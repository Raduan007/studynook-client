import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { normalizeRoom } from '../api/normalizeRoom'

/**
 * Fetches all rooms from the backend.
 * Returns { rooms, loading, error }.
 */
const useRooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchRooms = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await axios.get('/rooms')
        if (!cancelled) setRooms(Array.isArray(data) ? data.map(normalizeRoom) : [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load rooms')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRooms()

    return () => {
      cancelled = true
    }
  }, [])

  return { rooms, loading, error }
}

export default useRooms
