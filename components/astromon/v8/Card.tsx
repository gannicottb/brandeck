import React from "react";
import { ParsedCard } from "lib/astromon/parse";
import { Reference } from "./Reference";
import { Mon } from "./Mon"
import { Upgrade } from "./Upgrade"

interface CardProps {
  data: ParsedCard,
  size?: string
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
      {data.type == "Upgrade" && <Upgrade
        data={data}
        size={cardSize}
        {...props}
      />}
    </>
  )
}