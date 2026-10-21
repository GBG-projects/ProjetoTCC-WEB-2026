import PomodoroClient from "../PomodoroClient";

export default async  function Pomodoro({params}: {params: Promise<{pomodoro_id: string}>}) {
  const {pomodoro_id} = await params;

  return <PomodoroClient pomodoro_id={pomodoro_id} />;

}