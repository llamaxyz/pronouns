import { withOGImage } from 'next-api-og-image'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import { NounSeed } from 'utils/types'

interface QueryParams {
  background: string
}

function someLongRunningValueGetter() {
  return new Promise((resolve: (value: string) => void) => {
    setTimeout(() => {
      resolve("Value in setTimeout's (500ms) callback")
    }, 500)
  })
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
      const noun = { background, body, accessory, head, glasses }
      console.log(renderNoun(noun))
      const value = await someLongRunningValueGetter()
      return (
        <html>
          <body>
            <div className="container">
              <img src={renderNoun(noun)} height={50} width={50} alt="" />
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
