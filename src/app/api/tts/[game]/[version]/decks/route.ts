import { Condition, Filterable } from "@/app/lib/Filters";
import { GameVersion } from "@/app/lib/GameVersion";
import { cardCache } from "@/app/lib/Utils";
import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { GameDataRepo } from "@/app/lib/GameDataRepo";

// AFAICT you can't dynamically load interfaces so we have to redeclare the fields we care about
interface DynamicCard extends Filterable {
  name: string;
  type: string;
  faction: string;
  idx: number;
  [key: string]: any; // Allows any other dynamic property
}
// Return "decklists" keyed by `idx` so that TTS can create the decks we want
export async function GET(
  request: Request,
  { params }: { params: Promise<{ game: string; version: string }> },
) {
  const { game, version } = await params;

  const gameVer = GameVersion.fromStrings(game, version);

  const repo = GameDataRepo.getInstance();

  // Dynamically load the right parser
  const { _parseSheet } = await import(
    `@/_games/${gameVer.gameName}/v${gameVer.version.major}/parse`
  );

  // Look up the cards
  const raw = await cardCache.get(gameVer);
  // Parse the cards
  const parsed = (await _parseSheet(raw)) as DynamicCard[];
  // Look up the deck list or 404
  const file = await repo.getFirst(gameVer, { nameEq: "decks" });
  if (!file?.id) {
    notFound();
  }
  // Download the text
  const fileContent = await repo.exportAsText(file?.id);

  // the decks are defined as single line filter expressions
  // TODO: maybe add some metadata like a name so we can label them
  const filterLines = fileContent.split("\n");

  // Create lists containing card indices based on the filter expressions
  /* example: 
  [
    {
      "deck_0": [
        "1",
        "2",
        "3",
        "3",
        "4",
        "5",
        "6",
        "6"
      ]
    },
    ...
  ]
  */
  const decks = filterLines.map((filterLine, deckIndex) => {
    const condition = Condition.fromString(filterLine);
    const cards = parsed.filter((c) => condition.test(c)).map((c) => c.idx);
    return { name: `deck_${deckIndex}`, cards };
  });

  return NextResponse.json({
    decks: decks,
  });
}
