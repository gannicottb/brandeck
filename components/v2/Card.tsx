import React from "react";
import { ParsedCard } from "../../lib/parse";
import { icon } from "../../lib/utils";
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
  const biomes = data.biome.split("")
  const colors = biomes.map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  const biomeIcons = biomes.map(b => icon(b))
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
        <div className={styles.biome}
          dangerouslySetInnerHTML={{ __html: biomeIcons.join("") }}
        />
      </div>
      <div className={styles.art}></div>
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
      {/* <div className={styles.text}>{data.text}</div> */}
      <div className={styles.bottombar}>
        <div className={styles.type}>{data.type}</div>
        {data.type == "Mon" && (
          <>
            <div className={styles.stat}>
              <div>{icon("Spd")}</div>
              <div>{data.speed}</div>
            </div>
            <div className={styles.stat}>
              <div>{icon("Str")}</div>
              <div>{data.strength}</div>
            </div>
            <div className={styles.stat}>
              <div>{icon("Fam")}</div>
              <div>{data.family}</div>
            </div>
            <div className={styles.stat}>
              <div>{icon("Psy")}</div>
              <div>{data.psychic}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}