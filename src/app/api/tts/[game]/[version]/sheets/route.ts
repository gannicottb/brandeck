import { GameVersion } from "@/app/lib/GameVersion";
import { ttsCache } from "@/app/lib/Utils";
import { NextResponse } from "next/server";

// return info about the uploaded sheets so that TTS can download the latest sheets and merge them into a single asset, in index order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ game: string; version: string }> },
) {
  const { game, version } = await params;

  const gameVer = GameVersion.fromStrings(game, version);

  const entries = await ttsCache.get(gameVer);

  // ISSUE! We have two kinds of cards with different backs. The Lua script in TTS needs a URL for the card backs.
  // We could return that link from this API to make it simpler, but we also have to know how to separate the sheets
  // We could simply hardcode that type:room should get back A and type:action should get back B.
  // Which then means I either need to always be careful to generate with filters on, or the tts renderMode needs to know.
  // Ok so we want all the Actions to have the same card back, and all the rooms to have the same (diff) card back
  // We know that at the CardInfo level via a type mapping. When we render in tts mode, we slice the whole list into sheets of 69.
  // and then we upload those sheets and cache the fileId and count, in order.
  // It won't break indexing because we have those values defined in a column, they're not implicit. (changing those values is breaking)
  // The card back needs to be set at the /sheets level, because that defines the base assets
  // the /decks level is a new feature to chop up the base assets into diff presorted decks.
  // So we want to add cardBack: URL to the TTSCardSheetEntry schema somehow.
  // Generate -> manor/cards/x.y?renderMode=tts -> container(sheet1{type}, sheet2{type}, ...)
  //    we have to declare somewhere what card back goes to which type.
  //    generally data is stored in the Drive folder. the decks.txt is a temporary hack, I think.
  //    we could define a metadata file in vX/.Y that maps `type -> cardBack link`

  return NextResponse.json(entries);
}
