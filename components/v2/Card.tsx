import React from "react";
import styles from '../../styles/v2/Card.module.css'

export const Card: React.FC<any> = (props) => {
  const stats = ["speed", "strength", "family", "psychic"]

  return (
    <div className={styles.card}>
      <div className={styles.topbar}>
        <div className='cost'>{props.cost}</div>
        <div className='name'>{props.name}</div>
        <div className='biome'>{props.biome}</div>
      </div>
      <div className={styles.art}></div>
      <div className='text'>{props.text}</div>
      <div className={styles.bottombar}>
        <div className='type'>{props.type}</div>
        {stats.map((s, i) =>
          <div className='stat' key={i}>
            <div>{s}</div>
            <div>{props[s]}</div>
          </div>
        )}
      </div>
    </div>
  )
}