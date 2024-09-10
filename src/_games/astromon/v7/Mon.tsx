import React from "react";
import { iconCircled } from "../utils";
import cardStyles from 'styles/astromon/v7/Card.module.scss'
import styles from 'styles/astromon/v7/Mon.module.scss'
import { biomeColors } from "./Card";
import { CardProps } from "../parse";
import { CardArt } from "../CardArt";

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

  const evolvedCornerOverlay =
    <div className={cardStyles.overlay} style={{ "fontSize": "2em" }}>
      <div className={cardStyles["topLeft"]} dangerouslySetInnerHTML={{ __html: iconCircled(biomes[0]) }} />
      <div className={cardStyles["topRight"]} dangerouslySetInnerHTML={{ __html: iconCircled(statType) }} />
    </div>

  const addLevelStyle = (baseStyle: string) => [
    baseStyle,
    data.subtype == "Level I" ? styles.bronzeBorder : null,
    data.subtype == "Level II" ? styles.silverBorder : null,
    data.subtype == "Level III" ? styles.goldBorder : null
  ].filter(c => c != null).join(" ")

  const bottomBarStyle = addLevelStyle(styles.bottombar)

  const evolveCostStyle = addLevelStyle(styles.evolveCost)

  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColor
      }}
    >
      {data.type == "Mon" ? cornerOverlay : evolvedCornerOverlay}
      <div className={cardStyles.topbar}>
        <div>
          <div className={cardStyles.name}>{data.name}</div>
          <div className={cardStyles.type}>{data.type} - {data.subtype}</div>
        </div>
      </div>
      <div className={cardStyles.art}>
        {data.art != "unknown" && <CardArt src={data.art} alt={data.name} />}
      </div>
      <div className={cardStyles.text}
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></div>
      <div className={bottomBarStyle}>
        {data.type == "Evolution" &&
          <div className={evolveCostStyle}
            dangerouslySetInnerHTML={{ __html: data.evolveCost }} />
        }
      </div>
    </div >
  )
}