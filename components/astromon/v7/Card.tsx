import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import { Reference } from "./Reference";
import { Mon } from "./Mon"
import { Mission } from "./Mission"
import { Dict } from "lib/utils";

interface CardProps {
  data: ParsedCard,
  size?: string
}

export const biomeColors: Dict = {
  "C": "#414345",
  "D": "#FF4600",
  "O": "#33ccff",
  "F": "#66ff66",
  "T": "#FFFFFF"
}

export const Card: React.FC<CardProps> = ({ data, size, ...props }) => {
  const cardSize = size || "medium"
  // Is there a less tedious way to delegate types like this?
  return (
    <>
      {data.type == "Reference" && <Reference
        data={data}
        size={cardSize}
        {...props}
      />}
      {data.type == "Mon" && <Mon
        data={data}
        size={cardSize}
        {...props}
      />}
      {data.type == "EvolvedMon" && <Mon
        data={data}
        size={cardSize}
        {...props}
      />}
      {data.type == "Mission" && <Mission
        data={data}
        size={cardSize}
        {...props}
      />}
    </>
  )
}