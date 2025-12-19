// app/dashboard/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Permohonan, StatusType } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";

import {
  CheckCheck,
  X,
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Map status number ke string
const getStatusText = (status: number): StatusType => {
  switch (status) {
    case 1:
      return "dimulai";
    case 2:
      return "verifikasi";
    case 3:
      return "tandatangan";
    case 4:
      return "ready";
    case 5:
      return "ambil";
    case 6:
      return "tolak";
    case 7:
      return "batal";
    default:
      return "dimulai";
  }
};

// Map status ke warna badge
const getStatusColor = (status: StatusType) => {
  switch (status) {
    case "dimulai":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "verifikasi":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "tandatangan":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "ready":
      return "bg-green-100 text-green-800 border-green-200";
    case "ambil":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "tolak":
      return "bg-red-100 text-red-800 border-red-200";
    case "batal":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      {
        /* <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {" "}
            <X />
            Tolak
          </Button>
            </DropdownMenuTrigger> */
      }
      return (
        <ButtonGroup>
          <Button variant="outline">
            {" "}
            <CheckCheck />
            Terima
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="destructive">
                {" "}
                <X />
                Tolak
                <ChevronDownIcon/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="[--radius:1rem]">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <VolumeOffIcon />
                  happak die
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckIcon />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertTriangleIcon />
                  Report Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRoundXIcon />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShareIcon />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon />
                  Copy Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <TrashIcon />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      );
    },
  },
];
