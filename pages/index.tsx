import type { NextPage } from 'next'
import Marquee from 'components/Marquee'
import Nav from 'components/Nav'
import Title from 'components/Title'
import Paragraph from 'components/Paragraph'
import Signup from 'components/Signup'

const Home: NextPage = () => (
  <div className="bg-ui-black text-white">
    <Nav />
    <div className="py-6 px-10">
      <h1>noun</h1>
    </div>
  </div>
)

export default Home
