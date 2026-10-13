"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import type { LeadRow, LeadStatus } from "@/lib/cms/leads";

function db() {
  return supabaseBrowser();
}

export async function listLeads(): Promise<LeadRow[]> {
  const { data, error } = await db()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load leads: ${error.message}`);
  return (data ?? []) as LeadRow[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await db().from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(`Could not update status: ${error.message}`);
}
