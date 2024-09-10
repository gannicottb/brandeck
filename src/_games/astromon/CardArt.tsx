import Image from "next/image"
export function CardArt({ src, alt }: { src: string, alt: string }) {
  return <Image
    src={src}
    fill={true}
    alt={alt}
    referrerPolicy="no-referrer"
    priority
    sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
  />
}