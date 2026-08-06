import { getRootId, getGameNames, Folder } from "@/app/lib/Utils";
import { Version } from "@/app/lib/Version";
import { GameVersionPicker } from "./components/GameVersionPicker";
import { GameDataRepo } from "./lib/GameDataRepo";

// interface Folder {
//   id: string;
//   name: string;
// }
// this could be a candidate for ownership in GameDataRepo
async function getVersionsFor(gameName: string): Promise<Version[]> {
  const repo = GameDataRepo.getInstance();

  const allMajorVersions = await repo.list({
    nameContains: "v",
    isFolder: true,
    parentsIn: getRootId(gameName),
  });

  const majors: Folder[] = allMajorVersions.map((f) => {
    return { id: f.id || "", name: f.name || "" };
  });

  const allVersions: Version[] = await Promise.all(
    majors.map(async (major) => {
      const minorVersions = await repo.list({
        nameContains: ".",
        isFolder: true,
        parentsIn: major.id,
      });

      const names = minorVersions
        .map((f) => f.name || "")
        .filter((s) => s != "");
      return names.map<Version>((minor) => {
        return Version.apply(
          Number(major.name.replace("v", "")),
          Number(minor.replace(".", "")),
        );
      });
    }),
  ).then((x) =>
    x.flat(1).sort((a, b) => Version.toNumber(a) - Version.toNumber(b)),
  );
  return allVersions;
}
type GameVersionMap = Record<string, Version[]>;

export default async function Home() {
  const gameVersions: GameVersionMap = await Promise.all(
    getGameNames().map((name) => getVersionsFor(name).then((vs) => [name, vs])),
  ).then(Object.fromEntries);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-400">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Brandeck
      </h1>
      <div>Winding Road Games card preview and generation utility.</div>
      <div className="flex flex-col">
        {Object.keys(gameVersions).map((gameName) => {
          const versions = gameVersions[gameName];
          return (
            <GameVersionPicker
              key={gameName}
              gameName={gameName}
              versions={versions}
            />
          );
        })}
      </div>
      <div>Winding Road Games 2026</div>
    </main>
  );
}
