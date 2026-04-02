import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req,{params}) {
    const {codusuario} = await params;
    const { searchParams } = new URL(req.url);
    const codcompromisso = searchParams.get('codcompromisso');

    try {
        const result = await pool.query('SELECT * FROM Turma WHERE CodUsuario = $1 and codcompromisso = $2', [codusuario, codcompromisso]);
        
        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Turma não encontrada" }, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0], { status: 200 });
    }
    catch(error) {
        console.error("Erro ao buscar Turma:", error);
        return new Response(
            JSON.stringify({
                message: "Erro ao buscar Turma"}),
                {status: 500}

        )
    }
}