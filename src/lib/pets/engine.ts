/** Adapted from adryd325/oneko.js (MIT), revision 5281d057.
 * Retains normalized pursuit, alert-before-pursuit, frame-indexed poses and
 * tired/sleep idle sequence. Original integration extends that foundation.
 * Copyright © 2022 adryd. See public/licenses/oneko-MIT.txt. */
export const kinds = ['cat', 'robot', 'fox', 'penguin', 'dog'] as const;
export type Kind = (typeof kinds)[number];
export type State =
  | 'idle'
  | 'alert'
  | 'curious'
  | 'walking'
  | 'investigating'
  | 'playing'
  | 'resting'
  | 'sleeping'
  | 'waking'
  | 'stretching'
  | 'petting'
  | 'happy'
  | 'dragging'
  | 'dropping'
  | 'recovering';
export const personalities = {
  cat: { speed: 42, rest: 8, interest: 'emora', thought: 'hmm…' },
  robot: {
    speed: 57,
    rest: 4,
    interest: 'minigpt',
    thought: 'another experiment?',
  },
  fox: { speed: 72, rest: 4, interest: 'github', thought: 'interesting…' },
  penguin: {
    speed: 27,
    rest: 12,
    interest: 'research',
    thought: 'one more paper…',
  },
  dog: { speed: 55, rest: 6, interest: 'contact', thought: 'a little hello ♡' },
};
export class Pet {
  state: State = 'idle';
  age = 0;
  x: number;
  y = 0;
  groundY = 0;
  targetY = 0;
  travelY = 0;
  vx = 0;
  vy = 0;
  target: number;
  facing = 1;
  frame = 0;
  cycle = 0;
  cooldown = 0;
  chasing = false;
  following = false;
  thought = '';
  look = 0;
  elapsed = 0;
  constructor(
    public kind: Kind,
    x: number,
    private random = Math.random,
  ) {
    this.x = x;
    this.target = x;
  }
  enter(state: State) {
    this.state = state;
    this.age = 0;
  }
  pet() {
    if (this.state !== 'dragging' && this.state !== 'dropping')
      this.enter('petting');
  }
  wake() {
    this.enter('waking');
  }
  investigate(x: number, thought: string) {
    if (
      this.cooldown > 0 ||
      ['dragging', 'dropping', 'petting'].includes(this.state)
    )
      return false;
    this.target = x;
    this.thought = thought;
    this.chasing = false;
    this.cooldown = 24;
    this.enter('alert');
    return true;
  }
  tick(
    dt: number,
    width: number,
    pointer?: { x: number; y?: number; speed: number; follow: boolean },
    height?: number,
  ) {
    dt = Math.min(dt, 0.05);
    this.age += dt;
    this.elapsed += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    const p = personalities[this.kind];
    if (pointer)
      this.look = Math.max(-1, Math.min(1, (pointer.x - this.x) / 80));
    if (this.state === 'dragging') return;
    if (this.state === 'dropping') {
      this.vy += 460 * dt;
      this.y += this.vy * dt;
      if (this.y >= 0) {
        this.y = 0;
        this.vy = -this.vy * 0.26;
        if (Math.abs(this.vy) < 25) {
          this.vy = 0;
          this.enter('recovering');
        }
      }
      return;
    }
    const canPursue = !['petting', 'happy', 'dragging', 'dropping'].includes(
      this.state,
    );
    if (pointer?.follow && canPursue) {
      // Opt-in following tracks the live position on every frame. A section
      // reaction or autonomous rest must not block it for several seconds.
      const x = Math.max(36, Math.min(Math.max(36, width - 36), pointer.x));
      const y = height
        ? Math.max(
            36,
            Math.min(Math.max(36, height - 36), pointer.y ?? this.groundY),
          )
        : (pointer.y ?? this.groundY);
      this.target = x;
      this.targetY = y;
      this.thought = '';
      this.chasing = true;
      if (Math.hypot(x - this.x, y - this.groundY) > 12) {
        if (!this.following || !['alert', 'playing'].includes(this.state))
          this.enter('alert');
        this.following = true;
      } else {
        this.following = false;
        this.vx = 0;
        this.travelY = 0;
        if (this.state !== 'idle') this.enter('idle');
        else this.age = 0;
      }
    } else if (this.following) {
      // Leaving an interactive control stops following its stale position.
      this.following = false;
      this.vx = 0;
      this.travelY = 0;
      this.target = this.x;
      this.targetY = this.groundY;
      if (['alert', 'playing'].includes(this.state)) this.enter('idle');
    }
    // Brief, non-opt-in curiosity still honors the normal cooldown.
    if (
      pointer &&
      !pointer.follow &&
      this.cooldown === 0 &&
      this.age > 2 &&
      !['petting', 'happy', 'sleeping', 'waking'].includes(this.state) &&
      pointer.speed > 180 &&
      Math.abs(pointer.x - this.x) < 160
    ) {
      this.target = pointer.x;
      this.targetY = pointer.y ?? this.groundY;
      this.chasing = true;
      this.cooldown = 7;
      this.enter('alert');
    }
    switch (this.state) {
      case 'idle':
        if (this.age > 3 + kinds.indexOf(this.kind) * 0.5) {
          this.enter('curious');
        }
        break;
      case 'curious':
        if (this.age > 1.3) {
          this.target = 36 + this.random() * Math.max(0, width - 72);
          if (height)
            this.targetY = 36 + this.random() * Math.max(0, height - 72);
          this.enter('walking');
        }
        break;
      case 'alert':
        if (this.age > (this.following ? 0.18 : 0.65))
          this.enter(this.chasing ? 'playing' : 'walking');
        break;
      case 'walking':
      case 'playing': {
        const diffX = this.x - this.target;
        const diffY = this.groundY - this.targetY;
        const distance = Math.hypot(diffX, diffY);
        if (
          distance < (this.following ? 12 : 5) ||
          (!this.following && this.age > 8)
        ) {
          this.vx = 0;
          this.travelY = 0;
          this.enter(this.thought ? 'investigating' : 'resting');
          break;
        }
        // Adapted normalized pursuit from oneko.frame(), with acceleration/friction.
        const desired =
          -(diffX / distance) * p.speed * (this.state === 'playing' ? 1.7 : 1);
        this.vx += (desired - this.vx) * Math.min(1, dt * 5);
        const desiredY =
          -(diffY / distance) * p.speed * (this.state === 'playing' ? 1.7 : 1);
        this.travelY += (desiredY - this.travelY) * Math.min(1, dt * 5);
        this.x += this.vx * dt;
        this.groundY += this.travelY * dt;
        this.facing = this.vx < 0 ? -1 : 1;
        break;
      }
      case 'investigating':
        if (this.age > 3.5) {
          this.thought = '';
          this.enter('resting');
        }
        break;
      case 'resting':
        if (this.age > 2) {
          this.cycle++;
          this.enter(this.cycle % 2 ? 'stretching' : 'sleeping');
        }
        break;
      case 'sleeping':
        if (this.age > p.rest) this.enter('waking');
        break;
      case 'waking':
        if (this.age > 1) this.enter('stretching');
        break;
      case 'stretching':
        if (this.age > 1.8) this.enter('idle');
        break;
      case 'petting':
        if (this.age > 1.5) this.enter('happy');
        break;
      case 'happy':
        if (this.age > 2) this.enter('idle');
        break;
      case 'recovering':
        if (this.age > 0.8) this.enter('curious');
        break;
    }
    this.x = Math.max(36, Math.min(Math.max(36, width - 36), this.x));
    this.target = Math.max(36, Math.min(Math.max(36, width - 36), this.target));
    if (height)
      this.groundY = Math.max(36, Math.min(height - 36, this.groundY));
    this.frame = Math.floor(this.elapsed * 7);
  }
  sprite(calm = false) {
    if (calm) return 0;
    if (['walking', 'playing'].includes(this.state))
      return 1 + (this.frame % 2);
    if (['curious', 'alert', 'investigating', 'waking'].includes(this.state))
      return 3;
    if (['petting', 'happy'].includes(this.state)) return 4;
    if (['sleeping', 'resting'].includes(this.state)) return 5;
    if (this.state === 'stretching') return 6;
    if (['dragging', 'dropping'].includes(this.state)) return 7;
    return 0;
  }
}
