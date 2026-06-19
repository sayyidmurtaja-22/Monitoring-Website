import ButtonAuth from "@/components/auth/ButtonAuthApi";
import { userSession } from "@/libs/auth-libs";

const Navbar = async () => {
  const user = await userSession();
  return (
    <aside>
      <div>
        <ButtonAuth user={user} />
      </div>
    </aside>
  );
};

export default Navbar;
