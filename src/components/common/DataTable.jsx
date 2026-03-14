import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowClick,
  selectedRows,
  onSelectRow,
  onSelectAll
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {onSelectAll && (
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows?.length === data?.length && data?.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (onSelectAll ? 1 : 0)} className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A84C] mx-auto" />
              </td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onSelectAll ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {onSelectRow && (
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedRows?.includes(row._id)}
                      onChange={() => onSelectRow(row._id)}
                      className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {column.render ? column.render(row) : row[column.field]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 bg-gray-50 rounded-lg text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;