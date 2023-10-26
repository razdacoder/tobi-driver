import React, { useState } from "react";
import { MdLocalTaxi } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          user_type: "driver",
        },
      },
    });
    if (!error) {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select()
        .eq("id", data.user.id);
      dispatch(setUser(profile));
      console.log(profile);
      navigate("/home", { replace: true });
      setLoading(false);
      return;
    }
    setErr(error.message);
    setLoading(false);
  };
  return (
    <div className="flex justify-center flex-col items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-y-4 flex-1">
        <MdLocalTaxi size={80} className="text-green-500" />
      </div>
      <div className="flex flex-col w-full px-5">
        <h3 className="text-2xl font-semibold text-neutral-800 mb-2">
          Welcome
        </h3>
        <h3 className="text-lg font-medium text-neutral-500 mb-8">
          Create an account
        </h3>
        {err && <span className="text-rose-500 font-medium">{err}</span>}
        <form className="mb-5" onSubmit={onSubmit}>
          <div className="flex mb-3 flex-col gap-y-2">
            <label
              htmlFor="fullname"
              className="text-lg font-medium text-neutral-500"
            >
              Name
            </label>
            <input
              onChange={(e) =>
                setForm((form) => ({ ...form, name: e.target.value }))
              }
              className="w-full border-2 border-neutral-500 px-4 py-[10px] rounded-md focus:border-green-500 outline-none text-lg"
              type="text"
              placeholder="Name"
              id="fullname"
            />
          </div>
          <div className="flex mb-3 flex-col gap-y-1">
            <label
              htmlFor="email"
              className="text-lg font-medium text-neutral-500"
            >
              Email
            </label>
            <input
              onChange={(e) =>
                setForm((form) => ({ ...form, email: e.target.value }))
              }
              className="w-full mb-3 border-2 border-neutral-500 px-4 py-[10px] rounded-md focus:border-green-500 outline-none text-lg"
              type="email"
              placeholder="Email"
              id="email"
            />
          </div>
          <div className="flex mb-3 flex-col gap-y-2">
            <label
              htmlFor="password"
              className="text-lg font-medium text-neutral-500"
            >
              Password
            </label>
            <input
              onChange={(e) =>
                setForm((form) => ({ ...form, password: e.target.value }))
              }
              className="w-full border-2 border-neutral-500 px-4 py-[10px] rounded-md focus:border-green-500 outline-none text-lg"
              type="password"
              placeholder="Password"
              id="password"
            />
          </div>
          <button className="w-full mt-5 bg-green-500 px-6 py-3 mb-3 rounded-md text-white font-semibold text-lg">
            {loading ? <Spinner /> : "Register"}
          </button>
          <div className="flex justify-center items-center">
            <button
              onClick={() => navigate("/welcome")}
              className="font-medium text-lg text-neutral-500"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
