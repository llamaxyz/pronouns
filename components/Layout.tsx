import { ReactElement } from 'react'

type LayoutProps = {
  children: ReactElement<SectionProps> | Array<ReactElement<SectionProps>>
  className?: string
}

type SectionProps = {
  children: React.ReactNode
  className?: string
  width: number
}

const columnWidths = ['lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-4', 'lg:col-span-5']

const Layout = ({ className = '', children }: LayoutProps) => {
  return <div className={`grid grid-cols-12 gap-x-6 px-10 md:mx-auto max-w-none md:max-w-3xl lg:max-w-none ${className}`}>{children}</div>
}

const Section = ({ children, width, className = '' }: SectionProps) => (
  <div className={`col-span-full ${columnWidths[width - 1]} py-6 ${className}`}>{children}</div>
)

const pkg = Object.assign(Layout, {
  Section,
})

export { pkg as Layout }
