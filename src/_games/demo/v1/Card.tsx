import { CardSizes } from "@/app/lib/CardPageProps";
import { CardData, CardProps } from "./parse";
import { ComponentType } from "react";
import dynamic from "next/dynamic";
import { IconoirProvider } from "iconoir-react";

export default function Card({ data, size }: { data: CardData, size: string }) {
  const CardOfType: ComponentType<CardProps> = dynamic<CardProps>(() => import(`./templates/${data.type}`))
  return (
    <IconoirProvider
      iconProps={{
        style: { display: "unset" },
        height: "1em",
        width: "1em"
      }}
    >
      <div className={`
      ${CardSizes[size]}
      bg-white
      flex flex-col
      border-solid border-2 border-black
      float-left
      whitespace-pre-line
      box-border
      break-inside-avoid
      card
    `}>
        <CardOfType data={data} />
      </div>
    </IconoirProvider>
  )
}