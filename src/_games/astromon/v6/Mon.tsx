import React from "react";
import { icon, iconCircled } from "../utils";
import cardStyles from 'styles/astromon/v6/Card.module.scss'
import styles from 'styles/astromon/v6/Mon.module.scss'
import { Dict } from "@/app/lib/Utils";
import { CardProps } from "../parse";

const biomeColors: Dict = {
  "C": "#414345",
  "D": "#FF4600",
  "O": "#33ccff",
  "F": "#66ff66"
}

export const Mon: React.FC<CardProps> = ({ data, size, ...props }) => {
  const biomes = data.biome.split("")
  const colors = biomes.map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  const biomeIcons = biomes.map(b => iconCircled(b))
  const [statType, statValue] = [data.skillType, data.skillValue]

  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColor
      }}
    >
      <div className={cardStyles.topbar}>
        <div className={styles.cost}>
          {data.cost}
          <span className={styles.cost_icon}>{icon("energy")}</span>
        </div>

        <div>
          <div className={cardStyles.name}>{data.name}</div>
          <div className={cardStyles.type}>{data.type}</div>
        </div>
        <div className={styles.biome}
          dangerouslySetInnerHTML={{ __html: biomeIcons.join("") }}
        />
      </div>
      <div className={cardStyles.art}>
        {data.art != "unknown" && <img
          alt={data.name}
          src={data.art}
          referrerPolicy="no-referrer"
        />}
      </div>
      <div className={cardStyles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
      <div className={styles.mergeHeader}>▼ Merge to Unlock ▼</div>
      <div className={styles.bottombar}>
        <div className={styles.stat}>
          <div>{data.bonusEffect || ""}</div>
        </div>
        <div className={styles.stat}>
          <div>{data.bonusStars ? `${data.bonusStars}${icon("star")}` : ""}</div>
        </div>
        <div className={styles.bonusStat}>
          <div>
            <span>{data.bonusSkill > 0 ? "+" : ""}</span>
            <div>{data.bonusSkill || ""}</div>
          </div>
        </div>
        <div className={styles.baseStat}>
          <div>{icon(statType)}</div>
          <div>{statValue}</div>
        </div>
      </div>
    </div >
  )
}