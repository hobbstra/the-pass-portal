// ponytail: hand-edited listings until the app's hiring module ships
// (swells-baker-app docs/superpowers/specs/2026-07-24-hiring-module-design.md).
// Fields mirror its job_postings table so this file can be swapped for an API fetch.

export type JobPosting = {
  id: string;
  title: string;
  employmentType: "Full-time" | "Part-time" | "Seasonal";
  location: string;
  pay?: string;
  summary: string;
  duties: string[];
  requirements: string[];
};

export type Employer = {
  slug: string;
  name: string;
  tagline: string;
  applyEmail: string;
  website: string;
  instagram: string;
  // The employer's own applicant texting number (10DLC is per business, so never shared).
  smsNumber?: string;
  // Registered 10DLC brand, named as the sender on the SMS terms page.
  legalName?: string;
  // The business's logo (public org-logos storage), shown in the applicant pages' header.
  logo?: string;
  // Press coverage, newest first: shown on the jobs page so applicants see who they'd work for.
  press?: { outlet: string; title: string; url: string }[];
  postings: JobPosting[];
};

export const employers: Employer[] = [
  {
    slug: "swells",
    name: "Swells Sourdough",
    tagline:
      "A family-owned sourdough bakery in Little Italy: old-world methods, California vibes. Every loaf is cold fermented at least 24 hours, with organic flour and ingredients you can feed your family. Find us at our shop on India St, the Little Italy Mercato on Saturdays and the La Jolla Open Aire Market on Sundays.",
    applyEmail: "jobs@swellsbakery.com",
    website: "https://swellssourdough.com",
    instagram: "https://www.instagram.com/swellssourdough/",
    smsNumber: "(858) 216-8955",
    legalName: "E&P Boulangerie LLC",
    logo: "https://mgodxfznaahrgdzopykr.supabase.co/storage/v1/object/public/org-logos/00000000-0000-0000-0000-000000000001/logo-1791217153551.jpg",
    // From swellssourdough.com's "In the Press", plus the Business Journal profile (owner, 2026-11-01:
    // "include swells in the news from the tribune and other sources").
    press: [
      { outlet: "Eater San Diego", title: "The Best New Restaurants in San Diego (October 2026)", url: "https://sandiego.eater.com/maps/best-new-san-diego-restaurants-heatmap" },
      { outlet: "San Diego Union-Tribune", title: "Swells Sourdough opens new bakery in Little Italy", url: "https://www.sandiegouniontribune.com/2026/10/01/the-dish-swells-sourdough-opens-new-bakery-in-little-italy-today/" },
      { outlet: "CBS 8", title: "Swells Sourdough Bakery opens store in downtown San Diego", url: "https://www.cbs8.com/video/news/community/cbs8-guests/swells-sourdough-bakery-opens-store-downtown-san-diego/509-96cd4ac7-867f-473e-b12d-62b6454a54aa" },
      { outlet: "San Diego Business Journal", title: "Swells Sourdough Bakery makes waves", url: "https://sdbj.com/food/swells-sourdough-bakery-makes-waves/" },
      { outlet: "SanDiegoVille", title: "Swells Sourdough Bakery to open first brick-and-mortar in Little Italy", url: "https://www.sandiegoville.com/2026/09/san-diegos-swells-sourdough-bakery-to.html" },
      { outlet: "Patch", title: "Farmers market favorite opens first permanent store", url: "https://patch.com/california/san-diego/farmers-market-favorite-swells-sourdough-bakery-open-first-permanent-store-san" },
      { outlet: "Hoodline", title: "Swells Sourdough Bakery opens in Little Italy", url: "https://hoodline.com/2026/09/little-italy-s-swells-sourdough-bakery-opens-storefront-after-years-at-the-mercato/" },
      { outlet: "What Now San Diego", title: "Swells Sourdough Bakery to officially open in Little Italy", url: "https://whatnow.com/san-diego/restaurants/swells-sourdough-bakery-to-officially-open-in-little-italy-october-1-2026/" },
    ],
    postings: [
      {
        id: "barista",
        title: "Barista",
        employmentType: "Part-time",
        location: "San Diego, CA",
        pay: "$18–$20/hr + shared tips",
        summary:
          "Pull shots and pour drinks alongside our bread, pastries, and bagels. Our customers are regulars, and we want them to feel like it.",
        duties: [
          "Prepare espresso drinks, drip coffee, and teas to a consistent standard",
          "Dial in the grinder each morning and keep the machine clean",
          "Take orders and payments on Square",
          "Help the front-of-house team during rushes",
        ],
        requirements: [
          "Some espresso experience preferred, or a real interest in learning",
          "Available weekend mornings",
          "California Food Handler Card (or get one within 30 days of hire)",
        ],
      },
      {
        id: "front-of-house",
        title: "Front of House",
        employmentType: "Part-time",
        location: "San Diego, CA",
        pay: "$18–$21/hr + shared tips",
        summary:
          "You're the face of the bakery. Set up the stand or counter, talk bread with customers, and keep the line moving when the country loaves are going fast.",
        duties: [
          "Set up and break down the display, signage, and point of sale",
          "Greet customers, answer questions about the bread, and make recommendations",
          "Handle cash and card sales and pre-order pickups",
          "Keep the display stocked, labeled, and clean",
        ],
        requirements: [
          "Friendly, calm under a line of customers",
          "Available Saturday and Sunday mornings",
          "Able to lift 30 lb and stand for a full shift",
          "California Food Handler Card (or get one within 30 days of hire)",
        ],
      },
      {
        id: "viennoiserie-baker",
        // Must match the job's title in Pass Admin: the card's details are matched by title.
        title: "Production Baker (Sourdough & Viennoiserie)",
        employmentType: "Full-time",
        location: "San Diego, CA",
        pay: "$22–$26/hr + shared tips",
        summary:
          "Laminate, shape, proof, and bake our croissants and other laminated pastries. Early mornings, a small team, and butter everywhere.",
        duties: [
          "Mix and laminate dough, then shape croissants, pains au chocolat, and seasonal pastries",
          "Manage proofing and bake schedules so everything is out of the oven before the markets open",
          "Follow production sheets and log waste and yields in The Pass",
          "Keep the bench, sheeter, and walk-in clean and organized",
        ],
        requirements: [
          "1+ year of lamination or pastry production experience",
          "Comfortable with early starts (around 4am) and weekend shifts",
          "Able to lift 50 lb and work on your feet in a hot kitchen",
          "California Food Handler Card (or get one within 30 days of hire)",
        ],
      },
    ],
  },
];

export const getEmployer = (slug: string) => employers.find((e) => e.slug === slug);

// ---- Open jobs from the app's apply_jobs RPC (public, anon key) ----

export type ApplyQuestion = {
  id: string;
  prompt: string;
  kind: "yes_no" | "yes_no_soon" | "shifts" | "days_times";
  options: { key: string; label: string }[];
};

export type OpenJob = {
  org_name: string;
  job_id: string;
  title: string;
  token: string;
  questions: ApplyQuestion[];
  consent_text: string | null;
  fine_print: string | null;
  brand_color: string | null;
  sms_number: string | null; // E.164
};

// Returns null when the RPC is unreachable or errors, so callers fall back to
// "Apply by email" rather than rendering a broken form.
export async function fetchOpenJobs(orgSlug: string): Promise<{ jobs: OpenJob[]; brand_color: string | null } | null> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) {
    console.error("apply_jobs: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
    return null;
  }
  try {
    const res = await fetch(`${base}/rest/v1/rpc/apply_jobs`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: orgSlug }),
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // An org with nothing open comes back as ONE row with a null job_id (it still carries the brand);
    // an unknown slug is zero rows. The null row is never rendered as a job.
    const rows = (await res.json()) as (Omit<OpenJob, "job_id"> & { job_id: string | null })[];
    const jobs = (rows.filter((r) => r.job_id !== null) as OpenJob[]).map((r) => ({
      ...r,
      questions: (r.questions ?? []).map((q) => ({ ...q, options: q.options ?? [] })),
    }));
    return { jobs, brand_color: rows[0]?.brand_color ?? null };
  } catch (e) {
    console.error("apply_jobs failed", e);
    return null;
  }
}
