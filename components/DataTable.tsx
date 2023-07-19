'use client'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

import Pagination from './Pagination';
import { compareObjects } from '../utils';

export type DataTableCell = {
  value: any;
  content: React.ReactNode;
};

type ColumnConfig = {
  sortable: boolean;
};

export type DataTableProps = {
  search?: string;
  perPage?: number;
  headers: string[];
  sortable?: boolean;
  paginated?: boolean;
  rows: DataTableCell[][];
  caption: React.ReactNode;
  columnsConfig?: ColumnConfig[];
};

enum SortDirection {
  ASC,
  DSC,
  NONE,
}

export default function DataTable({
  rows,
  headers,
  caption,
  search = '',
  perPage = 10,
  sortable = false,
  paginated = false,
  columnsConfig = [],
}: DataTableProps) {
  const [page, setPage] = useState<number>(1);
  const [sortIndex, setSortIndex] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.NONE
  );
  const [sortedRows, setSortedRows] = useState<DataTableCell[][]>(rows);

  useEffect(() => {
    const filteredRows = search.length
      ? rows.filter(([{ value }]) =>
          (value as string).toLowerCase().includes(search.toLowerCase())
        )
      : rows;

    const nextSortedRows =
      sortIndex === null || sortDirection === SortDirection.NONE
        ? filteredRows
        : filteredRows.toSorted((rowA, rowB) => {
            const valueA = rowA.at(sortIndex)?.value;
            const valueB = rowB.at(sortIndex)?.value;
            const modifier = sortDirection === SortDirection.ASC ? 1 : -1;

            switch (typeof valueA) {
              case 'number':
                return (valueA - valueB) * modifier;
              case 'string':
                return valueA.localeCompare(valueB) * modifier;
              default:
                return (
                  (valueA instanceof Date && valueB instanceof Date
                    ? valueA > valueB
                      ? 1
                      : -1
                    : compareObjects(valueA, valueB)) * modifier
                );
            }
          });

    setSortedRows(nextSortedRows);
  }, [rows, search, sortDirection, sortIndex]);

  const handleSort = useCallback((index: number) => {
    if (sortIndex !== index) {
      setSortIndex(index);
      setSortDirection(SortDirection.ASC);
    } else {
      setSortDirection((dir) => (dir === SortDirection.NONE ? 0 : dir + 1));
    }
  }, [sortIndex]);

  const tableHeaders = useMemo(() => (
    <Thead>
      <Tr>
        {headers.map((header, index) => (
          <Th key={header} px="8px">
            {!sortable || !columnsConfig.at(index)?.sortable ? (
              <Text fontSize="md" fontWeight="bold" color="orange.400">
                {header}
              </Text>
            ) : (
              <Button
                onClick={() => handleSort(index)}
                variant="ghost"
                size="xs"
                padding={0}
                _hover={{ backgroundColor: 'inherit' }}
              >
                <Flex gap="2" alignItems="center">
                  <Text fontSize="md" fontWeight="bold">
                    {header}
                  </Text>
                  <Flex direction="column">
                    <ChevronUpIcon
                      boxSize={4}
                      color="orange.900"
                      opacity={
                        index === sortIndex &&
                        sortDirection === SortDirection.ASC
                          ? 1
                          : 0.2
                      }
                    />
                    <ChevronDownIcon
                      boxSize={4}
                      color="orange.900"
                      opacity={
                        index === sortIndex &&
                        sortDirection === SortDirection.DSC
                          ? 1
                          : 0.2
                      }
                    />
                  </Flex>
                </Flex>
              </Button>
            )}
          </Th>
        ))}
      </Tr>
    </Thead>
  ), [columnsConfig, handleSort, headers, sortable, sortDirection, sortIndex]);

  const renderBody = () => {
    const start = paginated ? Math.max((page - 1) * perPage, 0) : 0;
    const end = paginated ? page * perPage : -1;
    return (
      <Tbody>
        {sortedRows.slice(start, end).map((row, index) => (
          <Tr
            _hover={{ backgroundColor: 'orange.100' }}
            key={`${headers[index]}-${index}`}
          >
            {row.map(({ content, value }) => (
              <Td isNumeric={typeof value === 'number'} padding={3} key={value}>
                {content}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    );
  };

  const renderPagination = () => {
    if (!paginated || perPage >= sortedRows.length) {
      return null;
    }

    const maxPage = Math.ceil(sortedRows.length / perPage);
    const onNext = () =>
      setPage((currentPage) => Math.min(currentPage + 1, maxPage));
    const onPrev = () => setPage((currentPage) => Math.max(currentPage - 1, 1));
    const onClick = (index: number) => setPage(index);

    return (
      <Center>
        <Pagination
          current={page}
          max={maxPage}
          onNext={onNext}
          onPrev={onPrev}
          onClick={onClick}
        />
      </Center>
    );
  };

  if (!sortedRows.length) {
    return (
      <Center>
        <Text fontWeight="bold" fontSize="lg">
          No Data
        </Text>
      </Center>
    );
  }

  return (
    <>
      <TableContainer>
        <Table variant="unstyled" colorScheme="orange">
          <TableCaption color="orange.500">{caption}</TableCaption>
          {tableHeaders}
          {renderBody()}
        </Table>
      </TableContainer>
      {renderPagination()}
    </>
  );
}
