import { redirect } from 'next/navigation';

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  redirect(`/${slug}/comments`);
}
