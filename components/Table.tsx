import Image from 'next/image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import loadingNoun from 'public/loading-skull-noun.gif'
import Progress from 'components/Progress'
import { NounSeed, Status } from 'utils/types'

type TableProps = {
  seed?: NounSeed
  status: Status
}

const tableData = [
  [
    { name: 'Background', value: 'Cool' },
    { name: 'Floor', value: 'Ξ 98.73' },
    { name: 'Population', value: '150' },
    { name: <div className="text-white/60 tracking-wider text-xs mb-1.5">Common</div>, value: <Progress /> },
  ],
  [
    { name: 'Body', value: 'Cool' },
    { name: 'Floor', value: 'Ξ 98.73' },
    { name: 'Population', value: '150' },
    { name: <div className="text-white/60 tracking-wider text-xs mb-1.5">Common</div>, value: <Progress /> },
  ],
  [
    { name: 'Accessory', value: 'Cool' },
    { name: 'Floor', value: 'Ξ 98.73' },
    { name: 'Population', value: '150' },
    { name: <div className="text-white/60 tracking-wider text-xs mb-1.5">Common</div>, value: <Progress /> },
  ],
  [
    { name: 'Head', value: 'Cool' },
    { name: 'Floor', value: 'Ξ 98.73' },
    { name: 'Population', value: '150' },
    { name: <div className="text-white/60 tracking-wider text-xs mb-1.5">Common</div>, value: <Progress /> },
  ],
  [
    { name: 'Glasses', value: 'Cool' },
    { name: 'Floor', value: 'Ξ 98.73' },
    { name: 'Population', value: '150' },
    { name: <div className="text-white/60 tracking-wider text-xs mb-1.5">Common</div>, value: <Progress /> },
  ],
]

const renderPart = (seed: NounSeed, id: number) => {
  const { parts, background } = getNounData(seed)
  return `data:image/svg+xml;base64,${window.btoa(buildSVG(id === -1 ? [] : [parts[id]], ImageData.palette, background))}`
}

const Table = ({ seed, status }: TableProps) => {
  const bg = seed?.background.toString() === '0' ? 'bg-cool' : 'bg-warm'
  return (
    <div className="min-w-[480px] gap-y-4 flex flex-col">
      {tableData.map((row, i) => (
        <div key={i} className="flex gap-x-6 overflow-x-auto">
          <div className={`${bg} flex w-10 h-10 rounded text-black`}>
            <Image
              className="rounded"
              alt={`Noun`}
              width={40}
              height={40}
              src={status === 'loading' || seed === undefined ? loadingNoun : renderPart(seed, i - 1)}
            />
          </div>
          {row.map((data, i) => (
            <div className="flex-1" key={i}>
              {typeof data.name === 'string' ? (
                <div className="uppercase text-white/60 tracking-wider text-xs">{data.name}</div>
              ) : (
                data.name
              )}
              {typeof data.value === 'string' ? <div className="font-medium text-md">{data.value}</div> : data.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Table
