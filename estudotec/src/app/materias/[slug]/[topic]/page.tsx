import { Suspense } from "react";
import { StudyPlatform } from "@/components/StudyPlatform";
import { MATERIAS_INICIAIS } from "@/data/materias-iniciais";
import { slugify } from "@/lib/slugify";

export function generateStaticParams() {
  const params: { slug: string; topic: string }[] = [];
  for (const s of MATERIAS_INICIAIS) {
    const sSlug = slugify(s.name);
    for (const t of s.topics) {
      params.push({
        slug: sSlug,
        topic: slugify(t.title),
      });
    }
  }
  return params;
}

type Props = {
  params: Promise<{ slug: string; topic: string }>;
};

async function TopicContent({ params }: Props) {
  const { slug, topic } = await params;
  return <StudyPlatform initialSubjectSlug={slug} initialTopicSlug={topic} />;
}

export default function TopicPage(props: Props) {
  return (
    <Suspense
      fallback={
        <main className="loading-screen">
          <span className="brand-mark">e</span>
        </main>
      }
    >
      <TopicContent {...props} />
    </Suspense>
  );
}

