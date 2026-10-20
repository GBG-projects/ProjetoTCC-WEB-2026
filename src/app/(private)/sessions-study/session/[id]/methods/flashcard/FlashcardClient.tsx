'use client'

import { useRouter } from "next/navigation";
import CriarFlashcard from "@/app/components/SessionStudy/methodsPages/flashcard/CriarFlashcard";

export default function FlashcardClient({ flashcard_id }: { flashcard_id: string }) {
  const router = useRouter();
  return <CriarFlashcard flashcard_id={flashcard_id} onVoltar={() => router.back()} />;
}