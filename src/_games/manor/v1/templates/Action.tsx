import { Dict } from "@/app/lib/Utils";
import { MarkdownWithIcons } from "../MarkdownWithIcons";
import { CardData } from "../parse";
import Image from "next/image";
import iconFor from "../icons";

export default function Action({ data }: { data: CardData }) {
  const factionColors: Dict = {
    B: "blue-500",
    C: "rose-600",
    R: "yellow-500",
    W: "black",
  };

  const borderColor = (faction: string) => {
    if (faction?.length > 0) return factionColors[faction];
    else return "gray-400";
  };
  // This text box is "lurk aware"
  // and "dot aware"
  const CustomTextBox = ({ text }: { text: string }) => {
    if (text.startsWith("**Lurk**")) {
      const [lurk, action] = text.split("---");

      return (
        <>
          <MarkdownWithIcons content={lurk} />
          <hr className={`pb-2 mt-2 border-${borderColor(data.faction)}`} />
          <MarkdownWithIcons content={action} />
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
      <div className="absolute right-[2%] top-[1%] text-lg border-2 border-black border-double rounded-[50%] bg-white px-2">
        {data.cost}
      </div>
      <div className="text-center mx-auto mb-auto uppercase text-sm">
        {data.type}
      </div>
      <div
        className={`mx-auto p-2 border-solid border-4 border-${borderColor(data.faction)}`}
      >
        <Image
          src="https://placehold.co/300x200/png?text=👻"
          width={300}
          height={200}
          alt={data.name}
          referrerPolicy="no-referrer"
          priority
          sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
      </div>
      <div className="absolute left-1 top-[65%] text-xl bg-white rounded-lg">
        {data.text.startsWith("**Lurk**") && <span>{iconFor("lurk")}</span>}
      </div>
      <div
        className={`text-center bg-white border-solid border-2 border-${borderColor(data.faction)} w-[fit-content] mx-auto p-1 rounded-lg`}
      >
        {data.name}
      </div>

      <div
        className={`bg-white border-solid border-2 border-${borderColor(data.faction)} h-[30%] w-[90%] p-1 rounded-t-lg mx-auto text-sm text-center`}
      >
        <CustomTextBox text={data.text} />
      </div>
    </div>
  );
}
