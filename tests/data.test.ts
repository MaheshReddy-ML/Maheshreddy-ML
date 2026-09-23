import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classify,
  normalize,
  safeUrl,
  type RawRepo,
} from '../src/lib/projects/normalize';
import snapshot from '../src/data/github-snapshot.json';
import { studies } from '../src/data/studies';
void test('All seven documented studies map to discovered repositories, including renamed sign-language repo', () => {
  const projects = (snapshot.repos as RawRepo[]).map(normalize);
  for (const study of studies)
    assert.equal(
      projects.filter((p) => p.studySlug === study.slug).length,
      1,
      study.slug,
    );
});
void test('Homepage links reject executable and invalid schemes', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///tmp/x',
    '//evil.test',
    'not-a-url',
  ])
    assert.equal(safeUrl(value), null);
  assert.equal(safeUrl('https://example.com/demo'), 'https://example.com/demo');
});
void test('Normalization preserves real GitHub counts and fork status', () => {
  for (const r of snapshot.repos as RawRepo[]) {
    const p = normalize(r);
    assert.equal(p.stargazers_count, r.stargazers_count);
    assert.equal(p.forks_count, r.forks_count);
    assert.equal(p.fork, r.fork);
    assert.equal(p.html_url, r.html_url);
  }
});
void test('Classifier uses repository signals; unfamiliar projects remain experiments', () => {
  const base = snapshot.repos[0] as RawRepo;
  assert.deepEqual(
    classify({ ...base, name: 'untitled', description: null, topics: [] }),
    ['Experiments'],
  );
  assert.ok(
    classify({
      ...base,
      name: 'sign-language',
      description: 'CNN computer vision',
      topics: [],
    }).includes('Computer Vision'),
  );
  assert.ok(
    classify({
      ...base,
      name: 'SentinelAI',
      description: 'AI governance',
      topics: [],
    }).includes('AI Systems'),
  );
});
void test('Résumé measurements retain evaluation qualifications', () => {
  const minigpt = studies.find((s) => s.slug === 'minigpt')!;
  assert.ok(minigpt.evidence.some((e) => e.label.includes('internal')));
  assert.ok(
    studies.find((s) => s.slug === 'emora')!.limits.includes('snapshot'),
  );
  assert.ok(
    studies
      .find((s) => s.slug === 'logistic-regression')!
      .limits.includes('illustrative'),
  );
});
