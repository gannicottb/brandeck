import React from "react";
import cardStyles from 'styles/astromon/v8/Card.module.scss'
import monStyles from 'styles/astromon/v8/Mon.module.scss'
import styles from 'styles/astromon/v8/Upgrade.module.scss'
import { icon } from "../utils";
import { CardProps } from "../parse";
import Image from "next/image";
import { CardArt } from "../CardArt";

export const Upgrade: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}>
      <div className={cardStyles.topbar}>
        <div className={monStyles.cost}>
          {data.cost}
          <span className={monStyles.cost_icon}>{icon("build")}</span>
        </div>
        <div>
          <div className={cardStyles.name}>{data.name}</div>
          <div className={cardStyles.type}>{data.type}</div>
        </div>
        <div></div>
      </div>

      <div className={cardStyles.art}>
        {data.art != "unknown" && <CardArt src={data.art} alt={data.name} />}
      </div>
      {data.text &&
        <div className={styles.text}
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></div>}
      <div className={monStyles.baseStars}>
        <div>{data.bonusStars}</div>
        <div>{icon("star")}</div>
      </div>
    </div>
  )
}