import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Pet, kinds, personalities } from '../src/lib/pets/engine';
function advance(p: Pet, seconds: number, width = 800) {
  for (let t = 0; t < seconds; t += 0.025) p.tick(0.025, width);
}
void test('autonomous cycle includes walking, rest, stretch, sleep and wake', () => {
  const p = new Pet('cat', 100, () => 0.6),
    seen = new Set<string>();
  for (let i = 0; i < 7000; i++) {
    p.tick(0.025, 800);
    seen.add(p.state);
  }
  for (const state of [
    'idle',
    'curious',
    'walking',
    'resting',
    'stretching',
    'sleeping',
    'waking',
  ])
    assert.ok(seen.has(state), state);
});
void test('pursuit accelerates, changes direction and remains in bounds', () => {
  const p = new Pet('fox', 100);
  p.target = 600;
  p.enter('walking');
  advance(p, 1);
  assert.ok(p.x > 100);
  assert.equal(p.facing, 1);
  p.target = 36;
  advance(p, 2);
  assert.equal(p.facing, -1);
  advance(p, 10, 180);
  assert.ok(p.x >= 36 && p.x <= 144);
});
void test('petting interrupts sleep, becomes happy and returns to idle', () => {
  const p = new Pet('cat', 100);
  p.enter('sleeping');
  p.pet();
  assert.equal(p.state, 'petting');
  advance(p, 1.6);
  assert.equal(p.state, 'happy');
  advance(p, 2.1);
  assert.equal(p.state, 'idle');
});
void test('drop integrates gravity, bounces and recovers', () => {
  const p = new Pet('dog', 100);
  p.y = -22;
  p.enter('dropping');
  const states = new Set<string>();
  for (let i = 0; i < 120; i++) {
    p.tick(0.025, 800);
    states.add(p.state);
    assert.ok(p.y <= 0);
  }
  assert.ok(states.has('recovering'));
  assert.equal(p.y, 0);
});
void test('interaction cooldown prevents repeated section reactions', () => {
  const p = new Pet('robot', 100);
  assert.equal(p.investigate(300, 'transformer'), true);
  assert.equal(p.investigate(400, 'spam'), false);
  assert.equal(p.thought, 'transformer');
});
void test('following has an alert stage then play; idle cursor does not force pursuit', () => {
  const p = new Pet('cat', 100);
  p.age = 3;
  p.tick(0.025, 800, { x: 500, speed: 0, follow: true });
  assert.equal(p.state, 'alert');
  for (let i = 0; i < 30; i++)
    p.tick(0.025, 800, { x: 500, speed: 0, follow: true });
  assert.equal(p.state, 'playing');
});
void test('follow mode overrides section cooldown and tracks a moving cursor', () => {
  const p = new Pet('cat', 100);
  p.groundY = 100;
  assert.equal(p.investigate(350, 'an interesting section'), true);
  p.tick(0.025, 800, { x: 600, y: 700, speed: 0, follow: true }, 1000);
  assert.equal(p.target, 600);
  assert.equal(p.targetY, 700);
  assert.equal(p.thought, '');
  assert.equal(p.following, true);
  for (let i = 0; i < 40; i++)
    p.tick(0.025, 800, { x: 600, y: 700, speed: 0, follow: true }, 1000);
  assert.equal(p.state, 'playing');
  const before = p.x;
  for (let i = 0; i < 40; i++)
    p.tick(0.025, 800, { x: 50, y: 200, speed: 0, follow: true }, 1000);
  assert.equal(p.target, 50);
  assert.equal(p.targetY, 200);
  assert.ok(p.x < before, 'the pet reverses toward the new cursor position');
});
void test('follow mode stops at controls and resumes after dragging', () => {
  const p = new Pet('dog', 100);
  p.tick(0.025, 800, { x: 500, speed: 0, follow: true });
  assert.equal(p.following, true);
  p.tick(0.025, 800, { x: 500, speed: 0, follow: false });
  assert.equal(p.following, false);
  assert.equal(p.state, 'idle');
  p.enter('dragging');
  p.tick(0.025, 800, { x: 500, speed: 0, follow: true });
  assert.equal(p.state, 'dragging');
  p.enter('recovering');
  p.tick(0.025, 800, { x: 500, speed: 0, follow: true });
  assert.equal(p.following, true);
  assert.equal(p.state, 'alert');
});
void test('all five personalities have distinct profiles and valid sprite columns', () => {
  assert.equal(new Set(kinds.map((k) => personalities[k].speed)).size, 5);
  for (const kind of kinds) {
    const p = new Pet(kind, 100);
    assert.equal(p.sprite(true), 0);
    for (let i = 0; i < 4000; i++) {
      p.tick(0.05, 800);
      assert.ok(p.sprite() >= 0 && p.sprite() <= 7);
    }
  }
});

void test('fast cursor play survives the alert delay without follow mode', () => {
  const p = new Pet('cat', 100);
  p.age = 3;
  p.tick(0.025, 800, { x: 180, speed: 300, follow: false });
  assert.equal(p.state, 'alert');
  for (let i = 0; i < 30; i++)
    p.tick(0.025, 800, { x: 180, speed: 0, follow: false });
  assert.equal(p.state, 'playing');
});

void test('page roaming and cursor pursuit travel in two dimensions', () => {
  const p = new Pet('cat', 100);
  p.groundY = 100;
  p.target = 500;
  p.targetY = 700;
  p.enter('walking');
  for (let i = 0; i < 80; i++) p.tick(0.025, 1000, undefined, 2000);
  assert.ok(p.x > 100);
  assert.ok(p.groundY > 100);
  p.age = 3;
  p.cooldown = 0;
  p.tick(0.025, 1000, { x: 200, y: 1300, speed: 0, follow: true }, 2000);
  assert.equal(p.targetY, 1300);
});
