'use client'
import Input from "@/app/components/Input/input";
import { toastErro } from "@/app/components/toasts/toastsPersonalizados";
import { error } from "console";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Profile(){
    const {data:session} = useSession();
    const user= session?.user
    const [image, setImage] = useState<File | null>(null)
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const [loading, setLoading] = useState(false)
    const getUser = async()=>{
        if(!user) return
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.id}`)
            if(!response.ok){
            toastErro('Erro ao carregar suas informações, recarregue a página ')
            return
            }
            const data = await response.json();
            setName(data.nome);
            setImage(data.foto);
            setEmail(data.email);
            console.log('data:',data);
            

        }catch(error){
            toastErro('Erro ao carregar suas informações, recarregue a página')
        }

    }

    useEffect(()=>{
        getUser()
    },[user])
    
    if(session?.user) {
        return(
        <div>
            <div>
                <h1>olá, tenho aid</h1>
                
                <Input textLabel="nome" type="text" placeholder="Insira um novo Nome" value={name} id="name" setValue={setName} required></Input>
                <Input textLabel="email" type="text" placeholder="" value={email} id="email" setValue={setEmail} disable required></Input>
               
            </div>
        </div>
        )
    }
    return(
        <div>Usuario não encontrado
        </div>
    )
}