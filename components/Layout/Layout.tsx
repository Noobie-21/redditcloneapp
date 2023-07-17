import React from "react";
import Navbar from "../Navbar/Navbar";
import AuthModal from "../Modal/Auth/AuthModal";

export default function Layout({ children }: any) {
  return (
    <div>
      <Navbar />
      {/* <AuthModal /> */}
      <main>{children}</main>
    </div>
  );
}
