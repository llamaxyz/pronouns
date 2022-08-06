import type { NextPage } from 'next'
import Nav from 'components/Nav'

const Home: NextPage = () => (
  <div className="bg-ui-black text-white">
    <Nav />
    <div className="py-6 px-10">
      <h1>noun</h1>
    </div>
  </div>
)

export default Home
