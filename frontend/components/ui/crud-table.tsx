"use client";

import * as React from "react";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CrudTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
}

// For convenience in the CRUD form. Adjust if your union differs.
type Role = "admin" | "doctor" | "secretary";
const ROLES: Role[] = ["admin", "doctor", "secretary"];

export function CrudTable<
  TData extends {
    id?: number;
    email: string;
    first_name: string;
    last_name: string;
    role: Role;
    is_active?: boolean;
  },
  TValue
>({ columns, data, title }: CrudTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData, setTableData] = React.useState<TData[]>(data);
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({
    name: false, // hide computed "name" column from the UI
  });

  // ---------- CRUD form state ----------
  type Draft = {
    id?: number;
    email: string;
    first_name: string;
    last_name: string;
    role: Role;
    is_active: boolean;
  };

  const emptyDraft: Draft = {
    email: "",
    first_name: "",
    last_name: "",
    role: "doctor",
    is_active: true,
  };

  const [draft, setDraft] = React.useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const startEdit = React.useCallback((row: TData) => {
    setEditingId(row.id ?? null);
    setDraft({
      id: row.id,
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      role: row.role,
      is_active: row.is_active ?? true,
    });
  }, []);

  const handleDelete = React.useCallback((row: TData) => {
    setTableData((prev) =>
      row.id != null
        ? prev?.filter((u) => u.id !== row.id)
        : prev?.filter((u) => u !== row)
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate an id if needed
    const nextId =
      draft.id ?? Math.max(0, ...tableData.map((u) => u.id ?? 0)) + 1;

    const newRecord = {
      ...draft,
      id: nextId,
    } as TData;

    if (editingId == null) {
      // CREATE
      setTableData((prev) => [newRecord, ...prev]);
    } else {
      // UPDATE
      setTableData((prev) =>
        prev.map((u) =>
          u.id === editingId ? ({ ...u, ...newRecord } as TData) : u
        )
      );
    }

    setEditingId(null);
    setDraft(emptyDraft);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  // ---------- Columns ----------
  const allColumns = React.useMemo(() => {
    // Computed "name" column for search filtering (hidden from UI).
    // filterFn matches all tokens (case-insensitive), so "ali smi" matches "Alice Smith".
  const nameColumn: ColumnDef<TData, string> = {
    id: "name",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`.trim(),
    header: "Name",
    filterFn: (row, columnId, filterValue) => {
      const value = String(filterValue || "")
        .toLowerCase()
        .trim();
      if (!value) return true;
      const tokens = value.split(/\s+/).filter(Boolean);
      const full =
        `${row.original.first_name} ${row.original.last_name}`.toLowerCase();
      return tokens.every((t) => full.includes(t));
    },
  };
    // Actions column

  const actionsColumn: ColumnDef<TData> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => startEdit(row.original)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original)}
        >
          Delete
        </Button>
      </div>
    ),
  };

  return [nameColumn, ...columns, actionsColumn] as ColumnDef<
    TData,
    TValue
  >[];
}, [columns, handleDelete, startEdit]);

  const table = useReactTable({
    data: tableData,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="card m-6 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-2">{title}</h1>

        <Input
          placeholder="Search name (first + last)"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-60 rounded-full"
        />

        <div className="ml-auto">
          <Button onClick={startCreate}>Create User</Button>
        </div>
      </div>

      {/* CRUD Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-6"
      >
        <Input
          required
          placeholder="First name"
          value={draft.first_name}
          onChange={(e) =>
            setDraft((d) => ({ ...d, first_name: e.target.value }))
          }
        />
        <Input
          required
          placeholder="Last name"
          value={draft.last_name}
          onChange={(e) =>
            setDraft((d) => ({ ...d, last_name: e.target.value }))
          }
        />
        <Input
          required
          type="email"
          placeholder="Email"
          value={draft.email}
          onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
        />
        <select
          className="h-10 rounded-md border px-3"
          value={draft.role}
          onChange={(e) =>
            setDraft((d) => ({ ...d, role: e.target.value as Role }))
          }
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r[0].toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 px-2">
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) =>
              setDraft((d) => ({ ...d, is_active: e.target.checked }))
            }
          />
          Active
        </label>

        <div className="flex gap-2">
          <Button type="submit">{editingId == null ? "Add" : "Save"}</Button>
          {editingId != null && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
