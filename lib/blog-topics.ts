/**
 * The topic set for the blog's "Browse by topic" filter.
 *
 * Same nineteen topics, in the same order, as supabase/migrations/0002_categories.sql —
 * that order is editorial (two surgical specialities, then major conditions, then body
 * regions, then care and lifestyle), not alphabetical, so it is stated rather than sorted.
 *
 * ── Why posts are matched on keywords ──────────────────────────────────────────────
 * All 169 migrated posts carry the single WordPress category "uncategorized", so
 * filtering on `post.category` alone would leave every chip empty. Each topic therefore
 * also declares the words that identify it, matched against the post's own slug and
 * title. Nothing is invented: a post is only filed under Stroke because it says "stroke".
 *
 * A post written in the CMS *with* a real category still wins — see `topicsForPost`.
 * As posts are categorised properly the keyword path quietly stops mattering.
 *
 * Keywords are matched as substrings of `"<slug> <title>"` lowercased, so a stem like
 * "herniat" covers herniated/herniation and "tumo" covers both spellings.
 */

export type BlogTopic = { name: string; keywords: readonly string[] };

export const BLOG_TOPICS: readonly BlogTopic[] = [
  { name: "Brain", keywords: ["brain", "cranio", "cerebral", "intracranial", "hydrocephalus", "skull", "concussion", "neuroplasticity", "chiari", "nasal"] },
  { name: "Spine", keywords: ["spine", "spinal", "vertebra", "scoliosis", "kyphosis", "lumbar", "thoracic", "myelopathy", "hunchback", "posture"] },
  { name: "Stroke", keywords: ["stroke", "clot", "haemorrhage", "hemorrhage", "aneurysm"] },
  { name: "Paralysis", keywords: ["paralysis", "paralys", "paraplegia", "quadriplegia"] },
  { name: "Tumour", keywords: ["tumour", "tumor", "cancer", "glioma", "metasta", "lesion"] },
  { name: "Migraine", keywords: ["migraine", "headache"] },
  { name: "Back", keywords: ["back-pain", "back pain", "lower-back", "lower back", "backache", "your-back", "your back"] },
  { name: "Neck", keywords: ["neck", "cervical", "cervicalgia"] },
  { name: "Disc", keywords: ["disc", "discectomy", "herniat", "slipped"] },
  // Deliberately narrow. "surgery" appears in most slugs on a surgeon's blog, so matching
  // it would file almost everything here; these are the words that mark a post as being
  // about the operation itself.
  { name: "Surgery", keywords: ["minimally-invasive", "minimally invasive", "endoscopic", "keyhole", "robotic", "intraoperative", "intra-operative", "perioperative", "awake-craniotomy", "before-surgery", "after-surgery", "after-spine-surgery"] },
  { name: "Children", keywords: ["child", "children", "paediatric", "pediatric", "infant", "congenital", "craniosynostosis", "down-syndrome"] },
  { name: "Rehab", keywords: ["rehab", "recovery", "physiotherapy", "regain", "restore"] },
  { name: "Nutrition", keywords: ["nutrition", "diet", "vitamin", "food", "gut", "obesity"] },
  { name: "Sleep", keywords: ["sleep", "insomnia", "nightmare", "sleeplessness"] },
  { name: "Parkinson", keywords: ["parkinson", "tremor", "deep-brain-stimulation", "dopamine", "movement-disorder"] },
  { name: "Memory", keywords: ["memory", "dementia", "forget", "cognitive", "alzheimer", "brain-fog"] },
  { name: "Epilepsy", keywords: ["epilepsy", "seizure"] },
  { name: "Arthritis", keywords: ["arthritis", "spondylosis", "spondylitis", "degenerat"] },
  { name: "Genetic", keywords: ["genetic", "dna", "hereditary", "dyslexia", "syndrome"] },
];

const BY_NAME = new Map(BLOG_TOPICS.map((t) => [t.name.toLowerCase(), t.name]));

/**
 * Topics a post belongs to.
 *
 * A real category, when the post has one, is authoritative and is used alone — a post
 * filed under Spine in the CMS should not also be dragged into Surgery by a stray word
 * in its title. Only uncategorised posts fall through to keyword matching.
 */
export function topicsForPost(post: { slug: string; title: string; category?: string }): string[] {
  const declared = post.category ? BY_NAME.get(post.category.trim().toLowerCase()) : undefined;
  if (declared) return [declared];

  const haystack = `${post.slug} ${post.title}`.toLowerCase();
  return BLOG_TOPICS.filter((t) => t.keywords.some((k) => haystack.includes(k))).map((t) => t.name);
}
