import dynamic from 'next/dynamic'
import { Version } from '@/app/lib/Version'
import { first, parseVersion } from '@/app/lib/Utils'
import { CardPageProps } from '@/app/lib/CardPageProps'

export default async function Page({ params, searchParams }: {
  params: { game: string, version: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const ver: Version = parseVersion(params.version)
  const size: string = first(searchParams["size"]) || "print"

  // We assume that all game+version combinations will have a Cards component that takes GameVersion
  const Cards = dynamic<CardPageProps>(
    () => import(`@/_games/${params.game}/v${ver.major}/Cards`)
  )
  return <Cards gameVer={{ gameName: params.game, version: ver }} size={size} />
}