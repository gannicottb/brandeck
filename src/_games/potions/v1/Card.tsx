import { CardSizes } from "@/app/lib/CardPageProps";
import { CardData, CardProps } from "./parse";
import { ComponentType } from "react";
import dynamic from "next/dynamic";

export default function Card({ data, size }: { data: CardData, size: string }) {
  const CardOfType: ComponentType<CardProps> = dynamic<CardProps>(() => import(`./templates/${data.type}`))
  return (
    <div className={`
      ${CardSizes[size]}
      flex flex-col
      relative
      border-solid border-2 border-black
      float-left
      whitespace-pre-line
      box-border
      break-inside-avoid
      card
    `}>
      <CardOfType data={data} />
    </div>
  )
}