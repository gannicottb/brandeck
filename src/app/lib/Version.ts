export interface Version {
  major: number,
  minor: number
}

export abstract class Version {
  static fromString(s: string) {
    const [major, minor] = s.split(".").map((s) => Number(s))
    return this.apply(major, minor)
  }
  static toNumber(v: Version) {
    return Number(`${v.major}.${v.minor}`)
  }
  static toString(v: Version) {
    return `${v.major}.${v.minor}`
  }
  static apply(major: number, minor: number) {
    return { major, minor }
  }
}