"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { updateUserRole } from "./actions";

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

export default function AdminUserTable({ users }: { users: UserData[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, newRole: "USER" | "ADMIN") => {
    startTransition(() => {
      updateUserRole(userId, newRole);
    });
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold mb-4">Daftar Pengguna (Admin View)</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name || "-"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Select
                  disabled={isPending}
                  defaultValue={user.role}
                  onValueChange={(value) =>
                    handleRoleChange(user.id, value as "USER" | "ADMIN")
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                Tidak ada pengguna ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
