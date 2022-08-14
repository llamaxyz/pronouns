import { useEnsName } from 'wagmi'
import { truncateAddress } from 'utils/index'

type AccountProps = {
  address: string
  length?: number
  alwaysAvatar?: boolean
}

const Account = ({ address, length = 4, alwaysAvatar = false }: AccountProps) => {
  const { data } = useEnsName({
    address,
  })

  return (
    <span className="flex items-center justify-center">
      <img
        className={`h-6 w-6 mr-2 rounded-full ${alwaysAvatar ? '' : 'hidden xl:inline'}`}
        src={`https://cdn.stamp.fyi/avatar/${address}`}
      />
      <span>{data || truncateAddress(address, length)}</span>
    </span>
  )
}

export default Account
