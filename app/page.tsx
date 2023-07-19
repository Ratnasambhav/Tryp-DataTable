'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Badge, Button, Box, Flex, Text } from '@chakra-ui/react'

import { formatDate } from '@/utils'
import DataTable, { DataTableCell } from '@/components/DataTable'

import type { Album, AlbumResponse } from '@/types/album'

const API_ENDPOINT = 'https://cors-anywhere.herokuapp.com/https://itunes.apple.com/search?term=michael+jackson&entity=album'

export default function Home() {
  const [error, setError] = useState<any>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINT, { headers: { 'Access-Control-Allow-Origin':'*' }})
      const { results } = await res.json() as unknown as AlbumResponse
      setAlbums(results)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const getHeaders = () => [
    'Album',
    'Genre',
    'Release Date',
    'Track Count',
    '',
  ]

  const getColumnsConfig = () => [
    { sortable: true },
    { sortable: true },
    { sortable: true },
    { sortable: true },
    { sortable: false },
  ]

  const getRows = (): DataTableCell[][] => albums.map((album) => [
    {
      value: album.collectionName,
      content: renderAlbumName(album.collectionName, album.artworkUrl100),
    },
    {
      value: album.primaryGenreName,
      content: renderGenre(album.primaryGenreName),
    },
    {
      value: new Date(album.releaseDate),
      content: renderReleaseDate(album.releaseDate),
    },
    {
      value: album.trackCount,
      content: renderTrackCount(album.trackCount),
    },
    {
      value: null,
      content: renderAction(album.collectionViewUrl),
    },
  ])

  const renderReleaseDate = (releaseDate: string) => {
    return (
      <Text>{formatDate(releaseDate)}</Text>
    )
  }

  const renderTrackCount = (trackCount: number) => (
    <Badge
      fontSize='sm'
      variant='subtle'
      borderRadius='full'
      colorScheme='orange'
    >
      {trackCount}
    </Badge>
  )

  const renderGenre = (genre: string) => (
    <Text fontSize='md' noOfLines={1}>{genre}</Text>
  )

  const renderAction = (url: string) => (
    <Button
      size='sm'
      colorScheme='orange'
      onClick={() => window.open(url, '_blank')?.focus()}
    >
      Listen
    </Button>
  )

  const renderAlbumName = (name: string, artworkUrl: string) => {
    const imageStyle = {
      borderRadius: '5px',
      boxShadow: '20px 20px 60px #BEBEBE, -20px -20px 60px #FFFFFF',
    }
    return (
      <Flex alignItems='center' gap='2'>
        <Image src={artworkUrl} alt={name} width={32} height={32} style={imageStyle} />
        <Text fontSize='lg' noOfLines={1}>{name}</Text>
      </Flex>
    )
  }

  return (
    <Box m='16px'>
      <Text fontSize='3xl' fontWeight='black'>Tryp Data Table</Text>
      <Box my='24px'>
        <DataTable
          sortable
          rows={getRows()}
          headers={getHeaders()}
          columnsConfig={getColumnsConfig()}
          caption={'Michael Jackson\'s Albums'}
        />
      </Box>
    </Box>
  )
}
