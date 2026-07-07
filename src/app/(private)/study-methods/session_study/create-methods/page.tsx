'use client'
import ConfirmButton from "@/app/components/Button/ConfirmButton";
import Input from "@/app/components/Input/input/input";
import Select from "@/app/components/Input/selectInput/selectInput";
import { toastErro } from "@/app/components/toasts/toastsPersonalizados";
import { useState } from "react";


export default function CreateStudyMethods() {
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
    const [cicle,setCicle] = useState(1);
    const [time,setTime] = useState(0);
    const [breakTime,setBreakTime] = useState(5);
    const [flashcard,setFlashcard] = useState("");

    const tipoCampo = {
        livre: [
          <Input key={"time"} textLabel="tempo" value={time} setValue={setTime} type="number" placeholder="..." id="time1" required></Input>,

        ],
        pomodoro: [
          <Input key={"cicle"} textLabel="Ciclos" value={cicle} setValue={setCicle} type="number" placeholder="..." id="cicle" required></Input>,
          <Input key={"time"} textLabel="tempo" value={time} setValue={setTime} type="number" placeholder="..." id="time" required></Input>,
          <Input key={"breakTime"} textLabel="tempo de descanso" value={breakTime} setValue={setBreakTime} type="number" placeholder="..." id="breakTime" required></Input>,

        ],
    }
    const verificarCampo = ()=>{
        let camposParaAdicionar = tipoCampo.livre;
        if(valueOptions=="Pomodoro"){
          camposParaAdicionar = tipoCampo.pomodoro;
        }
        return camposParaAdicionar;
      }

      const submitMethodStudy = async()=> {
          if(typeof time != "number" ||
            typeof cicle != "number" ||
            typeof breakTime != "number"
          ){
              toastErro('Preencha todos os campos corretamente');
          }

          if(name=="" || discipline==""){
            toastErro('Preencha todos os campos corretamente');
          }

          const data = {
            name,
            discipline,
            type: valueOptions,
            time,
            cicle,
            breakTime,
          }
          let rota;
          switch(valueOptions){
            case "Livre":
              rota = "free";
              break;
            case "Pomodoro":
              rota = "pomodoro";
              break;
            case "Mapa mental":
              rota = "mental-map";
              break;
            case "Flashcard":
              rota = "flashcard";
              break;
          }
          
      }
  
  return (
    <div>
      <form action="" onSubmit={(e)=>{
          e.preventDefault();
          submitMethodStudy();
      }}>
        <h1>Crie seus métodos de estudo</h1>
        <div>
            <Input textLabel="Nome do estudo" value={name} setValue={setName} type="text" placeholder="ex: Geometria" id="metodo" required></Input>
        </div>
        <div>
            <Input textLabel="Disciplina" value={discipline} setValue={setDiscipline} type="text" placeholder="ex: Geometria" id="metodo" required></Input>
        </div>
        <div>
          <Select
            textLabel="Escolha o tipo de estudo"
            value={valueOptions}
            id="tipo-estudo"
            setValue={setValueOptions}
            options={optionsType}
            placeholder="Selecione..."
            required
          />
          
        </div>
        <div>
          {
           verificarCampo() 
          }
        </div>
           <ConfirmButton type="submit" text="Confirmar"/>
      </form>
    </div>
  );
}