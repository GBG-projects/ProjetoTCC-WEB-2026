'use client'
import Input from "@/app/components/Input/input/input";
import Select from "@/app/components/Input/selectInput/selectInput";
import { useState } from "react";



export default function StudyMethods(){
    // const getMethods = async()=>{
    //     let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`)

    // }
    return(
        <CreateStudyMethods/>
    )
}


export function CreateStudyMethods() {
  const optionsType = [
    { label: "Livre", value: "Livre" },
    { label: "Pomodoro", value: "Pomodoro" },
    { label: "Mapa mental", value: "Mapa mental" },
    { label: "Flashcard", value: "Flashcard" },
  ];
   const optionsDiscipline = [
    { label: "Matemática", value: "Mátematica" },
    { label: "Lingua portuguesa", value: "Lingua portuguesa" },
    { label: "Ciências exatas", value: "Ciências exatas" },
    { label: "Ciências humanas", value: "Flashcard" },
  ];
  const [valueOptions, setValueOptions] = useState("Livre");
  const [name, setName] = useState("");
  const [discipline,setDiscipline] = useState("Nenhuma");
    
    const tipoCampo = {
        livre: [
          <Input textLabel="Livre" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>,
          <Input textLabel="Livre2" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>,

        ],
        pomodoro: [
          <Input textLabel="Nome do método" value={discipline} setValue={setDiscipline} type="text" placeholder="ex: outra coisa" id="disciplina"></Input>
        ],
        mapaMental: [
            <Input textLabel="Nom" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>,
            <Input textLabel="pomodoro aqui" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>,

        ],
        flashcard: [
          <Input textLabel="Nome do método" value={discipline} setValue={setDiscipline} type="text" placeholder="ex: outra coisa" id="disciplina"></Input>
        ]
    }
    const verificarCampo = ()=>{
        let camposParaAdicionar = tipoCampo.livre;
        if(valueOptions=="Pomodoro"){
          camposParaAdicionar = tipoCampo.pomodoro;
          
        }
        else if(valueOptions=="Mapa mental"){
          camposParaAdicionar = tipoCampo.mapaMental;
          
        }
        else if(valueOptions == "Flashcard"){
          camposParaAdicionar = tipoCampo.flashcard;
        }

        for(let campo of camposParaAdicionar){
          return campo;
        }
      
      }
  
  return (
    <div>
      <form action="">
        <h1>Crie seus métodos de estudo</h1>
        <div>
            <Input textLabel="Nome do método" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>
        </div>
        <div>
            <Input textLabel="Disciplina" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo"></Input>
        </div>
        <div>
          <Select
            textLabel="Escolha o tipo de estudo"
            value={valueOptions}
            id="tipo-estudo"
            setValue={setValueOptions}
            options={optionsType}
            placeholder="Selecione..."
          />
          
        </div>
        <div>
          <Input textLabel="Nome do método" value={discipline} setValue={setDiscipline} type="text" placeholder="ex: outra coisa" id="disciplina"></Input>
        </div>
        <div>
          {
           verificarCampo() 
          }
        </div>
      </form>
    </div>
  );
}