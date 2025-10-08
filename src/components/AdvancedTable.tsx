import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye } from 'lucide-react';

// Sample data type
type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  startDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
};

// Generate mock data
const generateData = (count) => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const statuses = ['Active', 'Inactive', 'On Leave'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 100000) + 40000,
    startDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

export default function AdvancedTable() {
  const [data] = useState(() => generateData(1000));
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Define columns with advanced features
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="w-4 h-4 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 cursor-pointer"
          />
        ),
        size: 50,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue }) => (
          <div className="font-medium">{getValue()}</div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <a href={`mailto:${getValue()}`} className="text-blue-600 hover:underline">
            {getValue()}
          </a>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        filterFn: 'includesString',
        cell: ({ getValue }) => {
          const dept = getValue();
          const colors = {
            Engineering: 'bg-blue-100 text-blue-800',
            Sales: 'bg-green-100 text-green-800',
            Marketing: 'bg-purple-100 text-purple-800',
            HR: 'bg-yellow-100 text-yellow-800',
            Finance: 'bg-red-100 text-red-800',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[dept]}`}>
              {dept}
            </span>
          );
        },
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        cell: ({ getValue }) => (
          <span className="font-semibold">
            ${getValue().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          const colors = {
            Active: 'bg-green-500',
            Inactive: 'bg-gray-500',
            'On Leave': 'bg-orange-500',
          };
          return (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
              <span className="text-sm">{status}</span>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employee Directory</h1>
        <div className="text-sm text-gray-600">
          {Object.keys(rowSelection).length} of {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
      </div>

      {/* Global Search & Column Visibility */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative group">
          <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Columns
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
            {table.getAllLeafColumns().map((column) => (
              <label key={column.id} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  className="w-4 h-4"
                />
                <span className="text-sm">{column.id}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Column Filters */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={(table.getColumn('name')?.getFilterValue()) ?? ''}
          onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          placeholder="Filter by name..."
          className="px-3 py-1 text-sm border rounded"
        />
        <input
          type="text"
          value={(table.getColumn('department')?.getFilterValue()) ?? ''}
          onChange={(e) => table.getColumn('department')?.setFilterValue(e.target.value)}
          placeholder="Filter by department..."
          className="px-3 py-1 text-sm border rounded"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {header.column.getIsSorted() === 'asc' ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronsUpDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    row.getIsSelected() ? 'bg-blue-50' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            {'>>'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {Object.keys(rowSelection).length} selected
            </span>
            <button className="px-4 py-1 bg-white text-blue-600 rounded hover:bg-gray-100">
              Export
            </button>
            <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}