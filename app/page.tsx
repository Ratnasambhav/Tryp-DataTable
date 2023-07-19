'use client'

import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Box,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';

import DataTable, { DataTableCell } from '../components/DataTable';
import useDebounce from '../hooks/useDebounce';
import { formatDate } from '../utils';

import type { NextPage } from 'next';
import type { Album, AlbumResponse } from '@/types/album';

const DEFAULT_ARTIST = 'Björk';
const ALBUM_ENTITY_NAME = 'album';
const DEFAULT_ALBUMS_PER_PAGE = 10;
const API_ENDPOINT = 'https://itunes.apple.com/search';

const Home: NextPage = () => {
  const [error, setError] = useState<any>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState<boolean>(true);
  const [albumsPerPage, setAlbumsPerPage] = useState<number>(
    DEFAULT_ALBUMS_PER_PAGE
  );
  const [artist, setArtist] = useState<string>(DEFAULT_ARTIST);
  const [tableCaption, setTableCaption] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const searchArtist = useDebounce<string>(artist, 500);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL(API_ENDPOINT);
      url.searchParams.append('term', searchArtist.toLowerCase());
      url.searchParams.append('entity', ALBUM_ENTITY_NAME);
      const res = await fetch(url.toString());
      const { results, resultCount } = (await res.json()) as AlbumResponse;
      setAlbums(results);
      setTableCaption(`${searchArtist}'s Albums (${resultCount} albums)`);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [searchArtist]);

  useEffect(() => {
    searchArtist && fetchAlbums();
  }, [searchArtist, fetchAlbums]);


  const getHeaders = () => [
    'Album',
    'Genre',
    'Release Date',
    'Track Count',
    '',
  ];

  const getColumnsConfig = () => [
    { sortable: true },
    { sortable: true },
    { sortable: true },
    { sortable: true },
    { sortable: false },
  ];

  const getRows = (): DataTableCell[][] =>
    albums.map((album) => [
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
    ]);

  const renderReleaseDate = (releaseDate: string) => {
    return <Text>{formatDate(releaseDate)}</Text>;
  };

  const renderTrackCount = (trackCount: number) => (
    <Badge
      fontSize="sm"
      variant="subtle"
      borderRadius="full"
      colorScheme="orange"
    >
      {trackCount}
    </Badge>
  );

  const renderGenre = (genre: string) => (
    <Text fontSize="md" noOfLines={1}>
      {genre}
    </Text>
  );

  const renderAction = (url: string) => (
    <Button
      size="sm"
      colorScheme="orange"
      onClick={() => window.open(url, '_blank')?.focus()}
    >
      Listen
    </Button>
  );

  const renderAlbumName = (name: string, artworkUrl: string) => {
    const imageStyle = {
      borderRadius: '5px',
      boxShadow: '20px 20px 60px #BEBEBE, -20px -20px 60px #FFFFFF',
    };
    return (
      <Flex alignItems="center" gap="2">
        <Image
          alt={name}
          width={32}
          height={32}
          src={artworkUrl}
          style={imageStyle}
        />
        <Text fontSize="lg" noOfLines={1}>
          {name}
        </Text>
      </Flex>
    );
  };

  const renderForm = () => (
    <Flex gap="4" my="16px" direction="row" wrap="wrap">
      <InputGroup maxW="320px">
        <InputLeftAddon>Artist:</InputLeftAddon>
        <Input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </InputGroup>
      <InputGroup maxW="256px">
        <InputLeftAddon>Albums Per Page:</InputLeftAddon>
        <Input
          type="number"
          value={albumsPerPage}
          isDisabled={!isPaginationEnabled}
          onChange={(e) =>
            setAlbumsPerPage(Math.max(e.target.valueAsNumber, 1))
          }
        />
      </InputGroup>
      <Flex align="center" gap="2">
        <Text fontWeight="semibold">Pagination</Text>
        <Switch
          isChecked={isPaginationEnabled}
          onChange={() => setIsPaginationEnabled((enabled) => !enabled)}
        />
      </Flex>
      <Flex>
        <InputGroup maxW="320px">
          <InputLeftAddon>Search:</InputLeftAddon>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>
    </Flex>
  );

  const renderTable = () => {
    if (isLoading) {
      return (
        <Stack>
          <Skeleton height="56px" />
          <Skeleton height="56px" />
          <Skeleton height="56px" />
          <Skeleton height="56px" />
          <Skeleton height="56px" />
        </Stack>
      );
    }
    if (error) {
      return (
        <Center>
          <Text color="red" fontWeight="bold">
            Sorry, something went wrong :(
          </Text>
        </Center>
      );
    }
    return (
      <DataTable
        sortable
        search={search}
        rows={getRows()}
        caption={tableCaption}
        headers={getHeaders()}
        perPage={albumsPerPage}
        paginated={isPaginationEnabled}
        columnsConfig={getColumnsConfig()}
      />
    );
  };

  return (
    <>
      <Head>
        <title>DataTable</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box m="16px">
          <Text fontSize="3xl" fontWeight="black">
            DataTable
          </Text>
          <Box>{renderForm()}</Box>
          <Box my="24px">{renderTable()}</Box>
        </Box>
      </main>
    </>
  );
};

export default Home;
