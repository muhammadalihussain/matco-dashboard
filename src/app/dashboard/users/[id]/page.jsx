"use client";
import { updateUser } from "../../../lib/actions";
import styles from "../../../components/users/addUser/addUser.module.css";
import Navbar from "../../../components/dashboard/navbar/navbar";
import React, { useEffect, useState, useRef } from "react";
import { authService } from "../../../lib/services/authService";
import { useParams } from "next/navigation";

const UpdatePage = () => {
  // const [DataAreaId, setDataAreaId] = useState(0);
  const params = useParams();
  const { id } = params; // Get the ID from URL

  const [DataRoleId, setDataRoleId] = useState(0);
  const [user, setUser] = useState(0);
  const [DataAreaIdrecords, setDataAreaIdRecords] = useState([]);
  const [DataRolesrecords, setDataRolesRecords] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const hasFetched = useRef(false); // Prevents duplicate API calls
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(""); // State to store input value
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userAddress, setAddress] = useState("");

  const toggleSite = (optionId) => {
    setSelectedSites(
      (prev) =>
        prev.some((item) => item.Id === optionId)
          ? prev.filter((item) => item.Id !== optionId) // ✅ Compare `item.Id`
          : [...prev, { Id: optionId }] // Add full object
    );
  };

  const isChecked = (id) => {
    return selectedSites.some((site) => site.Id === id);
  };

  // const user = await fetchUser(id);

  // const handleCheckboxChange = (optionId) => {
  //   console.log(optionId);
  //   setSelectedSites((prev) =>
  //     prev.includes(optionId)
  //       ? prev.filter((id) => id !== optionId)
  //       : [...prev, optionId]
  //   );
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await authService.fetchUser(id).then((u) => {
          // setDataAreaId(u);
          setUsername(u.username);
          setEmail(u.email);
          setPassword(u.password);
          setPhone(u.phone);
          setAddress(u.address);
          setUser(u);
          setDataRoleId(u.role_id);
        });
      } catch (error) {
        console.error("Error fetching areaid data:", error);
      } finally {
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) return; // Skip if already fetched
      hasFetched.current = true;

      try {
        await authService.getAllRole().then((u) => {
          // setDataRoleId(u);
          setDataRolesRecords(u);
        });
      } catch (error) {
        console.error("Error fetching areaid data:", error);
      } finally {
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        await authService.getDataAreaId().then((u) => {
          // setDataAreaId(u);

          setDataAreaIdRecords(u);
        });
        await authService.getUserAccesssitesByuserid(id).then((u) => {
          setSelectedSites(u);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching areaid data:", error);
      } finally {
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={styles.container}>
      <div className="flex justify-end">
        <Navbar />
      </div>
      <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
        <legend className="px-2 text-sm font-medium text-green-500">
          Update User
        </legend>

        <form action={updateUser} className={styles.form}>
          <input type="hidden" name="id" value={user.Id} />
          <input
            type="text"
            name="username"
            value={username} // Controlled by state
            onChange={(e) => setUsername(e.target.value)} // Update state on change
            required
          />
          <input
            value={userEmail} // Controlled by state
            onChange={(e) => setEmail(e.target.value)} // Update state on change
            type="email"
            placeholder="email"
            name="email"
            required
          />
          <input
            value={userPassword} // Controlled by state
            onChange={(e) => setPassword(e.target.value)} // Update state on change
            type="password"
            placeholder="password"
            name="password"
            required
          />

          <input type="hidden" name="oldpassword" value={user.password} />

          {/* <select
            name="dataareaId"
            id="dataareaId"
            value={DataAreaId}
            onChange={(e) => setDataAreaId(e.target.value)}
          >
            <option value="0" disabled>
              Choose a site
            </option>
            {DataAreaIdrecords?.length > 0 ? (
              DataAreaIdrecords.map((id) => (
                <option key={id.Id} value={id.Id}>
                  {id.Id}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select> */}

          <select
            key={"0"}
            name="RoleId"
            id="RoleId"
            value={DataRoleId}
            onChange={(e) => setDataRoleId(e.target.value)}
          >
            <option value="0" disabled>
              Choose a Role
            </option>
            {DataRolesrecords?.length > 0 ? (
              DataRolesrecords.map((id) => (
                <option key={id.id} value={id.id}>
                  {id.role_name}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
          <input type="hidden" id="role_Id" name="role_Id" value={DataRoleId} />

          <input
            type="phone"
            placeholder="phone"
            name="phone"
            value={userPhone} // Controlled by state
            onChange={(e) => setPhone(e.target.value)} // Update state on change
          />

          {/* <select name="isAdmin" id="isAdmin" className="h-16">
            <option value={false}>Is Admin?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select> */}
          <select name="isActive" id="isActive">
            <option value={true} selected={user.isActive}>
              Yes
            </option>
            <option value={false} selected={!user.isActive}>
              No
            </option>
          </select>
          <textarea
            name="address"
            id="address"
            rows="3"
            value={userAddress} // Controlled by state
            onChange={(e) => setAddress(e.target.value)} // Update state on change
          ></textarea>

          <fieldset className={`border border-gray-700 rounded-lg p-8  `}>
            <legend className="px-2 text-sm font-medium text-green-500 ">
              Allow to Access Multiples sites
            </legend>
            {DataAreaIdrecords.map((option) => (
              <div key={option.Id}>
                <label>
                  <input
                    name="siteIds"
                    type="checkbox"
                    checked={isChecked(option.Id)}
                    onChange={() => toggleSite(option.Id)}
                  />
                  {option.Id}
                </label>
              </div>
            ))}
          </fieldset>
          <input
            type="hidden"
            id="sitesIds"
            name="sitesIds"
            value={selectedSites.map((item) => item.Id).join(", ")}
          />
          <button type="submit">Update</button>
        </form>
      </fieldset>
    </div>
  );
};

export default UpdatePage;
