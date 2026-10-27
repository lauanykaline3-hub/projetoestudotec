import { Suspense } from "react";
import { StudyPlatform } from "@/components/StudyPlatform";
import { MATERIAS_INICIAIS } from "@/data/materias-iniciais";
import { slugify } from "@/lib/slugify";

export function generateStaticParams() {
  return MATERIAS_INICIAIS.map((s) => ({
    slug: slugify(s.name),
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

async function MateriaContent({ params }: Props) {
  const { slug } = await params;
  return <StudyPlatform initialSubjectSlug={slug} />;
}

export default function MateriaPage(props: Props) {
  return (
    <Suspense
      fallback={
        <main className="loading-screen">
          <span className="brand-mark">e</span>
        </main>
      }
    >
      <MateriaContent {...props} />
    </Suspense>
  );
}

