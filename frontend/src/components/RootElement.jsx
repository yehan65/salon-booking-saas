import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function RootElement() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
