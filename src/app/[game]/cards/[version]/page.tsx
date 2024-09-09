import dynamic from 'next/dynamic'
import { parseVersion, Version } from '@/app/lib/Version'
import { first } from '@/app/lib/Utils'
import { CardPageProps } from '@/app/lib/CardPageProps'
import Controls from '@/app/components/Controls'
import { GameVersion } from '@/app/lib/GameVersion'
import { FilterProps } from '@/app/lib/Filters'

export default async function Page({ params, searchParams }: {
  params: { game: string, version: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const ver: Version = parseVersion(params.version)
  const gameVer: GameVersion = { gameName: params.game, version: ver }
  const size: string = first(searchParams["size"]) || "print"
  const filters: FilterProps = {
    // types: (first(searchParams.types || [])?.split(",") || []).map(t => t.toLowerCase()),
    // names: (first(searchParams.names || [])?.split(",") || []).map(t => t.toLowerCase())
    query: first(searchParams.q) || ""
  }

  // We assume that all game+version combinations will have a Cards component that takes GameVersion
  const Cards = dynamic<CardPageProps>(
    () => import(`@/_games/${params.game}/v${ver.major}/Cards`)
  )
  return <div>
    <Controls gameVer={gameVer} />
    <Cards gameVer={gameVer} size={size} filters={filters} />
  </div>
}