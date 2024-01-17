import { first, parseVersion } from "@/app/lib/Utils";
import { Version } from "@/app/lib/Version";

export const getVersion = (query: string | string[]): Version => {
  const firstVersionParam = first(query) || "1.0"
  return parseVersion(firstVersionParam)
}