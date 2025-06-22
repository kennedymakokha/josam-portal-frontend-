// components/DataTable.tsx
import React from 'react';

type Column<Data> = {
    key: keyof Data;
    label?: string;
    render?: (value: any, row: Data) => React.ReactNode;
};

type Action<Data> = {
    label?: string;
    onClick: (row: Data) => void;
    className?: string;
    icon?: React.ReactNode; // ✅ Add th
    ariaLabel?: string; // ✅ Add this
    disabled?: boolean; // 👈 Add this line
};

type DataTableProps<Data extends object> = {
    data: Data[];
    columns: Column<Data>[];
    actions?: Action<Data>[];
    itemsPerPage?: number;
};

export default function DataTable<Data extends object>({
    data,
    columns,
    actions = [],
    itemsPerPage = 5,
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
                    {paginatedData.map((row, rowIndex) => (
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
                                                className={action.className || 'bg-blue-500  text-white px-2 py-1 rounded flex items-center gap-1'}
                                            >
                                                {action.icon && <span>{action.icon}</span>}
                                                {action.label && <span>{action.label}</span>}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 pt-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
