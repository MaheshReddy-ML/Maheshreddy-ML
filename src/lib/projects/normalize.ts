import { studies } from '@/data/studies';
export type RawRepo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  fork: boolean;
  archived: boolean;
  owner: { login: string };
};
export const categories = [
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'LLM / Generative AI',
  'AI Systems',
  'Research',
  'Developer Tools',
  'Experiments',
];
export function classify(repo: RawRepo) {
  const s =
    `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase();
  const found: string[] = [];
  const rules: [string, RegExp][] = [
    [
      'Machine Learning',
      /machine.learning|classification|regression|predict|customer.intelligence|student.performance.risk|myml|kaggle/,
    ],
    ['Deep Learning', /deep.learning|neural|cnn|lstm|gpt|transformer/],
    ['NLP', /nlp|chatbot|gpt|text|word2vec|emailfilter|language.model/],
    ['Computer Vision', /vision|sign.language|image|object.detection/],
    ['LLM / Generative AI', /llm|gpt|generative|companion|jarvis/],
    ['AI Systems', /governance|sentinel|companion|jarvis|aegis/],
    ['Research', /research|breast.cancer/],
    ['Developer Tools', /developer.tool|library|myml|parser/],
  ];
  for (const [label, re] of rules) if (re.test(s)) found.push(label);
  return found.length ? found : ['Experiments'];
}
export function safeUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}
export function normalize(repo: RawRepo) {
  const study = studies.find((s) =>
    new RegExp(s.repoPattern, 'i').test(repo.name),
  );
  return {
    ...repo,
    homepage: safeUrl(repo.homepage),
    categories: classify(repo),
    studySlug: study?.slug,
    displayName: study?.name ?? repo.name.replace(/[-_]/g, ' '),
    summary:
      repo.description ||
      study?.subtitle ||
      'Explore the repository README, source code, and recent activity.',
    color:
      study?.color ??
      ['blue', 'green', 'pink', 'yellow', 'lavender'][repo.id % 5],
  };
}
export type Project = ReturnType<typeof normalize>;
