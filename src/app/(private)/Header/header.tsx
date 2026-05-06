'use client'
import Link from "next/link";
import styles from './header.module.css'
import { useState } from "react";
export default function Header(){
    const [name,setName] = useState('') 
    return(
        <header style={{ borderBottom: "1px solid #977272" }}>
            <nav className={styles.nav}>
                <div className={styles.brand}>
            
                <span className={styles.brandName}>Focus Flow</span>
                </div>
                <div className={styles.navLinks}>
                <Link href="/dashboard" className={styles["btn-links"]}>
                    Inicio
                </Link>
                <Link href="/profile" className={styles["btn-links"]}>
                    Perfil
                </Link>
                </div>
            </nav>
        </header>
    )
}