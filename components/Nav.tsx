import Title from 'components/Title'
import Button from 'components/Button'

const Nav = () => {
  return (
    <div className="py-6 px-10 flex justify-between items-center border-b border-b-white/10">
      <Title level={6} className="text-malachite-green uppercase">
        Pronouns
      </Title>
      <Button>Connect</Button>
    </div>
  )
}

export default Nav
