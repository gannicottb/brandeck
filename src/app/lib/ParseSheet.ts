import { parseString } from "@fast-csv/parse";
import { CardRow } from "./CardRow";
import camelCase from "lodash.camelcase";

export async function parseSheet<C extends CardRow>(csv: string, transformFn: (c: C) => C) {
  return new Promise<C[]>(resolve => {
    let result: C[] = []
    parseString<C, C>(csv,
      { headers: headers => headers.map(h => camelCase(h || "")), trim: true }
    )
      .transform((data: C) => {
        return transformFn(data)
      })
      .on('error', error => console.error(error))
      .on('data', (row: C) => [...Array(Number(row.num))].forEach((_, i) => result.push(row)))
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`)
        resolve(result)
      });
  })
}