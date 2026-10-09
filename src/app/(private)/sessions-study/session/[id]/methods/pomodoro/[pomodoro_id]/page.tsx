import PomodoroPage  from "@/app/components/SessionStudy/methodsPages/pomodoro/PomodoroPage";

export default async  function Pomodoro({params}: {params: Promise<{pomodoro_id: string}>}) {
  const {pomodoro_id} = await params;

  return <PomodoroPage pomodoro_id={pomodoro_id} />;

}