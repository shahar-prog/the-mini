import CrosswordPageView from '@/components/crossword/CrosswordPageView';

interface PageProps {
  params: Promise<{
    seed: string;
  }>;
}

export default async function DynamicPuzzlePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CrosswordPageView seedParam={resolvedParams.seed} />;
}
