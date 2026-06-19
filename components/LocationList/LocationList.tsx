// components/LocationList/LocationList.tsx
import LocationListClient from "./LocationListClient";
import { type User } from "next-auth";

interface LocationListProps {
  user: User;
  onClose?: () => void;
}

const LocationList = ({ user, onClose }: LocationListProps) => {
  return <>{user ? <LocationListClient user={user} onClose={onClose} /> : null}</>;
};

export default LocationList;