"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/lib/login-schema";
import seedData from "@/data/usuarios.json";
import {
  findLocalUser,
  registerLocalUser,
  verifyLocalUser,
  getAllLocalUsers,
  saveUsers,
  type LocalUser,
  type UserRole,
} from "@/lib/local-auth";
import {
  MATERIAS_INICIAIS,
  type Subject,
} from "@/data/materias-iniciais";
import { AdminPanelModal } from "@/components/AdminPanelModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  secureGetItem,
  secureSetItem,
  secureClearAll,
} from "@/lib/storage-crypto";
import { slugify } from "@/lib/slugify";

const STORAGE_KEY = "estudotec-dados";
const SESSION_KEY = "estudotec-sessao";
const SUBJECTS_KEY = "estudotec-materias";
const seedUsers = seedData.usuarios as LocalUser[];

type SavedData = {
  studentName: string;
  email: string;
  role: UserRole;
  subject: string;
  topic: string;
  answers: Record<string, number>;
};

const initialData: SavedData = {
  studentName: "",
  email: "",
  role: "usuario",
  subject: MATERIAS_INICIAIS[0].name,
  topic: MATERIAS_INICIAIS[0].topics[0].title,
  answers: {},
};

type StudyPlatformProps = {
  initialSubjectSlug?: string;
  initialTopicSlug?: string;
};

export function StudyPlatform({
  initialSubjectSlug,
  initialTopicSlug,
}: StudyPlatformProps) {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>(MATERIAS_INICIAIS);
  const [users, setUsers] = useState<LocalUser[]>(seedUsers);
  const [data, setData] = useState<SavedData>(initialData);
  const [loginError, setLoginError] = useState("");
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [registerRole, setRegisterRole] = useState<UserRole>("usuario");
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Carrega matérias, usuários e sessão criptografados do navegador
  useEffect(() => {
    let active = true;

    async function hydrate() {
      let currentSubjects = MATERIAS_INICIAIS;
      try {
        const storedSubjects = secureGetItem(SUBJECTS_KEY);
        if (storedSubjects) {
          const parsed = JSON.parse(storedSubjects) as Subject[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentSubjects = parsed;
          }
        }
      } catch {
        currentSubjects = MATERIAS_INICIAIS;
      }

      const currentUsers = getAllLocalUsers(seedUsers);

      // Determina a matéria pelo slug da rota (se fornecido)
      let defaultSub = currentSubjects[0] ?? MATERIAS_INICIAIS[0];
      if (initialSubjectSlug) {
        const matched = currentSubjects.find(
          (s) => slugify(s.name) === initialSubjectSlug
        );
        if (matched) {
          defaultSub = matched;
        }
      }

      // Determina o assunto/tópico pelo slug da rota (se fornecido)
      let defaultTopic = defaultSub.topics[0]?.title ?? "";
      if (initialTopicSlug) {
        const matchedTopic = defaultSub.topics.find(
          (t) => slugify(t.title) === initialTopicSlug
        );
        if (matchedTopic) {
          defaultTopic = matchedTopic.title;
        }
      }

      let restored: SavedData = {
        ...initialData,
        subject: defaultSub.name,
        topic: defaultTopic,
      };

      try {
        const saved = secureGetItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<SavedData>;
          restored = {
            ...restored,
            ...parsed,
            studentName: "",
            email: "",
            subject: defaultSub.name,
            topic: defaultTopic,
          };
        }
        const email = secureGetItem(SESSION_KEY) ?? "";
        const user = email ? findLocalUser(email, currentUsers) : undefined;
        if (user) {
          restored = {
            ...restored,
            email,
            role: user.role ?? "usuario",
            studentName: user.name ?? email.split("@")[0].replace(/[._-]+/g, " "),
          };
        } else {
          secureClearAll();
        }
      } catch {
        secureClearAll();
      }

      if (active) {
        setSubjects(currentSubjects);
        setUsers(currentUsers);
        setData(restored);
        setReady(true);
      }
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, [initialSubjectSlug, initialTopicSlug]);

  // Salva o progresso e seleções do usuário com criptografia (apenas quando logado)
  useEffect(() => {
    if (ready && data.studentName && data.email) {
      const studyData: Omit<SavedData, "studentName" | "email" | "role"> = {
        subject: data.subject,
        topic: data.topic,
        answers: data.answers,
      };
      secureSetItem(STORAGE_KEY, JSON.stringify(studyData));
    }
  }, [data, ready]);

  // Salva alterações nas matérias com criptografia
  function handleSaveSubjects(updatedSubjects: Subject[]) {
    setSubjects(updatedSubjects);
    secureSetItem(SUBJECTS_KEY, JSON.stringify(updatedSubjects));

    const currentStillExists = updatedSubjects.find((s) => s.name === data.subject);
    if (!currentStillExists && updatedSubjects.length > 0) {
      setData((d) => ({
        ...d,
        subject: updatedSubjects[0].name,
        topic: updatedSubjects[0].topics[0]?.title ?? "",
      }));
    } else if (currentStillExists) {
      const topicExists = currentStillExists.topics.find((t) => t.title === data.topic);
      if (!topicExists && currentStillExists.topics.length > 0) {
        setData((d) => ({
          ...d,
          topic: currentStillExists.topics[0].title,
        }));
      }
    }
  }

  // Salva alterações nos usuários com criptografia
  function handleSaveUsers(updatedUsers: LocalUser[]) {
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    const currentUpdated = updatedUsers.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (currentUpdated) {
      setData((d) => ({
        ...d,
        studentName: currentUpdated.name ?? d.studentName,
        role: currentUpdated.role ?? d.role,
      }));
    }
  }

  function handleSelectCreated(subjectName: string, topicTitle: string) {
    setData((d) => ({
      ...d,
      subject: subjectName,
      topic: topicTitle,
    }));
    router.push(`/materias/${slugify(subjectName)}/${slugify(topicTitle)}`);
  }

  const subject =
    subjects.find((x) => x.name === data.subject) ??
    subjects[0] ??
    MATERIAS_INICIAIS[0];

  const topic =
    subject.topics.find((x) => x.title === data.topic) ??
    subject.topics[0] ?? {
      title: "Sem assunto",
      description: "Nenhum assunto disponível nesta matéria ainda.",
      summary: ["Aguardando inclusão de tópicos pelo administrador."],
      questions: [],
    };

  const progress = useMemo(() => {
    const ids = subjects.flatMap((s) =>
      s.topics.flatMap((t) => t.questions.map((_, i) => `${s.name}|${t.title}|${i}`))
    );
    return ids.length
      ? Math.round(
          (ids.filter((id) => data.answers[id] !== undefined).length / ids.length) * 100
        )
      : 0;
  }, [subjects, data.answers]);

  function enter(values: LoginFormValues) {
    setLoginError("");
    let studentName = values.email.split("@")[0].replace(/[._-]+/g, " ");
    let userRole: UserRole = "usuario";

    if (authMode === "register") {
      const created = registerLocalUser(
        values.email,
        values.password,
        users,
        registerRole
      );
      if (!created) {
        setLoginError("Já existe uma conta com este Gmail. Entre ou use outro endereço.");
        return;
      }
      userRole = registerRole;
      setUsers(getAllLocalUsers(seedUsers));
    } else {
      const user = verifyLocalUser(values.email, values.password, users);
      if (!user) {
        setLoginError("Gmail ou senha incorretos. Se ainda não tem conta, cadastre-se.");
        return;
      }
      studentName = user.name ?? studentName;
      userRole = user.role ?? "usuario";
    }

    secureSetItem(SESSION_KEY, values.email);
    setData((d) => ({
      ...d,
      email: values.email,
      studentName,
      role: userRole,
    }));
  }

  // Botão Sair da Conta: LIMPA ABSOLUTAMENTE TUDO DO LOCALSTORAGE
  function leave() {
    setData(initialData);
    setSubjects(MATERIAS_INICIAIS);
    setUsers(seedUsers);
    setLoginError("");
    setSearch("");
    setAdminModalOpen(false);
    secureClearAll();
    if (typeof window !== "undefined") {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch {
        // ignore
      }
    }
    router.push("/");
  }

  if (!ready) {
    return (
      <main className="loading-screen">
        <span className="brand-mark">e</span>
      </main>
    );
  }

  // TELA DE LOGIN / CADASTRO
  if (!data.studentName) {
    return (
      <main className="welcome-screen">
        <div className="absolute top-5 right-6 z-10">
          <ThemeToggle showLabel />
        </div>

        <div className="welcome-shape shape-one" />
        <div className="welcome-shape shape-two" />
        <section className="welcome-card">
          <span className="welcome-icon">
            e<span>.</span>
          </span>
          <p className="eyebrow">UM ESPAÇO PARA APRENDER</p>
          <h1>
            {authMode === "login" ? "Continue seus estudos" : "Crie sua conta"}
            <br />
            <span>{authMode === "login" ? "com a gente." : "para estudar."}</span>
          </h1>
          <p className="welcome-copy">
            {authMode === "login"
              ? "Acesse seu espaço de aprendizagem com seu Gmail e senha."
              : "Cadastre seu Gmail, escolha sua senha e perfil de acesso."}
          </p>

          <form onSubmit={handleSubmit(enter)} className="welcome-form" noValidate>
            <label htmlFor="student-email">Gmail</label>
            <div className="name-input-wrap">
              <span>✉</span>
              <input
                id="student-email"
                type="email"
                autoComplete="email"
                placeholder="voce@gmail.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="login-error" role="alert">
                {errors.email.message}
              </p>
            )}

            <label htmlFor="student-password">Senha</label>
            <div className="name-input-wrap relative">
              <span>●</span>
              <input
                id="student-password"
                type={showPassword ? "text" : "password"}
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                placeholder="Mínimo 8 caracteres"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="bg-transparent border-0 px-1.5 cursor-pointer text-inherit text-base flex items-center opacity-80 hover:opacity-100 transition-opacity"
                title={showPassword ? "Ocultar senha" : "Ver senha"}
                aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="login-error" role="alert">
                {errors.password.message}
              </p>
            )}

            {authMode === "register" && (
              <div className="mt-3.5 mb-1.5">
                <label className="mb-1.5 block">
                  Perfil de Acesso
                </label>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRegisterRole("usuario")}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      registerRole === "usuario"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                        : "border-gray-200 dark:border-gray-700 bg-transparent text-inherit"
                    }`}
                  >
                    🎓 Estudante (Usuário)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole("admin")}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      registerRole === "admin"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                        : "border-gray-200 dark:border-gray-700 bg-transparent text-inherit"
                    }`}
                  >
                    👑 Administrador
                  </button>
                </div>
              </div>
            )}

            {loginError && (
              <p className="login-error" role="alert">
                {loginError}
              </p>
            )}

            <button className="primary-button" disabled={isSubmitting}>
              {isSubmitting
                ? "Verificando…"
                : authMode === "login"
                ? "Acessar meus estudos"
                : "Criar conta"}{" "}
              <span>→</span>
            </button>
          </form>

          <p className="auth-switch">
            {authMode === "login" ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              className="auth-switch-button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setLoginError("");
                clearErrors();
              }}
            >
              {authMode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </section>
      </main>
    );
  }

  // TELA PRINCIPAL (APLICAÇÃO)
  return (
    <main className="app-shell">
      {/* Modal do Painel de Controle com CRUD Completo */}
      {data.role === "admin" && (
        <AdminPanelModal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          subjects={subjects}
          onSaveSubjects={handleSaveSubjects}
          users={users}
          onSaveUsers={handleSaveUsers}
          currentUserEmail={data.email}
          onSelectCreated={handleSelectCreated}
        />
      )}

      {/* TOPBAR (SEM ÂNCORAS, USANDO LINKS DE PÁGINAS DO NEXT.JS) */}
      <header className="topbar">
        <div className="topbar-main">
          <Link href="/" className="brand" aria-label="Estudo Tec, início">
            <span className="brand-mark">
              e<span>.</span>
            </span>
            <span className="brand-name">
              ESTUDO<span>TEC</span>
            </span>
          </Link>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              aria-label="Buscar matéria ou assunto"
              placeholder="Busque uma matéria ou assunto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd>⌘ K</kbd>
          </div>

          {/* Botão de Painel de Controle exclusivo para o Administrador */}
          {data.role === "admin" && (
            <button
              onClick={() => setAdminModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-700 to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/30 hover:brightness-110 transition-all cursor-pointer border-0"
              title="Acessar o Painel de Controle (CRUD de matérias, assuntos, atividades e usuários)"
            >
              <span className="text-sm">🎛️</span> Painel de Controle
            </button>
          )}

          <Link href="/equipes" className="teams-nav-link">
            <span>♧</span> Equipes
          </Link>

          {/* Botão de Alternância de Tema (Dark / Light) */}
          <ThemeToggle />

          {/* Perfil com Role */}
          <div className="profile flex items-center gap-2">
            <span className="profile-avatar">
              {data.studentName.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col leading-tight">
              <span className="profile-name">{data.studentName}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  data.role === "admin"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {data.role === "admin" ? "👑 Admin" : "🎓 Estudante"}
              </span>
            </div>
            <span className="profile-chevron">⌄</span>
          </div>

          <button
            className="mobile-toggle"
            aria-label="Abrir matérias"
            onClick={() => setMobileMenu((v) => !v)}
          >
            ☰
          </button>
        </div>

        {/* Barra de Matérias com Links de Páginas Reais (Next.js Link) */}
        <nav
          className={`subject-nav ${mobileMenu ? "is-open" : ""}`}
          aria-label="Matérias"
        >
          <div className="nav-inner">
            <span className="nav-label">MATÉRIAS</span>
            {subjects.map((s) => (
              <Link
                key={s.name}
                href={`/materias/${slugify(s.name)}`}
                className={`subject-link ${data.subject === s.name ? "active" : ""}`}
              >
                <span className="nav-subject-icon">{s.icon}</span>
                {s.name}
                {data.subject === s.name && <span className="active-dot" />}
              </Link>
            ))}

            {/* Ação rápida para o admin abrir o painel de controle */}
            {data.role === "admin" && (
              <button
                onClick={() => setAdminModalOpen(true)}
                className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-dashed border-indigo-500/40 text-[11px] font-bold ml-2 cursor-pointer hover:bg-indigo-500/25 transition-all"
              >
                ⚙ Gerenciar Conteúdos
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="dashboard-layout">
        {/* SIDEBAR DE ASSUNTOS */}
        <aside className="sidebar">
          <div className="side-heading">
            <div>
              <p className="side-overline">SUA JORNADA</p>
              <h2>Estude por assunto</h2>
            </div>
            <span className="topic-count">{subject.topics.length}</span>
          </div>

          <div className="topic-list">
            {subject.topics
              .filter(
                (t) =>
                  t.title.toLowerCase().includes(search.toLowerCase()) ||
                  t.description.toLowerCase().includes(search.toLowerCase())
              )
              .map((t, i) => (
                <Link
                  key={t.title}
                  href={`/materias/${slugify(subject.name)}/${slugify(t.title)}`}
                  className={`topic-link ${topic.title === t.title ? "selected" : ""}`}
                >
                  <span className="topic-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="topic-link-title">{t.title}</span>
                  <span className="topic-arrow">→</span>
                </Link>
              ))}

            {!subject.topics.some(
              (t) =>
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase())
            )}
          </div>

          <div className="progress-card">
            <div className="progress-top">
              <span className="progress-symbol">✦</span>
              <span className="progress-label">SEU PROGRESSO</span>
              <span className="progress-value">{progress}%</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>Continue assim. Cada questão conta!</p>
          </div>

          <div className="sidebar-bottom">
            <div className="study-tip">
              <span className="tip-icon">☼</span>
              <p>
                <strong>Um passo de cada vez</strong>
                <br />
                Aprender também é respeitar seu ritmo.
              </p>
            </div>
            <button className="logout-button" onClick={leave}>
              <span>↪</span> Sair da conta
            </button>
          </div>
        </aside>

        {/* ÁREA DE CONTEÚDO / ESTUDO */}
        <section className="content-area">
          <div className="breadcrumbs">
            <Link href="/" className="text-inherit no-underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Início</Link>
            <span className="crumb-separator">/</span>
            <Link href={`/materias/${slugify(subject.name)}`} className="text-inherit no-underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{subject.name}</Link>
            <span className="crumb-separator">/</span>
            <strong>{topic.title}</strong>
          </div>

          <div className="welcome-banner">
            <div className="banner-copy">
              <span className="banner-label">SEU ESPAÇO DE APRENDIZADO</span>
              <h1>
                Olá, {data.studentName.split(" ")[0]} <span className="wave">✦</span>
              </h1>
              <p>
                {data.role === "admin"
                  ? "Você tem privilégios de Administrador. Use o Painel de Controle no topo para criar, editar ou excluir qualquer conteúdo ou usuário."
                  : "Que bom ter você por aqui. Vamos aprender algo novo hoje?"}
              </p>
            </div>
            <div className="banner-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <span className="art-star star-a">✦</span>
              <span className="art-star star-b">✳</span>
              <span className="art-book">↗</span>
              <span className="art-dot dot-a" />
              <span className="art-dot dot-b" />
            </div>
            <span className="banner-decoration">
              ESTUDE NO SEU TEMPO · APRENDA SEM LIMITES
            </span>
          </div>

          <div className="section-heading">
            <div>
              <p className="section-kicker">
                {subject.name.toUpperCase()} <span>·</span> CONTEÚDO
              </p>
              <h2>{topic.title}</h2>
            </div>
            <span className={`subject-badge ${subject.color}`}>
              {subject.icon} <span>{subject.name}</span>
            </span>
          </div>

          {/* RESUMO EXPLICATIVO */}
          <article className="lesson-card">
            <div className={`lesson-accent ${subject.color}`}>
              <span>{subject.icon}</span>
            </div>
            <div className="lesson-content">
              <div className="lesson-meta">
                <span className="lesson-pill">RESUMO EXPLICATIVO</span>
                <span>✧ &nbsp; 5 min de leitura</span>
              </div>
              <h3>Vamos entender {topic.title.toLowerCase()}?</h3>
              <p className="lesson-intro">{topic.description}</p>
              <div className="lesson-summary">
                {topic.summary.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <div className="lesson-note">
                <span>✦</span>
                <p>
                  <strong>Dica de estudo</strong>
                  <br />
                  Leia o resumo com atenção e depois tente resolver as questões sem
                  consultar as respostas. Você consegue!
                </p>
              </div>
            </div>
          </article>

          {/* SEÇÃO DE QUESTÕES / ATIVIDADES */}
          <div className="questions-heading">
            <div>
              <p className="section-kicker">HORA DE PRATICAR</p>
              <h2>
                Questões <span className="question-total">{topic.questions.length}</span>
              </h2>
            </div>
            <span className="question-helper">
              {topic.questions.length > 0
                ? "Escolha uma alternativa para responder"
                : "Nenhuma questão cadastrada para este assunto"}
            </span>
          </div>

          {topic.questions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-gray-500/5 dark:bg-gray-800/20 border border-dashed border-gray-400/30 text-center">
              <p className="m-0 mb-2.5 text-[15px] font-semibold text-gray-800 dark:text-gray-200">
                Este assunto ainda não possui atividades cadastradas.
              </p>
              {data.role === "admin" && (
                <button
                  onClick={() => setAdminModalOpen(true)}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs border-0 cursor-pointer transition-colors shadow-sm"
                >
                  + Abrir Painel de Controle para adicionar questão
                </button>
              )}
            </div>
          ) : (
            <div className="question-list">
              {topic.questions.map((q, i) => {
                const id = `${subject.name}|${topic.title}|${i}`;
                const selected = data.answers[id];
                return (
                  <article className="question-card" key={id}>
                    <div className="question-topline">
                      <span className="question-number">
                        QUESTÃO {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="question-points">✦ &nbsp; Pratique</span>
                    </div>
                    <h3>{q.prompt}</h3>
                    <div className="answer-list">
                      {q.options.map((option, j) => {
                        const chosen = selected === j;
                        const correct = selected !== undefined && j === q.answer;
                        return (
                          <button
                            key={option}
                            onClick={() =>
                              setData((d) => ({
                                ...d,
                                answers: { ...d.answers, [id]: j },
                              }))
                            }
                            className={`answer-option ${chosen ? "chosen" : ""} ${
                              correct ? "correct" : ""
                            } ${chosen && !correct ? "incorrect" : ""}`}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + j)}
                            </span>
                            <span>{option}</span>
                            {correct && <span className="answer-status">✓</span>}
                            {chosen && !correct && (
                              <span className="answer-status">×</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selected !== undefined && (
                      <div
                        className={`feedback ${
                          selected === q.answer ? "feedback-correct" : "feedback-incorrect"
                        }`}
                      >
                        <strong>
                          {selected === q.answer
                            ? "Muito bem! Resposta correta."
                            : "Quase! Vamos revisar."}
                        </strong>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          <footer className="page-footer">
            <span className="footer-brand">
              e<span>.</span> ESTUDOTEC
            </span>
            <span>Feito para aprender, um dia de cada vez.</span>
          </footer>
        </section>
      </div>
    </main>
  );
}

