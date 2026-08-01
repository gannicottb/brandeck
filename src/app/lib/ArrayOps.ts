export class ArrayOps<T> {
  private ts: T[];
  constructor(array: T[]) {
    this.ts = array;
  }
  /*
    ex: ArrayOps.of(a).grouped(2)
  */
  static of<T>(array: T[]) {
    return new ArrayOps(array);
  }
  // unwrap the ArrayOps monad
  value(){
    return this.ts
  }
  grouped(size: number): T[][] {
    return this.ts.reduce<T[][]>((result, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!result[chunkIndex]) {
        result[chunkIndex] = []; // start a new chunk
      }

      result[chunkIndex].push(item);

      return result;
    }, []);
  }
  last(): T | undefined {
    return this.ts.at(-1);
  }
  dropRight(n: number): T[] {
    return this.ts.slice(0, -n);
  }
  drop(n: number): T[] {
    return this.ts.slice(n, this.ts.length);
  }
  // this is monadic. Arguably the others should be too so you can chain them
  // without having to lift each intermediate result back into ArrayOps
  distinct(pred: (t: T) => string): ArrayOps<T> {
    const count: Record<string, number> = {};
    return this.map((x) => x.filter((t) => {
      const discrim = pred(t);
      count[discrim] = (count[discrim] ?? 0) + 1;
      return count[discrim] == 1;
    }));
  }
  filterIf(pred: (t: T) => boolean, applyFilter: boolean) {
    this.mapIf(applyFilter, (ts: T[]) => ts.filter(pred))
  }
  mapIf(shouldDo: boolean, fn: (ts: T[]) => T[]) {
    shouldDo ? fn(this.ts) : this.ts
  }
  map(fn: (ts: T[]) => T[]): ArrayOps<T> {
    return ArrayOps.of(fn(this.ts))
  }
  async mapAsync(fn: (ts: T[]) => Promise<T[]>): Promise<ArrayOps<T>> {
    // let x = (await fn(this.ts))
    // return ArrayOps.of(x)
    return fn(this.ts).then((x) => ArrayOps.of(x))
  }
  // async mapIfAsync(shouldDo: boolean, fn: (ts: T[]) => Promise<T[]>): Promise<ArrayOps<T>> {
  //   return shouldDo ? await fn(this.ts) : this
  // }

}
