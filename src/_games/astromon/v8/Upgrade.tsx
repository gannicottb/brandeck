import React from "react";
import cardStyles from 'styles/astromon/v8/Card.module.scss'
import monStyles from 'styles/astromon/v8/Mon.module.scss'
import styles from 'styles/astromon/v8/Upgrade.module.scss'
import { icon } from "../utils";
import { CardProps } from "../parse";
import Image from "next/image";

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
        {data.art != "unknown" && <Image
          src={data.art}
          fill={true}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />}
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