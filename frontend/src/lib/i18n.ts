export type UiLang = "es" | "en" | "pt";

export const UI_LANGS: { code: UiLang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "https://flagcdn.com/w40/ar.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "pt", label: "Português", flag: "https://flagcdn.com/w40/br.png" },
];

type Dict = Record<string, string>;

const es: Dict = {
  "app.name": "Pingu",
  "app.tagline": "¡La forma divertida, gratis y efectiva de aprender un idioma!",
  "nav.learn": "Aprender",
    "nav.home": "Inicio",
  "nav.ranking": "Ranking",
  "nav.friendsRanking": "Ranking entre amigos",
  "nav.friends": "Amigos",
  "nav.badges": "Insignias",
  "nav.activity": "Actividad histórica",
  "nav.profile": "Perfil",
  "nav.admin": "Admin",
  "nav.courses": "Cursos",
  "auth.start": "Empezar",
  "auth.haveAccount": "Ya tengo una cuenta",
  "auth.login": "Iniciar sesión",
  "auth.register": "Crear cuenta",
  "auth.name": "Nombre",
  "auth.email": "Email",
  "auth.emailTaken": "Ese email ya está registrado",
  "auth.notFound": "No encontramos ninguna cuenta con ese email",
  "auth.logout": "Cerrar sesión",
  "auth.uiLang": "Idioma de la app",
  "course.choose": "¿Qué querés aprender?",
  "course.enroll": "Inscribirme",
  "course.enrolled": "Inscripto",
  "course.continue": "Continuar",
  "course.leave": "Dejar curso",
  "course.level": "Nivel",
  "course.lessons": "lecciones",
  "course.progress": "Progreso del curso",
  "course.completed": "completadas",
  "course.next": "Próxima lección",
  "course.finished": "¡Curso completado!",
  "course.notEnrolled": "No estás inscripto en este curso",
  "lesson.locked": "Completá la lección anterior para desbloquear esta",
  "lesson.start": "Empezar",
  "lesson.review": "Repasar",
  "lesson.retry": "Reintentar",
  "lesson.check": "Comprobar",
  "lesson.continue": "Continuar",
  "lesson.correct": "¡Correcto!",
  "lesson.wrong": "Respuesta incorrecta",
  "lesson.answer": "Respuesta correcta:",
  "lesson.finish": "Terminar lección",
  "lesson.score": "Puntaje",
  "lesson.passed": "¡Lección completada!",
  "lesson.failed": "Necesitás 60 o más para aprobar",
  "lesson.xpEarned": "XP ganados",
  "lesson.vocab": "Vocabulario de la lección",
  "lesson.q.translate": "Traducí esta palabra",
  "lesson.q.reverse": "¿Cómo se dice en tu idioma?",
  "lesson.q.listen": "Elegí la traducción correcta",
  "lesson.q.write": "Escribí la traducción",
  "lesson.exit": "Salir",
  "streak.days": "días de racha",
  "xp.total": "XP totales",
  "ranking.title": "Tabla de clasificación",
  "ranking.historical": "Global histórico",
  "ranking.global": "Global",
  "ranking.week": "Esta semana",
  "ranking.friends": "Amigos",
  "ranking.position": "Tu posición",
  "ranking.you": "Vos",
  "friends.title": "Amigos",
  "friends.add": "Agregar amigo por email",
  "friends.requests": "Solicitudes recibidas",
  "friends.accept": "Aceptar",
  "friends.reject": "Rechazar",
  "friends.requestSent": "Solicitud enviada",
  "friends.self": "No podés agregarte a vos mismo",
  "friends.dup": "Ya son amigos",
  "friends.none": "Todavía no agregaste amigos",
  "friends.remove": "Eliminar",
  "badges.title": "Insignias",
  "badges.locked": "Bloqueada",
  "badges.unlocked": "Desbloqueada el",
  "activity.title": "Actividad diaria",
  "activity.from": "Desde",
  "activity.to": "Hasta",
  "activity.xpDay": "XP por día",
  "activity.lessonsDay": "lecciones",
  "admin.title": "Panel de administración",
  "admin.newCourse": "Nuevo curso",
  "admin.newLesson": "Nueva lección",
  "admin.language": "Idioma",
  "admin.order": "Orden",
  "admin.orderTaken": "Ya existe una lección con ese orden en el curso",
  "admin.title.field": "Título",
  "admin.xp": "XP de recompensa (5 a 50)",
  "admin.create": "Crear",
  "common.save": "Guardar",
  "common.cancel": "Cancelar",
  "common.of": "de",
};

const en: Dict = {
  "app.name": "Pingu",
  "app.tagline": "The free, fun and effective way to learn a language!",
  "nav.learn": "Learn",
    "nav.home": "Home",
  "nav.ranking": "Leaderboard",
  "nav.friendsRanking": "Friends ranking",
  "nav.friends": "Friends",
  "nav.badges": "Badges",
  "nav.activity": "Activity history",
  "nav.profile": "Profile",
  "nav.admin": "Admin",
  "nav.courses": "Courses",
  "auth.start": "Get started",
  "auth.haveAccount": "I already have an account",
  "auth.login": "Log in",
  "auth.register": "Create account",
  "auth.name": "Name",
  "auth.email": "Email",
  "auth.emailTaken": "That email is already registered",
  "auth.notFound": "We couldn't find an account with that email",
  "auth.logout": "Log out",
  "auth.uiLang": "App language",
  "course.choose": "What do you want to learn?",
  "course.enroll": "Enroll",
  "course.enrolled": "Enrolled",
  "course.continue": "Continue",
  "course.leave": "Leave course",
  "course.level": "Level",
  "course.lessons": "lessons",
  "course.progress": "Course progress",
  "course.completed": "completed",
  "course.next": "Next lesson",
  "course.finished": "Course completed!",
  "course.notEnrolled": "You are not enrolled in this course",
  "lesson.locked": "Complete the previous lesson to unlock this one",
  "lesson.start": "Start",
  "lesson.review": "Review",
  "lesson.retry": "Retry",
  "lesson.check": "Check",
  "lesson.continue": "Continue",
  "lesson.correct": "Correct!",
  "lesson.wrong": "Wrong answer",
  "lesson.answer": "Correct answer:",
  "lesson.finish": "Finish lesson",
  "lesson.score": "Score",
  "lesson.passed": "Lesson completed!",
  "lesson.failed": "You need 60 or more to pass",
  "lesson.xpEarned": "XP earned",
  "lesson.vocab": "Lesson vocabulary",
  "lesson.q.translate": "Translate this word",
  "lesson.q.reverse": "How do you say it in your language?",
  "lesson.q.listen": "Pick the right translation",
  "lesson.q.write": "Type the translation",
  "lesson.exit": "Exit",
  "streak.days": "day streak",
  "xp.total": "Total XP",
  "ranking.title": "Leaderboard",
  "ranking.historical": "Historical global",
  "ranking.global": "Global",
  "ranking.week": "This week",
  "ranking.friends": "Friends",
  "ranking.position": "Your position",
  "ranking.you": "You",
  "friends.title": "Friends",
  "friends.add": "Add friend by email",
  "friends.requests": "Received requests",
  "friends.accept": "Accept",
  "friends.reject": "Reject",
  "friends.requestSent": "Request sent",
  "friends.self": "You can't add yourself",
  "friends.dup": "You are already friends",
  "friends.none": "You haven't added friends yet",
  "friends.remove": "Remove",
  "badges.title": "Badges",
  "badges.locked": "Locked",
  "badges.unlocked": "Unlocked on",
  "activity.title": "Daily activity",
  "activity.from": "From",
  "activity.to": "To",
  "activity.xpDay": "XP per day",
  "activity.lessonsDay": "lessons",
  "admin.title": "Admin panel",
  "admin.newCourse": "New course",
  "admin.newLesson": "New lesson",
  "admin.language": "Language",
  "admin.order": "Order",
  "admin.orderTaken": "A lesson with that order already exists in this course",
  "admin.title.field": "Title",
  "admin.xp": "XP reward (5 to 50)",
  "admin.create": "Create",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.of": "of",
};

const pt: Dict = {
  "app.name": "Pingu",
  "app.tagline": "O jeito divertido, grátis e eficaz de aprender um idioma!",
  "nav.learn": "Aprender",
  "nav.ranking": "Ranking",
  "nav.friends": "Amigos",
  "nav.badges": "Insígnias",
  "nav.profile": "Perfil",
  "nav.admin": "Admin",
  "nav.courses": "Cursos",
  "auth.start": "Começar",
  "auth.haveAccount": "Já tenho uma conta",
  "auth.login": "Entrar",
  "auth.register": "Criar conta",
  "auth.name": "Nome",
  "auth.email": "Email",
  "auth.emailTaken": "Esse email já está cadastrado",
  "auth.notFound": "Não encontramos nenhuma conta com esse email",
  "auth.logout": "Sair",
  "auth.uiLang": "Idioma do app",
  "course.choose": "O que você quer aprender?",
  "course.enroll": "Inscrever-me",
  "course.enrolled": "Inscrito",
  "course.continue": "Continuar",
  "course.leave": "Sair do curso",
  "course.level": "Nível",
  "course.lessons": "lições",
  "course.progress": "Progresso do curso",
  "course.completed": "concluídas",
  "course.next": "Próxima lição",
  "course.finished": "Curso concluído!",
  "course.notEnrolled": "Você não está inscrito neste curso",
  "lesson.locked": "Conclua a lição anterior para desbloquear esta",
  "lesson.start": "Começar",
  "lesson.review": "Revisar",
  "lesson.retry": "Tentar de novo",
  "lesson.check": "Verificar",
  "lesson.continue": "Continuar",
  "lesson.correct": "Correto!",
  "lesson.wrong": "Resposta incorreta",
  "lesson.answer": "Resposta correta:",
  "lesson.finish": "Finalizar lição",
  "lesson.score": "Pontuação",
  "lesson.passed": "Lição concluída!",
  "lesson.failed": "Você precisa de 60 ou mais para passar",
  "lesson.xpEarned": "XP ganhos",
  "lesson.vocab": "Vocabulário da lição",
  "lesson.q.translate": "Traduza esta palavra",
  "lesson.q.reverse": "Como se diz no seu idioma?",
  "lesson.q.listen": "Escolha a tradução correta",
  "lesson.q.write": "Escreva a tradução",
  "lesson.exit": "Sair",
  "streak.days": "dias de ofensiva",
  "xp.total": "XP totais",
  "ranking.title": "Classificação",
  "ranking.historical": "Global histórico",
  "ranking.global": "Global",
  "ranking.week": "Esta semana",
  "ranking.friends": "Amigos",
  "ranking.position": "Sua posição",
  "ranking.you": "Você",
  "friends.title": "Amigos",
  "friends.add": "Adicionar amigo por email",
  "friends.requests": "Solicitações recebidas",
  "friends.accept": "Aceitar",
  "friends.reject": "Recusar",
  "friends.requestSent": "Solicitação enviada",
  "friends.self": "Você não pode se adicionar",
  "friends.dup": "Vocês já são amigos",
  "friends.none": "Você ainda não adicionou amigos",
  "friends.remove": "Remover",
  "badges.title": "Insígnias",
  "badges.locked": "Bloqueada",
  "badges.unlocked": "Desbloqueada em",
  "activity.title": "Atividade diária",
  "activity.from": "De",
  "activity.to": "Até",
  "activity.xpDay": "XP por dia",
  "activity.lessonsDay": "lições",
  "admin.title": "Painel de administração",
  "admin.newCourse": "Novo curso",
  "admin.newLesson": "Nova lição",
  "admin.language": "Idioma",
  "admin.order": "Ordem",
  "admin.orderTaken": "Já existe uma lição com essa ordem no curso",
  "admin.title.field": "Título",
  "admin.xp": "XP de recompensa (5 a 50)",
  "admin.create": "Criar",
  "common.save": "Salvar",
  "common.cancel": "Cancelar",
  "common.of": "de",
};

// Keep every piece of interface copy in one place. Content returned by a course
// (words to learn, names supplied by users, etc.) is intentionally not translated.
const extra: Record<UiLang, Dict> = {
  es: {
    "app.features": "Lecciones cortas, XP, racha diaria, insignias y ranking con tus amigos.",
    "common.loading": "Cargando...", "common.error": "No se pudo cargar la información.",
    "common.password": "Contraseña", "common.passwordForgot": "Olvidé mi contraseña", "common.changePassword": "Cambiar contraseña",
    "course.loading": "Cargando cursos...", "course.loadError": "No se pudieron cargar los cursos.", "course.available": "Este idioma todavía no tiene cursos disponibles", "course.completedCourses": "Cursos completados", "course.done": "Completado", "course.otherActive": "Otro nivel activo", "course.alreadyCompleted": "Ya completado", "course.alreadyEnrolled": "Ya estás inscrito", "course.start": "Comenzar", "course.view": "Ver curso", "course.loadingProgress": "Cargando progreso...",
    "activity.invalidRange": "El inicio debe ser anterior al final.", "activity.loading": "Cargando actividad...", "activity.loadError": "No se pudo cargar la actividad.", "activity.xpPeriod": "XP ganada en el período", "activity.completedLessons": "Lecciones completadas", "activity.chart": "Días de actividad · XP conseguidos por día", "activity.earned": "Ganado",
    "home.title": "Inicio", "home.continue": "Continuar aprendiendo", "home.greeting": "Hola, {name}. Retomá tus cursos y seguí con la próxima lección.", "home.noCourses": "Todavía no estás inscripto en ningún curso.", "home.noFriends": "Todavía no tenés amigos.", "home.viewFriends": "Ver amigos", "home.weeklyRanking": "Ranking semanal", "home.earnedBadges": "Insignias conseguidas", "home.badgeEarned": "Conseguida el", "home.noBadges": "Todavía no conseguiste insignias.", "home.loading": "Cargando tu inicio...", "home.loadError": "No se pudo cargar tu inicio.",
    "friends.emailPlaceholder": "Email del usuario", "friends.loading": "Cargando amigos...", "ranking.friendsTitle": "Ranking entre amigos", "ranking.friendsDescription": "Compará tu progreso con tus amigos.", "ranking.friendsEmpty": "Todavía no tenés amigos para comparar.", "ranking.loading": "Cargando ranking...", "ranking.loadError": "No se pudo cargar el ranking.",
    "profile.loading": "Cargando perfil...", "profile.loadError": "No se pudo cargar el perfil.", "profile.security": "Seguridad", "profile.securityDescription": "Ingresá la contraseña de tu cuenta de Pingu para confirmar tu identidad.", "profile.passwordPlaceholder": "Contraseña de Pingu", "profile.verify": "Verificar contraseña", "profile.verified": "La contraseña está verificada. Por seguridad, no se puede mostrar ni recuperar una contraseña almacenada como hash.", "profile.delete": "Borrar mi cuenta", "profile.deleteConfirm": "¿Seguro que querés borrar tu cuenta? Esta acción no se puede deshacer.", "profile.deleteError": "No se pudo borrar la cuenta", "profile.passwordVerified": "Contraseña verificada. Las contraseñas no se pueden recuperar porque se guardan cifradas.", "profile.passwordIncorrect": "Contraseña incorrecta",
    "auth.passwordUpdated": "Contraseña actualizada. Ya podés iniciar sesión.", "lesson.loading": "Cargando lección...", "lesson.loadError": "No se pudo cargar la lección.", "lesson.result": "Resultado de la lección", "lesson.scoreLabel": "Puntaje", "admin.description": "Los endpoints de administración de cursos y lecciones requieren completar permisos en el backend.", "notFound.title": "Página no encontrada",
  },
  en: {
    "app.features": "Short lessons, XP, daily streaks, badges and leaderboards with your friends.",
    "common.loading": "Loading...", "common.error": "We couldn't load the information.", "common.password": "Password", "common.passwordForgot": "Forgot my password", "common.changePassword": "Change password",
    "course.loading": "Loading courses...", "course.loadError": "We couldn't load the courses.", "course.available": "This language has no courses available yet", "course.completedCourses": "Completed courses", "course.done": "Completed", "course.otherActive": "Another level is active", "course.alreadyCompleted": "Already completed", "course.alreadyEnrolled": "Already enrolled", "course.start": "Start", "course.view": "View course", "course.loadingProgress": "Loading progress...",
    "activity.invalidRange": "The start date must be before the end date.", "activity.loading": "Loading activity...", "activity.loadError": "We couldn't load the activity.", "activity.xpPeriod": "XP earned during this period", "activity.completedLessons": "Completed lessons", "activity.chart": "Activity days · XP earned per day", "activity.earned": "Earned",
    "home.title": "Home", "home.continue": "Keep learning", "home.greeting": "Hi, {name}. Pick up your courses and continue with the next lesson.", "home.noCourses": "You aren't enrolled in any courses yet.", "home.noFriends": "You don't have friends yet.", "home.viewFriends": "View friends", "home.weeklyRanking": "Weekly leaderboard", "home.earnedBadges": "Earned badges", "home.badgeEarned": "Earned on", "home.noBadges": "You haven't earned any badges yet.", "home.loading": "Loading your home...", "home.loadError": "We couldn't load your home.",
    "friends.emailPlaceholder": "User email", "friends.loading": "Loading friends...", "ranking.friendsTitle": "Friends leaderboard", "ranking.friendsDescription": "Compare your progress with your friends.", "ranking.friendsEmpty": "You don't have friends to compare with yet.", "ranking.loading": "Loading leaderboard...", "ranking.loadError": "We couldn't load the leaderboard.",
    "profile.loading": "Loading profile...", "profile.loadError": "We couldn't load the profile.", "profile.security": "Security", "profile.securityDescription": "Enter your Pingu account password to confirm your identity.", "profile.passwordPlaceholder": "Pingu password", "profile.verify": "Verify password", "profile.verified": "The password is verified. For security, a hashed password cannot be displayed or recovered.", "profile.delete": "Delete my account", "profile.deleteConfirm": "Are you sure you want to delete your account? This cannot be undone.", "profile.deleteError": "We couldn't delete the account", "profile.passwordVerified": "Password verified. Passwords cannot be recovered because they are stored encrypted.", "profile.passwordIncorrect": "Incorrect password",
    "auth.passwordUpdated": "Password updated. You can log in now.", "lesson.loading": "Loading lesson...", "lesson.loadError": "We couldn't load the lesson.", "lesson.result": "Lesson results", "lesson.scoreLabel": "Score", "admin.description": "Course and lesson administration endpoints require backend permissions to be completed.", "notFound.title": "Page not found",
  },
  pt: {
    "app.features": "Lições curtas, XP, sequência diária, insígnias e ranking com amigos.",
    "common.loading": "Carregando...", "common.error": "Não foi possível carregar as informações.", "common.password": "Senha", "common.passwordForgot": "Esqueci minha senha", "common.changePassword": "Alterar senha",
    "course.loading": "Carregando cursos...", "course.loadError": "Não foi possível carregar os cursos.", "course.available": "Este idioma ainda não tem cursos disponíveis", "course.completedCourses": "Cursos concluídos", "course.done": "Concluído", "course.otherActive": "Outro nível ativo", "course.alreadyCompleted": "Já concluído", "course.alreadyEnrolled": "Você já está inscrito", "course.start": "Começar", "course.view": "Ver curso", "course.loadingProgress": "Carregando progresso...",
    "activity.invalidRange": "A data inicial deve ser anterior à final.", "activity.loading": "Carregando atividade...", "activity.loadError": "Não foi possível carregar a atividade.", "activity.xpPeriod": "XP ganhos no período", "activity.completedLessons": "Lições concluídas", "activity.chart": "Dias de atividade · XP ganhos por dia", "activity.earned": "Ganho",
    "home.title": "Início", "home.continue": "Continuar aprendendo", "home.greeting": "Olá, {name}. Retome seus cursos e siga para a próxima lição.", "home.noCourses": "Você ainda não está inscrito em nenhum curso.", "home.noFriends": "Você ainda não tem amigos.", "home.viewFriends": "Ver amigos", "home.weeklyRanking": "Ranking semanal", "home.earnedBadges": "Insígnias conquistadas", "home.badgeEarned": "Conquistada em", "home.noBadges": "Você ainda não conquistou insígnias.", "home.loading": "Carregando seu início...", "home.loadError": "Não foi possível carregar seu início.",
    "friends.emailPlaceholder": "Email do usuário", "friends.loading": "Carregando amigos...", "ranking.friendsTitle": "Ranking de amigos", "ranking.friendsDescription": "Compare seu progresso com seus amigos.", "ranking.friendsEmpty": "Você ainda não tem amigos para comparar.", "ranking.loading": "Carregando ranking...", "ranking.loadError": "Não foi possível carregar o ranking.",
    "profile.loading": "Carregando perfil...", "profile.loadError": "Não foi possível carregar o perfil.", "profile.security": "Segurança", "profile.securityDescription": "Digite a senha da sua conta Pingu para confirmar sua identidade.", "profile.passwordPlaceholder": "Senha do Pingu", "profile.verify": "Verificar senha", "profile.verified": "A senha está verificada. Por segurança, uma senha armazenada como hash não pode ser exibida ou recuperada.", "profile.delete": "Excluir minha conta", "profile.deleteConfirm": "Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.", "profile.deleteError": "Não foi possível excluir a conta", "profile.passwordVerified": "Senha verificada. Senhas não podem ser recuperadas porque são armazenadas criptografadas.", "profile.passwordIncorrect": "Senha incorreta",
    "auth.passwordUpdated": "Senha atualizada. Você já pode entrar.", "lesson.loading": "Carregando lição...", "lesson.loadError": "Não foi possível carregar a lição.", "lesson.result": "Resultado da lição", "lesson.scoreLabel": "Pontuação", "admin.description": "Os endpoints de administração de cursos e lições exigem permissões no backend.", "notFound.title": "Página não encontrada",
  },
};

Object.assign(extra.es, {
  "profile.showPasswords": "Mostrar contraseñas",
  "profile.hidePasswords": "Ocultar contraseñas",
  "profile.passwordSameError": "La nueva contraseña debe ser diferente de la actual",
});
Object.assign(extra.en, {
  "profile.showPasswords": "Show passwords",
  "profile.hidePasswords": "Hide passwords",
  "profile.passwordSameError": "The new password must be different from the current password",
});
Object.assign(extra.pt, {
  "profile.showPasswords": "Mostrar senhas",
  "profile.hidePasswords": "Ocultar senhas",
  "profile.passwordSameError": "A nova senha deve ser diferente da atual",
});

Object.assign(es, extra.es);
Object.assign(en, extra.en);
Object.assign(pt, extra.pt);

const DICTS: Record<UiLang, Dict> = { es, en, pt };

export function translate(lang: UiLang, key: string): string {
  return DICTS[lang]?.[key] ?? DICTS.es[key] ?? key;
}

const LANGUAGE_NAMES: Record<UiLang, Record<string, string>> = {
  es: { es: "Español", en: "Inglés", fr: "Francés", de: "Alemán", it: "Italiano", pt: "Portugués" },
  en: { es: "Spanish", en: "English", fr: "French", de: "German", it: "Italian", pt: "Portuguese" },
  pt: { es: "Espanhol", en: "Inglês", fr: "Francês", de: "Alemão", it: "Italiano", pt: "Português" },
};

/** Localizes language names returned by the API, which are stored in Spanish. */
export function languageName(lang: UiLang, code: string, fallback: string): string {
  return LANGUAGE_NAMES[lang][code] ?? fallback;
}

const TECHNICAL_LEVEL: Record<UiLang, string> = {
  es: "Lenguaje técnico", en: "Technical language", pt: "Linguagem técnica",
};
const TECHNICAL_LESSONS: Record<UiLang, string[]> = {
  es: ["Herramientas", "Máquinas", "Materiales"],
  en: ["Tools", "Machines", "Materials"],
  pt: ["Ferramentas", "Máquinas", "Materiais"],
};

export function levelName(lang: UiLang, level: string): string {
  return level === "TECNICO" ? TECHNICAL_LEVEL[lang] : level;
}

export function lessonName(lang: UiLang, level: string, order: number, fallback: string): string {
  return level === "TECNICO" ? (TECHNICAL_LESSONS[lang][order - 1] ?? fallback) : fallback;
}

/**
 * Badge names and descriptions are persisted in Spanish. Their criteria are
 * stable identifiers, so the display copy can be localized without changing
 * existing users' badges in the database.
 */
export function localizeBadge(
  lang: UiLang,
  badge: { insignia_nombre: string; insignia_descripcion: string | null; insignia_criterio: string },
) {
  const amount = badge.insignia_criterio.match(/\d+/)?.[0];
  const criterion = badge.insignia_criterio;
  if (criterion.startsWith("xp") && amount) {
    return lang === "en" ? { name: "First steps", description: `Reach ${amount} XP` } : lang === "pt" ? { name: "Primeiros passos", description: `Alcance ${amount} XP` } : { name: badge.insignia_nombre, description: badge.insignia_descripcion ?? `Alcanzá ${amount} XP` };
  }
  if (criterion.startsWith("racha") && amount) {
    return lang === "en" ? { name: "Perfect week", description: `Keep a ${amount}-day streak` } : lang === "pt" ? { name: "Semana perfeita", description: `Mantenha uma sequência de ${amount} dias` } : { name: badge.insignia_nombre, description: badge.insignia_descripcion ?? `Mantené una racha de ${amount} días` };
  }
  if (criterion.startsWith("lecciones") && amount) {
    return lang === "en" ? { name: "Dedicated student", description: `Complete ${amount} lessons` } : lang === "pt" ? { name: "Estudante dedicado", description: `Conclua ${amount} lições` } : { name: badge.insignia_nombre, description: badge.insignia_descripcion ?? `Completá ${amount} lecciones` };
  }
  if (criterion.startsWith("curso_completado:")) {
    const [, code, level] = criterion.split(":");
    const name = languageName(lang, code, code);
    return lang === "en" ? { name: `${name} ${level} completed`, description: `Complete every ${name} ${level} lesson` } : lang === "pt" ? { name: `${name} ${level} concluído`, description: `Conclua todas as lições de ${name} ${level}` } : { name: badge.insignia_nombre, description: badge.insignia_descripcion ?? `Completá todas las lecciones de ${name} ${level}` };
  }
  return { name: badge.insignia_nombre, description: badge.insignia_descripcion };
}
