import React from "react";
import { ParsedCard } from "../../lib/parse";
import styles from '../../styles/v2/Card.module.css'

type Dict = {
  [key: string]: string
}

const biomeColors: Dict = {
  "D": "#FF4600",
  "C": "#414345",
  "O": "#33ccff",
  "F": "#66ff66"
}
interface CardProps {
  data: ParsedCard
}

export const Card: React.FC<CardProps> = ({ data, ...props }) => {
  const stats = ["speed", "strength", "family", "psychic"]
  const colors = data.biome.split("").map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  console.log(`color = ${biomeColor}`)
  return (
    <div className={styles.card}
      style={{
        background: biomeColor
      }}
      {...props}
    >
      <div className={styles.topbar}>
        <div className={styles.cost}>{data.cost}</div>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.biome}>{data.biome}</div>
      </div>
      <div className={styles.art}></div>
      <div className={styles.text}>{data.text}</div>
      <div className={styles.bottombar}>
        <div className={styles.type}>{data.type}</div>
        {stats.map((s, i) =>
          <div className={styles.stat} key={i}>
            <div>{s.slice(0, 3)}</div>
            <div>{data[s as keyof typeof data]}</div>
          </div>
        )}
      </div>
    </div>
  )
}