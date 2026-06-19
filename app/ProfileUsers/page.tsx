import { userSession } from "@/libs/auth-libs";
import ProfileUserClient from "./ProfleUserClient";
import AdminUserTable from "./AdminUserTable";
import { getAllUsers } from "./actions";

export default async function ProfilUserPage() {
  const user = await userSession();
  console.log("data", user);

  let allUsers: any[] = [];
  if (user?.role === "ADMIN") {
    allUsers = await getAllUsers();
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 w-full">
      <ProfileUserClient user={user} />
      
      {user?.role === "ADMIN" && (
        <AdminUserTable users={allUsers} />
      )}
    </div>
  );
}
