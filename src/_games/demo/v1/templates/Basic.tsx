import { CardData } from "../parse";
import Image from "next/image"

export default function Basic({ data }: { data: CardData }) {
  return (
    <>
      <div className="text-xl font-medium text-black">{data.name} - {data.type}</div>
      <div className="text-xl font-medium text-black">{data.power}</div>
      <div className="relative w-full h-1/2 m-0 bg-gray-400">
        <Image
          className="max-w-full max-h-full mt-auto mb-auto object-contain"
          src={data.art}
          fill={true}
          alt="art"
          referrerPolicy="no-referrer"
          priority={true}
        /></div>
      <div className="text-xl font-medium text-black">{data.text}</div>
    </>
  )
}
