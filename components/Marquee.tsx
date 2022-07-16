import { ChevronDoubleRightIcon } from '@heroicons/react/outline'

type position = 'top' | 'bottom'

type MarqueeProps = {
  text: string
  position?: position
}

const Marquee = ({ text, position = 'bottom' }: MarqueeProps) => (
  <div className={`fixed flex py-2 ${position === 'top' ? 'top-0' : 'bottom-0'} overflow-x-hidden`}>
    <div className="animate-marquee whitespace-nowrap">
      {[...Array(30)].map(i => (
        <span key={i} className="inline-flex items-center">
          <span className="mx-4">{text}</span>
          <ChevronDoubleRightIcon className="h-4 w-4 text-white inline transition hover:translate-x-0.5" />
        </span>
      ))}
    </div>
    <div className={`fixed py-2 ${position === 'top' ? 'top-0' : 'bottom-0'} animate-marquee2 whitespace-nowrap`}>
      {[...Array(30)].map(i => (
        <span key={i} className="inline-flex items-center">
          <span className="mx-4">{text}</span>
          <ChevronDoubleRightIcon className="h-4 w-4 text-white inline transition hover:translate-x-0.5" />
        </span>
      ))}
    </div>
  </div>
)

export default Marquee
