"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Mail, Phone, Search } from "lucide-react";
import { listLeads, updateLeadStatus } from "@/lib/admin/leads";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadRow, type LeadStatus } from "@/lib/cms/leads";
import { formatInZone } from "@/lib/admin/timezone";
import { AdminButton, Banner, Input, Modal, Panel, Select } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Patient enquiries.
 *
 * Reads and writes in the browser as the signed-in user, like the rest of the dashboard
 * — `leads_admin_all` is what actually authorises it. Anonymous visitors can file a lead
 * and cannot read one, so there is no privileged key here to leak patient details with.
 *
 * Filtering is client-side: the practice has one form and a queue measured in hundreds,
 * so fetching once and narrowing in memory is faster and simpler than a round trip per
 * keystroke. If this ever grows past a few thousand rows, move the search to the query.
 */

const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-teal-50 text-teal-800 ring-teal-200",
  contacted: "bg-navy-50 text-navy-800 ring-navy-200",
  follow_up: "bg-gold-300/30 text-navy-900 ring-gold-400/50",
  converted: "bg-teal-500/15 text-teal-900 ring-teal-400/40",
  closed: "bg-surface text-muted ring-border",
};

/** Submission-date windows, as days back from now. */
const RANGES = [
  { value: "all", label: "Any time", days: 0 },
  { value: "7", label: "Last 7 days", days: 7 },
  { value: "30", label: "Last 30 days", days: 30 },
  { value: "90", label: "Last 90 days", days: 90 },
] as const;

function StatusPill({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STATUS_TONE[status],
      )}
    >
      {LEAD_STATUS_LABEL[status]}
    </span>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("all");

  const [open, setOpen] = useState<LeadRow | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  /**
   * `loadedAt` doubles as the reference point for the date filter: taking Date.now()
   * inside the memo would be an impure read during render, and the window should anyway
   * be relative to when the data was fetched, not to each re-render.
   */
  const [loadedAt, setLoadedAt] = useState(0);

  const load = useCallback(() => {
    listLeads()
      .then((rows) => {
        setLeads(rows);
        setError(null);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not load leads."))
      .finally(() => {
        setLoadedAt(Date.now());
        setLoading(false);
      });
  }, []);

  useEffect(load, [load]);

  const stats = useMemo(
    () => ({ total: leads.length, fresh: leads.filter((l) => l.status === "new").length }),
    [leads],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const days = RANGES.find((r) => r.value === range)?.days ?? 0;
    const cutoff = days && loadedAt ? loadedAt - days * 86_400_000 : 0;

    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (cutoff && Date.parse(l.created_at) < cutoff) return false;
      if (!q) return true;
      // Name, phone and email — the three things someone searches a caller by.
      return [l.name, l.phone, l.email ?? ""].some((f) => f.toLowerCase().includes(q));
    });
  }, [leads, query, status, range, loadedAt]);

  /** Optimistic: the row updates immediately and rolls back if the write is rejected. */
  const changeStatus = async (lead: LeadRow, next: LeadStatus) => {
    const previous = lead.status;
    setSaving(lead.id);
    setLeads((rows) => rows.map((r) => (r.id === lead.id ? { ...r, status: next } : r)));
    setOpen((o) => (o && o.id === lead.id ? { ...o, status: next } : o));

    try {
      await updateLeadStatus(lead.id, next);
      setError(null);
    } catch (e: unknown) {
      setLeads((rows) => rows.map((r) => (r.id === lead.id ? { ...r, status: previous } : r)));
      setOpen((o) => (o && o.id === lead.id ? { ...o, status: previous } : o));
      setError(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-navy-900">Leads</h1>
          <p className="mt-1 text-sm text-muted">Patient enquiries from the website forms.</p>
        </div>
        <div className="flex gap-6 text-sm">
          <span>
            <span className="font-display text-xl font-medium text-navy-900">{stats.total}</span>
            <span className="ml-1.5 text-muted">total</span>
          </span>
          <span>
            <span className="font-display text-xl font-medium text-teal-700">{stats.fresh}</span>
            <span className="ml-1.5 text-muted">new</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Banner tone="error">{error}</Banner>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone or email"
            aria-label="Search leads"
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus | "all")}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
        <Select
          value={range}
          onChange={(e) => setRange(e.target.value as typeof range)}
          aria-label="Filter by date"
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </Select>
      </div>

      <Panel className="mt-4 p-0">
        {loading ? (
          <p className="px-4 py-12 text-center text-sm text-muted">Loading leads…</p>
        ) : visible.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted/50" />
            <p className="mt-3 text-sm text-muted">
              {leads.length === 0
                ? "No enquiries yet. They appear here as soon as the website form is submitted."
                : "No leads match these filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: a table. Below sm it would need horizontal scrolling, so the same
                rows render as cards instead. */}
            <table className="hidden w-full border-collapse text-sm sm:table">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-3">
                      <span className="block font-medium text-navy-900">{l.name}</span>
                      <span className="mt-0.5 block text-xs text-muted">{l.phone}</span>
                      {l.email && <span className="block text-xs text-muted">{l.email}</span>}
                    </td>
                    <td className="px-4 py-3 text-muted">{l.service ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatInZone(l.created_at)}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={l.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AdminButton onClick={() => setOpen(l)}>View</AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-border sm:hidden">
              {visible.map((l) => (
                <li key={l.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-navy-900">{l.name}</span>
                      <span className="mt-0.5 block text-xs text-muted">{l.phone}</span>
                      <span className="mt-0.5 block text-xs text-muted">{formatInZone(l.created_at)}</span>
                    </div>
                    <StatusPill status={l.status} />
                  </div>
                  <AdminButton className="mt-3 w-full" onClick={() => setOpen(l)}>
                    View enquiry
                  </AdminButton>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {open && (
        <Modal title={open.name} onClose={() => setOpen(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${open.phone}`}
                className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-teal-700"
              >
                <Phone className="h-4 w-4" /> {open.phone}
              </a>
              {open.email && (
                <a
                  href={`mailto:${open.email}`}
                  className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-teal-700"
                >
                  <Mail className="h-4 w-4" /> {open.email}
                </a>
              )}
            </div>

            <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-muted">
              <dt className="font-medium text-navy-700">Service</dt>
              <dd>{open.service ?? "—"}</dd>
              <dt className="font-medium text-navy-700">Preferred date</dt>
              <dd>{open.preferred_date ?? "—"}</dd>
              <dt className="font-medium text-navy-700">Received</dt>
              <dd>{formatInZone(open.created_at)}</dd>
              <dt className="font-medium text-navy-700">Source</dt>
              <dd>
                {open.source}
                {open.source_path ? ` · ${open.source_path}` : ""}
              </dd>
            </dl>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">Message</p>
              <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-navy-900">
                {open.message?.trim() || "—"}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">Status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LEAD_STATUSES.map((s) => (
                  <AdminButton
                    key={s}
                    variant={open.status === s ? "primary" : "secondary"}
                    disabled={saving === open.id}
                    onClick={() => changeStatus(open, s)}
                  >
                    {LEAD_STATUS_LABEL[s]}
                  </AdminButton>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
