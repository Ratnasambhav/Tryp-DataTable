'use client'


import Image from 'next/image'
import { Badge, Link, Tag } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'

import DataTable from '@/components/DataTable'

import type { Album, AlbumResponse } from '@/types/album'

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

  const getHeaders = () => [
    'Artwork',
    'Name',
    'Genre',
    'Release Date',
    'Track Count',
    '',
  ]

  const getRows = () => albums.map((album) => [
    {
      value: renderArtwork(album.artworkUrl100, album.collectionName),
      isNumeric: false,
    },
    {
      value: album.collectionName,
      isNumeric: false,
    },
    {
      value: renderGenre(album.primaryGenreName),
      isNumeric: false,
    },
    {
      value: renderReleaseDate(album.releaseDate),
      isNumeric: false,
    },
    {
      value: renderTrackCount(album.trackCount),
      isNumeric: false,
    },
    {
      value: renderLink(album.collectionViewUrl),
      isNumeric: false,
    },
  ])

  const renderArtwork = (artworkUrl: string, alt: string) => {
    const imageStyle = {
      borderRadius: '5px',
      boxShadow: '20px 20px 60px #BEBEBE, -20px -20px 60px #FFFFFF',
    }
    return (
      <Image src={artworkUrl} alt={alt} width={72} height={72} style={imageStyle} />
    )
  }

  const renderReleaseDate = (releaseDate: string) => {
    const date = new Date(releaseDate)
    return (
      <span>{date.toLocaleDateString()}</span>
    )
  }

  const renderTrackCount = (trackCount: number) => (
    <Badge variant='subtle' borderRadius='full'>{trackCount}</Badge>
  )

  const renderGenre = (genre: string) => (
    <Tag variant='solid' borderRadius='full'>{genre}</Tag>
  )

  const renderLink = (url: string) => (
    <Link href={url} isExternal>Listen <ExternalLinkIcon mb='5px' /></Link>
  )

  return (
    <main>
      <DataTable headers={getHeaders()} rows={getRows()} caption="Michael Jackson's Albums" />
    </main>
  )
}
