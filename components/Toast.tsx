import React from 'react'
import { XCircleIcon } from '@heroicons/react/solid'
import { styled, keyframes } from '@stitches/react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import Paragraph from 'components/Paragraph'

type ToastProps = {
  children: React.ReactNode
  open: boolean
  message: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + 24px))` },
  to: { transform: 'translateX(0)' },
})

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + 24px))` },
})

const StyledToast = styled(ToastPrimitive.Root, {
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  display: 'grid',
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: 'auto max-content',
  columnGap: 15,
  alignItems: 'center',

  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in`,
    },
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },
    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out',
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-out`,
    },
  },
})

const Toast = ({ children, open, setOpen, message }: ToastProps) => (
  <ToastPrimitive.Provider swipeDirection="right">
    {children}
    <StyledToast
      className="border border-2 border-neutral-600 rounded-lg bg-neutral-800 flex p-4 outline-none"
      open={open}
      onOpenChange={setOpen}
    >
      <ToastPrimitive.Title className="flex items-center gap-x-2 font-medium">
        <XCircleIcon className="w-8 h-8 text-red-400" />
        <Paragraph className="tracking-wider">{message}</Paragraph>
      </ToastPrimitive.Title>
    </StyledToast>
    <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 z-50 gap-2.5 m-0 outline-none list-none" />
  </ToastPrimitive.Provider>
)

export default Toast
