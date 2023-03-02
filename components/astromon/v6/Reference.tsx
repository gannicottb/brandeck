import React from "react";
import { ParsedCard } from "lib/astromon/v6/parse";
import cardStyles from 'styles/astromon/v6/Card.module.scss'
import styles from 'styles/astromon/v6/Reference.module.scss'

interface CardProps {
  data: ParsedCard,
  size: string
}

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