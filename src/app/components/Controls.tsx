"use client"
import { InputHTMLAttributes, useState } from "react";
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

const FilterBox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input
    className="border-2 bg-white text-black p-1 w-96"
    autoFocus={true}
    {...props}
  />
}

const HelpButton = () => {
  const [hidden, setHidden] = useState(true)
  return <div>
    <button className="border-2 bg-white text-black p-1"
      onClick={() => setHidden(!hidden)}
    >?</button>
    {!hidden && <code className="text-xs">(key:value AND key2:value|value2|value3 OR key3:"value with spaces")</code>}
  </div>
}

export default function Controls({ gameVer, filterQuery }: { gameVer: GameVersion, filterQuery: string }) {
  const [isLoading, setLoading] = useState(false)

  const [filterBuilder, setFilterBuilder] = useState({ query: filterQuery } as FilterProps)
  const filterLink = filterBuilder.query.length > 0 ? `?q=${filterBuilder.query}` : ""

  return (
    <div className="print:hidden flex flex-col">
      <div>
        <Link className="p-1" href={"/"}>{"<= Home"}</Link>
        <button
          className="border-2 bg-white text-black p-1"
          onClick={(e) => {
            e.preventDefault()
            setLoading(true)
            doGenerate(gameVer).finally(() => setLoading(false))
          }
          }>{isLoading ? "Generating..." : "Generate"}</button>
      </div>
      <div className="flex">
        <FilterBox
          value={filterBuilder.query}
          onChange={ev => setFilterBuilder({ query: ev.currentTarget.value })}
          onKeyUp={ev => ev.key === "Enter" && (window.location.href = filterLink)}
        />
        <Link href={filterLink} className={"text-cyan-600 hover:underline p-1"}>
          Filter
        </Link>
        <HelpButton />
      </div>
    </div>
  )
}