import { useEffect } from 'react'

const useTitle = (title) => {
  useEffect(() => {
    document.title = title ? `StudyNook \u2013 ${title}` : 'StudyNook'
  }, [title])
}

export default useTitle
