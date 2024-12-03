import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";
import ProtecRouter from "./ProtecRouter";

const MainRouter = () => {
  return (
    <>
      <Routes>
        <Route element={<ProtecRouter />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile/:id" element={<Profile />}></Route>
        </Route>

        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
      </Routes>
    </>
  );
};

export default MainRouter;
