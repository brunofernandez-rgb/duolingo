import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DuoButton } from "@/components/duo/DuoButton";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";

type Vocabulary = { source: string; translation: string };

const VOCABULARY: Record<string, Record<string, Vocabulary[]>> = {
  es: {
    A1: [{ source: "hello", translation: "hola" }, { source: "thank you", translation: "gracias" }, { source: "water", translation: "agua" }, { source: "house", translation: "casa" }, { source: "friend", translation: "amigo" }],
    advanced: [{ source: "I need help", translation: "necesito ayuda" }, { source: "where is the station?", translation: "¿dónde está la estación?" }, { source: "I like learning", translation: "me gusta aprender" }, { source: "I arrive tomorrow", translation: "llego mañana" }, { source: "how much does it cost?", translation: "¿cuánto cuesta?" }],
  },
  en: {
    A1: [{ source: "hola", translation: "hello" }, { source: "gracias", translation: "thank you" }, { source: "agua", translation: "water" }, { source: "casa", translation: "house" }, { source: "amigo", translation: "friend" }],
    advanced: [{ source: "necesito ayuda", translation: "I need help" }, { source: "¿dónde está la estación?", translation: "where is the station?" }, { source: "me gusta aprender", translation: "I like learning" }, { source: "llego mañana", translation: "I arrive tomorrow" }, { source: "¿cuánto cuesta?", translation: "how much does it cost?" }],
  },
  pt: {
    A1: [{ source: "hola", translation: "olá" }, { source: "gracias", translation: "obrigado" }, { source: "agua", translation: "água" }, { source: "casa", translation: "casa" }, { source: "amigo", translation: "amigo" }],
    advanced: [{ source: "necesito ayuda", translation: "preciso de ajuda" }, { source: "¿dónde está la estación?", translation: "onde fica a estação?" }, { source: "me gusta aprender", translation: "gosto de aprender" }, { source: "llego mañana", translation: "chego amanhã" }, { source: "¿cuánto cuesta?", translation: "quanto custa?" }],
  },
  fr: {
    A1: [{ source: "hola", translation: "bonjour" }, { source: "gracias", translation: "merci" }, { source: "agua", translation: "eau" }, { source: "casa", translation: "maison" }, { source: "amigo", translation: "ami" }],
    advanced: [{ source: "necesito ayuda", translation: "j'ai besoin d'aide" }, { source: "¿dónde está la estación?", translation: "où est la gare ?" }, { source: "me gusta aprender", translation: "j'aime apprendre" }, { source: "llego mañana", translation: "j'arrive demain" }, { source: "¿cuánto cuesta?", translation: "combien ça coûte ?" }],
  },
  de: {
    A1: [{ source: "hola", translation: "hallo" }, { source: "gracias", translation: "danke" }, { source: "agua", translation: "Wasser" }, { source: "casa", translation: "Haus" }, { source: "amigo", translation: "Freund" }],
    advanced: [{ source: "necesito ayuda", translation: "Ich brauche Hilfe" }, { source: "¿dónde está la estación?", translation: "Wo ist der Bahnhof?" }, { source: "me gusta aprender", translation: "Ich lerne gern" }, { source: "llego mañana", translation: "Ich komme morgen an" }, { source: "¿cuánto cuesta?", translation: "Wie viel kostet das?" }],
  },
  it: {
    A1: [{ source: "hola", translation: "ciao" }, { source: "gracias", translation: "grazie" }, { source: "agua", translation: "acqua" }, { source: "casa", translation: "casa" }, { source: "amigo", translation: "amico" }],
    advanced: [{ source: "necesito ayuda", translation: "ho bisogno di aiuto" }, { source: "¿dónde está la estación?", translation: "dov'è la stazione?" }, { source: "me gusta aprender", translation: "mi piace imparare" }, { source: "llego mañana", translation: "arrivo domani" }, { source: "¿cuánto cuesta?", translation: "quanto costa?" }],
  },
};

function questionsFor(language: string, level: string, lessonOrder: number) {
  const languageVocabulary = VOCABULARY[language] ?? VOCABULARY.en;
  const vocabulary = languageVocabulary[level === "A1" ? "A1" : "advanced"];
  const offset = Math.max(0, lessonOrder - 1) % vocabulary.length;
  return vocabulary.map((_, index) => vocabulary[(index + offset) % vocabulary.length]);
}

function optionsFor(question: Vocabulary, vocabulary: Vocabulary[], index: number) {
  const distractors = vocabulary
    .filter((item) => item.translation !== question.translation)
    .slice(index % 2, (index % 2) + 2)
    .map((item) => item.translation);
  return [question.translation, ...distractors].sort(() => 0.5 - Math.random());
}

export const Route = createFileRoute("/leccion/$leccionId")({
  component: () => <RequireAuth>{(ctx) => <Leccion {...ctx} />}</RequireAuth>,
});

function Leccion({ user }: { user: { id: string } }) {
  const { leccionId } = Route.useParams();
  const { t } = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const lesson = useQuery({ queryKey: ["leccion", leccionId], queryFn: () => api.leccion(Number(leccionId)) });
  const attempt = useMutation({
    mutationFn: (puntaje: number) => api.intento(Number(user.id), Number(leccionId), puntaje),
    onSuccess: (_, puntaje) => {
      queryClient.invalidateQueries({ queryKey: ["progreso"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", user.id] });
      if (puntaje >= 60) {
        toast.success(t("lesson.passed"));
        navigate({ to: "/curso/$cursoId", params: { cursoId: String(lesson.data?.curso_id) } });
      } else {
        toast.error(t("lesson.failed"));
        setQuestionIndex(0);
        setSelected(null);
        setChecked(false);
        setCorrectAnswers(0);
      }
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("lesson.failed")),
  });

  if (lesson.isLoading) return <p>Cargando lección...</p>;
  if (lesson.isError || !lesson.data) return <p>No se pudo cargar la lección.</p>;
  const questions = questionsFor(lesson.data.idioma_codigo, lesson.data.curso_nivel, lesson.data.orden);
  const vocabulary = (VOCABULARY[lesson.data.idioma_codigo] ?? VOCABULARY.en)[lesson.data.curso_nivel === "A1" ? "A1" : "advanced"];
  const question = questions[questionIndex];
  const options = optionsFor(question, vocabulary, questionIndex);
  const isCorrect = selected === question.translation;
  const lastQuestion = questionIndex === questions.length - 1;

  const checkAnswer = () => {
    if (!selected || checked) return;
    setChecked(true);
    if (isCorrect) setCorrectAnswers((current) => current + 1);
  };

  const nextQuestion = () => {
    if (!checked) return;
    if (lastQuestion) {
      const score = Math.round(((correctAnswers + (isCorrect ? 1 : 0)) / questions.length) * 100);
      attempt.mutate(score);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link to="/cursos" className="text-sm font-extrabold text-primary">← {t("lesson.exit")}</Link>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-muted-foreground">
          <span>{lesson.data.titulo}</span>
          <span>{questionIndex + 1}/{questions.length}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-success transition-all" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
      <div className="rounded-3xl border-2 border-border bg-card p-6">
        <p className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{lesson.data.idioma_nombre} · {lesson.data.curso_nivel}</p>
        <h1 className="mt-5 text-3xl font-extrabold">{t("lesson.q.listen")}</h1>
        <p className="mt-6 text-center text-2xl font-extrabold">{question.source}</p>
        <div className="mt-6 grid gap-3">
          {options.map((option) => {
            const answerState = checked && option === question.translation ? "border-success bg-success-soft text-success" : checked && option === selected ? "border-destructive bg-destructive-soft text-destructive" : selected === option ? "border-primary bg-primary-soft text-primary" : "border-border bg-card";
            return <button key={option} type="button" disabled={checked} onClick={() => setSelected(option)} className={`flex min-h-14 items-center justify-between rounded-2xl border-2 p-4 text-left font-extrabold transition-colors ${answerState}`}><span>{option}</span>{checked && option === question.translation ? <CheckCircle2 className="h-5 w-5" /> : checked && option === selected ? <XCircle className="h-5 w-5" /> : null}</button>;
          })}
        </div>
        {checked && <p className={`mt-5 font-extrabold ${isCorrect ? "text-success" : "text-destructive"}`}>{isCorrect ? t("lesson.correct") : `${t("lesson.wrong")}: ${question.translation}`}</p>}
      </div>
      <DuoButton block disabled={!selected || attempt.isPending} onClick={checked ? nextQuestion : checkAnswer}>{checked && lastQuestion ? t("lesson.finish") : checked ? t("lesson.continue") : t("lesson.check")}</DuoButton>
    </div>
  );
}
