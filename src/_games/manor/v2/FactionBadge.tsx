import iconFor from "./icons";

export const FactionBadge = ({ faction }: { faction: string }) => {
  switch (faction) {
    case "B":
      return iconFor("blue");
    case "C":
      return iconFor("red");
    case "M":
      return iconFor("black");
    case "R":
      return iconFor("yellow");
    default:
      return <></>;
  }
};
