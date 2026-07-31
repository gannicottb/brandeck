import { Condition, Filterable } from "@/app/lib/Filters";
import { GameVersion } from "@/app/lib/GameVersion";
import { cardCache } from "@/app/lib/Utils";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

  // Dynamically load the right parser
  const { _parseSheet } = await import(
    `@/_games/${gameVer.gameName}/v${gameVer.version.major}/parse`
  );

  // Look up the cards
  const raw = await cardCache.get(gameVer);
  // Parse the cards
  const parsed = (await _parseSheet(raw)) as DynamicCard[];

  // Note: we don't usually hardcode configuration like this in brandeck, should be read from Google Drive
  // Look up the decks.txt containing the decks we want to load in TTS
  const filePath = path.join(
    process.cwd(),
    `src/_games/${gameVer.gameName}/v${gameVer.version.major}/decks.txt`,
  );
  const fileContent = await fs.readFile(filePath, "utf8");

  // the decks are defined as single line filter expressions
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
    return { [`deck_${deckIndex}`]: cards };
  });

  return NextResponse.json({
    decks: decks,
  });
}
