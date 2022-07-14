import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import styles from 'styles/astromon/v3/Reference.module.scss'
import { icon } from "lib/astromon/utils";

interface CardProps {
  data: ParsedCard,
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
          <span>Desert {icon("desert")}</span>
          <span>Cave {icon("cave")}</span>
          <span>Ocean {icon("ocean")}</span>
          <span>Forest {icon("forest")}</span>
        </div>
        <div className={styles.column}>
          <span>Speed {icon("spd")}</span>
          <span>Strength {icon("str")}</span>
          <span>Family {icon("fam")}</span>
          <span>Psychic {icon("psy")}</span>
        </div>
      </div>}
    </>
  )
}