import type { Metadata } from "next";
import Link from "next/link";
import { ParticipanteAvatar } from "@/components/ParticipanteAvatar";

export const metadata: Metadata = {
  title: "Nossa Equipe | Estudo Tec",
  description: "Conheça as participantes do projeto Estudo Tec.",
};

export type Participante = {
  nome: string;
  papel: string;
  foto?: string; // Caminho da foto em /public (ex: "/fotoEquipe/Nome.jpeg") ou URL externa
};

// Lista de participantes. Caso a foto quebre ou esteja vazia, exibe as iniciais automaticamente.
const equipe: Participante[] = [
  {
    nome: "Ana Karolyne",
    papel: "Participante",
    foto: "/fotoEquipe/Ana-Karolyne.jpeg",
  },
  {
    nome: "Jamily Selesthe",
    papel: "Participante",
    foto: "/fotoEquipe/Jamily-Selesthe.jpeg",
  },
  {
    nome: "Lauany Kaline",
    papel: "Participante",
    foto: "/fotoEquipe/Lauany-Kaline.jpeg",
  },
  {
    nome: "Raiany Gabrielle",
    papel: "Participante",
    foto: "/fotoEquipe/Raiany-Gabrielle.jpeg",
  },
];

const repositorio = "https://github.com/lauanykaline3-hub/projetoestudotec.git";

const coresFallback = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
];

export default function EquipePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#11121e] text-gray-900 dark:text-[#f0f1fa] py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Barra superior de ações */}
        <div className="mb-8 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-[#2d2f47] bg-white dark:bg-[#1c1d30] px-4 py-2 text-xs font-semibold text-gray-700 dark:text-[#f0f1fa] shadow-sm hover:bg-gray-50 dark:hover:bg-[#26273f] transition-all duration-200"
          >
            ← Voltar para o início
          </Link>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Estudo Tec
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl transition-colors duration-200">
            Nossa equipe
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-[#9fa1ba] transition-colors duration-200">
            Conheça as participantes do nosso projeto.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {equipe.map((membro, index) => (
            <li
              key={membro.nome}
              className="rounded-2xl border border-gray-100 dark:border-[#2b2d45] bg-white dark:bg-[#18192a] p-6 text-center shadow-sm dark:shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <ParticipanteAvatar
                nome={membro.nome}
                foto={membro.foto}
                colorClass={coresFallback[index % coresFallback.length]}
              />
              <h2 className="mt-4 text-base font-bold text-gray-900 dark:text-white transition-colors duration-200">
                {membro.nome}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#9fa1ba] transition-colors duration-200">
                {membro.papel}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href={repositorio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:hover:bg-indigo-500 transition-all duration-200"
          >
            Acessar repositório no GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  );
}
