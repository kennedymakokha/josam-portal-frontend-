'use client';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../../../context/themeContext';
import { useSearchParams } from 'next/navigation';
import { useGetThemeQuery } from '../../../../store/features/appApi';
import Image from 'next/image';

export default function Home() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');

  const {
    setPrimaryColor,
    setTagline,
    setLogo,
    setAppname,
    primaryColor,
    tagline,
    logo,
    app_name,
  } = useContext(ThemeContext);

  const { data: theme } = useGetThemeQuery(
    { name: nameParam as string },
    { skip: !nameParam }
  );

  useEffect(() => {
    if (!theme) return;

    setPrimaryColor(theme.primaryColor);
    setTagline(theme.tagline);
    setLogo(theme.logo);
    setAppname(theme.app_name);
  }, [theme, setAppname, setPrimaryColor, setLogo, setTagline]);

  return (
    <div
      style={{ background: primaryColor }}
      className="flex flex-col items-center justify-center min-h-screen p-8"
    >
      {logo && (
        <Image
          height={160}
          width={160}
          src={logo}
          alt="Logo"
          className="w-40 h-40 object-contain mb-4"
        />
      )}
      <h1 className="text-4xl font-bold mb-2">
        Welcome to {app_name || 'My App'}
      </h1>
      <p className="text-lg mb-6">{tagline}</p>
      <button
        style={{ backgroundColor: primaryColor }}
        className="text-white px-4 py-2 rounded shadow"
      >
        Themed Button
      </button>
    </div>
  );
}
