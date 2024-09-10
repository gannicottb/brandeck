import React from "react";
import cardStyles from 'styles/astromon/v6/Card.module.scss'
import styles from 'styles/astromon/v6/Reference.module.scss'
import { CardProps } from "../parse";
import { CardArt } from "../CardArt";

export const Reference: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}>
      <div className={styles.name}>{data.name}</div>
      {data.art != "unknown" && <div className={cardStyles.art}>
        <CardArt src={data.art} alt={data.name} />
      </div>}
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
    </div>
  )
}