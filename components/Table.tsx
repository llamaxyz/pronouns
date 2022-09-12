import React from 'react'
import Image from 'next/image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import loadingNoun from 'public/loading-skull-noun.gif'
import Progress from 'components/Progress'
import Skeleton from 'components/Skeleton'
import { capitalize } from 'utils/index'
import { NounSeed, Status } from 'utils/types'
import { useTraitStats } from 'utils/hooks'
import { EncodedImage } from '@nouns/assets/dist/types'

type TableProps = {
  seed?: NounSeed
  status: Status
  id?: number
}

const getProgress = (pct: number, status: Status) => {
  const rarity = pct > 40 ? 'Common' : pct > 10 ? 'Medium' : 'Rare'
  return {
    name: '',
    value: <Progress pct={pct} status={status} rarity={rarity} />,
  }
}

const generateTableData = (
  apiData: Record<string, Record<string, number>>,
  status: Status,
  nounParts?: {
    name: string
    image: string
  }[]
) => {
  const traitArr = ['background', 'body', 'accessory', 'head', 'glasses']
  const rowsWithTraits = traitArr.map((trait, j) => [
    { name: capitalize(trait), value: nounParts?.[j].name },
    { name: 'Sale', value: '' },
    { name: 'Population', value: '' },
    { name: '', value: <Progress rarity="Common" /> },
  ])
  if (apiData) {
    return rowsWithTraits.map((row, j) =>
      row.map((rowData, i) => {
        if (i === 1) {
          const amount = apiData[traitArr[j]]?.median_sale_price?.toFixed(2)
          return { ...rowData, value: amount ? `Ξ ${amount}` : '—' }
        }
        if (i === 2) {
          return { ...rowData, value: apiData[traitArr[j]]?.total_occurrence ?? '—' }
        }
        if (i === 3) {
          return getProgress(apiData[traitArr[j]]?.pct_occurrence, status)
        }
        return rowData
      })
    )
  }
  return rowsWithTraits
}

const generateImage = (parts: EncodedImage[], background: string, id: number) =>
  `data:image/svg+xml;base64,${window.btoa(buildSVG(id === -1 ? [] : [parts[id]], ImageData.palette, background))}`

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
  const tableData = generateTableData(data?.body, dataStatus, nounParts)

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
              {data.name ? (
                <Skeleton
                  loading={dataStatus !== 'success'}
                  loadingElement={<div className="animate-pulse h-3 mb-1 bg-white/20 rounded" />}
                >
                  {React.isValidElement(data.name) ? (
                    data.name
                  ) : (
                    <div className="uppercase text-white/60 tracking-wider text-xs">{data.name}</div>
                  )}
                </Skeleton>
              ) : null}

              {React.isValidElement(data.value) ? (
                data.value
              ) : (
                <Skeleton loading={dataStatus !== 'success'} loadingElement={<div className="animate-pulse h-6 bg-white/20 rounded" />}>
                  <div className="font-medium text-md truncate">{data.value}</div>
                </Skeleton>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default React.memo(Table)
