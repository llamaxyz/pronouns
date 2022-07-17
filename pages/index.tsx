import type { NextPage } from 'next'
import Marquee from 'components/Marquee'
import Title from 'components/Title'
import Paragraph from 'components/Paragraph'
import Signup from 'components/Signup'

const Home: NextPage = () => (
  <div className="bg-black text-white flex flex-col min-h-screen items-center justify-center space-y-20">
    <div className="uppercase">
      <Title level={1} className="text-malachite-green">
        Pronouns
      </Title>
      <Paragraph className="text-center">A Nouns Experience for Power Users</Paragraph>
    </div>
    <Signup />
    <Marquee text="A Llama X Vector Collaboration" />
  </div>
)

export default Home
