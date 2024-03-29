import React from "react";
import cardStyles from 'styles/astromon/v5/Card.module.scss'
import styles from 'styles/astromon/v5/Resource.module.scss'
import { icon, iconCircled } from "../utils";
import { CardProps } from "../parse";

export const Resource: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}>
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