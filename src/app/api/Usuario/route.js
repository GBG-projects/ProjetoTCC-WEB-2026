import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {

    try {

        const { CodUsuario, Nome, Email, senha, Nivel, Pontos } = await requisicao.json();

        if (!Nome || !Email || !senha) {
            return NextResponse.json(
                { error: "Informações em branco" },
                { status: 400 }
            );
        }

        
        await pool.query(
            `INSERT INTO Usuario (Nome, Email, senha)
            VALUES ($1, $2, $3)`,
            [Nome, Email, senha]
        );

        return NextResponse.json({ message: "Usuario criado" }, { status: 201 })

    } catch (error) {

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {

    try {

        const result = await pool.query(`SELECT * FROM Usuario ORDER BY CodUsuario;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}