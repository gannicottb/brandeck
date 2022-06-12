import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import styles from 'styles/astromon/v2/Card.module.css'

interface CardProps {
  data: ParsedCard
}

export const Card: React.FC<CardProps> = ({ data, ...props }) => {

  return (
    <div className={styles.card}
      {...props}
    >
      <h2>UNIMPLEMENTED</h2>
    </div>
  )
}