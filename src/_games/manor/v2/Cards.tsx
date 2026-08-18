import Card from "./Card";
import { _parseSheet } from "./parse";
import { Container } from "@/app/components/Container";
import { cardCache } from "@/app/lib/Utils";
import { CardPageProps } from "@/app/lib/CardPageProps";
import { Condition } from "@/app/lib/Filters";
import { ArrayOps } from "@/app/lib/ArrayOps";

export default async function Cards({
  gameVer,
  size,
  filters,
  diffWith,
  renderMode,
}: CardPageProps) {
  const raw = await cardCache.get(gameVer);
  const parsed = await _parseSheet(raw);
  const filter = Condition.fromString(filters.query);

  // Chain a mix of normal Array methods and ArrayOps sauce
  const transformed = await ArrayOps.of(parsed)
    .mapAsync(async (cs) => {
      if (diffWith) {
        // Assumption: we only want to diff with the previous minor version, which may or may not exist.
        const prevRaw = await cardCache.get(diffWith);
        const prevParsed = await _parseSheet(prevRaw);
        return cs.filter(
          (itemA) =>
            !prevParsed.some(
              (itemB) => JSON.stringify(itemB) === JSON.stringify(itemA),
            ),
        );
      } else {
        return cs;
      }
    })
    .then((a) => {
      return renderMode == "tts" ? a.distinct((c) => c.idx) : a;
    })
    .then((a) => {
      return a.map((cs) => cs.filter((c) => filter.test(c)));
    })
    .then((a) => {
      return a.map((cs) =>
        cs.sort((aa, bb) => Number(aa.idx) - Number(bb.idx)),
      ); // idx order!
    });

  return (
    <Container
      cards={transformed
        .value()
        .map((r, i) => (
          <Card data={r} key={i} size={size} gameVer={gameVer} />
        ))}
      renderMode={renderMode}
    />
  );
}
