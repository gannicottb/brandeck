import { ArrayOps, debugLog } from "./Utils"

export interface Filterable extends Record<string, any> { }

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

const extractConditionsAndOperators = new RegExp(/([^" ]*".*")|(\S+)/gm)

// make a Condition from a single token
// NOTE: assumes all comparisons are (string === string)?
function parseSingleCondition(s: string): Condition<Filterable> {
  const [k, v] = s.split(":")
  // sauce: allow listing out a list of options for a key
  const ors = v.replaceAll(`"`, "").split("|")
  debugLog("Condition value(s):", ors)
  return ors.map(o =>
    new Condition<Filterable>(a =>
      a[k]?.toLowerCase() === o.toLowerCase() // case insensitive string compare
    )
  ).reduce((final, next) => final.or(next))

}
// This takes a string (containing multiple conditions and operators) and returns a Condition
function parseQuery(s: string): Condition<Filterable> {
  // empty query means allow all
  if (s.length == 0) return new Condition<Filterable>(() => true)
  // parse query into tokens
  const [initial, ...rest] = [...s.matchAll(extractConditionsAndOperators)].map(arr => arr[0])
  debugLog("Conditions:", initial, rest)
  if (rest.length % 2 != 0) {
    console.log("Dropping last token from query while parsing, shouldn't be an odd # of them")
    rest.pop()
  }
  // parse and combine each pair of tokens (assumption is conditions joined with operators)
  return new ArrayOps(rest).grouped(2).reduce((all, one) => {
    const [operator, conditionStr] = one
    switch (operator) {
      case "AND":
        return all.and(parseSingleCondition(conditionStr))
      case "OR":
        return all.or(parseSingleCondition(conditionStr))
      default:
        throw new Error(`Unrecognized operator ${operator}`)
    }
  }, parseSingleCondition(initial))
}

// holdover from previous implementation, could remove
export interface FilterProps {
  query: string
}