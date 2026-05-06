'use client'
import { signOut, useSession } from "next-auth/react";
import styles from './dashboard.module.css';
import { notFound } from "next/navigation"
export default function Dashboard() {
    const {data: session, status} = useSession();
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <h1>Ola {session?.user.name}</h1>
                <h1 className={styles.title}>Dashboard</h1>
                <button className={styles.button} onClick={() => signOut({callbackUrl: '/'}) }>
                    sair
                </button>
            </div>
        </div>
    );
}
