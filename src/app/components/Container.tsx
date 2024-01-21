import React from "react"
import { ReactNode, Fragment } from "react"

// Generic component that injects print breaks for cards
export function Container({ cards }: { cards: ReactNode[] }) {
  return (
    <div id='container' className="block max-w-[1125px] box-border">
      {cards.map((c, i) => {
        return <Fragment key={i}>
          {c}
          {(i > 0 && i % 9 == 0) && <div className="break-before-all" />}
        </Fragment>
      })}
    </div>
  )
}