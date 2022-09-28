import React from 'react'

const useRoveFocus = size => {
  const [currentFocus, setCurrentFocus] = React.useState(0)

  const handleKeyDown = React.useCallback(
    e => {
      if (e.keyCode === 40) {
        // Down arrow
        e.preventDefault()
        setCurrentFocus(currentFocus === size - 1 ? 0 : currentFocus + 1)
      } else if (e.keyCode === 38) {
        // Up arrow
        e.preventDefault()
        setCurrentFocus(currentFocus === 0 ? size - 1 : currentFocus - 1)
      }
    },
    [size, currentFocus, setCurrentFocus]
  )

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [handleKeyDown])

  return [currentFocus, setCurrentFocus]
}

export default useRoveFocus
