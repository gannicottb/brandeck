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
  // TODO: come back to this, I don't think it'll work though?
  const [filterBuilder, setFilterBuilder] = useState({ types: [], names: [] } as FilterProps)

  const addTypeFilter = (type: string) => {
    setFilterBuilder({ ...filterBuilder, types: Array.from(new Set([...filterBuilder.types, type])) })
  }
  const addNameFilter = (name: string) => {
    setFilterBuilder({ ...filterBuilder, names: Array.from(new Set([...filterBuilder.names, name])) })
  }

  const ResetButton = () => {
    return <button
      className="border-2 bg-white text-black p-1"
      onClick={(e) => {
        e.preventDefault()
        setFilterBuilder({ types: [], names: [] })
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

  const filterLink = `?types=${filterBuilder.types.join(",")}&names=${filterBuilder.names.join(",")}`

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
      <FilterBox label={"Types"} onEnter={addTypeFilter} />
      <FilterBox label={"Names"} onEnter={addNameFilter} />
      <ResetButton />
      <div>Filter: <Link href={filterLink} className={"text-cyan-600 hover:underline"}>
        {filterLink}
      </Link></div>
    </div>
  )
}