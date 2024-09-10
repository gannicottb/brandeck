import React from "react";
import cardStyles from 'styles/astromon/v8/Card.module.scss'
import styles from 'styles/astromon/v8/Reference.module.scss'
import { CardProps } from "../parse";
import Image from "next/image";

export const Reference: React.FC<CardProps> = ({ data, size }) => {
  return (
    <div className={cardStyles[size]}>
      <div className={styles.name}>{data.name}</div>
      {data.art != "unknown" && <div className={cardStyles.art}>
        <Image
          src={data.art}
          fill={true}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>}
      <div className={styles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
    </div>
  )
}