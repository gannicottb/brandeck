import React from "react";
import { icon, iconCircled } from "../utils";
import cardStyles from 'styles/astromon/v8/Card.module.scss'
import styles from 'styles/astromon/v8/Mon.module.scss'
import { Dict } from "@/app/lib/Utils";
import { CardProps } from "../parse";
import Image from "next/image"

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
          <div className={cardStyles.type}>{data.type} - {data.subtype}</div>
        </div>
        <div className={styles.biome}
          dangerouslySetInnerHTML={{ __html: biomeIcons.join("") }}
        />
      </div>
      <div className={cardStyles.art}>
        {data.art != "unknown" && <Image
          src={data.art}
          fill={true}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />}
      </div>
      <div className={cardStyles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>

      <div className={styles.bottombar}>
        <div className={styles.stat}>
          <div>{data.draw ? `${data.draw}${icon("draw-icon")}` : ""}</div>
        </div>
        <div className={styles.stat}>
          <div>{data.recruit ? `${data.recruit}${icon("side-action")}` : ""}</div>
        </div>
        <div className={styles.stat}>
          <div>
            <div>{data.build ? `${data.build}${icon("build")}` : ""}</div>
          </div>
        </div>
        <div className={styles.baseStat}>
          <div>{icon(statType)}</div>
          <div>{statValue}</div>
        </div>
        <div className={styles.baseStars}>
          <div>{data.bonusStars}</div>
          <div>{icon("star")}</div>
        </div>
      </div>
    </div >
  )
}