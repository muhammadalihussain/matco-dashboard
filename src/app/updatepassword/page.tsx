"use client";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  // console.log({props});
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this runs only in the browser
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token"));
    }
  }, []);

  const router = useRouter();

  const [state, setSate] = useState({
    password: "",
    cpassword: "",
  });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSate({ ...state, [e.target.name]: e.target.value });
  };

  const onSUbmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!state.password || !state.cpassword) {
        toast.error("please fill all fields");
        return;
      }

      const response = await axios.post("/api/auth/updatepassword", {
        ...state,
        token: token,
      });
      const data = await response.data;

      toast.success(data.msg);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      alert(error);
      toast.error(error.response);
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto flex flex-wrap items-center">
          <fieldset className={`border border-gray-700 rounded-lg p-4 `}>
            <legend className="px-2 text-sm font-medium text-green-500">
              Update Password
            </legend>
            <form
              onSubmit={onSUbmitHandler}
              className=" bg-slate-800 md:w-1/2  rounded-lg p-8 flex flex-col mx-auto w-full mt-10 md:mt-0"
            >
              <h2 className="text-green-500 text-lg font-medium title-font mb-5">
                Forget Password
              </h2>
              <div className="relative mb-4">
                <label
                  htmlFor="password"
                  className="leading-7 text-sm text-red-500"
                >
                  New password (*)
                </label>
                <input
                  onChange={onChangeHandler}
                  value={state.password}
                  type="password"
                  id="password"
                  name="password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="cpasssowrd"
                  className="leading-7 text-sm text-red-600"
                >
                  Confirm password (*)
                </label>
                <input
                  onChange={onChangeHandler}
                  value={state.cpassword}
                  type="password"
                  id="cpasssowrd"
                  name="cpassword"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-grey-500 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <button className="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Forget Password
              </button>
              <div className="flex justify-between items-center">
                <p className="text-xs text-blue-500 mt-3">
                  Already Know ? <Link href={"/"}>Login?</Link>
                </p>
              </div>
            </form>
          </fieldset>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default ForgetPassword;
