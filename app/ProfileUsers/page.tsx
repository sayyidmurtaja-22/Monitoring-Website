import { userSession } from "@/libs/auth-libs";
import ProfileUserClient from "./ProfleUserClient";

export default async function ProfilUserPage() {

    const user = await userSession();
    console.log("data", user)

  return (
    <div>
      <ProfileUserClient  user={user} />
    </div>
  );
}
