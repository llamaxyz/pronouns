import Title from 'components/Title'
import Connect from 'components/Connect'

const Nav = () => {
  return (
    <div className="py-6 px-10 flex justify-between items-center border-b border-b-white/10">
      <Title level={6} className="text-malachite-green uppercase">
        Pronouns
      </Title>
      <Connect />
    </div>
  )
}

export default Nav
