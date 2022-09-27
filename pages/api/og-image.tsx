import { withOGImage } from 'next-api-og-image'
import Image from 'next/image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import { NounSeed } from 'utils/types'

interface QueryParams {
  background: string
}

const style = `
  body {
    font-family: 'Inter', sans-serif;
  }
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

const renderNoun = (seed: NounSeed) => {
  const { parts, background } = getNounData(seed)
  return `data:image/svg+xml;base64,${Buffer.from(buildSVG(parts, ImageData.palette, background)).toString('base64')}`
}

export default withOGImage<'query', QueryParams>({
  template: {
    react: async ({ background, body, accessory, head, glasses }) => {
      const noun = {
        background: parseInt(background),
        body: parseInt(body),
        accessory: parseInt(accessory),
        head: parseInt(head),
        glasses: parseInt(glasses),
      }
      return (
        <html>
          <head>
            <style dangerouslySetInnerHTML={{ __html: style }} />
            <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
          </head>
          <body>
            <div className="container">
              <div className="flex justify-center h-64 rounded-lg text-black bg-black">
                <Image width={256} height={256} src={renderNoun(noun)} />
              </div>
              <h1>{background}</h1>
              <h1>{body}</h1>
              <h1>{accessory}</h1>
              <h1>{head}</h1>
              <h1>{glasses}</h1>
            </div>
          </body>
        </html>
      )
    },
  },
  dev: {
    inspectHtml: false,
  },
})
