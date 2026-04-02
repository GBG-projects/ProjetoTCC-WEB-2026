import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req,{params}) {
    const {codcompromisso} = await params;

    try {
        const result = await pool.query('SELECT * FROM Compromisso WHERE codcompromisso = $1', [codcompromisso]);
        
        if (result.rows.length === 0) {
            return NextResponse.json({ message: "compromisso não encontrado" }, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0], { status: 200 });
    }
    catch(error) {
        console.error("Erro ao buscar compromisso:", error);
        return new Response(
            JSON.stringify({
                message: "Erro ao buscar compromisso"}),
                {status: 500}

        )
    }
}