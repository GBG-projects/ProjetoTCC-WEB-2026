'use client'
import Input from "@/app/components/Input/input/input";
import { useState } from "react";

export default function Flashcard() {
    return(
        <CreateFlashcard/>
    )
}

export function CreateFlashcard() {
    const [name, setName] = useState("");
    const [discipline,setDiscipline] = useState("Nenhuma");
    const [flashcard,setFlashcard] = useState("");

    return(
        <div className="flex flex-col gap-4">
            <Input textLabel="Nome do método" value={discipline} setValue={setDiscipline} type="text" placeholder="ex: outra coisa" id="disciplina"></Input>
            <Input textLabel="Frente do flashcard" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>
            <Input textLabel="Verso do flashcard" value={flashcard} setValue={setFlashcard} type="text" placeholder="ex: Geometria" id="metodo"></Input>
        </div>
    )
}