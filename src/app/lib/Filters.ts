import { ArrayOps, debugLog } from "./Utils"

export interface Filterable extends Record<string, any> { }

export class Condition<A> {
  test: (a: A) => boolean
  // Construct with initial fn
  constructor(p: (a: A) => boolean) {
    this.test = p
  }

  static fromString(s: string) {
    return parseQuery(s)
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

const extractConditionsAndOperators = new RegExp(/([^" ]*".*")|(\S+)/gm)
const splitCondition = new RegExp(/([^:!]+)([:|!])([^:!]+)/gm)

type Compare<A, B> = (a: A, b: B) => boolean
type CompareStrings = Compare<string, string>
type CombineConditions<T> = (l: Condition<T>, r: Condition<T>) => Condition<T>
type CombineFilterables = CombineConditions<Filterable>
function lowerAll(a: string, b: string) {
  return [a, b].map(s => s.toLowerCase())
}
function cmpInsensitive(cmp: CompareStrings): CompareStrings {
  return (a, b) => {
    const [l, r] = lowerAll(a, b)
    return cmp(l, r)
  }
}
const eq: CompareStrings = (a, b) => a === b
const ne: CompareStrings = (a, b) => a !== b
const eqInsensitive = cmpInsensitive(eq)
const neInsensitive = cmpInsensitive(ne)
const andConds: CombineFilterables = (l, r) => l.and(r)
const orConds: CombineFilterables = (l, r) => l.or(r)

function parseOperator(s: string): [CompareStrings, CombineFilterables] {
  switch (s) {
    case ":":
      return [eqInsensitive, orConds]
    case "!":
      return [neInsensitive, andConds]
    default:
      throw new Error(`Unrecognized operator ${s}`)
  }
}
// make a Condition from a single token
function parseSingleCondition(s: string): Condition<Filterable> {
  const [k, o, v] = [...s.matchAll(splitCondition)][0].slice(1, 4)
  debugLog(k, o, v)
  const [cmp, combine] = parseOperator(o)
  const values = v.replaceAll(`"`, "").split("|") // get all values delimited by |
  debugLog("Condition value(s):", values)
  return values.map(or => new Condition<Filterable>(a => cmp(a[k], or))).reduce(combine)
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