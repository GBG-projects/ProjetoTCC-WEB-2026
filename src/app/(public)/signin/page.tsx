'use client'
import { useState } from "react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/input/input";
import styles from './signin.module.css'
import { signIn } from 'next-auth/react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toastErro, toastSucesso } from "../../components/toasts/toastsPersonalizados";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    const loginGoogle = async () => {
        await signIn('google', {
            callbackUrl: '/dashboard'
        })
    }

    const loginCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false
        });
        if (res?.error) {
            toastErro("Usuario ou senha incorretos");
        } else {
            toastSucesso('Login executado com sucesso')
            router.push('/dashboard');
        }
        setLoading(false)
    };

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.brand}>
                    <span className={styles.brandName}>Focus Flow</span>
                </div>
                <div className={styles.navLinks}>
                    <Link href="/signup" className={styles.btnLink}>
                        Registrar-se
                    </Link>
                </div>
            </nav>

            <main className={styles.main}>
                <form onSubmit={loginCredentials} className={styles.card}>
                    <h1 className={styles.title}>Entrar</h1>

                    <div className={styles.field}>
                        <Input
                            textLabel="Email"
                            type="text"
                            placeholder="Insira um email"
                            value={email}
                            id="email"
                            setValue={setEmail}
                        />
                    </div>

                    <div className={styles.field}>
                        <Input
                            textLabel="Senha"
                            type={showPassword ? "text" : "password"}
                            placeholder="Insira uma senha"
                            value={password}
                            id="password"
                            setValue={setPassword}
                            icon={
                                <Button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    variant="icon"
                                    className={styles.iconButton}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            }
                        />
                    </div>

                    <Button
                        text={loading ? "Entrando" : "Entrar"}
                        disabled={loading}
                        className={styles.btnCriar}
                    />
                    <button type="button" onClick={loginGoogle} className={styles.btnGhost}>
                        Entrar com Google
                    </button>
                </form>
            </main>
        </div>
    );
}