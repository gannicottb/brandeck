import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import { icon, iconCircled } from "lib/astromon/utils";
import cardStyles from 'styles/astromon/v6/Card.module.scss'
import styles from 'styles/astromon/v6/Mon.module.scss'
import { Dict } from "lib/utils";

const biomeColors: Dict = {
  "C": "#414345",
  "D": "#FF4600",
  "O": "#33ccff",
  "F": "#66ff66"
}
interface CardProps {
  data: ParsedCard,
  size: string
}

export const Mon: React.FC<CardProps> = ({ data, size, ...props }) => {
  const biomes = data.biome.split("")
  const colors = biomes.map(b => biomeColors[b])
  const biomeColor = colors.length == 1 ? colors[0] : `linear-gradient(to right, ${colors.join(",")})`
  const biomeIcons = biomes.map(b => iconCircled(b))

  const ifNonZero = (value: number) => (value || 0) > 0
  const x: [string, number][] = [
    ["speed", data.speed],
    ["strength", data.strength],
    ["psychic", data.psychic],
    ["family", data.family]
  ]

  // Find the combination of name and value that are defined for this mon
  const stat = (x.map(tuple => ifNonZero(tuple[1]) ? tuple : undefined)
    .filter(x => x != undefined) as [string, number][])[0] || ["unknown", 0]

  if (stat[0] == "unknown") { console.log(`Could not parse ${data.name}: "${x}"`) }

  const [statType, statValue] = [stat[0], stat[1]]

  return (
    <div className={cardStyles[size]}
      style={{
        background: biomeColor
      }}
    >
      <div className={cardStyles.topbar}>
        <div className={styles.cost}>{data.cost}</div>
        <div>
          <div className={cardStyles.name}>{data.name}</div>
          <div className={cardStyles.type}>{data.type}</div>
        </div>
        <div className={styles.biome}
          dangerouslySetInnerHTML={{ __html: biomeIcons.join("") }}
        />
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
      <div className={styles.mergeHeader}>▼ Merge to Unlock ▼</div>
      <div className={styles.bottombar}>
        <div className={styles.stat}>
          <div>{data.bonusEffect || ""}</div>
        </div>
        <div className={styles.stat}>
          <div>{data.bonusStars ? `${data.bonusStars}${icon("star")}` : ""}</div>
        </div>
        <div className={styles.bonusStat}>
          <div>
            <span>{data.bonusStat ? "+" : ""}</span>
            <div>{data.bonusStat || ""}</div>
          </div>
        </div>
        <div className={styles.baseStat}>
          <div>{icon(statType)}</div>
          <div>{statValue}</div>
        </div>
      </div>
    </div >
  )
}