import React from "react";
import { ReactNode, Fragment } from "react";

const cardTotal = (cards: ReactNode[]) => {
  return (
    <div className="print:hidden fixed bottom-0 right-0">
      Total: {cards.length}
    </div>
  );
};
const defaultContainer = (cards: ReactNode[]) => {
  return (
    <div id="container" className="block max-w-[1125px] box-border">
      {cards.map((c, i) => {
        return (
          <Fragment key={`print-block-${i}`}>
            {c}
            {i > 0 && i % 9 == 0 && <div className="break-before-all" />}
          </Fragment>
        );
      })}
      {cardTotal(cards)}
    </div>
  );
};

const MAX_CARDS_IN_TTS_SHEET = 69;

// This works if we have 69 or fewer cards, but really I have more
// So ideally we'd render multiple 4096x4096 images, one fully kitted and the other with overflow.
// Or, we might actually wind up wanting to slice and dice the decks anyway, so a workaround could be
// pass filters through to the generate page, so it can do different slices. Which would then import as different decks nicely.
const ttsWidth = 232.5 * 10;
const ttsHeight = 325.5 * 7;
const ttsExportContainer = (cards: ReactNode[]) => {
  const sheets = Array.from(
    { length: Math.ceil(cards.length / MAX_CARDS_IN_TTS_SHEET) },
    (_, index) =>
      cards.slice(
        index * MAX_CARDS_IN_TTS_SHEET,
        (index + 1) * MAX_CARDS_IN_TTS_SHEET,
      ),
  );

  // Return divs that represent the sheets, each with up to MAX_CARDS and [1-10]x7 (regardless of actual card count)
  // I think TTS might actually not accept a single row sheet though? So we have to be at least 2 rows tall.
  // easiest thing (not perfectly efficient) is to just fix the height so the sheets are always 10x7
  return (
    <div
      id="container"
      className="block box-border"
      style={{width: `${ttsWidth}px`}}
    >
      {sheets.map((cards, page) =>
        <div className="sheet flow-root" style={{width: `${ttsWidth}px`, height: `${ttsHeight}px`}} key={`page-${page}`}>
          {cards}
        </div>
      )}
    </div>
  );
};

// Generic component that injects print breaks for cards
export function Container({
  cards,
  renderMode,
}: {
  cards: ReactNode[];
  renderMode?: string;
}) {
  switch (renderMode) {
    case "tts":
      return ttsExportContainer(cards);
    default:
      return defaultContainer(cards);
  }
}
