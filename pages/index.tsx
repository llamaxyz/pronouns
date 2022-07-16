import type { NextPage } from 'next'
import Marquee from 'components/Marquee'
import Title from 'components/Title'
import Paragraph from 'components/Paragraph'
import Signup from 'components/Signup'

const Home: NextPage = () => (
  <div className="bg-black text-white text-center flex flex-col min-h-screen items-center justify-center space-y-20">
    <div>
      <Title level={1}>Pronouns</Title>
      <Paragraph>A Nouns Experience for Power Users</Paragraph>
    </div>
    <Signup />
    <Marquee text="A Llama/Vector/Nouns Interaction" />
  </div>
)

export default Home
