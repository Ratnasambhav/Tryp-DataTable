import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'

export type DataTableCell = {
  value: React.ReactNode,
  isNumeric?: boolean,
}

export type DataTableProps = {
  headers: string[]
  rows: DataTableCell[][]
  caption: React.ReactNode
  sortable?: boolean
  paginated?: boolean
}

export default function DataTable({
  rows,
  headers,
  caption,
  sortable = false,
  paginated = false,
}: DataTableProps) {
  const renderTableBody = () => {
    if (!rows?.length) {
      return <span>No Data</span>
    }

    return rows.map((row) => (
      <Tr>
        {row.map(({ value, isNumeric}) => (
            <Td isNumeric={isNumeric}>{value}</Td>
          )
        )}
      </Tr>
    ))
  }

  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption placement='top'>{caption}</TableCaption>
        <Thead>
          <Tr>
            {headers.map((header) => <Th key={header}>{header}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {renderTableBody()}
        </Tbody>
      </Table>
    </TableContainer>
  )
}