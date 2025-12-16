// app/dashboard/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Permohonan, StatusType } from "./types";
import { Badge } from "@/components/ui/badge";

// Map status number ke string
const getStatusText = (status: number): StatusType => {
  switch (status) {
    case 1: return "pending";
    case 2: return "processing";
    case 3: return "success";
    case 4: return "failed";
    default: return "pending";
  }
};

// Map status ke warna badge
const getStatusColor = (status: StatusType) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
    case "success": return "bg-green-100 text-green-800 border-green-200";
    case "failed": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const columns: ColumnDef<Permohonan>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user.name",
    header: "Nama Pemohon",
    cell: ({ row }) => {
      const user = row.original.user;
      return <div>{user.name}</div>;
    },
  },
  {
    accessorKey: "username",
    header: "Username/NIM",
  },
  {
    accessorKey: "nomor_ijazah",
    header: "Nomor Ijazah",
  },
  {
    accessorKey: "keperluan",
    header: "Keperluan",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("keperluan")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusNum = row.getValue("status") as number;
      const statusText = getStatusText(statusNum);
      
      return (
        <Badge variant="outline" className={getStatusColor(statusText)}>
          {statusText.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Pengajuan",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    accessorKey: "jumlah_lembar",
    header: "Jumlah Lembar",
  },
];