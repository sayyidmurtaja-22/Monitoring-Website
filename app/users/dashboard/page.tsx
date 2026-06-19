// app/users/dashboard/page.tsx  ← atau halaman home kamu
import { userSession } from "@/libs/auth-libs"
import HomePage from "./HomepageClient"

export default async function Page() {
  const session = await userSession()
  return <HomePage user={session?.name ?? "Pengguna"}
   />
}