'use client'
import MindMap from "@/app/components/SessionStudy/methodsPages/mind_map/Scallidraw";
import { useRouter } from "next/navigation";


export default function MindMapClient({mapa_mental_id}: {mapa_mental_id: string}){
  const router = useRouter();
  return <MindMap mindMapId={mapa_mental_id} onVoltar={()=> router.back()}/>
}