'use client'

import { useEffect, useState, useMemo } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Button, Center, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'

import { compareObjects } from '@/utils';

export type DataTableCell = {
  value: any
  content: React.ReactNode
}

export type ColumnConfig = {
  sortable: boolean
}

export type DataTableProps = {
  headers: string[]
  rows: DataTableCell[][]
  caption: React.ReactNode
  maxWidth?: string
  columnsConfig?: ColumnConfig[]
  sortable?: boolean
  paginated?: boolean
}

enum SortDirection { ASC, DSC, NONE }

export default function DataTable({
  rows,
  headers,
  caption,
  maxWidth,
  sortable = false,
  paginated = false,
  columnsConfig = [],
}: DataTableProps) {
  const [sortIndex, setSortIndex] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.NONE)
  const [sortedRows, setSortedRows] = useState<DataTableCell[][]>(rows)

  useEffect(() => setSortedRows(rows), [rows])

  useEffect(() => {
    if (!sortIndex) {
      return
    }
    const nextSortedRows = sortRows(sortIndex)
    setSortedRows(() => nextSortedRows)
  }, [sortDirection, sortIndex])

  const handleSort = (index: number) => {
    if (sortIndex !== index) {
      setSortIndex(() => index)
      setSortDirection(SortDirection.ASC)
    } else {
      setSortDirection((dir) => dir === 2 ? 0 : dir + 1);
    }
  }

  const sortRows = (index: number): DataTableCell[][] => {
    console.log("==> SORTING", { index, sortDirection })
    return rows.toSorted((rowA, rowB) => {
      const valueA = rowA.at(index)?.value
      const valueB = rowB.at(index)?.value
      const modifier = sortDirection === SortDirection.ASC ? 1 : -1;
    
      switch (typeof valueA) {
        case 'number':
          return (valueA - valueB) * modifier
        case 'string':
          return valueA.localeCompare(valueB) * modifier
        default:
          return (
            (valueA instanceof Date && valueB instanceof Date)
              ? (valueA > valueB ? 1 : -1)
              : compareObjects(valueA, valueB)
          ) * modifier
      }
    })
  }

  const tableHeaders = useMemo(() => (
    <Thead>
      <Tr>
        {headers.map((header, index) => (
          <Th key={header} px='8px'>
            {
              (!sortable || !columnsConfig.at(index)?.sortable)
                ? (
                  <Text fontSize='md' fontWeight='bold' color='orange.400'>{header}</Text>
                ) : (
                  <Button onClick={() => handleSort(index)} variant='ghost' size='xs' padding={0} _hover={{ backgroundColor: 'inherit' }}>
                    <Flex gap='2' alignItems='center'>
                      <Text fontSize='md' fontWeight='bold'>{header}</Text>
                      <Flex direction='column'>
                        <ChevronUpIcon
                          boxSize={4}
                          color='orange.900'
                          opacity={index === sortIndex && sortDirection === SortDirection.ASC ? 1 : 0.2}
                        />
                        <ChevronDownIcon
                          boxSize={4}
                          color='orange.900'
                          opacity={index === sortIndex && sortDirection === SortDirection.DSC ? 1 : 0.2}
                        />
                      </Flex>
                    </Flex>
                  </Button>
                )
            }
          </Th>
        ))}
      </Tr>
    </Thead>
  ), [columnsConfig, headers, sortIndex, sortDirection])

  if (!sortedRows.length) {
    return (
      <Center>
        <Text fontWeight='bold' fontSize='lg'>No Data</Text>
      </Center>
    )
  }

  return (
    <>
      <TableContainer>
        <Table variant='unstyled' colorScheme='orange' maxWidth={maxWidth}>
          <TableCaption color='orange.500'>{caption}</TableCaption>
          {tableHeaders}
          <Tbody>
            {sortedRows.map((row, index) => (
              <Tr _hover={{ backgroundColor: 'orange.100'  }} key={`${headers[index]}-${index}`}>
                {row.map(({ content, value }) => (
                    <Td isNumeric={typeof value === 'number'} padding={3} key={value}>{content}</Td>
                  )
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}