import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { useSelector, useDispatch } from "react-redux";
import { setSession, selectSession } from "../slices/authSlice";

const RequireAuth = () => {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  return session ? <Outlet /> : <Navigate to="/welcome" />;
};

export default RequireAuth;
