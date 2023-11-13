import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { MdArrowBackIos, MdLocalTaxi } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, setSession, setUser } from "../slices/authSlice";
import { supabase } from "../utils/supabase";

const RideHistory = ({ destination, date, price }) => {
  return (
    <div className="w-full border-b-[1px] mb-3 py-3 border-neutral-300 flex items-center justify-between">
      <MdLocalTaxi size={30} className="text-blue-400" />
      <div>
        <h4 className="text-xl font-semibold">{destination}</h4>
        <span className=" text-neutral-500 text-lg">{date}</span>
      </div>
      <h4 className="text-3xl font-bold">&#8358; {price}</h4>
    </div>
  );
};

const History = () => {
  const naviagate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const getMyRides = async () => {
      const { data, error } = await supabase
        .from("rides")
        .select()
        .eq("driver", user.id);

      setRides(data);
    };

    getMyRides();
  }, []);

  const signOut = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_online: false })
      .eq("id", user.id);

    if (!error) {
      const { error: err } = await supabase.auth.signOut();
      dispatch(setSession(null));
      dispatch(setUser(null));
      naviagate("/welcome", { replace: true });
    }
  };
  return (
    <div className="h-screen relative">
      <div className="flex justify-between px-5 py-5 shadow-sm items-center border-b-[1px] border-neutral-300 mb-5">
        <button onClick={() => naviagate("/home")}>
          <MdArrowBackIos size={30} />
        </button>
        <h3 className="text-xl font-semibold flex-1 text-center">Profile</h3>
        <div className="w-8"></div>
      </div>
      <div className="px-5">
        <h4 className="text-3xl font-semibold">History</h4>
        <div className="mt-5 border-t-[1px] border-neutral-300 py-3">
          {rides.length > 0 ? (
            rides.map((ride) => (
              <RideHistory
                key={ride.id}
                destination={ride.destination}
                price={ride.price}
                date={format(
                  new Date(ride.created_at),
                  "dd MMMM, yyyy HH:mm aaa"
                )}
              />
            ))
          ) : (
            <span className="text-lg text-neutral-600 text-center">
              No rides to show!!
            </span>
          )}
        </div>
      </div>
      <button
        onClick={signOut}
        className="absolute bottom-4 w-full text-rose-500 text-xl py-5"
      >
        Sign Out
      </button>
    </div>
  );
};

export default History;
