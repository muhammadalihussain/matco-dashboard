"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
// import { login } from "../lib/actions";
import { useActionState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useFormStatus } from "react-dom";
import { UserContext } from "@/app/lib/context/userProvider";
import { ToastContainer, toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const LoginForm = () => {
  // const [state, formAction] = useActionState<any, FormData>(login, undefined);
  // const { pending } = useFormStatus();

  const date = new Date().getFullYear();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(UserContext);
  const { login, loading } = context;
  const handleLogin = async () => {
    setError(""); // Clear previous errors

    if (!email || !password) {
      setIsLoading(false);
      toast.error("please fill all fields");
      return;
    }

    // Get context with null check

    const result = await login(email, password);

    if (!result.success) {
      if (result.error) {
        toast.error(result.error);
        setError(result.error);
        setIsLoading(false);
      } else {
        toast.error("Login failed"); // Default error message
      }
    }
  };

  return (
    // <form action={formAction}>

    <div className="py-10 mt-10">
      <h2 className="text-3xl font-bold text-green-500 mb-2">
        Sign In to Account
      </h2>
      <div className="border-2 w-10 bg-green-500 inline-block mb-2"></div>

      <div className="flex flex-col  items-center">
        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-full">
          <FaRegEnvelope className="text-red-400 m-2 " />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="bg-gray-100  text-red-400 outline-none text-sm flex-1"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* {state?.errors?.email && (
              <p className="text-red-500">{state.errors.email}</p>
            )} */}
        </div>
        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 rounded-full">
          <MdLockOutline className="text-red-400 m-2  " />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="bg-gray-100  text-red-400  outline-none text-sm flex-1"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* {state?.errors?.password && (
              <p className="text-red-500">{state.errors.password}</p>
            )} */}
        </div>
        <div className="flex justify-between w-64 mb-5">
          <label className="flex  items-center text-xs">
            <input type="checkbox" className="mr-1 " />
            <span className="text-green-500 font-bold"> Remember me </span>
          </label>

          <a href="/forgetpassword" className="text-xs">
            <span className="text-green-500 font-bold">Forget Password?</span>
          </a>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="border-2 border-green text-green-500 rounded-full px-20 py-2 inline-block font-semibold   hover:bg-green-500 hover:text-white"
        >
          Sign In
          {/* {pending ? "Submitting..." : "Sign In"} */}
        </button>
        <br></br>
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            Processing Please Wait ...
          </>
        ) : (
          ""
        )}
      </div>
      <div>
        {error && <p className="text-red-500 font-bold mt-8">{error}</p>}

        {/* {state?.error && (
            <p className="text-red-500 font-bold mt-8">{state.error}</p>
          )} */}
      </div>
      <div className="mt-28 font-bold text-green-500 ">
        ©<span className="">{date} Matco Foods Ltd. </span>
        <br></br> Developed by Muhammad Ali Hussain (software eng.)
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
