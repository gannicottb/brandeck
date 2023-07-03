import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import cardStyles from 'styles/astromon/v7/Card.module.scss'
import styles from 'styles/astromon/v7/Mission.module.scss'
import { icon, iconCircled } from "lib/astromon/utils";
import { biomeColors } from "./Card";

interface CardProps {
  data: ParsedCard,
  size: string
}

const overlayRow = (icon: string) =>
  <div>
    <div dangerouslySetInnerHTML={{ __html: iconCircled(icon) }} />
    <div dangerouslySetInnerHTML={{ __html: iconCircled(icon) }} />
  </div>

export const Mission: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColors[data.biome]
      }}
    >
      <div className={styles.corners}>
        {overlayRow(data.biome)}
        {overlayRow(data.biome)}
      </div>
      <div className={cardStyles.topbar}>
        <div className={cardStyles.name}>{data.name}</div>
        <div className={cardStyles.type}>{data.type}</div>
      </div>

      <div className={cardStyles.art}>
        {data.art != "unknown" && <img
          alt={data.name}
          src={data.art}
          referrerPolicy="no-referrer"
        />}
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