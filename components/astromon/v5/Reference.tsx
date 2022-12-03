import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import cardStyles from 'styles/astromon/v5/Card.module.scss'
import styles from 'styles/astromon/v5/Reference.module.scss'
import { icon, iconCircled } from "lib/astromon/utils";

interface CardProps {
  data: ParsedCard,
  size: string
}

export const Reference: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}>
      <div className={styles.name}>{data.name}</div>
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
      {data.name == "First Player" && <div className={styles.legend}>
        <div className={styles.column}>
          {["Desert", "Cave", "Ocean", "Forest"].map(b =>
            <div className={styles.row} key={b}>
              <span>{b}</span>
              <span dangerouslySetInnerHTML={{ __html: icon(b) }} />
            </div>
          )}
        </div>
        <div className={styles.column}>
          {["Speed", "Strength", "Family", "Psychic"].map(s =>
            <div className={styles.row} key={s}>
              <span>{s}</span>
              <span dangerouslySetInnerHTML={{ __html: icon(s) }} />
            </div>
          )}
        </div>
      </div>}
    </div>
  )
}