import { GameDataRepo } from "@/app/lib/GameDataRepo";
import { GameVersion } from "@/app/lib/GameVersion";
import { Version } from "@/app/lib/Version";
import { NextResponse } from "next/server";

import { z } from "zod";

const CreateVersionRequestSchema = z.object({
  game: z.string()
});
type CreateVersionRequest = z.infer<typeof CreateVersionRequestSchema>;

export async function POST(request: Request) {
  const json = await request.json();
  const { game} = CreateVersionRequestSchema.parse(json);

  const repo = GameDataRepo.getInstance();

  const done = await repo.makeNextMinorVersion(
    game,
  );

  return NextResponse.json({
    files: done,
  });
}
