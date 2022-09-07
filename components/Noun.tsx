import Image from 'next/image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import loadingNoun from 'public/loading-skull-noun.gif'
import { NounSeed, Status } from 'utils/types'

type NounProps = {
  seed?: NounSeed
  id: number | undefined
  status: Status
  isSmall?: boolean
}

const renderNoun = (seed: NounSeed) => {
  const { parts, background } = getNounData(seed)
  return `data:image/svg+xml;base64,${window.btoa(buildSVG(parts, ImageData.palette, background))}`
}

const Noun = ({ seed, status, id, isSmall = false }: NounProps) => (
  <div
    className={`${isSmall ? '' : seed?.background.toString() === '0' ? 'bg-cool' : 'bg-warm'} flex justify-center ${
      isSmall ? 'h-6 w-6' : 'h-64 rounded-lg'
    } text-black`}
  >
    <Image
      {...(isSmall ? { style: { borderRadius: '50%' } } : {})}
      key={status}
      alt={`Noun ${id}`}
      width={256}
      height={256}
      src={status === 'loading' || seed === undefined ? loadingNoun : renderNoun(seed)}
    />
  </div>
)

export default Noun
