import Image from 'next/image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import loadingNoun from 'public/loading-skull-noun.gif'
import { Status } from 'utils/types'

interface NounSeed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

type NounProps = {
  seed?: NounSeed
  id: number | undefined
  status: Status
}

const renderNoun = (seed: NounSeed) => {
  const { parts, background } = getNounData(seed)
  return `data:image/svg+xml;base64,${window.btoa(buildSVG(parts, ImageData.palette, background))}`
}

const Noun = ({ seed, status, id }: NounProps) => {
  return (
    <div className={`${seed?.background.toString() === '0' ? 'bg-cool' : 'bg-warm'} flex justify-center rounded-lg h-64 text-black`}>
      <Image
        alt={`Noun ${id}`}
        width={256}
        height={256}
        src={status === 'loading' || seed === undefined ? loadingNoun : renderNoun(seed)}
      />
    </div>
  )
}

export default Noun
