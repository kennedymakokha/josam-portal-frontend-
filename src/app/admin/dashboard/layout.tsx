'use client'
import { useSelector } from "react-redux";
import Header from "../../components/header";
import Sidebar from "../../components/sideBar";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { RootState } from "@reduxjs/toolkit/query";
// import { RootState } from "../../../store/store";

export default function Layout({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  // const { user } = useSelector((state: RootState) => state.auth)

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/auth');
  //   }
  // }, [user, router]);
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
