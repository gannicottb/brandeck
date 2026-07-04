import Card from "./Card";
import { _parseSheet } from "./parse";
import { Container } from "@/app/components/Container";
import { cardCache } from "@/app/lib/Utils";
import { CardPageProps } from "@/app/lib/CardPageProps";
import { Condition } from "@/app/lib/Filters";

export default async function Cards({
  gameVer,
  size,
  filters,
  diffWith,
}: CardPageProps) {
  const raw = await cardCache.get(gameVer);
  const parsed = await _parseSheet(raw);

  let diffed;

  if (diffWith) {
    // Assumption: we only want to diff with the previous minor version, which may or may not exist.

    const prevRaw = await cardCache.get(diffWith);
    const prevParsed = await _parseSheet(prevRaw);

    diffed = parsed.filter(
      (itemA) =>
        !prevParsed.some(
          (itemB) => JSON.stringify(itemB) === JSON.stringify(itemA),
        ),
    );
  }

  const filter = Condition.fromString(filters.query);
  return (
    <Container
      cards={(diffed || parsed)
        .filter((c) => filter.test(c))
        .map((r, i) => (
          <Card data={r} key={i} size={size} gameVer={gameVer} />
        ))}
    />
  );
}
