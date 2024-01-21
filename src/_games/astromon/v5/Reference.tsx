import React from "react";
import cardStyles from 'styles/astromon/v5/Card.module.scss'
import styles from 'styles/astromon/v5/Reference.module.scss'
import { CardProps } from "../parse";


export const Reference: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}>
      <div className={styles.name}>{data.name}</div>
      {data.art != "unknown" && <div className={cardStyles.art}>
        <img
          alt={data.name}
          src={data.art}
          referrerPolicy="no-referrer"
        />
      </div>}
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
    </div>
  )
}