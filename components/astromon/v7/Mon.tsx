import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import { iconCircled } from "lib/astromon/utils";
import cardStyles from 'styles/astromon/v7/Card.module.scss'
import { biomeColors } from "./Card";

interface CardProps {
  data: ParsedCard,
  size: string
}

export const Mon: React.FC<CardProps> = ({ data, size, ...props }) => {
  const biomes = data.biome.split("")
  const colors = biomes.map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  const statType = data.skillType

  const cornerOverlay =
    <div className={cardStyles.overlay} style={{ "fontSize": "2em" }}>
      {["topLeft", "bottomRight"].map(c =>
        <div className={cardStyles[c]} key={c} dangerouslySetInnerHTML={{ __html: iconCircled(statType) }} />
      )}
      {["topRight", "bottomLeft"].map(c =>
        <div className={cardStyles[c]} key={c} dangerouslySetInnerHTML={{ __html: iconCircled(biomes[0]) }} />
      )}
    </div>

  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColor
      }}
    >
      {cornerOverlay}
      <div className={cardStyles.topbar}>
        <div>
          <div className={cardStyles.name}>{data.name}</div>
          <div className={cardStyles.type}>{data.type}</div>
        </div>
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
    </div >
  )
}