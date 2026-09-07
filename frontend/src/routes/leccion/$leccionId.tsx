import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DuoButton } from "@/components/duo/DuoButton";
import { RequireAuth } from "@/components/duo/RequireAuth";
import { api } from "@/lib/api";
import { useT } from "@/lib/useT";
import { lessonName } from "@/lib/i18n";

type Vocabulary = { source: string; translation: string };

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
  const { t, lang } = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalCorrectAnswers, setFinalCorrectAnswers] = useState(0);
  const lesson = useQuery({ queryKey: ["leccion", leccionId], queryFn: () => api.leccion(Number(leccionId)) });
  const attempt = useMutation({
    mutationFn: (puntaje: number) => api.intento(Number(user.id), Number(leccionId), puntaje),
    onSuccess: (_, puntaje) => {
      queryClient.invalidateQueries({ queryKey: ["progreso"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", user.id] });
      // XP for the current week is derived by the backend from completed
      // progress records, so refresh the cached weekly table as well.
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
      setFinalScore(puntaje);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("lesson.failed")),
  });

  if (lesson.isLoading) return <p>{t("lesson.loading")}</p>;
  if (lesson.isError || !lesson.data) return <p>{t("lesson.loadError")}</p>;
  // The prompt follows the app language; the answer remains the language of
  // the course (`traduccion` is chosen by the backend using idioma_codigo).
  const vocabulary = lesson.data.vocabulario.map((word) => ({
    source: word.significados[lang] ?? word.fuente,
    translation: word.traduccion,
  }));
  const questions = vocabulary;
  const question = questions[questionIndex];
  const options = optionsFor(question, vocabulary, questionIndex);
  const isCorrect = selected === question.translation;
  const lastQuestion = questionIndex === questions.length - 1;

  if (finalScore !== null) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <Trophy className="mx-auto h-14 w-14 text-gold" />
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{lessonName(lang, lesson.data.curso_nivel, lesson.data.orden, lesson.data.titulo)}</p>
          <h1 className="mt-2 text-3xl font-extrabold">{t("lesson.result")}</h1>
        </div>
        <div className="rounded-3xl border-2 border-border bg-card p-8">
          <p className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">{t("lesson.scoreLabel")}</p>
          <p className="mt-2 text-7xl font-extrabold text-primary">{finalScore}<span className="text-3xl">/100</span></p>
          <p className="mt-4 font-bold text-muted-foreground">{finalCorrectAnswers} de {questions.length} respuestas correctas</p>
          <p className={`mt-3 font-extrabold ${finalScore >= 60 ? "text-success" : "text-destructive"}`}>
            {finalScore >= 60 ? t("lesson.passed") : t("lesson.failed")}
          </p>
        </div>
        {finalScore >= 60 ? (
          <DuoButton block onClick={() => navigate({ to: "/curso/$cursoId", params: { cursoId: String(lesson.data.curso_id) } })}>
            Volver al curso
          </DuoButton>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <DuoButton onClick={() => { setFinalScore(null); setQuestionIndex(0); setSelected(null); setChecked(false); setCorrectAnswers(0); setFinalCorrectAnswers(0); }}>
              Repetir
            </DuoButton>
            <DuoButton variant="outline" onClick={() => navigate({ to: "/curso/$cursoId", params: { cursoId: String(lesson.data.curso_id) } })}>
              Volver al curso
            </DuoButton>
          </div>
        )}
      </div>
    );
  }

  const checkAnswer = () => {
    if (!selected || checked) return;
    setChecked(true);
    if (isCorrect) setCorrectAnswers((current) => current + 1);
  };

  const nextQuestion = () => {
    if (!checked) return;
    if (lastQuestion) {
      const score = Math.round((correctAnswers / questions.length) * 100);
      setFinalCorrectAnswers(correctAnswers);
      attempt.mutate(score);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link to="/curso/$cursoId" params={{ cursoId: String(lesson.data.curso_id) }} className="text-sm font-extrabold text-primary">← {t("lesson.exit")}</Link>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-extrabold text-muted-foreground">
          <span>{lessonName(lang, lesson.data.curso_nivel, lesson.data.orden, lesson.data.titulo)}</span>
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
