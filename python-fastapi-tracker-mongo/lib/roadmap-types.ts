// Shapes shared by the seed data, the database layer and the UI.
// Safe to import from client components (no server code in here).

// One search to type into YouTube ("yt") or the web ("web").
export type Search = { q: string; on: "yt" | "web" };

// A direct link to a free resource that is stable enough to link to (docs, courses, repos).
export type Link = { label: string; url: string };

export type Step = {
  id: string;
  title: string;
  learn: string;
  // The stopping rule. Without one, an ADHD brain keeps "researching".
  doneWhen: string;
  minutes: number;
  keywords: string[];
  // First search is the best one to start with.
  search: Search[];
  links: Link[];
};

export type Project = Step & { label: string; kind: "mini" | "major" };

export type StageDoc = {
  _id: string;
  order: number;
  title: string;
  blurb: string;
};

export type ModuleDoc = {
  _id: string;
  order: number;
  stage: string;
  week: string;
  title: string;
  goal: string;
  nodeTip?: string;
  tasks: Step[];
  project: Project;
  // Flat list of every task and project id in this module, so a step can be validated with one indexed query.
  itemIds: string[];
};

export type Roadmap = { stages: StageDoc[]; modules: ModuleDoc[] };

export function searchUrl(s: Search): string {
  const q = encodeURIComponent(s.q);
  return s.on === "yt"
    ? `https://www.youtube.com/results?search_query=${q}`
    : `https://www.google.com/search?q=${q}`;
}

export function stepsOf(m: ModuleDoc): Step[] {
  return [...m.tasks, m.project];
}
