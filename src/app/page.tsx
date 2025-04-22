import dashboard from "./images/dashboard.png";
// import logo from "./images/logo.png";
import Image from "next/image";

// import { getCurrentSession } from "./lib/actions";
import LoginForm from "./components/loginForm";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  // const session = await getCurrentSession();

  // if (session?.isLoggedIn) {
  //   redirect("/");
  // }
  return (
    <div className="flex bg-182237 flex-col items-center justify-center min-h-screen py-2 bg-slate-800">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20  text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5  bg-slate-800">
            <LoginForm />
          </div>
          <div className="w-2/5 bg-green-800 text-white rounded-tr-2xl rounded-r-2xl py-36 px-12">
            <div className=" font-bold text-center ">
              Matco Analytics Dashboard
            </div>
            <Image
              src={dashboard}
              width={500}
              height={500}
              alt="Picture of the author"
            />
            <div className=" font-bold text-center ">
              <span className="text-white-500 ">
                {" "}
                ©{new Date().getFullYear()} Matco All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
