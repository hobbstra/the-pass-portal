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
  postings: JobPosting[];
};

export const employers: Employer[] = [
  {
    slug: "swells",
    name: "Swells Sourdough",
    tagline:
      "A small sourdough bakery on the San Diego coast. We bake before sunrise and sell at the Little Italy Mercato and La Jolla Open Aire markets.",
    applyEmail: "jobs@swellsbakery.com",
    website: "https://swellssourdough.com",
    instagram: "https://www.instagram.com/swellssourdough/",
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
        title: "Viennoiserie Baker",
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
