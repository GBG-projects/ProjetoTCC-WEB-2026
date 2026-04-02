import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req,{params}) {
    const {codusuario} = await params;

    try {
        const result = await pool.query('SELECT * FROM Usuario WHERE CodUsuario = $1', [codusuario]);
        
        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0], { status: 200 });
    }
    catch(error) {
        console.error("Erro ao buscar usuario:", error);
        return new Response(
            JSON.stringify({
                message: "Erro ao buscar usuario"}),
                {status: 500}

        )
    }
}