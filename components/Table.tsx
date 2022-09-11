import React from 'react'
import Image from 'next/image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import loadingNoun from 'public/loading-skull-noun.gif'
import Progress from 'components/Progress'
import { NounSeed, Status } from 'utils/types'
import { useTraitStats } from 'utils/hooks'

type TableProps = {
  seed?: NounSeed
  status: Status
  id: number
}

const rawTableData = [
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

const generateImage = (parts, background, id: number) =>
  `data:image/svg+xml;base64,${window.btoa(buildSVG(id === -1 ? [] : [parts[id]], ImageData.palette, background))}`
const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1)

const renderNounParts = (seed: NounSeed) => {
  const { parts, background } = getNounData(seed)
  return [
    {
      name: background === 'e1d7d5' ? 'Warm' : 'Cool',
      image: generateImage(parts, background, -1),
    },
    {
      name: capitalize(parts[0].filename.replace('body-', '')),
      image: generateImage(parts, background, 0),
    },
    {
      name: capitalize(parts[1].filename.replace('accessory-', '')),
      image: generateImage(parts, background, 1),
    },
    {
      name: capitalize(parts[2].filename.replace('head-', '')),
      image: generateImage(parts, background, 2),
    },
    {
      name: capitalize(parts[3].filename.replace('glasses-', '')),
      image: generateImage(parts, background, 3),
    },
  ]
}

const Table = ({ seed, status, id }: TableProps) => {
  const { data, status: dataStatus } = useTraitStats(seed as unknown as Record<string, string>, id)
  const bg = seed?.background.toString() === '0' ? 'bg-cool' : 'bg-warm'
  const nounParts = seed && renderNounParts(seed)
  const tableData = rawTableData.map((row, j) => row.map((data, i) => (i !== 0 ? data : { name: data.name, value: nounParts?.[j].name })))
  return (
    <div className="min-w-[480px] grid grid-cols-[40px_repeat(3,_minmax(0,_1fr))_auto] gap-4">
      {tableData.map((row, i) => (
        <React.Fragment key={i}>
          <div className={`${bg} flex w-10 h-10 rounded text-black`}>
            <Image
              className="rounded"
              alt={`Noun`}
              width={40}
              height={40}
              src={status === 'loading' || seed === undefined || nounParts === undefined ? loadingNoun : nounParts?.[i].image}
            />
          </div>
          {row.map((data, j) => (
            <div key={j}>
              {typeof data.name === 'string' ? (
                <div className="uppercase text-white/60 tracking-wider text-xs">{data.name}</div>
              ) : (
                data.name
              )}
              {typeof data.value === 'string' ? <div className="font-medium text-md truncate">{data.value}</div> : data.value}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default React.memo(Table)
