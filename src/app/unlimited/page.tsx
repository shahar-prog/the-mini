import { redirect } from 'next/navigation';
import { generateRandomSeed } from '@/lib/crossword/generator';

export const dynamic = 'force-dynamic';

export default function UnlimitedPage() {
  const seed = generateRandomSeed();
  redirect(`/${seed}`);
}
