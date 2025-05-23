import React from "react";

type DataItem = { id: number | string; [key: string]: any };

// Update Column definition
interface ColumnDefinition<T extends DataItem> {
  key: keyof T | "actions" | string; // Allow string for custom keys like 'eventInfo'
  header: string;
  render?: (item: T) => React.ReactNode; // Optional render function
}

interface DataTableProps<T extends DataItem> {
  columns: ColumnDefinition<T>[]; // Use updated definition
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number | string) => void;
  isLoading?: boolean;
  error?: string | null;
}

function DataTable<T extends DataItem>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading = false,
  error = null,
}: DataTableProps<T>) {
  // ... (isLoading, error, no data checks remain the same) ...
  if (isLoading) {
    return (
      <div className="table-container">
        <p>Loading data...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="table-container error-message">
        <p>Error: {error}</p>
      </div>
    );
  }
  // Anda juga bisa menambahkan cek data kosong di sini jika mau
  // if (!isLoading && !error && (!data || data.length === 0)) {
  //    return <div className="table-container"><p>No data available.</p></div>;
  // }

  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={`${item.id}-${String(col.key)}`}>
                  {
                    col.key === "actions" ? (
                      <div className="table-actions">
                        {onEdit && (
                          <button onClick={() => onEdit(item)}>Edit</button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    ) : // Use render function if provided, otherwise access directly
                    col.render ? (
                      col.render(item)
                    ) : (
                      String(item[col.key as keyof T] ?? "")
                    ) // Handle null/undefined
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
