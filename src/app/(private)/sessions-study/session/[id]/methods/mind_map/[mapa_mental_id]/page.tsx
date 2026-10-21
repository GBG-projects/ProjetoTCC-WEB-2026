import MindMapClient from "../MindMapClient";

export default async function MindMap_Page({params}: {params: Promise<{mapa_mental_id: string}>}){
  const {mapa_mental_id} = await params;

  return <MindMapClient mapa_mental_id={mapa_mental_id}/>
}