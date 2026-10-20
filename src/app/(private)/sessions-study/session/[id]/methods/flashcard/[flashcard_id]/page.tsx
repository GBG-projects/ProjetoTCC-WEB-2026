import FlashcardClient from "../FlashcardClient";

export default async function Flashcard({ params }: { params: Promise<{ flashcard_id: string }> }) {
  const { flashcard_id } = await params;
  return <FlashcardClient flashcard_id={flashcard_id} />;
}