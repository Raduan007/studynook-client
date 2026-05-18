import { useEffect } from 'react'

const useTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | StudyNook` : 'StudyNook'
  }, [title])
}

export default useTitle
