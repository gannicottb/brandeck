/*

  cases:

  all cards of types found in list

  all cards with a certain name OR a type found in list

  all cards with starterDeck set to something

  all cards with name found in list

  fundamental unit is a predicate to test against a Card (A => boolean)

  filters usually assume accumulation of conditions (AND)

  But in our case, we filter not to find things, but to craft the set of cards that we want to print.
  somewhat complex example:
  card => (c1 & c2) | (c3) | ((c4 & c5 | c6)): boolean

  class FiCo<A> {
    test: A => boolean
    and: FiCo = _ => true
    or: FiCo = _ => true
  }
  a = FiCo(c1).and(FiCo(c2))
  b = FiCo(c3)
  c = FiCo(c4).and(FiCo(c5)).or(FiCo(c6))
  final = a.or(b).or(c)

  If I want to support the above semantics, I need a way to translate the grouping from a string

  (k1:val & k2:val)
  (k1:val & k2:val) | (k3:val)
  Can we make the assumption that () groups are always ORed together?

  This seems complicated. What about starting with support for simpler semantics

  condition[ AND|OR ]*
  ex - ```
  type:ingredient OR name:"Salt - A"
  ```
  => ["type:ingredient", "OR", `name:"Salt - A"`]
  parse conditions from strings
  => [Cond(c => c[type] === "ingredient"), "OR", Cond(c => c[name] === "Salt - A")]
  glue them together with appropriate operator (tricky... would have to pass forward a function for completion)
  => Cond(c => c[type] === "ingredient" || c[name] === "Salt - A")


*/


type Condition<A> = (a: A) => boolean
const isReferenceCard: Condition<FilterableCard> = c => c.type == "Reference"

// Combine two conditions
type Operator = "AND" | "OR"
type Operand<A> = boolean | Expression<A>
interface Expression<A> {
  a: Operand<A>
  operator: Operator, // how to combine
  b: Operand<A>
}
// Represents a function of A => boolean, that can be chained
// with others via & and |
// daisy chaining doesn't represent grouping ()
class Cond<A> {
  check: (a: A) => boolean
  constructor(p: (a: A) => boolean) {
    this.check = p
  }
  and(co: Cond<A>): Cond<A> {
    return new Cond<A>(a => this.check(a) && co.check(a))
  }
  or(co: Cond<A>): Cond<A> {
    return new Cond<A>(a => this.check(a) || co.check(a))
  }
}

interface Filterable extends Record<string, any> { }
const queryString = "type:Reference AND name:'Info - 1' OR type:Ingredient"
const queryString2 = "type:Reference|Ingredient AND name:'Info - 1'"
const queryString3 = "type:Reference|Ingredient name:'Info - 1'"
const queryString4 = "type:Reference|Ingredient"
const queryString5 = `name:"Info - 1"`
const queryString6 = `(type:Reference & name:"Info - 1") | (type:Ingredient)`
const queryString7 = `subType:Slime OR type:Salt OR name:Chef`
// this is pretty sweet
const queryString8 = `starterDeck:A|B|C|D|E|F AND subType:Slime OR type:Reference`
const regex = new RegExp(/([^" ]*"[^"]+")|\S+/gm)
const extractGroups = new RegExp(/(\([^)]*\))/gm)
const extractConditionsAndOperators = new RegExp(/([^" &]*"[^"&]+")|\s([&|\|])\s|(\S+)/gm)

// make a Cond from a single token
function makeCond(s: string): Cond<Filterable> {
  const [k, v] = s.split(":")
  // sauce: allow listing out a list of options for a key
  const ors = v.replaceAll(`"`, "").split("|")

  return orAll(ors.map(o => new Cond<Filterable>(a => a[k] === o)))
}
// make a Cond from a string containing many tokens, AND them together
function parseQuery(s: string): Cond<Filterable> {
  const tokens = [...s.matchAll(regex)]
  console.log(tokens)
  return andAll(tokens.map(t => makeCond(t[0])))
}
// AND together multiple conditions
function andAll<A>(conditions: Cond<A>[]) {
  return conditions.reduce((final, next) => final.and(next))
}
// OR together multiple conditions
function orAll<A>(conditions: Cond<A>[]) {
  return conditions.reduce((final, next) => final.or(next))
}
// this is heinous
function parseQueryMixed(s: string): Cond<Filterable> {
  const tokens = ["type:ingredient", "OR", `name:"Salt - A"`]
  const x = tokens.reduce((builder, next) => {
    if (next === "AND") {
      // return builder.and //(Cond => Cond)
      const f = (c: Cond<Filterable>) => builder(c).and(c)
      return f
    } else if (next === "OR") {
      // return builder.or //(Cond => Cond)
      return c => builder(c).or(c)
    }
    else { // it's a condition to parse and plug in to builder
      const parsed = makeCond(next)
      // return c: Cond => builder(parsed)  
      return c => builder(parsed)
    }
  }, (c: Cond<Filterable>) => { return c })(new Cond<Filterable>(c => true))
  return x
}
function parseQueryMixedGreedy2(s: string) {
  const [initial, ...rest] = [...s.matchAll(extractConditionsAndOperators)].map(arr => arr[0])
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
function parseQueryMixedGreedy(s: string) {
  const tokens = ["type:Ingredient", "OR", `name:"Salt A"`, "OR", "name:Chef"]
  const [l, o, r] = tokens.slice(0, 3) // first 3 elements. What if there are more?
  //[a,b,c,d,e] => [a,b,c], [d,e]
  //[a,b,c,d,e,f,g] => [a,b,c], [d,e], [f,g]
  // length of tokens must be odd
  //[a] => [a]
  // compute initial condition from first token OR first 3 tokens
  // then attach conditions we find in the list, 2 tokens at a time.
  // or if we always add ["true", "AND"] to the front of the tokens
  // [c1, &, c2, |, c3]
  // take first item as initial check
  // process remaining pairs
  // console.log(l, o, r)
  const left = makeCond(l)
  const right = makeCond(r)
  // console.log(left.check({ type: "Ingredient" }))
  // console.log(right.check({ name: "Salt A" }))
  switch (o) {
    case "AND":
      return left.and(right)
    case "OR":
      return left.or(right)
    default:
      throw "aahhhhh"
  }
}
const yyyy = parseQuery(queryString5)
const zz = parseQueryMixedGreedy2(queryString8)
const yyy = new Cond<FilterableCard>(c => c.type === "Reference")
  .and(new Cond<FilterableCard>(c => c.name === "Info - 1"))
  .or(new Cond<FilterableCard>(c => c.type === "Ingredient"))

//const eval = <A>(expr: Condition<A>, a: A) => expr(a)
export function evalOp<A>(expr: Operand<A>): boolean {
  // if it's an Expression, evalOp a and b recursively then combine with op
  if (typeof (expr) === "object") {
    const left = evalOp(expr.a)
    const right = evalOp(expr.b)
    switch (expr.operator) {
      case "AND":
        return left && right
      case "OR":
        return left || right
    }
  } else {
    return expr // base case, just return the boolean
  }
}

const x = evalOp<FilterableCard>({
  a: true, operator: "AND", b: false
})

const y = (c: FilterableCard) => evalOp<FilterableCard>({
  a: {
    a: c.type === "Reference", operator: "AND", b: c.name === "Info - 1"
  },
  operator: "OR",
  b: c.type === "Ingredient"
})

const yy = (c: FilterableCard) => evalOp<FilterableCard>(
  combine(
    [
      combine([c.type === "Reference", c.name === "Info - 1"], "AND"),
      c.type === "Ingredient"
    ],
    "OR"
  ))

const combine = <A>(conditions: Operand<A>[], op: Operator): Operand<A> => {
  return conditions.reduce((prev, curr) => {
    return {
      a: prev,
      operator: op,
      b: curr
    }
  }, true)
}

export const demo = { x, y, yyy, yyyy, zz }

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