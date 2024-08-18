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

  checkInclusion(array: string[], pred: string): boolean {
    if (array.length > 0) {
      return array.includes(pred)
    } else return true
  }

  or(predicates: boolean[]): boolean {
    return predicates.reduce((memo, pred) => memo || pred)
  }

  and(predicates: boolean[]): boolean {
    return predicates.reduce((memo, pred) => memo && pred)
  }

  allows(card: FilterableCard): boolean {
    let isAllowed = true

    isAllowed = this.and([
      this.checkInclusion(this.names, card.name.toLowerCase()),
      this.checkInclusion(this.types, card.type.toLowerCase()),
    ])

    return isAllowed
  }
}