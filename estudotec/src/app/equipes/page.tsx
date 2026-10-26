import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa Equipe | Estudo Tec",
  description: "Conheça as participantes do projeto Estudo Tec.",
};

const equipe = ["Ana Karolyne", "Jamily Selesthe", "Lauany Kaline", "Raiany Gabrielle"];
const repositorio = "https://github.com/lauanykaline3-hub/projetoestudotec.git";

export default function EquipePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Estudo Tec</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nossa equipe</h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">Conheça as participantes do nosso projeto.</p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {equipe.map((nome, index) => (
            <li key={nome} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
              <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl text-lg font-bold ${["bg-indigo-100 text-indigo-700", "bg-emerald-100 text-emerald-700", "bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700"][index]}`} aria-hidden="true">
                {nome.split(" ").map((parte) => parte[0]).join("")}
              </span>
              <h2 className="mt-4 text-base font-semibold text-gray-900">{nome}</h2>
              <p className="mt-1 text-sm text-gray-500">Participante</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href={repositorio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Acessar repositório no GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  );
}
