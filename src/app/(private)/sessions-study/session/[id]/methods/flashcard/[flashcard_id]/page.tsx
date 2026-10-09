import CriarFlashcard from "@/app/components/SessionStudy/methodsPages/flashcard/CriarFlashcard";

export default async function Flashcard({ params }: { params: Promise<{ flashcard_id: string }> }) {
  const { flashcard_id } = await params;
  return <CriarFlashcard flashcard_id={flashcard_id} />;
}