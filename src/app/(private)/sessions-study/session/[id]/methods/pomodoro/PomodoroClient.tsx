'use client'

import PomodoroPage  from "@/app/components/SessionStudy/methodsPages/pomodoro/PomodoroPage";
import { useRouter } from "next/navigation";

export default function PomodoroClient({pomodoro_id}:{pomodoro_id: string}) {
  const router = useRouter();  
  return <PomodoroPage pomodoro_id={pomodoro_id} onVoltar={()=> router.back()}/>;

}