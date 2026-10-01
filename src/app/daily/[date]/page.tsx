import { redirect } from 'next/navigation';
import CrosswordPageView from '@/components/crossword/CrosswordPageView';

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function DailyDatePage({ params }: PageProps) {
  const resolvedParams = await params;
  const requestedDate = resolvedParams.date;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(requestedDate);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate > today) {
    redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }

  return <CrosswordPageView seedParam={requestedDate} />;
}
