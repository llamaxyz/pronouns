import React from 'react'
import { InformationCircleIcon } from '@heroicons/react/solid'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const Tooltip = ({ text }: { text: string }) => {
  return (
    <TooltipPrimitive.Provider delayDuration={50}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <InformationCircleIcon className="h-4 w-4 inline hover:text-white/50 transition ease-in-out" />
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="bg-neutral-800 px-3 py-2 max-w-[14rem] text-white text-sm tracking-wide rounded shadow-sm animate-tooltip opacity-0 ease-in-out"
            sideOffset={5}
          >
            {text}
            <TooltipPrimitive.Arrow className="fill-neutral-800" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default Tooltip