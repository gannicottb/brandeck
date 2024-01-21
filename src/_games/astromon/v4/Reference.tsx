import React from "react";
import styles from 'styles/astromon/v4/Reference.module.scss'
import { icon } from "../utils";
import { CardData } from "../parse";

interface CardProps {
  data: CardData,
}

export const Reference: React.FC<CardProps> = ({ data }) => {
  return (
    <>
      <div className={styles.name}>{data.name}</div>
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
      {data.name == "Competitions" && <div className={styles.legend}>
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
    </>
  )
}