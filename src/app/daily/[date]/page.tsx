import CrosswordPageView from '@/components/crossword/CrosswordPageView';

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function DailyDatePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CrosswordPageView seedParam={resolvedParams.date} />;
}
