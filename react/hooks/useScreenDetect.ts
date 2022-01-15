import React from 'react'

export default function useScreenDetect() {
  const [isMobile, setMobile] = React.useState(false)

  React.useEffect(() => {
    const mobile = window.screen.availWidth < 835
    // const tablet = window.screen.availWidth < 835;
    setMobile(mobile)
  }, [])

  return { isMobile }
}
