'use client';
import PetWorld from './PetWorld';
import type { Kind } from '@/lib/pets/engine';
export default function Companion({ kind = 'robot' }: { kind?: Kind }) {
  return <PetWorld kind={kind} small />;
}
