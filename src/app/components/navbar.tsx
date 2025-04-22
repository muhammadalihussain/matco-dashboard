"use client";
import { UserContext } from "@/app/lib/context/userProvider";
import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsPerson } from "react-icons/bs";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  // const router = useRouter();
  const { user, logout } = useContext(UserContext);

  // if (!user) {
  //   router.push("/");
  // }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/dashboard">
        <h1 className="text-xl font-bold">Production Dashboard</h1>
      </Link>
      <div>
        {user ? (
          <div className=" flex justify-evenly items-center">
            {/* <div className="bg-gradient-to-t from-blue-500 to to-blue-50 rounded-full p-3 text-xl text-white">
              <BsPerson />
            </div> */}
            <h1 className="text-black-500 mr-3">
              Welcome,{" "}
              <span className="text-blue-500 "> {user.user.username}! </span>
            </h1>

            <button
              onClick={logout}
              className="bg-red-500 mr-3 text-white px-4 py-2 rounded-md"
            >
              <MdLogout size={20} />
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Not logged in</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
