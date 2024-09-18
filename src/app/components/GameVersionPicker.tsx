"use client"
import Link from "next/link"
import { Version } from "../lib/Version"
import { Select } from "./Select"
import { useRouter } from "next/navigation"
import { ArrayOps } from "../lib/ArrayOps"

interface GameVersionPickerProps {
  gameName: string
  versions: Version[]
}

export const GameVersionPicker = ({ gameName, versions }: GameVersionPickerProps) => {
  const router = useRouter()
  const makeHref = (v: Version) => {
    return `/${gameName}/cards/${Version.toString(v)}`
  }
  const latest = ArrayOps.of(versions).last()

  return (
    <div key={gameName}>
      <h3 className="font-bold">{gameName}</h3>
      <div className="flex flex-row flex-wrap items-center">
        {latest && <div className="m-1 p-1 border-2 border-white">
          <Link href={makeHref(latest)}>{`${Version.toString(latest)}`}</Link>
        </div>}
        <Select
          className="p-1 border-2 border-white bg-transparent"
          value=""
          onChange={ev =>
            router.push(makeHref(Version.fromString(ev.currentTarget.value)))
          }
          options={
            [{ label: "Older", value: "" }].concat(ArrayOps.of(versions).dropRight(1)
              .reverse()
              .map(v => { return { label: Version.toString(v), value: Version.toString(v) } }
              ))}
        />
      </div>
    </div>
  )
}