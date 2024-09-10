import React from "react";
import cardStyles from 'styles/astromon/v7/Card.module.scss'
import styles from 'styles/astromon/v7/Mission.module.scss'
import { icon, iconCircled } from "../utils";
import { biomeColors } from "./Card";
import { CardProps } from "../parse";
import { CardArt } from "../CardArt";

const cornerOverlay = (icon: string) =>
  <div className={cardStyles.overlay} style={{ "fontSize": "2em" }}>
    {["topLeft", "topRight", "bottomLeft", "bottomRight"].map(c =>
      <div className={cardStyles[c]} key={c} dangerouslySetInnerHTML={{ __html: iconCircled(icon) }} />
    )}
  </div>

export const Mission: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColors[data.biome]
      }}
    >
      {cornerOverlay(data.biome)}
      <div className={cardStyles.topbar}>
        <div className={cardStyles.name}>{data.name}</div>
        <div className={cardStyles.type}>{data.type}</div>
      </div>

      <div className={cardStyles.art}>
        {data.art != "unknown" && <CardArt src={data.art} alt={data.name} />}
      </div>
      {data.text &&
        <div className={styles.text}
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></div>}
      {(data.text && data.bonusStars > 0) && <hr style={{ width: "80%" }} />}
      {(data.bonusStars > 0) &&
        <div className={styles.reward}>
          <div>{data.bonusStars}{icon("star")}</div>
        </div>
      }
    </div>
  )
}