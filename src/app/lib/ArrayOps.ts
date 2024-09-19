export class ArrayOps<T> {
  ts: T[]
  constructor(array: T[]) { this.ts = array }
  /*
    ex: ArrayOps.of(a).grouped(2)
  */
  static of<T>(array: T[]) { return new ArrayOps(array) }
  grouped(size: number): T[][] {
    return this.ts.reduce<T[][]>((result, item, index) => {
      const chunkIndex = Math.floor(index / size)
      if (!result[chunkIndex]) {
        result[chunkIndex] = [] // start a new chunk
      }

      result[chunkIndex].push(item)

      return result
    }, [])
  }
  last(): T | undefined {
    return this.ts.at(-1)
  }
  dropRight(n: number): T[] {
    return this.ts.slice(0, -n)
  }
  drop(n: number): T[] {
    return this.ts.slice(n, this.ts.length)
  }
}