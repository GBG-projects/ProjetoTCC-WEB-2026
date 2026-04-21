'use client'
import { useState } from "react";
import Button from "../components/Button/Button";
import Input from "../components/Input/input";
import styles from './signin.module.css'
import { signIn } from 'next-auth/react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import pageStyles from '../page.module.css'
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false
        });
        if (res?.error) {
            setError("Usuario ou senha incorretos");
        } else {
            router.push('/dashboard');
        }
        setLoading(false)
    };
    return (
        <div className={pageStyles.page}>
            <nav className={pageStyles.nav}>
                <div className={pageStyles.brand}>
                    <span className={pageStyles.brandName}>Focus Flow</span>
                </div>
                <div className={pageStyles.navLinks}>
                    <Link href="/signup" className={pageStyles["btn-links"]}>
                        Registrar-se
                    </Link>
                </div>
            </nav>

            <div className={styles.container}>
                <div className={styles.heroGlow} />
                <form action="" onSubmit={login} className={styles.form}>
                    <h1 className={pageStyles.title}>Entrar</h1>
                    <div className={styles.inputFields}>
                        <Input textLabel="Email" type="text" placeholder="Insira um email" value={email} id="email" setValue={setEmail} />
                    </div>
                    <div className={styles.inputFields}>
                        <Input
                            textLabel="Senha"
                            type={showPassword ? "text" : "password"}
                            placeholder="Insira uma senha"
                            value={password}
                            id="password"
                            setValue={setPassword}
                            icon={
                                <Button type="button" onClick={() => setShowPassword(!showPassword)} variant="icon" className={styles.iconButton}>
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            }
                        />
                    </div>
                    {error && <p className={styles.errorText}>{error}</p>}

                    <Button text={loading?"Entrando":"Entrar"} disabled={loading}/>
                </form>
            </div>
        </div>
    );
}