'use client'
import { useState } from "react";
import Button from "../components/Button/Button";
import Input from "../components/Input/input";
import styles from './login.module.css'
export default function Login(){

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    return(
        <div className="h-full flex justify-center items-center">

            <form action="" className={styles.form}>
                <h1 className="text-2xl">Focus Flow</h1>
                <div className={styles.inputFields}>
                    <Input textLabel="Email" type="text" placeholder="Insira um senha" value={email} id="email" setValue={setEmail}></Input>
                </div>
                <div className={styles.inputFields}>
                    <Input textLabel="Senha" type="text" placeholder="Insira um senha" value={password} id="password" setValue={setPassword}></Input>
                </div>
                <Button text="Entrar"/>
            </form>

        </div>
    )
}