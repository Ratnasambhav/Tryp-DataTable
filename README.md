# Technical Task for Tryp.com

This project is build using of React (`v18.0.0`), Next.js (`v12.1.4`) and Chakra UI (`v2.7.1`).

## About DataTable

The `DataTable` component takes the following props as input:

```
search?: string;
perPage?: number;
headers: string[];
sortable?: boolean;
paginated?: boolean;
rows: DataTableCell[][];
caption: React.ReactNode;
columnsConfig?: ColumnConfig[];
```

1. `search`: The search key by which the table will be filtered. Please note that in the current implementation, only the first column of the table is searchable.
2. `perPage`: The number of rows to be displayed in one page. This options will be ignored if `paginated` is `false`. It has a default value of 10.
3. `headers`: The column headers of the tables, passed as an array of strings.
4. `sortable`: Set this to `true` if the table should be sortable. We can control which column is sortable using `columnsConfig` prop. It is set to `false` by default.
5. `paginated`: Set this to `true` if the table should be paginated. It is set to `false` by default.
6. `rows`: The data to be displayed in the table. This has to be passed as an array of arrays of `DataTableCell`. `DataTableCell` consists of two properties: `value` and `content`. `value` property will be used for sorting the table along the column the cell belongs to. `content` is a `ReactNode` which will be rendered in the cell. More properties can be added to `DataTableCell` for additional features.
7. `caption`: Caption for the table.
8. `columnsConfig`: An array of `ColumnConfig` objects which consists of `sortable` property. Set this property of this column should be sortable. More properties can be added to `ColumnConfig` for additional features.

## Improvements

1. Better error handling for API calls
2. Per column filtering
3. Fixed column widths so layout doesn't shift when rows change

## Why is there no git history?

The only laptop I have is my work laptop which is provided by my current employer. As such, my laptop has a lot of restrictions including installing software packages like Node, npm etc. Additionally, the only git/github account which can be added is my work account. The reposiroties created through this acount have to be private and I wouldn't be able to share a link for that reposiroty.
Hence I had to work on this task in an online IDE like Stackblitz but sadly this lacks git and this project doesn;t have any git history.
