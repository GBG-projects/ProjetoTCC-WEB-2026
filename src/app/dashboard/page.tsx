'use client'
import { signOut, useSession } from "next-auth/react";
import styles from './page.module.css';

export default function Dashboard() {

    const {user: session} = useSession();
    
    console.log(session?.user);
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <h1 className={styles.title}>Dashboard</h1>
                <button className={styles.button} onClick={() => signOut({callbackUrl: '/'}) }>
                    sair
                </button>
            </div>
        </div>
    );
}
