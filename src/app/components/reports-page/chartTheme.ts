import type { CSSProperties } from 'react'

export const COR_TEXTO = 'rgba(255, 255, 255, 0.8)'
export const COR_GRADE = 'rgba(255, 255, 255, 0.12)'
export const COR_HORAS = '#0ea5e9'
export const COR_RESPONDIDAS = '#0ea5e9'
export const COR_ACERTADAS = '#34d399'

export const tickStyle = { fill: COR_TEXTO, fontSize: 12 }

export const tooltipContentStyle: CSSProperties = {
  background: '#12245c',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 10,
}

export const tooltipTextStyle: CSSProperties = { color: '#fff' }

export const tooltipCursor = { fill: 'rgba(255, 255, 255, 0.08)' }