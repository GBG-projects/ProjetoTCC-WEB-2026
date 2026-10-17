"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./report.module.css";
import {
  abreviar,
  formatarHoras,
  type HorasPorDisciplina,
} from "./chartData";
import {
  COR_GRADE,
  COR_HORAS,
  COR_TEXTO,
  tickStyle,
  tooltipContentStyle,
  tooltipCursor,
  tooltipTextStyle,
} from "./chartTheme";

interface Props {
  dados: HorasPorDisciplina[];
}

export default function HorasChart({ dados }: Props) {
  if (dados.length === 0) {
    return <p className={styles.mensagem}>Sem dados neste período.</p>;
  }

  const altura = Math.max(240, dados.length * 44 + 90);

  return (
    <div style={{ width: "100%", height: altura }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          layout="vertical"
          margin={{ top: 8, right: 56, bottom: 28, left: 8 }}
        >
          <CartesianGrid stroke={COR_GRADE} horizontal={false} />
          <XAxis
            type="number"
            tick={tickStyle}
            stroke={COR_GRADE}
            label={{
              value: "Horas",
              position: "insideBottom",
              offset: -16,
              fill: COR_TEXTO,
            }}
          />
          <YAxis
            type="category"
            dataKey="disciplina"
            width={120}
            tick={tickStyle}
            stroke={COR_GRADE}
            tickFormatter={(valor: string) => abreviar(valor)}
          />
          <Tooltip
            cursor={tooltipCursor}
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipTextStyle}
            itemStyle={tooltipTextStyle}
            formatter={(valor: unknown) => formatarHoras(valor)}
          />
          <Legend
            verticalAlign="top"
            formatter={(nome) => <span style={tooltipTextStyle}>{nome}</span>}
          />
          <Bar
            dataKey="horas"
            name="Horas estudadas"
            fill={COR_HORAS}
            radius={[0, 6, 6, 0]}
          >
            <LabelList
              dataKey="horas"
              position="right"
              formatter={formatarHoras}
              fill="#fff"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
