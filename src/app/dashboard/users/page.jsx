import styles from "../../components/users/users.module.css";
import Search from "../../components/search/search";
import Pagination from "../../components/pagination/pagination";
import Image from "next/image";
import Link from "next/link";
import { getAllUsersBySearch } from "../../lib/dal/userdbutils"; //"../../lib/data";
import { deleteUser } from "../../lib/actions"; //../../lib/actions";
import noavatar from "../../../app/images/noavatar.png"; // "../../../images/noavatar.png";
import Navbar from "../../components/dashboard/navbar/navbar";

async function users({ searchParams }) {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const results = await getAllUsersBySearch(q, page);

  const count = results?.filtered;
  const users = results?.records;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
        <div className={styles.add_login}>
          <Link href="/dashboard/users/add">
            <button className={styles.addButton}>Add New</button>
          </Link>
          <Navbar />
        </div>
      </div>
      <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
        <legend className="px-2 text-sm font-medium text-green-500">
          User Details
        </legend>

        <table className={styles.table}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Created At</td>
              <td>Role</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user?.Id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      src={user?.img || noavatar}
                      //  src={"/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user?.username}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.createdAt?.toString().slice(4, 16)}</td>
                <td>{user.RoleName}</td>
                <td>{user.isActive ? "active" : "passive"}</td>
                <td>
                  <div className={styles.buttons}>
                    {/* <Link href={`/dashboard/users/${user.Id}`}> */}
                    <Link href={`/dashboard/users/${user.Id}`}>
                      <button className={`${styles.button} ${styles.view}`}>
                        View
                      </button>
                    </Link>
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.Id} />
                      <button className={`${styles.button} ${styles.delete}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination count={count} />
      </fieldset>
    </div>
  );
}

export default users;
