import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RideMap from "../components/RideMap";
import Spinner from "../components/Spinner";
import { supabase } from "../utils/supabase";
import { selectUser, setUser } from "./../slices/authSlice";

const RequestCard = ({
  riderName,
  destination,
  price,
  declineCallback,
  acceptCallback,
}) => {
  return (
    <div className="absolute z-50 h-screen top-0 left-0 w-full bg-neutral-900 opacity-95 flex justify-center items-center">
      <div className="w-[90%] h-[40%] bg-white px-5 py-5">
        <h4 className="text-center text-2xl font-semibold">New Ride Request</h4>
        <div className="flex flex-col justify-center items-center mt-10">
          <AiOutlineUser size={50} />
          <h5 className="text-2xl font-semibold my-3">{riderName}</h5>
          <p className="text-xl font-semibold">DROP OFF: {destination}</p>
          <span className="text-xl font-medium">&#8358; {price}</span>
        </div>
        <div className="flex justify-between mt-6 gap-x-3 items-center">
          <button
            onClick={declineCallback}
            className="bg-rose-500 w-1/2 text-white py-3 px-8 text-lg rounded-lg"
          >
            Decline
          </button>
          <button
            onClick={acceptCallback}
            className="bg-green-500 w-1/2 text-white py-3 px-8 text-lg rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const profiles = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          dispatch(setUser(payload.new));
        }
      )
      .subscribe((status) => {
        console.log("Status - ", status);
      });
  });

  useEffect(() => {
    const rides = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rides",
          filter: `driver=eq.${user.id}`,
        },
        (payload) => handleRideEvent(payload.new)
      )
      .subscribe();
  });

  const handleRideEvent = async (payload) => {
    console.log("Change received!", payload);
    let { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", payload.rider);
    setIsRequestAvailable(true);
    const profile = profiles[0];
    const reqInfo = {
      rideId: payload.id,
      riderName: profile.full_name,
      destination: payload.destination,
      price: payload.price,
    };
    setRequest(reqInfo);
  };

  const declineCallback = async () => {
    console.log(request);
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "declined" })
      .eq("id", request.rideId);

    if (!error) {
      setIsRequestAvailable(false);
    }
  };

  const acceptCallback = async () => {
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "on-route" })
      .eq("id", request.rideId);

    const { data: rides, error: ridesError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", request.rideId);
    if (!ridesError) {
      setcurrentRide(rides[0]);
      setRequest(null);
    }

    if (!error) {
      setIsRequestAvailable(false);
    }
  };

  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [activeDestination, setactiveDestination] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isrequestAvailable, setIsRequestAvailable] = useState(false);
  const [request, setRequest] = useState(null);
  const [currentRide, setcurrentRide] = useState(null);

  const onChange = async (e) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_online: e.target.checked })
      .eq("id", user.id);

    console.log("Status: Changed");
  };

  const handleClick = async () => {
    if (currentRide.status === "on-route") {
      setLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .update({ status: "picked-up" })
        .eq("id", currentRide.id);

      if (!error) {
        const { data: rides, error: ridesError } = await supabase
          .from("rides")
          .select("*")
          .eq("id", currentRide.id);
        if (!ridesError) {
          setcurrentRide(rides[0]);
          console.log(currentRide);
        }
      }
      setLoading(false);
    } else if (currentRide.status === "picked-up") {
      setLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .update({ status: "payment" })
        .eq("id", currentRide.id);
      if (!error) {
        const { data: rides, error: ridesError } = await supabase
          .from("rides")
          .select("*")
          .eq("id", currentRide.id);
        if (!ridesError) {
          setcurrentRide(rides[0]);
          console.log(currentRide);
        }
      }

      setLoading(false);
    } else if (currentRide.status === "payment") {
      setLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .update({ status: "completed" })
        .eq("id", currentRide.id);

      if (!error) {
        const { data: rides, error: ridesError } = await supabase
          .from("rides")
          .select("*")
          .eq("id", currentRide.id);
        if (!ridesError) {
          setcurrentRide(null);
          console.log(currentRide);
        }
      }
      setLoading(false);
    } else if (currentRide.status === "completed") {
      setLoading(true);
      setcurrentRide(null);
      console.log(currentRide);
      setLoading(false);
    }
  };
  return (
    <div className="h-screen flex flex-col relative">
      {isrequestAvailable && (
        <RequestCard
          riderName={request.riderName}
          destination={request.destination}
          price={request.price}
          declineCallback={declineCallback}
          acceptCallback={acceptCallback}
        />
      )}
      <div className="px-5 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/history")}
          className="flex justify-center items-center"
        >
          <MdMenu size={30} className="text-neutral-700" />
        </button>
        <h4
          className={`text-xl font-semibold ${
            user.is_online ? "text-green-600" : "text-gray-400"
          }`}
        >
          {user.is_online ? "Online" : "Offline"}
        </h4>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={user.is_online}
            onChange={onChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
        </label>
      </div>

      <div className="h-[80%]">
        <RideMap />
      </div>
      <div className="h-[10%] flex justify-center items-center px-5">
        <button
          disabled={currentRide === null || loading}
          onClick={handleClick}
          className="w-full bg-green-800 py-4 mt-4 rounded-md text-white text-lg disabled:bg-neutral-400"
        >
          {user.is_online && currentRide === null && "Waiting For Request..."}
          {user.is_online === false &&
            currentRide === null &&
            "You are offline"}
          {currentRide !== null &&
            currentRide.status === "on-route" &&
            loading === false &&
            "Pick Up Rider"}
          {currentRide !== null &&
            currentRide.status === "picked-up" &&
            loading === false &&
            "Destination Reached"}
          {currentRide !== null &&
            currentRide.status === "payment" &&
            loading === false &&
            "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

export default Home;

// create table
//   public.rides (
//     id uuid not null default gen_random_uuid (),
//     created_at timestamp with time zone null default now(),
//     rider uuid null,
//     driver uuid null,
//     destination text null,
//     destination_lat double precision null,
//     destination_lng double precision null,
//     price double precision null,
//     status text null,
//     constraint rides_pkey primary key (id),
//     constraint rides_driver_fkey foreign key (driver) references profiles (id),
//     constraint rides_rider_fkey foreign key (rider) references profiles (id)
//   ) tablespace pg_default;
