import dynamic from "next/dynamic";
import { Version } from "@/app/lib/Version";
import { cardCache, first } from "@/app/lib/Utils";
import { CardPageProps } from "@/app/lib/CardPageProps";
import Controls from "@/app/components/Controls";
import { GameVersion } from "@/app/lib/GameVersion";
import { FilterProps } from "@/app/lib/Filters";

export default async function Page({
  params,
  searchParams,
}: {
  params: { game: string; version: string; slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const gameVer: GameVersion = GameVersion.apply(
    params.game,
    Version.fromString(params.version),
  );
  const size: string = first(searchParams["size"]) || "print";
  const filters: FilterProps = {
    query: first(searchParams.q) || "",
  };

  // Handle the custom /diff/X.Y path!
  // Cards.tsx can be given a diffWith, and so we could href to load a diff from a picker but urlhacking will work too
  const [segment, value] = params.slug ? params.slug : [];
  const diffWithVersion =
    segment == "diff"
      ? GameVersion.apply(gameVer.gameName, Version.fromString(value))
      : undefined;

  const renderMode = first(searchParams["renderMode"])

  // We assume that all game+version combinations will have a Cards component that takes GameVersion
  const Cards = dynamic<CardPageProps>(
    () =>
      import(`@/_games/${gameVer.gameName}/v${gameVer.version.major}/Cards`),
  );
  return (
    <div>
      <Controls gameVer={gameVer} filterQuery={filters.query} />
      <Cards
        gameVer={gameVer}
        size={size}
        filters={filters}
        diffWith={diffWithVersion}
        renderMode={renderMode}
      />
    </div>
  );
}
