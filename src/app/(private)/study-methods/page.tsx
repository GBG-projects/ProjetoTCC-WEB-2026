'use client'
import Input from "@/app/components/Input/input/input";
import Select from "@/app/components/Input/selectInput/selectInput";
import { useUser } from "@/app/contexts/UserContext";
import Link from "next/link";
import { useState } from "react";



export default function StudyMethods(){
    // const getMethods = async()=>{
    //     let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`)
    const {user} = useUser();
    let userId = user?.id;

  console.log('user id:', userId)
    // }
    return(
      <div>

        <h1>Sem metodos ainda</h1>
        <Link href="study-methods/session_study/create-methods">Link</Link>
      </div>
    )
}

