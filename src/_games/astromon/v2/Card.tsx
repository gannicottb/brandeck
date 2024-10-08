import React from "react";
import styles from 'styles/astromon/v2/Card.module.scss'
import { Dict } from "@/app/lib/Utils";
import { CardData } from "../parse";
import { icon } from "../utils";
import { CardArt } from "../CardArt";

const biomeColors: Dict = {
  "D": "#FF4600",
  "C": "#414345",
  "O": "#33ccff",
  "F": "#66ff66"
}
interface OuterCardProps {
  data: CardData,
  size?: string
}

export const Card: React.FC<OuterCardProps> = ({ data, size, ...props }) => {
  const biomes = data.biome.split("")
  const colors = biomes.map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  const biomeIcons = biomes.map(b => icon(b))
  const cardSize = size || "medium"
  return (
    <div className={styles[cardSize]}
      style={{
        background: biomeColor
      }}
      {...props}
    >
      <div className={styles.topbar}>
        <div className={styles.cost}>{data.cost}</div>
        <div>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.type}>{data.type}</div>
        </div>
        <div className={styles.biome}
          dangerouslySetInnerHTML={{ __html: biomeIcons.join("") }}
        />
      </div>
      <div className={styles.art}>
        {data.art != "unknown" && <CardArt src={data.art} alt={data.name} />}
      </div>
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
      {data.type == "Mon" &&
        <div className={styles.bottombar}>
          <div className={styles.stat}>
            <div>{icon("Spd")}</div>
            <div>{data.speed || ""}</div>
          </div>
          <div className={styles.stat}>
            <div>{icon("Str")}</div>
            <div>{data.strength || ""}</div>
          </div>
          <div className={styles.stat}>
            <div>{icon("Fam")}</div>
            <div>{data.family || ""}</div>
          </div>
          <div className={styles.stat}>
            <div>{icon("Psy")}</div>
            <div>{data.psychic || ""}</div>
          </div>
        </div>}
    </div>
  )
}