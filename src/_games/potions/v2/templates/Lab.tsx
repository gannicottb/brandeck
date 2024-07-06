import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image"

export default function Lab({ data }: { data: CardData }) {
  const topAndBottom = "flex justify-around w-[40%] ml-auto mr-auto text-2xl bg-orange-400 rounded-2xl"
  const leftAndRight = "flex flex-col justify-center h-[30%] min-w-[18%] mt-auto mb-auto text-2xl bg-orange-500 rounded-2xl"
  return (
    <div className="flex flex-col h-full">
      <div className={`absolute top-0 w-full h-full m-0 -z-10`}>
        <Image
          src={data.art}
          fill={true}
          alt="art"
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      <div className={topAndBottom}>
        <MarkdownWithIcons content={data.upgrade1} />
      </div>
      <div className="flex h-full justify-between">
        <div className={leftAndRight}>
          <MarkdownWithIcons content={data.upgrade2} />
        </div>
        <div className={leftAndRight}>
          <MarkdownWithIcons content={data.upgrade3} />
        </div>
      </div>
      <div className={topAndBottom}>
        <MarkdownWithIcons content={data.upgrade4} />
      </div>
    </div>
  )
}