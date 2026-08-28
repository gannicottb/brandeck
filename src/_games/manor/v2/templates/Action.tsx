import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image";
import iconFor from "../icons";
import { useMemo } from "react";
import { factionColors } from "../colors";

export default function Action({ data }: { data: CardData }) {
  const myColor = useMemo(() => {
    return factionColors(data.faction);
  }, [data.faction]);

  const myTextSize = ["Awaken"].includes(data.name) ? "text-2xl" : "text-sm";

  const isLurk = (data.text.includes("**Lurk**") && data.text.includes("---")) || data.subtype.toLowerCase() == "lurk";

  // This text box is "lurk aware"
  // and "dot aware"
  const CustomTextBox = ({ text }: { text: string }) => {
    if (isLurk) {
      const [action, lurk] = text.split("---");
      // If you don't wrap the MarkdownWithIcons components, you get duplicate key warnings
      // because react-markdown generates the keys and then React flattens the whole thing
      return (
        <>
          <div>
            <MarkdownWithIcons content={action} />
          </div>
          <div className="relative">
            <hr className={`pb-2 mt-2 border-${myColor.tw}`} />
            <span className={`absolute left-[45%] top-0 bg-white text-sm px-1`}>{iconFor("lurk", {fill: myColor.css})}</span>
          </div>
          
          <div>
            <>
              <MarkdownWithIcons content={lurk} />
              {/* <span className="text-3xl">{iconFor("lurk")}</span> */}
            </>
          </div>
        </>
      );
    } else if (text.includes(`dot`)) {
      return (
        <span className="text-left">
          <MarkdownWithIcons content={text} />
        </span>
      );
    } else {
      return <MarkdownWithIcons content={text} />;
    }
  };

  return (
    <div className="flex flex-col h-[100%] justify-end">
      <div className="absolute right-[2%] top-[1%] text-lg flex">
        {data.jumpscare && iconFor("jumpscare")}

        <div
          className={`border-2 border-${myColor.tw} border-solid rounded-[50%] h-8 w-8 items-center justify-center inline-flex text-2xl bg-white`}
        >
          {data.cost}
        </div>
      </div>
      <div className="text-left px-2 text-md flex">
        {data.name}
        {data.itembox && (
          <div
            className={`border-${myColor.tw} border-solid rounded-[25%] border-2 px-1 text-sm inline-flex items-center justify-center bg-gray-100 ml-auto mr-8`}
          >
            <CustomTextBox text={data.itembox} />
          </div>
        )}
      </div>
      <div
        className={`relative mb-auto p-2 border-solid border-4 border-${myColor.tw} -z-10`}
      >
        <Image
          src={
            data.art
              ? data.art
              : "https://placehold.co/300x200/white/white/png?text="
          }
          width={300}
          height={200}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
        {data.subtype && (
          <div
            className={`absolute -bottom-1 -right-1 px-1 text-xs uppercase italic border-solid border-4 rounded-tl-lg border-${myColor.tw}`}
          >
            {data.subtype}
          </div>
        )}
      </div>
      <div
        className={`flex flex-col bg-white border-solid border-2 border-${myColor.tw} h-[40%] w-[90%] p-1 rounded-t-lg mx-auto ${myTextSize} text-center`}
      >
        <CustomTextBox text={data.text} />
        {data.gain && (
          <div
            className={`border-solid border-2 border-${myColor.tw} mt-auto p-1 bg-gray-100 text-center text-lg`}
          >
            <CustomTextBox text={data.gain} />
          </div>
        )}
      </div>
      {/*rounded-[50%] border-2 border-solid border-gray-300*/}
      {data.marketbox && (
        <div className="absolute bottom-0 w-full h-[10%] border-solid border-2 bg-gray-100 flex text-lg">
          <div className="h-8 w-8 inline-flex items-center justify-center mx-auto">
            <div className="absolute -top-1 z-0 text-3xl text-gray-300 leading-none">{iconFor("ecto")}</div>
            <div className="absolute -top-1 z-10 text-2xl">{data.marketbox}</div>
          </div>
        </div>
      )}
    </div>
  );
}
