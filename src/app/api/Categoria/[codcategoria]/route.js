import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req,{params}) {
    const {codcategoria} = await params;

    try {
        const result = await pool.query('SELECT * FROM Categoria WHERE codcategoria = $1', [codcategoria]);
        
        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Categoria não encontrada"}, { status: 404 });
        }
        
        return NextResponse.json(result.rows[0], { status: 200 });
    }
    catch(error) {
        console.error("Erro ao buscar categoria:", error);
        return new Response(
            JSON.stringify({
                message: "Erro ao buscar categoria"}),
                {status: 500}

        )
    }
}