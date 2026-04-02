const { NextResponse } = require("next/server");
import pool from "@/lib/db";


export async function POST(requisicao) {

    try {

        const {cod_Lembrete, Datalembrete, titulolembrete, CodCompromisso } = await requisicao.json();

        if (!Datalembrete || !titulolembrete ||!CodCompromisso) {
            return NextResponse.json(
                { error: "Informações em branco" },
                { status: 400 }
            );
        }

        
        await pool.query(
            `INSERT INTO Lembrete (Datalembrete, titulolembrete, CodCompromisso)
            VALUES ($1, $2, $3)`,
            [Data_lembrete, titulo_lembrete, CodCompromisso]
        );

        return NextResponse.json({ message: "Lembrete criado" }, { status: 201 })

    } catch (error) {

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {

    try {

        const result = await pool.query(`SELECT * FROM Lembrete ORDER BY codLembrete asc;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}