// components/DataTable.tsx
import React from 'react';

type Column<Data> = {
    key: keyof Data;
    label?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, row: Data) => React.ReactNode;
};

type Action<Data> = {
    label?: string;
    onClick: (row: Data) => void;
    className?: string;
    icon?: React.ReactNode;
    ariaLabel?: string;
    disabled?: boolean;
};

type DataTableProps<Data extends object> = {
    data: Data[];
    columns: Column<Data>[];
    actions?: Action<Data>[];
    itemsPerPage?: number;
    loading?: boolean;
};

export default function DataTable<Data extends object>({
    data,
    columns,
    actions = [],
    itemsPerPage = 5,
    loading = false,
}: DataTableProps<Data>) {
    const [currentPage, setCurrentPage] = React.useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-4">
            <table className="w-full table-auto text-black border-collapse border">
                <thead className="bg-gray-200 text-left">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="px-4 py-2 border">
                                {col.label ?? String(col.key)}
                            </th>
                        ))}
                        {actions.length > 0 && <th className="px-4 py-2 border">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                className="text-center py-6"
                            >
                                <div className="flex justify-center items-center space-x-2">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-800"></div>
                                    <span>Loading...</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-t">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2 border">
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : (String(row[col.key]) as React.ReactNode)}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-4 py-2 border">
                                        <div className="flex gap-2">
                                            {actions.map((action, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => action.onClick(row)}
                                                    aria-label={action.ariaLabel || action.label}
                                                    disabled={action.disabled}
                                                    className={
                                                        action.className ||
                                                        'bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1'
                                                    }
                                                >
                                                    {action.icon && <span>{action.icon}</span>}
                                                    {action.label && <span>{action.label}</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 pt-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={loading || currentPage === 1}
                    className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={loading || currentPage === totalPages}
                    className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
