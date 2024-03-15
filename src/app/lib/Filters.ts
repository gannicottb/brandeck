export interface FilterProps {
  types: string[],
  names: string[]
}
export interface FilterableCard {
  type: string,
  name: string
}
export interface Filters extends FilterProps { }
export class Filters {
  constructor({ types, names }: FilterProps = { types: [], names: [] }) {
    this.types = types
    this.names = names
  }
  allows(card: FilterableCard): boolean {
    let isAllowed = true

    if (this.types.length > 0) {
      isAllowed &&= this.types.includes(card.type.toLowerCase())
    }

    if (this.names.length > 0) {
      isAllowed &&= this.names.includes(card.name.toLowerCase())
    }

    return isAllowed
  }
}