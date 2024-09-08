import React from "react";
import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image"
import iconFor from "../icons";

interface CornerPlacementProps {
  corner: "tl" | "tr" | "bl" | "br"
  children: React.ReactNode,
  extraClasses?: string
}
function CornerPlacement(props: CornerPlacementProps) {
  const margin = "0.5"
  const pos = (k: string) => {
    switch (k) {
      case "tl":
        return `top-${margin} left-${margin}`
      case "tr":
        return `top-${margin} right-${margin}`
      case "bl":
        return `bottom-${margin} left-${margin}`
      case "br":
        return `bottom-${margin} right-${margin}`
    }
  }

  return (
    <div className={
      `absolute z-10 ${pos(props.corner)} rounded-full p-2 ${props.extraClasses}`
    }>
      {props.children}
    </div>
  )
}

export default function Assistant({ data }: { data: CardData }) {
  return (
    <div className="flex flex-col h-[100%] justify-end">
      <CornerPlacement corner="tr"
        extraClasses={`h-10 w-10 flex items-center justify-center 
           bg-yellow-400 border-solid border-2 border-black`}>
        <div className="text-5xl font-bold leading-[0]">{iconFor(data.grade)}</div>
      </CornerPlacement>
      <div className={`absolute left-[5%] top-[5%] w-[90%] h-[90%] m-0 -z-10`}>
        <Image
          src={data.art}
          fill={true}
          alt="art"
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      <div className="text-center bg-white border-solid border-2 border-black w-[fit-content] ml-auto mr-auto p-1 rounded-t-lg">
        {data.name}
      </div>
      <div className="text-xs p-3 bg-white h-[30%]">
        <MarkdownWithIcons content={data.text} />
      </div>
    </div>
  )
}