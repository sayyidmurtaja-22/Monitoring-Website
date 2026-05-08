// LocationList.tsx (Server Component - async OK)
import LocationListClient from "./LocationListClient"; // Client component
import { type User } from "next-auth";

interface LocationListProps {
  user: User;
}

const LocationList = ({ user }: LocationListProps) => {
  // const user = await userSession();
  return <>{user ? <LocationListClient user={user} /> : null}</>;
};

export default LocationList;
