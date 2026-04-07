export interface BingoItem {
  id: number
  label: string
  icon: string
}

export const BINGO_ITEMS: BingoItem[] = [
  { id: 1,  label: 'Ravi Goes Over Time Limit',     icon: '👨‍💼' },
  { id: 2,  label: 'WFH',                          icon: '🏠' },
  { id: 3,  label: 'Heating / HVAC',               icon: '🌡️' },
  { id: 4,  label: 'Audits',                       icon: '📋' },
  { id: 5,  label: 'Security',                     icon: '🔒' },
  { id: 6,  label: 'Sports',                       icon: '⚽' },
  { id: 7,  label: 'Cynthia / Popcorn',            icon: '🍿' },
  { id: 8,  label: 'Adam: Unplanned Project Idea',  icon: '💡' },
  { id: 9,  label: 'Cloud',                        icon: '☁️' },
  { id: 10, label: 'Vince Jokes in Chat',           icon: '💬' },
  { id: 11, label: 'Mic Fails',                    icon: '🎤' },
  { id: 12, label: 'Slides Fail',                  icon: '💻' },
  { id: 13, label: 'Preview: Sequel',              icon: '🎬' },
  { id: 14, label: 'Preview: Tech Horror',         icon: '👾' },
  { id: 15, label: 'Derrick from San Antonio',     icon: '🤠' },
  { id: 16, label: 'Bring Your Own Cup',           icon: '☕' },
  { id: 17, label: 'Preview: Artist / Performer',  icon: '🎭' },
  { id: 18, label: 'ODEAN Mentioned',              icon: '📢' },
  { id: 19, label: 'KC Corporate Challenge',       icon: '🏆' },
  { id: 20, label: 'Upcoming Blockbuster',         icon: '🎥' },
  { id: 21, label: 'Past Blockbuster Performance', icon: '📊' },
  { id: 22, label: 'Taylor Swift',                 icon: '🎵' },
  { id: 23, label: 'New AMC Product / Service',    icon: '🎪' },
  { id: 24, label: 'Marvel Mentioned',             icon: '🦸' },
]

export const FREE_SQUARE: BingoItem = { id: 0, label: 'FREE', icon: '⭐' }

/** Returns a freshly shuffled 5×5 grid with FREE in the centre (index 12). */
export function buildGrid(): BingoItem[] {
  const shuffled = [...BINGO_ITEMS].sort(() => Math.random() - 0.5)
  // Insert FREE at position 12
  const grid: BingoItem[] = []
  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      grid.push(FREE_SQUARE)
    } else {
      const srcIdx = i < 12 ? i : i - 1
      grid.push(shuffled[srcIdx])
    }
  }
  return grid
}

/** Check all winning lines on a 5×5 grid. Returns array of winning line indices. */
export function getWinningLines(marked: Set<number>): number[][] {
  const lines: number[][] = []

  // Rows
  for (let r = 0; r < 5; r++) {
    const row = [r*5, r*5+1, r*5+2, r*5+3, r*5+4]
    if (row.every(i => marked.has(i))) lines.push(row)
  }

  // Cols
  for (let c = 0; c < 5; c++) {
    const col = [c, c+5, c+10, c+15, c+20]
    if (col.every(i => marked.has(i))) lines.push(col)
  }

  // Diagonals
  const d1 = [0, 6, 12, 18, 24]
  const d2 = [4, 8, 12, 16, 20]
  if (d1.every(i => marked.has(i))) lines.push(d1)
  if (d2.every(i => marked.has(i))) lines.push(d2)

  return lines
}
