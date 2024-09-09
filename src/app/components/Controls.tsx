"use client"
import { useState } from "react";
import { GameVersion } from "../lib/GameVersion";
import Link from "next/link";
import { FilterProps } from "../lib/Filters";

async function doGenerate(gameVer: GameVersion) {
  const origin = window.location.origin
  const res = await fetch(`${origin}/api/generate`, {
    method: "POST",
    body: JSON.stringify(gameVer)
  });
  const text = await res.text();
  return console.log(text);
}

export default function Controls({ gameVer }: { gameVer: GameVersion }) {
  const [isLoading, setLoading] = useState(false)
  // To update this...
  // do you write the raw syntax out?
  // starterDeck:A|B|C|D|E|F AND subType:Slime OR type:Reference
  const [filterBuilder, setFilterBuilder] = useState({ query: "" } as FilterProps)

  // const addTypeFilter = (type: string) => {
  //   setFilterBuilder({ ...filterBuilder, types: Array.from(new Set([...filterBuilder.types, type])) })
  // }
  // const addNameFilter = (name: string) => {
  //   setFilterBuilder({ ...filterBuilder, names: Array.from(new Set([...filterBuilder.names, name])) })
  // }

  const ResetButton = () => {
    return <button
      className="border-2 bg-white text-black p-1"
      onClick={(e) => {
        e.preventDefault()
        setFilterBuilder({ query: "" })
      }}
    >Reset</button>
  }

  const FilterBox = ({ label, onEnter }: { label: string, onEnter: (s: string) => void }) => {
    const [filterInput, setFilterInput] = useState("")
    return <><span>{label}</span><input
      className="border-2 bg-white text-black p-1"
      onKeyDown={(ev) => {
        if (ev.key === "Enter") {
          onEnter(ev.currentTarget.value)
          setFilterInput("")
        }
      }}
      onChange={(ev) => setFilterInput(ev.currentTarget.value)}
      value={filterInput}
    /></>
  }

  // const buildFilterParam = (key: string, values: string[]) =>
  //   values.length > 0 ? `${key}=${values.join(",")}` : ""

  const filterLink = () => {
    // const typesParam = buildFilterParam("types", filterBuilder.types)
    // const namesParam = buildFilterParam("names", filterBuilder.names)
    // const concatenated = [typesParam, namesParam].filter(p => p.length > 0).join("&")
    return filterBuilder.query.length > 0 ? `?q=${filterBuilder.query}` : ""
  }

  return (
    <div className="print:hidden">
      <Link className="p-1" href={"/"}>{"<= Home"}</Link>
      <button
        className="border-2 bg-white text-black p-1"
        onClick={(e) => {
          e.preventDefault()
          setLoading(true)
          doGenerate(gameVer).finally(() => setLoading(false))
        }
        }>{isLoading ? "Generating..." : "Generate"}</button>
      {/* <FilterBox label={"Types"} onEnter={addTypeFilter} /> */}
      {/* <FilterBox label={"Names"} onEnter={addNameFilter} /> */}
      <FilterBox label={"Filter"} onEnter={(s: string) => setFilterBuilder({ query: s })} />
      <ResetButton />
      <div>Filter: <Link href={filterLink()} className={"text-cyan-600 hover:underline"}>
        {filterLink()}
      </Link></div>
    </div>
  )
}