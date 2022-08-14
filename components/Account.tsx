import { useEnsName } from 'wagmi'
import { truncateAddress } from 'utils/index'

type AccountProps = {
  address: string
  length?: number
  isEns?: boolean
  alwaysAvatar?: boolean
}

const Account = ({ address, length = 4, isEns = false, alwaysAvatar = false }: AccountProps) => {
  const { data } = useEnsName({
    address,
    enabled: !isEns,
  })

  return (
    <span className={`flex items-center ${data && data.length > 13 ? 'justify-center lg:justify-start' : 'justify-center'}`}>
      <img
        className={`h-6 w-6 mr-2 rounded-full ${alwaysAvatar ? '' : 'inline lg:hidden xl:inline'}`}
        src={`https://cdn.stamp.fyi/avatar/${address}`}
      />
      <span className="truncate">{data ? data : isEns ? address : truncateAddress(address, length)}</span>
    </span>
  )
}

export default Account
