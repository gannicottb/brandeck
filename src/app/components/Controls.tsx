"use client"
import { useState } from "react";
import { GameVersion } from "../lib/GameVersion";

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

  return (
    <button
      className="border-2 bg-white text-black p-1"
      onClick={(e) => {
        e.preventDefault()
        setLoading(true)
        doGenerate(gameVer).finally(() => setLoading(false))
      }
      }>{isLoading ? "Generating..." : "Generate"}</button>
  )
}