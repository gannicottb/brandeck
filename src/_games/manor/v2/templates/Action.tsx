import { Dict } from "@/app/lib/Utils";
import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image";
import iconFor from "../icons";
import { useMemo } from "react";
import { factionColors, tailwindColor } from "../colors";

export default function Action({ data }: { data: CardData }) {
  const myColor = useMemo(() => {
    return factionColors(data.faction).tw;
  }, [data.faction]);

  const isLurk = data.text.includes("**Lurk**") && data.text.includes("---");

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
          <hr className={`pb-2 mt-2 border-${myColor}`} />
          <div>
            <>
              <MarkdownWithIcons content={lurk} />
              <span className="text-3xl">{iconFor("lurk")}</span>
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
          className={`border-2 border-${myColor} border-double rounded-[50%] bg-white px-2`}
        >
          {data.cost}
        </div>
      </div>
      <div className="text-left px-2 text-md">
        {/* {isLurk && <span className="mr-1">{iconFor("lurk")}</span>} */}
        {data.name}
      </div>
      <div
        className={`relative mb-auto p-2 border-solid border-4 border-${myColor} -z-10`}
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
            className={`absolute -bottom-1 -right-1 px-1 text-xs uppercase italic border-solid border-4 rounded-tl-lg border-${myColor}`}
          >
            {data.subtype}
          </div>
        )}
      </div>
      {/* <div className="absolute left-1 top-[65%] text-xl bg-white rounded-lg">
        {data.text.startsWith("**Lurk**") && <span>{iconFor("lurk")}</span>}
      </div> */}
      {/* <div
        className={`text-center bg-white border-solid border-2 border-${myColor} w-[fit-content] mx-auto p-1 rounded-lg`}
      >
        {data.name}
      </div> */}

      <div
        className={`flex flex-col bg-white border-solid border-2 border-${myColor} h-[40%] w-[90%] p-1 rounded-t-lg mx-auto text-sm text-center`}
      >
        <CustomTextBox text={data.text} />
        {data.gain && (
          <div
            className={`border-solid border-2 border-${myColor} mt-auto p-1 bg-gray-100 text-center text-lg`}
          >
            <CustomTextBox text={data.gain} />
          </div>
        )}
      </div>
    </div>
  );
}
