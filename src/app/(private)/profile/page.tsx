'use client'
import Input from "@/app/components/Input/input/input";
import { toastErro, toastSucesso } from "@/app/components/toasts/toastsPersonalizados";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from './profile.module.css'
import Button from "@/app/components/Button/Button";
import { toast } from "sonner";
import { useUser } from "@/app/contexts/UserContext";

export default function Profile(){
    const {atualizarUser} = useUser();
    const {data:session} = useSession();
    const user= session?.user
    const [image, setImage] = useState<File | null>(null)
    const [email,setEmail] = useState('');
    const [name,setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const getUser = async()=>{
        if(!user) return
        setLoading(true)
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.id}`)
            if(!response.ok){
            toastErro('Erro ao carregar suas informações, recarregue a página ')
            return
            }
            const data = await response.json();
            atualizarUser(data);
            setName(data.nome);
            if (data.foto) {
            setPreviewImage(data.foto);
            }
            setEmail(data.email);
            

        }catch(error){
            toastErro('Erro ao carregar suas informações, recarregue a página')
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getUser()
    },[user])
    

    const atualizarUsuario = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!user) return
        setLoading(true)
        try{
            const formData = new FormData();
            if(image instanceof File){
                formData.append('foto', image);
            }
            formData.append('nome', name);
            formData.append('email', email);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.id}`,{
                method:'PUT',
                body: formData
            })

            if(!response.ok){
                toastErro('Erro ao atualizar suas informações, tente novamente')
                return
            }
            const data = await response.json()
            atualizarUser(data)
            toastSucesso('Informações atualizadas com sucesso')
        }catch(error){
            toastErro('Erro ao atualizar suas informações, tente novamente')
        }
        finally{
        setLoading(false)
        }
    }

    if(session?.user) {
        if(loading){
            return <div>Carregando...</div>
        }
        return(
        <div>
            <div>
                <form action="" onSubmit={(e)=>{
                    e.preventDefault();
                    atualizarUsuario(e)
                }
                    }>
                    <label className={styles.photo}>
                        {!previewImage?<span>Adicionar foto</span>:<img src={previewImage}></img>}
                        <input accept="image/*" type="file" hidden onChange={(e)=>{
                            const file = e.target.files?.[0] ?? null
                            setImage(file)

                            if(previewImage){
                                URL.revokeObjectURL(previewImage)
                            }
                            if(file){
                                setPreviewImage(URL.createObjectURL(file))
                                return
                            }
                            setPreviewImage(null)
                            
                        }}/>
                        
                        </label>
                    <Input textLabel="nome" type="text" placeholder="Insira um novo Nome" value={name} id="name" setValue={setName} required></Input>
                    <Input textLabel="email" type="text" placeholder="" value={email} id="email" setValue={setEmail} disable required></Input>    
                    <Button type="submit">Atualizar</Button>           
                </form>
            </div>
        </div>
        )
    }
    return(
        <div>Usuario não encontrado
        </div>
    )
}