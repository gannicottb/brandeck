class Condition<A> {
  test: (a: A) => boolean
  // Construct with initial fn
  constructor(p: (a: A) => boolean) {
    this.test = p
  }
  // Combine with AND
  and(co: Condition<A>): Condition<A> {
    return new Condition<A>(a => this.test(a) && co.test(a))
  }
  // Combine with OR
  or(co: Condition<A>): Condition<A> {
    return new Condition<A>(a => this.test(a) || co.test(a))
  }
}
// wraps a Condition (because we don't have companion objects to define Condition.fromString)
export class Filter {
  condition: Condition<Filterable>
  constructor(queryString: string) {
    this.condition = parseQuery(queryString)
  }
  allows(c: Filterable) { return this.condition.test(c) }
}

interface Filterable extends Record<string, any> { }

const extractConditionsAndOperators = new RegExp(/([^" &]*"[^"&]+")|\s([&|\|])\s|(\S+)/gm)

// make a Condition from a single token
// NOTE: assumes all comparisons are (string === string)?
function makeCond(s: string): Condition<Filterable> {
  const [k, v] = s.split(":")
  console.log(`Making condition from ${k}:${v}`)
  // sauce: allow listing out a list of options for a key
  const ors = v.replaceAll(`"`, "").split("|")
  return orAll(
    ors.map(o =>
      new Condition<Filterable>(a =>
        a[k]?.toLowerCase() === o.toLowerCase() // case insensitive string compare
      )
    )
  )
}
// OR together multiple conditions
function orAll<A>(conditions: Condition<A>[]) {
  return conditions.reduce((final, next) => final.or(next))
}
// This takes a string (containing multiple conditions and operators) and returns a Condition
function parseQuery(s: string): Condition<Filterable> {
  const [initial, ...rest] = [...s.matchAll(extractConditionsAndOperators)].map(arr => arr[0])
  console.log(`parsing Query... ${initial} _ ${rest.join(",")}`)
  if (rest.length % 2 != 0) {
    console.log("Dropping last token from query while parsing, shouldn't be an odd # of them")
    rest.pop()
  }
  const groupsOfTwo = rest.reduce<string[][]>((result, item, index) => {
    const chunkIndex = Math.floor(index / 2)
    if (!result[chunkIndex]) {
      result[chunkIndex] = [] // start a new chunk
    }

    result[chunkIndex].push(item)

    return result
  }, [] as string[][])

  return groupsOfTwo.reduce((all, one) => {
    const [operator, conditionStr] = one
    switch (operator) {
      case "AND":
        return all.and(makeCond(conditionStr))
      case "OR":
        return all.or(makeCond(conditionStr))
      default:
        throw `Unrecognized operator ${operator}`
    }
  }, makeCond(initial))

}
// const queryString7 = `subType:Slime OR type:Salt OR name:Chef`
// // this is pretty sweet
// const queryString8 = `starterDeck:A|B|C|D|E|F AND subType:Slime OR type:Reference`
// const zz = parseQuery(queryString8)

// export const demo = { zz }

export interface FilterProps {
  // types: string[],
  // names: string[]
  query: string
}
export interface FilterableCard extends Filterable {
  // type: string,
  // name: string
}
// export interface Filters extends FilterProps { }
// export class Filters {
//   constructor({ types, names }: FilterProps = { types: [], names: [] }) {
//     this.types = types
//     this.names = names
//   }

//   checkInclusion(array: string[], pred: string): boolean {
//     if (array.length > 0) {
//       return array.includes(pred)
//     } else return true
//   }

//   or(predicates: boolean[]): boolean {
//     return predicates.reduce((memo, pred) => memo || pred)
//   }

//   and(predicates: boolean[]): boolean {
//     return predicates.reduce((memo, pred) => memo && pred)
//   }

//   allows(card: FilterableCard): boolean {
//     let isAllowed = true

//     isAllowed = this.and([
//       this.checkInclusion(this.names, card.name.toLowerCase()),
//       this.checkInclusion(this.types, card.type.toLowerCase()),
//     ])

//     return isAllowed
//   }
// }