import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import { icon, iconCircled } from "lib/astromon/utils";
import cardStyles from 'styles/astromon/v7/Card.module.scss'
import styles from 'styles/astromon/v7/Mon.module.scss'
import { biomeColors } from "./Card";

interface CardProps {
  data: ParsedCard,
  size: string
}

export const Mon: React.FC<CardProps> = ({ data, size, ...props }) => {
  const biomes = data.biome.split("")
  const colors = biomes.map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  const biomeIcons = biomes.map(b => icon(b))
  const [statType, statValue] = [data.skillType, data.skillValue]

  const biomeAndSkill = (style: string) =>
    <div className={style}
      style={{
        background: biomeColor
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: biomeIcons.join("") }} />
      <div dangerouslySetInnerHTML={{ __html: icon(statType) }} />
    </div>

  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColor
      }}
    >
      <div className={cardStyles.topbar}>
        {biomeAndSkill(styles.biomeAndSkillLeft)}
        <div>
          <div className={cardStyles.name}>{data.name}</div>
          <div className={cardStyles.type}>{data.type}</div>
        </div>
        {biomeAndSkill(styles.biomeAndSkillRight)}
      </div>
      <div className={cardStyles.art}>
        {data.art != "unknown" && <img
          alt={data.name}
          src={data.art}
          referrerPolicy="no-referrer"
        />}
      </div>
      <div className={cardStyles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>

      <div className={styles.bottombar}>
        <div className={styles.stat}>
          <div dangerouslySetInnerHTML={{ __html: iconCircled(statType) }} />
        </div>
      </div>
    </div >
  )
}