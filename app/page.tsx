'use client'

import { Album, AlbumResponse } from '@/types/album'
import { useState, useEffect } from 'react'

const API_ENDPOINT = 'https://itunes.apple.com/search?term=michael+jackson&entity=album'

export default function Home() {
  const [error, setError] = useState<any>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINT)
      const { results } = await res.json() as unknown as AlbumResponse
      setAlbums(results)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Tryp Data Table</h1>
      <pre>{JSON.stringify(albums, null, 2)}</pre>
    </main>
  )
}
