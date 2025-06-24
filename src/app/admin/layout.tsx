'use client'

import { useSelector } from "react-redux";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import { useRouter } from "next/navigation";
import { RootState } from "../../../store/store";
import { useContext, useEffect } from "react";
import { useGetThemeQuery } from "../../../store/features/appApi";
import { ThemeContext } from "../../../context/themeContext";
import { lightenColor } from "../../../utils/themeUtils";


// import { RootState } from "../../../store/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    setPrimaryColor,
    setTagline,
    setLogo,
    setAppname,
    primaryColor,

  } = useContext(ThemeContext);
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user) {
      if (user?.role === 'superadmin') {
        router.push('/admin');
      }
      else if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } else {
      router.push('/auth');
    }
  }, [user, router]);
  const { data: theme } = useGetThemeQuery(
    { id: user?.app_id as string },
    { skip: !user?.app_id }
  );

  useEffect(() => {
    if (!theme) return;
    setPrimaryColor(theme.primaryColor);
    setTagline(theme.tagline);
    setLogo(theme.logo);
    setAppname(theme.app_name);
  }, [theme, setAppname, setPrimaryColor, setLogo, setTagline]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main
          className="flex-1 p-4 overflow-y-auto"
          style={{ backgroundColor: lightenColor(primaryColor, 70) }}
        >

          {children}</main>
      </div>
    </div>
  );
}
