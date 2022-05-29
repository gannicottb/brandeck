import { parseString, Row } from '@fast-csv/parse';

// 2.0
type CardRow = {
  name: string;
  cost: string;
  type: string;
  biome: string;
  speed: string;
  strength: string;
  family: string;
  psychic: string;
  num: string;
  art: string;
  text: string;
};

type ParsedCard = {
  name: string;
  cost: number;
  type: string;
  biome: string;
  speed: number;
  strength: number;
  family: number;
  psychic: number;
  num: number;
  art: string;
  text: string;
};

export default (csv: string) => {
  return new Promise<Row<any>[]>(resolve => {
    let result: Row<any>[] = []
    parseString(csv, { headers: true })
      .on('error', error => console.error(error))
      .on('data', row => result.push(row))
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`)
        resolve(result)
      });
  })
}