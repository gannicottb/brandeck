"use client"
import { InputHTMLAttributes, useState } from "react";
import { GameVersion } from "../lib/GameVersion";
import Link from "next/link";
import { FilterProps } from "../lib/Filters";
import { useRouter } from "next/navigation";
import { IoRefreshOutline } from "react-icons/io5";

const GenerateButton = ({ gameVer }: { gameVer: GameVersion }) => {
  const [isLoading, setIsLoading] = useState(false)
  async function doGenerate(gameVer: GameVersion) {
    const origin = window.location.origin
    const res = await fetch(`${origin}/api/generate`, {
      method: "POST",
      body: JSON.stringify(gameVer)
    });
    const text = await res.text();
    return console.log(text);
  }
  return <button
    className="border-2 bg-white text-black p-1"
    onClick={(e) => {
      e.preventDefault()
      setIsLoading(true)
      doGenerate(gameVer).finally(() => setIsLoading(false))
    }
    }>{isLoading ? "Generating..." : "Generate"}</button>
}

const RefreshButton = ({ gameVer }: { gameVer: GameVersion }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  async function doRefresh(gameVer: GameVersion) {
    const res = await fetch(`${window.location.origin}/api/refresh`, {
      method: "POST",
      body: JSON.stringify(gameVer)
    });
    const text = await res.text();
    return console.log(text);
  }

  return <div className="ml-auto">
    {isLoading && <span>Refreshing...</span>}<button
      className={`border-2 ${isLoading ? "bg-slate-400" : "bg-green-400"} p-1`}
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault()
        setIsLoading(true)
        console.log("refreshing cache...")
        doRefresh(gameVer).finally(() => {
          router.refresh()
          setIsLoading(false)
        })
      }}
    >
      <IoRefreshOutline />
    </button>
  </div>
}
interface FilterBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  setInput: (s: string) => void
}
const FilterBox = ({ setInput, ...props }: FilterBoxProps) => {
  const ClearInput = () => <a className="absolute pt-1 right-1 z-0 cursor-pointer"
    onClick={() => setInput("")}
  >x</a>
  return <div className="relative">
    <ClearInput />
    <input
      className="border-2 bg-white text-black p-1 w-96"
      autoFocus={true}
      onChange={(ev) => setInput(ev.currentTarget.value)}
      {...props}
    />
  </div>
}

const HelpButton = () => {
  const [hidden, setHidden] = useState(true)
  return <div>
    <button className="border-2 bg-white text-black p-1"
      onClick={() => setHidden(!hidden)}
    >?</button>
    {!hidden && <code className="text-xs">(key:value AND key2!value|value2 OR key3:&quot;value with spaces&quot;)</code>}
  </div>
}
interface ControlsProps {
  gameVer: GameVersion
  filterQuery: string
}
export default function Controls({ gameVer, filterQuery }: ControlsProps) {
  const [filterBuilder, setFilterBuilder] = useState({ query: filterQuery } as FilterProps)
  const filterLink = () => {
    const withoutQueryParam = window.location.search
      .replace("?", "")
      .split("&")
      .filter(s => !s.startsWith("q=") && s.length > 0)
    const hrefWithoutParams = window.location.origin + window.location.pathname
    const filterParam = filterBuilder.query.length > 0 ? [`q=${filterBuilder.query}`] : []
    return [hrefWithoutParams, filterParam.concat(withoutQueryParam).join("&")].join("?")
  }

  return (
    <div className="print:hidden flex flex-col">
      <div className="flex">
        <Link className="p-1" href={"/"}>{"<= Home"}</Link>
        <GenerateButton gameVer={gameVer} />
        <RefreshButton gameVer={gameVer} />
      </div>
      <div className="flex">
        <FilterBox
          value={filterBuilder.query}
          setInput={s => setFilterBuilder({ query: s })}
          onKeyUp={ev => ev.key === "Enter" && (window.location.href = filterLink())}
        />
        <button
          className={"text-cyan-600 p-1 border-2"}
          onClick={() => window.location.href = filterLink()}
        >
          Filter
        </button>
        <HelpButton />
      </div>
    </div>
  )
}