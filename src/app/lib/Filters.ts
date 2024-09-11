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
const splitCondition = new RegExp(/([^:!]+)([:|!])([^:!]+)/gm)

// make a Condition from a single token
// NOTE: assumes all comparisons are (string === string)?
function lowerAll(strs: string[]) {
  return strs.map(s => s.toLowerCase())
}
function cmpInsensitive(cmp: (a: string, b: string) => boolean) {
  return (...strs: string[]) => {
    const [l, r] = lowerAll(strs)
    return cmp(l, r)
  }
}
type CompareStrings = (...strs: string[]) => boolean
type CombineConditions<T> = (l: Condition<T>, r: Condition<T>) => Condition<T>
const eqInsensitive = cmpInsensitive((a: string, b: string) => a === b)
const neInsensitive = cmpInsensitive((a: string, b: string) => a !== b)
const andConds = (l: Condition<Filterable>, r: Condition<Filterable>) => l.and(r)
const orConds = (l: Condition<Filterable>, r: Condition<Filterable>) => l.or(r)
// next step: handle numbers
function parseOperator(s: string): [CompareStrings, CombineConditions<Filterable>] {
  switch (s) {
    case ":":
      return [eqInsensitive, orConds]
    case "!":
      return [neInsensitive, andConds]
    default:
      throw new Error(`Unrecognized operator ${s}`)
  }
}
function parseSingleCondition(s: string): Condition<Filterable> {
  const [k, o, v] = [...s.matchAll(splitCondition)][0].slice(1, 4)
  debugLog(k, o, v)
  const [cmp, combine] = parseOperator(o)
  const values = v.replaceAll(`"`, "").split("|") // get all values delimited by |
  debugLog("Condition value(s):", values)
  return values.map(or => new Condition<Filterable>(a => cmp(a[k], or)))
    .reduce((final, next) => combine(final, next))

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