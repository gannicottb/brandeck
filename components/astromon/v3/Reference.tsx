import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import styles from 'styles/astromon/v3/Reference.module.scss'

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
    </>
  )
}