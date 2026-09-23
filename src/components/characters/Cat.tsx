'use client';
import PetWorld from './PetWorld';
export default function Cat({ small = false }: { small?: boolean }) {
  return <PetWorld kind="cat" small={small} />;
}
