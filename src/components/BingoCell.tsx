import { useState } from 'react'
import type { BingoItem } from '../data/bingoItems'

interface Props {
  item: BingoItem
  index: number
  marked: boolean
  winning: boolean
  gameRunning: boolean
  onToggle: (index: number) => void
}

export default function BingoCell({ item, index, marked, winning, gameRunning, onToggle }: Props) {
  const [hovered, setHovered] = useState(false)

  const isFree = item.id === 0

  const handleClick = () => {
    if (!gameRunning && !isFree) return
    if (isFree) return
    onToggle(index)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: isFree || !gameRunning ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered && gameRunning && !isFree ? 'scale(1.06)' : 'scale(1)',
        background: winning
          ? 'linear-gradient(135deg, #ffd700 0%, #ff6b00 100%)'
          : marked
          ? 'linear-gradient(135deg, #c8102e 0%, #8b0000 100%)'
          : isFree
          ? 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)'
          : hovered && gameRunning
          ? 'linear-gradient(135deg, #1e1e3a 0%, #2a1a3e 100%)'
          : 'linear-gradient(135deg, #12121f 0%, #1a1a2e 100%)',
        boxShadow: winning
          ? '0 0 20px #ffd70099, 0 0 40px #ffd70044'
          : marked
          ? '0 0 16px #c8102e88'
          : hovered && gameRunning
          ? '0 0 18px #a855f755, 0 0 8px #7c3aed44'
          : '0 2px 6px #00000066',
        border: winning
          ? '2px solid #ffd700'
          : marked
          ? '2px solid #c8102e'
          : isFree
          ? '2px solid #ffaa00'
          : hovered && gameRunning
          ? '2px solid #a855f7'
          : '2px solid #2e2e4a',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 4px',
        minHeight: '80px',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer overlay on hover */}
      {hovered && gameRunning && !marked && !isFree && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(168,85,247,0.15) 50%, transparent 60%)',
            animation: 'shimmer 1s ease infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          fontSize: '1.6rem',
          lineHeight: 1,
          display: 'block',
          transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
          transform: hovered && gameRunning ? 'translateY(-3px) rotate(8deg) scale(1.25)' : 'none',
          filter: marked || winning ? 'drop-shadow(0 0 6px #fff8)' : 'none',
        }}
      >
        {item.icon}
      </span>

      {/* Label */}
      <span
        style={{
          marginTop: '5px',
          fontSize: '0.58rem',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.2,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: winning || isFree
            ? '#0a0a14'
            : marked
            ? '#fff'
            : hovered && gameRunning
            ? '#e2d9f3'
            : '#9999bb',
        }}
      >
        {item.label}
      </span>

      {/* Check mark on marked cells */}
      {marked && !winning && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            right: 6,
            fontSize: '0.6rem',
            color: '#ffaaaa',
            fontWeight: 900,
          }}
        >
          ✓
        </div>
      )}
    </div>
  )
}
