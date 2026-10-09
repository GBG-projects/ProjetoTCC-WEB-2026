import MindMap from "@/app/components/SessionStudy/methodsPages/mind_map/Scallidraw";

export default async function MindMap_Page({params}: {params: Promise<{mapa_mental_id: string}>}){
  const {mapa_mental_id} = await params;
  return <MindMap mindMapId={mapa_mental_id}/>
}