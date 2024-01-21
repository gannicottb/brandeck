export interface Version {
  major: number,
  minor: number
}

export function parseVersion(version: string): Version {
  const [major, minor] = version.split(".").map((s) => Number(s))
  return { major, minor }
}