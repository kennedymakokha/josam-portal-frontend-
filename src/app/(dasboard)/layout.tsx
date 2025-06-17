'use client'
import { useSelector } from "react-redux";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  const { user } = useSelector((state: any) => state.auth)
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
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
