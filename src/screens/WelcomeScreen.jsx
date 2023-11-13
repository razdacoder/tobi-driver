import React from "react";
import { MdLocalTaxi } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-y-4 flex-1">
        <MdLocalTaxi size={80} className="text-blue-500" />
        <h3 className="text-3xl font-bold text-blue-500">Polyride Driver</h3>
      </div>
      <div className="flex flex-col w-full px-5">
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-500 px-6 py-3 mb-3 rounded-md text-white font-semibold text-lg"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full border-2 border-blue-500 px-6 py-3 mb-3 rounded-md text-blue-500 font-semibold text-lg"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
