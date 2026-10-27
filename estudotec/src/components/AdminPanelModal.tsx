"use client";

import { useState } from "react";
import type { Subject, Topic, Question } from "@/data/materias-iniciais";
import type { LocalUser, UserRole } from "@/lib/local-auth";

type AdminPanelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSaveSubjects: (updatedSubjects: Subject[]) => void;
  users: LocalUser[];
  onSaveUsers: (updatedUsers: LocalUser[]) => void;
  currentUserEmail: string;
  onSelectCreated: (subjectName: string, topicTitle: string) => void;
};

const CORES_DISPONIVEIS = [
  { label: "Azul", value: "blue" },
  { label: "Coral", value: "coral" },
  { label: "Dourado", value: "gold" },
  { label: "Verde", value: "green" },
  { label: "Roxo", value: "purple" },
  { label: "Índigo", value: "indigo" },
];

export function AdminPanelModal({
  isOpen,
  onClose,
  subjects,
  onSaveSubjects,
  users,
  onSaveUsers,
  currentUserEmail,
  onSelectCreated,
}: AdminPanelModalProps) {
  const [tab, setTab] = useState<
    "visao-geral" | "materias" | "assuntos" | "atividades" | "usuarios" | "junto"
  >("visao-geral");
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; msg: string } | null>(null);

  // Filtros de busca
  const [filtroMateria, setFiltroMateria] = useState<string>("todas");
  const [buscaGeral, setBuscaGeral] = useState("");

  // Estados de Edição (Modais de Edição inline)
  const [editingSubject, setEditingSubject] = useState<{
    originalName: string;
    name: string;
    icon: string;
    color: string;
  } | null>(null);

  const [editingTopic, setEditingTopic] = useState<{
    subjectName: string;
    originalTitle: string;
    title: string;
    description: string;
    summary: string;
  } | null>(null);

  const [editingQuestion, setEditingQuestion] = useState<{
    subjectName: string;
    topicTitle: string;
    questionIndex: number;
    prompt: string;
    options: [string, string, string, string];
    answer: number;
    explanation: string;
  } | null>(null);

  const [editingUser, setEditingUser] = useState<{
    email: string;
    name: string;
    senha: string;
    role: UserRole;
  } | null>(null);

  // Estados de Criação: Nova Matéria
  const [novaMateriaNome, setNovaMateriaNome] = useState("");
  const [novaMateriaIcone, setNovaMateriaIcone] = useState("📚");
  const [novaMateriaCor, setNovaMateriaCor] = useState("blue");
  const [novaMateriaTopico, setNovaMateriaTopico] = useState("");

  // Estados de Criação: Novo Assunto
  const [novoAssuntoMateria, setNovoAssuntoMateria] = useState(subjects[0]?.name ?? "");
  const [novoAssuntoTitulo, setNovoAssuntoTitulo] = useState("");
  const [novoAssuntoDesc, setNovoAssuntoDesc] = useState("");
  const [novoAssuntoResumo, setNovoAssuntoResumo] = useState("");

  // Estados de Criação: Nova Atividade
  const [novaAtivMateria, setNovaAtivMateria] = useState(subjects[0]?.name ?? "");
  const currentSubForAtiv = subjects.find((s) => s.name === novaAtivMateria) ?? subjects[0];
  const [novaAtivTopico, setNovaAtivTopico] = useState(currentSubForAtiv?.topics[0]?.title ?? "");
  const [novaAtivPrompt, setNovaAtivPrompt] = useState("");
  const [novaAtivAltA, setNovaAtivAltA] = useState("");
  const [novaAtivAltB, setNovaAtivAltB] = useState("");
  const [novaAtivAltC, setNovaAtivAltC] = useState("");
  const [novaAtivAltD, setNovaAtivAltD] = useState("");
  const [novaAtivCorreta, setNovaAtivCorreta] = useState(0);
  const [novaAtivExplicacao, setNovaAtivExplicacao] = useState("");

  // Estados de Criação: Novo Usuário
  const [novoUserNome, setNovoUserNome] = useState("");
  const [novoUserEmail, setNovoUserEmail] = useState("");
  const [novoUserSenha, setNovoUserSenha] = useState("");
  const [novoUserRole, setNovoUserRole] = useState<UserRole>("usuario");

  // Estados de Criação: Tudo Junto
  const [juntoMatNome, setJuntoMatNome] = useState("");
  const [juntoMatIcone, setJuntoMatIcone] = useState("✨");
  const [juntoMatCor, setJuntoMatCor] = useState("purple");
  const [juntoTopTitulo, setJuntoTopTitulo] = useState("");
  const [juntoTopDesc, setJuntoTopDesc] = useState("");
  const [juntoTopResumo, setJuntoTopResumo] = useState("");
  const [juntoAtivPrompt, setJuntoAtivPrompt] = useState("");
  const [juntoAtivA, setJuntoAtivA] = useState("");
  const [juntoAtivB, setJuntoAtivB] = useState("");
  const [juntoAtivC, setJuntoAtivC] = useState("");
  const [juntoAtivD, setJuntoAtivD] = useState("");
  const [juntoAtivCorreta, setJuntoAtivCorreta] = useState(0);
  const [juntoAtivExplicacao, setJuntoAtivExplicacao] = useState("");

  if (!isOpen) return null;

  // Totalizadores
  const totalMaterias = subjects.length;
  const totalAssuntos = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const totalAtividades = subjects.reduce(
    (acc, s) => acc + s.topics.reduce((tAcc, t) => tAcc + t.questions.length, 0),
    0
  );
  const totalUsuarios = users.length;

  // ================= CRUD: MATÉRIAS =================
  function handleCriarMateria(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!novaMateriaNome.trim()) {
      setFeedback({ tipo: "erro", msg: "Informe o nome da matéria." });
      return;
    }
    if (subjects.some((s) => s.name.toLowerCase() === novaMateriaNome.trim().toLowerCase())) {
      setFeedback({ tipo: "erro", msg: "Já existe uma matéria com este nome." });
      return;
    }
    const firstTopic = novaMateriaTopico.trim() || "Introdução";
    const newSubject: Subject = {
      name: novaMateriaNome.trim(),
      icon: novaMateriaIcone.trim() || "📚",
      color: novaMateriaCor,
      topics: [
        {
          title: firstTopic,
          description: `Introdução e visão geral sobre ${novaMateriaNome.trim()}.`,
          summary: [
            `Bem-vindo(a) à disciplina de ${novaMateriaNome.trim()}.`,
            "Conteúdo criado pela administração para apoiar seus estudos.",
          ],
          questions: [],
        },
      ],
    };
    const updated = [...subjects, newSubject];
    onSaveSubjects(updated);
    onSelectCreated(newSubject.name, firstTopic);
    setFeedback({ tipo: "sucesso", msg: `Matéria "${newSubject.name}" criada com sucesso!` });
    setNovaMateriaNome("");
    setNovaMateriaTopico("");
  }

  function handleSalvarEdicaoMateria(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSubject) return;
    if (!editingSubject.name.trim()) {
      setFeedback({ tipo: "erro", msg: "O nome da matéria não pode ficar vazio." });
      return;
    }

    const updated = subjects.map((s) => {
      if (s.name !== editingSubject.originalName) return s;
      return {
        ...s,
        name: editingSubject.name.trim(),
        icon: editingSubject.icon.trim() || s.icon,
        color: editingSubject.color,
      };
    });

    onSaveSubjects(updated);
    setEditingSubject(null);
    setFeedback({ tipo: "sucesso", msg: "Matéria atualizada com sucesso!" });
  }

  function handleExcluirMateria(materiaNome: string) {
    if (subjects.length <= 1) {
      setFeedback({ tipo: "erro", msg: "Você não pode excluir a única matéria existente." });
      return;
    }
    if (!confirm(`Tem certeza que deseja excluir a matéria "${materiaNome}" e todos os seus assuntos e questões?`)) {
      return;
    }
    const updated = subjects.filter((s) => s.name !== materiaNome);
    onSaveSubjects(updated);
    setFeedback({ tipo: "sucesso", msg: `Matéria "${materiaNome}" excluída com sucesso!` });
  }

  // ================= CRUD: ASSUNTOS =================
  function handleCriarAssunto(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!novoAssuntoTitulo.trim()) {
      setFeedback({ tipo: "erro", msg: "Informe o título do assunto." });
      return;
    }
    const targetSub = subjects.find((s) => s.name === novoAssuntoMateria);
    if (!targetSub) {
      setFeedback({ tipo: "erro", msg: "Selecione uma matéria válida." });
      return;
    }
    if (targetSub.topics.some((t) => t.title.toLowerCase() === novoAssuntoTitulo.trim().toLowerCase())) {
      setFeedback({ tipo: "erro", msg: "Este assunto já existe na matéria selecionada." });
      return;
    }

    const paragraphs = novoAssuntoResumo
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const newTopic: Topic = {
      title: novoAssuntoTitulo.trim(),
      description: novoAssuntoDesc.trim() || `Conteúdo teórico sobre ${novoAssuntoTitulo.trim()}.`,
      summary: paragraphs.length ? paragraphs : [`Conceitos sobre ${novoAssuntoTitulo.trim()}.`],
      questions: [],
    };

    const updated = subjects.map((s) =>
      s.name === novoAssuntoMateria ? { ...s, topics: [...s.topics, newTopic] } : s
    );

    onSaveSubjects(updated);
    onSelectCreated(novoAssuntoMateria, newTopic.title);
    setFeedback({ tipo: "sucesso", msg: `Assunto "${newTopic.title}" adicionado!` });
    setNovoAssuntoTitulo("");
    setNovoAssuntoDesc("");
    setNovoAssuntoResumo("");
  }

  function handleSalvarEdicaoAssunto(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTopic) return;
    if (!editingTopic.title.trim()) {
      setFeedback({ tipo: "erro", msg: "O título do assunto não pode ficar vazio." });
      return;
    }

    const paragraphs = editingTopic.summary
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const updated = subjects.map((s) => {
      if (s.name !== editingTopic.subjectName) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.title !== editingTopic.originalTitle) return t;
          return {
            ...t,
            title: editingTopic.title.trim(),
            description: editingTopic.description.trim() || t.description,
            summary: paragraphs.length ? paragraphs : t.summary,
          };
        }),
      };
    });

    onSaveSubjects(updated);
    setEditingTopic(null);
    setFeedback({ tipo: "sucesso", msg: "Assunto atualizado com sucesso!" });
  }

  function handleExcluirAssunto(subjectName: string, topicTitle: string) {
    const sub = subjects.find((s) => s.name === subjectName);
    if (sub && sub.topics.length <= 1) {
      setFeedback({ tipo: "erro", msg: "A matéria deve ter ao menos um assunto. Crie outro antes de excluir." });
      return;
    }
    if (!confirm(`Deseja excluir o assunto "${topicTitle}" de ${subjectName}?`)) return;

    const updated = subjects.map((s) => {
      if (s.name !== subjectName) return s;
      return {
        ...s,
        topics: s.topics.filter((t) => t.title !== topicTitle),
      };
    });

    onSaveSubjects(updated);
    setFeedback({ tipo: "sucesso", msg: `Assunto "${topicTitle}" removido!` });
  }

  // ================= CRUD: ATIVIDADES =================
  function handleCriarAtividade(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!novaAtivPrompt.trim()) {
      setFeedback({ tipo: "erro", msg: "Informe o enunciado da atividade." });
      return;
    }
    if (!novaAtivAltA.trim() || !novaAtivAltB.trim() || !novaAtivAltC.trim() || !novaAtivAltD.trim()) {
      setFeedback({ tipo: "erro", msg: "Preencha as 4 opções de resposta (A, B, C, D)." });
      return;
    }

    const newQuestion: Question = {
      prompt: novaAtivPrompt.trim(),
      options: [novaAtivAltA.trim(), novaAtivAltB.trim(), novaAtivAltC.trim(), novaAtivAltD.trim()],
      answer: novaAtivCorreta,
      explanation: novaAtivExplicacao.trim() || `A alternativa correta é a ${String.fromCharCode(65 + novaAtivCorreta)}.`,
    };

    const updated = subjects.map((s) => {
      if (s.name !== novaAtivMateria) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.title !== novaAtivTopico) return t;
          return {
            ...t,
            questions: [...t.questions, newQuestion],
          };
        }),
      };
    });

    onSaveSubjects(updated);
    onSelectCreated(novaAtivMateria, novaAtivTopico);
    setFeedback({ tipo: "sucesso", msg: "Atividade adicionada com sucesso!" });
    setNovaAtivPrompt("");
    setNovaAtivAltA("");
    setNovaAtivAltB("");
    setNovaAtivAltC("");
    setNovaAtivAltD("");
    setNovaAtivExplicacao("");
  }

  function handleSalvarEdicaoAtividade(e: React.FormEvent) {
    e.preventDefault();
    if (!editingQuestion) return;
    if (!editingQuestion.prompt.trim()) {
      setFeedback({ tipo: "erro", msg: "O enunciado não pode ficar vazio." });
      return;
    }

    const updated = subjects.map((s) => {
      if (s.name !== editingQuestion.subjectName) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.title !== editingQuestion.topicTitle) return t;
          const questionsCopy = [...t.questions];
          questionsCopy[editingQuestion.questionIndex] = {
            prompt: editingQuestion.prompt.trim(),
            options: editingQuestion.options,
            answer: editingQuestion.answer,
            explanation: editingQuestion.explanation.trim() || questionsCopy[editingQuestion.questionIndex].explanation,
          };
          return {
            ...t,
            questions: questionsCopy,
          };
        }),
      };
    });

    onSaveSubjects(updated);
    setEditingQuestion(null);
    setFeedback({ tipo: "sucesso", msg: "Atividade atualizada com sucesso!" });
  }

  function handleExcluirAtividade(subjectName: string, topicTitle: string, questionIndex: number) {
    if (!confirm("Deseja realmente excluir esta atividade?")) return;

    const updated = subjects.map((s) => {
      if (s.name !== subjectName) return s;
      return {
        ...s,
        topics: s.topics.map((t) => {
          if (t.title !== topicTitle) return t;
          return {
            ...t,
            questions: t.questions.filter((_, idx) => idx !== questionIndex),
          };
        }),
      };
    });

    onSaveSubjects(updated);
    setFeedback({ tipo: "sucesso", msg: "Atividade excluída com sucesso!" });
  }

  // ================= CRUD: USUÁRIOS =================
  function handleCriarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!novoUserEmail.trim() || !novoUserSenha.trim()) {
      setFeedback({ tipo: "erro", msg: "Preencha o Gmail e a senha do usuário." });
      return;
    }
    if (!novoUserEmail.trim().toLowerCase().endsWith("@gmail.com")) {
      setFeedback({ tipo: "erro", msg: "O e-mail deve terminar em @gmail.com." });
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === novoUserEmail.trim().toLowerCase())) {
      setFeedback({ tipo: "erro", msg: "Já existe uma conta com este Gmail." });
      return;
    }
    if (novoUserSenha.length < 8) {
      setFeedback({ tipo: "erro", msg: "A senha deve ter pelo menos 8 caracteres." });
      return;
    }

    const newUser: LocalUser = {
      name: novoUserNome.trim() || novoUserEmail.split("@")[0].replace(/[._-]+/g, " "),
      email: novoUserEmail.trim().toLowerCase(),
      senha: novoUserSenha,
      role: novoUserRole,
      createdAt: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    onSaveUsers(updated);
    setFeedback({ tipo: "sucesso", msg: `Usuário ${newUser.email} cadastrado com perfil ${newUser.role}!` });
    setNovoUserNome("");
    setNovoUserEmail("");
    setNovoUserSenha("");
  }

  function handleSalvarEdicaoUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    if (!editingUser.senha || editingUser.senha.length < 8) {
      setFeedback({ tipo: "erro", msg: "A senha deve ter pelo menos 8 caracteres." });
      return;
    }

    const updated = users.map((u) => {
      if (u.email.toLowerCase() !== editingUser.email.toLowerCase()) return u;
      return {
        ...u,
        name: editingUser.name.trim() || u.name,
        senha: editingUser.senha,
        role: editingUser.role,
      };
    });

    onSaveUsers(updated);
    setEditingUser(null);
    setFeedback({ tipo: "sucesso", msg: `Conta de ${editingUser.email} atualizada com sucesso!` });
  }

  function handleExcluirUsuario(email: string) {
    if (email.toLowerCase() === currentUserEmail.toLowerCase()) {
      setFeedback({ tipo: "erro", msg: "Você não pode excluir a sua própria conta ativa no momento." });
      return;
    }
    if (!confirm(`Deseja realmente remover o usuário "${email}"?`)) return;

    const updated = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    onSaveUsers(updated);
    setFeedback({ tipo: "sucesso", msg: `Usuário ${email} removido com sucesso!` });
  }

  // ================= CRUD: TUDO JUNTO =================
  function handleCriarTudoJunto(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!juntoMatNome.trim() || !juntoTopTitulo.trim() || !juntoAtivPrompt.trim()) {
      setFeedback({ tipo: "erro", msg: "Preencha o nome da matéria, o título do assunto e o enunciado da atividade." });
      return;
    }
    if (!juntoAtivA.trim() || !juntoAtivB.trim() || !juntoAtivC.trim() || !juntoAtivD.trim()) {
      setFeedback({ tipo: "erro", msg: "Preencha as 4 opções da atividade." });
      return;
    }

    const paragraphs = juntoTopResumo
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const question: Question = {
      prompt: juntoAtivPrompt.trim(),
      options: [juntoAtivA.trim(), juntoAtivB.trim(), juntoAtivC.trim(), juntoAtivD.trim()],
      answer: juntoAtivCorreta,
      explanation: juntoAtivExplicacao.trim() || `A alternativa correta é a ${String.fromCharCode(65 + juntoAtivCorreta)}.`,
    };

    const topic: Topic = {
      title: juntoTopTitulo.trim(),
      description: juntoTopDesc.trim() || `Conteúdo teórico sobre ${juntoTopTitulo.trim()}.`,
      summary: paragraphs.length ? paragraphs : [`Conceitos fundamentais de ${juntoTopTitulo.trim()}.`],
      questions: [question],
    };

    let updated: Subject[];
    const exists = subjects.find((s) => s.name.toLowerCase() === juntoMatNome.trim().toLowerCase());
    if (exists) {
      updated = subjects.map((s) => {
        if (s.name.toLowerCase() !== juntoMatNome.trim().toLowerCase()) return s;
        return {
          ...s,
          topics: [...s.topics, topic],
        };
      });
    } else {
      const newSub: Subject = {
        name: juntoMatNome.trim(),
        icon: juntoMatIcone.trim() || "✨",
        color: juntoMatCor,
        topics: [topic],
      };
      updated = [...subjects, newSub];
    }

    onSaveSubjects(updated);
    onSelectCreated(juntoMatNome.trim(), topic.title);
    setFeedback({ tipo: "sucesso", msg: "Matéria, assunto e atividade criados juntos com sucesso!" });

    setJuntoMatNome("");
    setJuntoTopTitulo("");
    setJuntoTopDesc("");
    setJuntoTopResumo("");
    setJuntoAtivPrompt("");
    setJuntoAtivA("");
    setJuntoAtivB("");
    setJuntoAtivC("");
    setJuntoAtivD("");
    setJuntoAtivExplicacao("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm overflow-hidden">
      <div className="relative flex h-[94vh] w-full max-w-5xl flex-col rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-[#161726] shadow-2xl overflow-hidden transition-colors">
        {/* TOPO DO PAINEL DE CONTROLE */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 px-6 py-4 bg-linears-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950/60 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-md shadow-indigo-500/25">
              🎛️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Painel de Controle</h2>
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                  ADMINISTRADOR
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                CRUD Completo: Visualize, crie, edite e remova matérias, assuntos, atividades e usuários.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl text-gray-400 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            title="Fechar Painel de Controle"
          >
            ✕
          </button>
        </div>

        {/* CARDS DE RESUMO E ESTATÍSTICAS */}
        <div className="grid grid-cols-2 gap-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-[#121320] p-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-3 text-center shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Matérias</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalMaterias}</p>
          </div>
          <div className="rounded-2xl border border-purple-100 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-3 text-center shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Assuntos</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalAssuntos}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-3 text-center shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Atividades</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalAtividades}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-3 text-center shadow-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Usuários</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalUsuarios}</p>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS DO CRUD */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-slate-800 bg-gray-100/70 dark:bg-[#121320] px-6 py-2.5 gap-2 text-xs font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setTab("visao-geral");
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 transition-all cursor-pointer ${
              tab === "visao-geral"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1f2035]"
            }`}
          >
            📋 Visão Geral e Lista Completa
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("materias");
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 transition-all cursor-pointer ${
              tab === "materias"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1f2035]"
            }`}
          >
            📚 Matérias ({totalMaterias})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("assuntos");
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 transition-all cursor-pointer ${
              tab === "assuntos"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1f2035]"
            }`}
          >
            📝 Assuntos ({totalAssuntos})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("atividades");
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 transition-all cursor-pointer ${
              tab === "atividades"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1f2035]"
            }`}
          >
            🎯 Atividades ({totalAtividades})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("usuarios");
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 transition-all cursor-pointer ${
              tab === "usuarios"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1f2035]"
            }`}
          >
            👥 Usuários ({totalUsuarios})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("junto");
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 transition-all cursor-pointer ${
              tab === "junto"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1f2035]"
            }`}
          >
            ✨ Criar Tudo Junto
          </button>
        </div>

        {/* FEEDBACK MENSAGEM */}
        {feedback && (
          <div
            className={`mx-6 mt-3 rounded-2xl p-3 text-xs font-semibold transition-all ${
              feedback.tipo === "sucesso"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {/* CORPO PRINCIPAL COM ROLAGEM */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================= ABA 1: VISÃO GERAL & LISTA COMPLETA ================= */}
          {tab === "visao-geral" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    O que você pode alterar e visualizar:
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nesta lista completa, você tem acesso hierárquico a todas as matérias, assuntos teóricos e questões cadastradas.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Filtrar por matéria ou assunto..."
                  className="w-full sm:w-64 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:border-indigo-500 focus:outline-none"
                  value={buscaGeral}
                  onChange={(e) => setBuscaGeral(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                {subjects
                  .filter(
                    (s) =>
                      s.name.toLowerCase().includes(buscaGeral.toLowerCase()) ||
                      s.topics.some((t) => t.title.toLowerCase().includes(buscaGeral.toLowerCase()))
                  )
                  .map((sub) => (
                    <div
                      key={sub.name}
                      className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-5 shadow-xs transition-shadow hover:shadow-md"
                    >
                      {/* Topo da Matéria */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-xl font-bold">
                            {sub.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white">{sub.name}</h4>
                              <span className="rounded-full bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                                Cor: {sub.color}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {sub.topics.length} assunto(s) ·{" "}
                              {sub.topics.reduce((acc, t) => acc + t.questions.length, 0)} atividade(s)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingSubject({
                                originalName: sub.name,
                                name: sub.name,
                                icon: sub.icon,
                                color: sub.color,
                              })
                            }
                            className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#141524] px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            ✎ Editar Matéria
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExcluirMateria(sub.name)}
                            className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                          >
                            🗑 Excluir Matéria
                          </button>
                        </div>
                      </div>

                      {/* Lista de Assuntos dentro da Matéria */}
                      <div className="mt-4 space-y-3 pl-2 sm:pl-4">
                        {sub.topics.map((top, tIdx) => (
                          <div
                            key={top.title}
                            className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-[#131422] p-3.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                                  {tIdx + 1}. {top.title}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{top.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingTopic({
                                      subjectName: sub.name,
                                      originalTitle: top.title,
                                      title: top.title,
                                      description: top.description,
                                      summary: top.summary.join("\n\n"),
                                    })
                                  }
                                  className="rounded-lg bg-white dark:bg-[#1a1b2d] px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  ✎ Editar Assunto
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleExcluirAssunto(sub.name, top.title)}
                                  className="rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                                >
                                  🗑 Excluir Assunto
                                </button>
                              </div>
                            </div>

                            {/* Questões do Assunto */}
                            {top.questions.length > 0 && (
                              <div className="mt-3 space-y-2 border-t border-gray-200/60 dark:border-slate-800 pt-2">
                                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                  🎯 Atividades cadastradas ({top.questions.length}):
                                </p>
                                <div className="space-y-1.5">
                                  {top.questions.map((q, qIdx) => (
                                    <div
                                      key={qIdx}
                                      className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1a1b2d] p-2.5 text-xs border border-gray-200/80 dark:border-slate-800"
                                    >
                                      <div className="pr-3">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                                          Q{qIdx + 1}: {q.prompt}
                                        </p>
                                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                          Gabarito: ({String.fromCharCode(65 + q.answer)}) {q.options[q.answer]}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setEditingQuestion({
                                              subjectName: sub.name,
                                              topicTitle: top.title,
                                              questionIndex: qIdx,
                                              prompt: q.prompt,
                                              options: [q.options[0], q.options[1], q.options[2], q.options[3]],
                                              answer: q.answer,
                                              explanation: q.explanation,
                                            })
                                          }
                                          className="rounded-md bg-gray-50 dark:bg-slate-800 px-2 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                                        >
                                          ✎ Editar
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleExcluirAtividade(sub.name, top.title, qIdx)}
                                          className="rounded-md bg-rose-50 dark:bg-rose-950/40 px-2 py-1 text-[11px] font-medium text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                                        >
                                          🗑 Excluir
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= ABA 2: CRUD MATÉRIAS ================= */}
          {tab === "materias" && (
            <div className="space-y-6">
              {/* Formulário de Criação de Matéria */}
              <form onSubmit={handleCriarMateria} className="rounded-3xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-5">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                  <span>➕</span> Cadastrar Nova Matéria
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome da Matéria *</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Filosofia, Biologia, Química"
                      value={novaMateriaNome}
                      onChange={(e) => setNovaMateriaNome(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ícone</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white text-center focus:border-indigo-500 focus:outline-none"
                      placeholder="📚"
                      value={novaMateriaIcone}
                      onChange={(e) => setNovaMateriaIcone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Cor do Badge</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      value={novaMateriaCor}
                      onChange={(e) => setNovaMateriaCor(e.target.value)}
                    >
                      {CORES_DISPONIVEIS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Primeiro Assunto (Opcional)</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Introdução aos estudos"
                      value={novaMateriaTopico}
                      onChange={(e) => setNovaMateriaTopico(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
                >
                  Salvar Nova Matéria
                </button>
              </form>

              {/* Tabela de Matérias Existentes */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Matérias Atuais ({subjects.length}):</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {subjects.map((sub) => (
                    <div
                      key={sub.name}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-2xl font-bold">
                          {sub.icon}
                        </span>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{sub.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {sub.topics.length} assunto(s) · {sub.color}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSubject({
                              originalName: sub.name,
                              name: sub.name,
                              icon: sub.icon,
                              color: sub.color,
                            })
                          }
                          className="rounded-lg bg-gray-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          ✎ Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExcluirMateria(sub.name)}
                          className="rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                        >
                          🗑 Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA 3: CRUD ASSUNTOS ================= */}
          {tab === "assuntos" && (
            <div className="space-y-6">
              {/* Formulário de Criação de Assunto */}
              <form onSubmit={handleCriarAssunto} className="rounded-3xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/40 dark:bg-purple-950/20 p-5">
                <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <span>➕</span> Cadastrar Novo Assunto
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Matéria de Destino *</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      value={novoAssuntoMateria}
                      onChange={(e) => setNovoAssuntoMateria(e.target.value)}
                    >
                      {subjects.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Título do Assunto *</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Termodinâmica, Sintaxe, Era Vargas"
                      value={novoAssuntoTitulo}
                      onChange={(e) => setNovoAssuntoTitulo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição Breve</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Ex: Conceitos essenciais e exemplos do tema."
                    value={novoAssuntoDesc}
                    onChange={(e) => setNovoAssuntoDesc(e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Resumo Explicativo (Parágrafos de Leitura do Aluno)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Digite o resumo que os alunos irão ler para aprender..."
                    value={novoAssuntoResumo}
                    onChange={(e) => setNovoAssuntoResumo(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 cursor-pointer"
                >
                  Salvar Assunto
                </button>
              </form>

              {/* Filtro por Matéria */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Filtrar por Matéria:</span>
                <select
                  value={filtroMateria}
                  onChange={(e) => setFiltroMateria(e.target.value)}
                  className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-800 dark:text-gray-200"
                >
                  <option value="todas">Todas as Matérias</option>
                  {subjects.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de Assuntos */}
              <div className="space-y-3">
                {subjects
                  .filter((s) => filtroMateria === "todas" || s.name === filtroMateria)
                  .flatMap((s) =>
                    s.topics.map((t) => (
                      <div
                        key={`${s.name}-${t.title}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-4 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                              {s.name}
                            </span>
                            <h5 className="font-bold text-gray-900 dark:text-white">{t.title}</h5>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.description}</p>
                          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                            {t.summary.length} parágrafo(s) · {t.questions.length} questão(ões)
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTopic({
                                subjectName: s.name,
                                originalTitle: t.title,
                                title: t.title,
                                description: t.description,
                                summary: t.summary.join("\n\n"),
                              })
                            }
                            className="rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            ✎ Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExcluirAssunto(s.name, t.title)}
                            className="rounded-lg bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                          >
                            🗑 Excluir
                          </button>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </div>
          )}

          {/* ================= ABA 4: CRUD ATIVIDADES ================= */}
          {tab === "atividades" && (
            <div className="space-y-6">
              {/* Formulário de Criação de Atividade */}
              <form onSubmit={handleCriarAtividade} className="rounded-3xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <span>➕</span> Cadastrar Nova Atividade (Questão)
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Matéria *</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      value={novaAtivMateria}
                      onChange={(e) => {
                        setNovaAtivMateria(e.target.value);
                        const s = subjects.find((sub) => sub.name === e.target.value);
                        if (s && s.topics[0]) {
                          setNovaAtivTopico(s.topics[0].title);
                        }
                      }}
                    >
                      {subjects.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.icon} {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Assunto *</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      value={novaAtivTopico}
                      onChange={(e) => setNovaAtivTopico(e.target.value)}
                    >
                      {currentSubForAtiv?.topics.map((t) => (
                        <option key={t.title} value={t.title}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Enunciado da Pergunta *</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Ex: Qual país iniciou a Primeira Revolução Industrial?"
                    value={novaAtivPrompt}
                    onChange={(e) => setNovaAtivPrompt(e.target.value)}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Alternativa A"
                    value={novaAtivAltA}
                    onChange={(e) => setNovaAtivAltA(e.target.value)}
                  />
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Alternativa B"
                    value={novaAtivAltB}
                    onChange={(e) => setNovaAtivAltB(e.target.value)}
                  />
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Alternativa C"
                    value={novaAtivAltC}
                    onChange={(e) => setNovaAtivAltC(e.target.value)}
                  />
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Alternativa D"
                    value={novaAtivAltD}
                    onChange={(e) => setNovaAtivAltD(e.target.value)}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gabarito (Resposta Correta)</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      value={novaAtivCorreta}
                      onChange={(e) => setNovaAtivCorreta(Number(e.target.value))}
                    >
                      <option value={0}>Alternativa A</option>
                      <option value={1}>Alternativa B</option>
                      <option value={2}>Alternativa C</option>
                      <option value={3}>Alternativa D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Explicação / Feedback Pedagógico</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: A Inglaterra foi pioneira devido às jazidas de carvão..."
                      value={novaAtivExplicacao}
                      onChange={(e) => setNovaAtivExplicacao(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
                >
                  Salvar Atividade
                </button>
              </form>

              {/* Lista de Atividades */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Todas as Atividades ({totalAtividades}):</h4>
                {subjects.flatMap((s) =>
                  s.topics.flatMap((t) =>
                    t.questions.map((q, qIdx) => (
                      <div
                        key={`${s.name}-${t.title}-${qIdx}`}
                        className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] p-4 shadow-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                              {s.name}
                            </span>
                            <span className="text-xs text-gray-400">›</span>
                            <span className="rounded-md bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                              {t.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingQuestion({
                                  subjectName: s.name,
                                  topicTitle: t.title,
                                  questionIndex: qIdx,
                                  prompt: q.prompt,
                                  options: [q.options[0], q.options[1], q.options[2], q.options[3]],
                                  answer: q.answer,
                                  explanation: q.explanation,
                                })
                              }
                              className="rounded-lg bg-gray-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                            >
                              ✎ Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleExcluirAtividade(s.name, t.title, qIdx)}
                              className="rounded-lg bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                            >
                              🗑 Excluir
                            </button>
                          </div>
                        </div>

                        <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">{q.prompt}</p>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`rounded-lg px-2.5 py-1 border ${
                                oIdx === q.answer
                                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold"
                                  : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-[#121320] text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}) {opt} {oIdx === q.answer && "✓"}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 italic">
                            💡 Explicação: {q.explanation}
                          </p>
                        )}
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          )}

          {/* ================= ABA 5: CRUD USUÁRIOS ================= */}
          {tab === "usuarios" && (
            <div className="space-y-6">
              {/* Formulário de Criação de Usuário */}
              <form onSubmit={handleCriarUsuario} className="rounded-3xl border border-amber-100 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 p-5">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <span>➕</span> Cadastrar Novo Usuário ou Administrador
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Carlos Eduardo"
                      value={novoUserNome}
                      onChange={(e) => setNovoUserNome(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gmail *</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="usuario@gmail.com"
                      value={novoUserEmail}
                      onChange={(e) => setNovoUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Senha * (mínimo 8)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Senha123#"
                      value={novoUserSenha}
                      onChange={(e) => setNovoUserSenha(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Perfil de Acesso:</label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-800 dark:text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={novoUserRole === "usuario"}
                      onChange={() => setNovoUserRole("usuario")}
                    />
                    🎓 Estudante (Usuário comum)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-800 dark:text-gray-200 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      checked={novoUserRole === "admin"}
                      onChange={() => setNovoUserRole("admin")}
                    />
                    👑 Administrador
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-4 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 cursor-pointer"
                >
                  Cadastrar Usuário
                </button>
              </form>

              {/* Tabela de Usuários */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Usuários Cadastrados ({users.length}):</h4>
                <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1a1b2d] shadow-xs">
                  <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      <tr>
                        <th className="px-4 py-3">Nome / E-mail</th>
                        <th className="px-4 py-3">Senha</th>
                        <th className="px-4 py-3">Perfil</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {users.map((u) => {
                        const isCurrent = u.email.toLowerCase() === currentUserEmail.toLowerCase();
                        return (
                          <tr key={u.email} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3">
                              <p className="font-bold text-gray-900 dark:text-white">{u.name || "Sem nome"}</p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">{u.email}</p>
                            </td>
                            <td className="px-4 py-3 font-mono text-gray-800 dark:text-gray-200">{u.senha}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  u.role === "admin"
                                    ? "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                    : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                }`}
                              >
                                {u.role === "admin" ? "👑 Admin" : "🎓 Estudante"}
                              </span>
                              {isCurrent && (
                                <span className="ml-1 text-[10px] text-gray-400 font-semibold">(Você)</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingUser({
                                    email: u.email,
                                    name: u.name || "",
                                    senha: u.senha,
                                    role: u.role,
                                  })
                                }
                                className="rounded-lg bg-gray-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                ✎ Editar
                              </button>
                              <button
                                type="button"
                                disabled={isCurrent}
                                onClick={() => handleExcluirUsuario(u.email)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                                  isCurrent
                                    ? "bg-gray-100 dark:bg-slate-900 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-slate-800 cursor-not-allowed"
                                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 cursor-pointer"
                                }`}
                                title={isCurrent ? "Não é possível excluir a sua própria conta logada." : "Excluir conta"}
                              >
                                🗑 Excluir
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA 6: CRIAR TUDO JUNTO ================= */}
          {tab === "junto" && (
            <form onSubmit={handleCriarTudoJunto} className="space-y-5">
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">1. Dados da Matéria</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome da Matéria *</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Filosofia, Biologia, Química"
                      value={juntoMatNome}
                      onChange={(e) => setJuntoMatNome(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ícone</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white text-center focus:border-indigo-500 focus:outline-none"
                      placeholder="✨"
                      value={juntoMatIcone}
                      onChange={(e) => setJuntoMatIcone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Cor</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                    value={juntoMatCor}
                    onChange={(e) => setJuntoMatCor(e.target.value)}
                  >
                    {CORES_DISPONIVEIS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 dark:border-purple-950/60 bg-purple-50/40 dark:bg-purple-950/20 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">2. Assunto Teórico</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Título do Assunto *</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Tabela Periódica, Genética"
                      value={juntoTopTitulo}
                      onChange={(e) => setJuntoTopTitulo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Breve Descrição</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Compreenda os elementos e suas propriedades."
                      value={juntoTopDesc}
                      onChange={(e) => setJuntoTopDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Resumo Teórico</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Escreva os conceitos fundamentais para leitura..."
                      value={juntoTopResumo}
                      onChange={(e) => setJuntoTopResumo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">3. Atividade de Fixação</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pergunta *</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Ex: Qual o número atômico do hidrogênio?"
                      value={juntoAtivPrompt}
                      onChange={(e) => setJuntoAtivPrompt(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                      placeholder="Opção A"
                      value={juntoAtivA}
                      onChange={(e) => setJuntoAtivA(e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                      placeholder="Opção B"
                      value={juntoAtivB}
                      onChange={(e) => setJuntoAtivB(e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                      placeholder="Opção C"
                      value={juntoAtivC}
                      onChange={(e) => setJuntoAtivC(e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                      placeholder="Opção D"
                      value={juntoAtivD}
                      onChange={(e) => setJuntoAtivD(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gabarito</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        value={juntoAtivCorreta}
                        onChange={(e) => setJuntoAtivCorreta(Number(e.target.value))}
                      >
                        <option value={0}>Alternativa A</option>
                        <option value={1}>Alternativa B</option>
                        <option value={2}>Alternativa C</option>
                        <option value={3}>Alternativa D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Explicação</label>
                      <input
                        className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="Ex: O hidrogênio possui apenas 1 próton..."
                        value={juntoAtivExplicacao}
                        onChange={(e) => setJuntoAtivExplicacao(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 cursor-pointer"
              >
                Cadastrar Matéria, Assunto e Atividade Juntos
              </button>
            </form>
          )}
        </div>

        {/* ================= MODAIS DE EDIÇÃO (POPUPS) ================= */}
        {/* Modal: Editar Matéria */}
        {editingSubject && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#18192a] p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">✎ Editar Matéria</h3>
              <form onSubmit={handleSalvarEdicaoMateria} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome da Matéria</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ícone</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white text-center"
                      value={editingSubject.icon}
                      onChange={(e) => setEditingSubject({ ...editingSubject, icon: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Cor</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                      value={editingSubject.color}
                      onChange={(e) => setEditingSubject({ ...editingSubject, color: e.target.value })}
                    >
                      {CORES_DISPONIVEIS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingSubject(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Editar Assunto */}
        {editingTopic && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#18192a] p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">✎ Editar Assunto ({editingTopic.subjectName})</h3>
              <form onSubmit={handleSalvarEdicaoAssunto} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Título do Assunto</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingTopic.title}
                    onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingTopic.description}
                    onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Resumo Teórico</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingTopic.summary}
                    onChange={(e) => setEditingTopic({ ...editingTopic, summary: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingTopic(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Editar Atividade */}
        {editingQuestion && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#18192a] p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                ✎ Editar Atividade ({editingQuestion.subjectName} › {editingQuestion.topicTitle})
              </h3>
              <form onSubmit={handleSalvarEdicaoAtividade} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Enunciado da Pergunta</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingQuestion.prompt}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, prompt: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Opção A"
                    value={editingQuestion.options[0]}
                    onChange={(e) => {
                      const newOpts: [string, string, string, string] = [...editingQuestion.options];
                      newOpts[0] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: newOpts });
                    }}
                  />
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Opção B"
                    value={editingQuestion.options[1]}
                    onChange={(e) => {
                      const newOpts: [string, string, string, string] = [...editingQuestion.options];
                      newOpts[1] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: newOpts });
                    }}
                  />
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Opção C"
                    value={editingQuestion.options[2]}
                    onChange={(e) => {
                      const newOpts: [string, string, string, string] = [...editingQuestion.options];
                      newOpts[2] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: newOpts });
                    }}
                  />
                  <input
                    className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                    placeholder="Opção D"
                    value={editingQuestion.options[3]}
                    onChange={(e) => {
                      const newOpts: [string, string, string, string] = [...editingQuestion.options];
                      newOpts[3] = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: newOpts });
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gabarito</label>
                    <select
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                      value={editingQuestion.answer}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: Number(e.target.value) })}
                    >
                      <option value={0}>Alternativa A</option>
                      <option value={1}>Alternativa B</option>
                      <option value={2}>Alternativa C</option>
                      <option value={3}>Alternativa D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Explicação</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                      value={editingQuestion.explanation}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Editar Usuário */}
        {editingUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#18192a] p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">✎ Editar Conta de Usuário</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{editingUser.email}</p>
              <form onSubmit={handleSalvarEdicaoUsuario} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome do Usuário</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Senha (mínimo 8 caracteres)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white font-mono"
                    value={editingUser.senha}
                    onChange={(e) => setEditingUser({ ...editingUser, senha: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Perfil de Acesso</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#121320] px-3 py-2 text-sm text-gray-900 dark:text-white"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  >
                    <option value="usuario">🎓 Estudante (Usuário comum)</option>
                    <option value="admin">👑 Administrador</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 cursor-pointer"
                  >
                    Salvar Usuário
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
