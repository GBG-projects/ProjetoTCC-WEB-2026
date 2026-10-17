"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./report.module.css";
import {
  abreviar,
  type QuestoesPorDisciplina,
} from "./chartData";
import {
  COR_ACERTADAS,
  COR_GRADE,
  COR_RESPONDIDAS,
  COR_TEXTO,
  tickStyle,
  tooltipContentStyle,
  tooltipCursor,
  tooltipTextStyle,
} from "./chartTheme";

interface Props {
  dados: QuestoesPorDisciplina[];
}

export default function QuestoesChart({ dados }: Props) {
  if (dados.length === 0) {
    return <p className={styles.mensagem}>Sem dados neste período.</p>;
  }

  const larguraMinima = Math.max(dados.length * 96, 320);

  return (
    <div className={styles.graficoScroll}>
      <div style={{ minWidth: larguraMinima, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dados}
            margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          >
            <CartesianGrid stroke={COR_GRADE} vertical={false} />
            <XAxis
              dataKey="disciplina"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={80}
              tick={tickStyle}
              stroke={COR_GRADE}
              tickFormatter={(valor: string) => abreviar(valor)}
            />
            <YAxis
              allowDecimals={false}
              tick={tickStyle}
              stroke={COR_GRADE}
              label={{
                value: "Questões",
                angle: -90,
                position: "insideLeft",
                fill: COR_TEXTO,
              }}
            />
            <Tooltip
              cursor={tooltipCursor}
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipTextStyle}
              itemStyle={tooltipTextStyle}
            />
            <Legend
              verticalAlign="top"
              formatter={(nome) => <span style={tooltipTextStyle}>{nome}</span>}
            />
            <Bar
              dataKey="respondidas"
              name="Respondidas"
              fill={COR_RESPONDIDAS}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="acertadas"
              name="Acertadas"
              fill={COR_ACERTADAS}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
