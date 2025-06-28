'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { logout } from '../../../store/slices/authSlice';
import { ThemeContext } from '../../../context/themeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function isLightColor(hex: string): boolean {
    const color = hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 230;
}

export default function Header() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { primaryColor } = useContext(ThemeContext);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isLight = isLightColor(primaryColor);
    const textColor = isLight ? '#1f2937' : '#ffffff'; // dark slate or white
    const bgColor = primaryColor || '#1e293b';

    const userName = user?.name || 'Guest';
    const userEmail = user?.email || 'guest@example.com';
    const userInitials = userName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
        router.push('/auth');
        // Optionally redirect to login page or show a message
    };

    useEffect(() => {
        if (!user) {
            router.push('/auth');
        }
    }, [])

    return (
        <header
            className="shadow p-4 flex justify-between items-center"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <h1 className="text-lg font-semibold">{userName}</h1>

            <div className="relative" ref={dropdownRef}>
                <button
                    className="w-10 h-10 bg-gray-200 text-slate-800 rounded-full flex items-center justify-center font-bold hover:bg-gray-300 focus:outline-none focus:ring"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {userInitials}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b">
                            <p className="font-semibold">{userName}</p>
                            <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                            <Link href="/admin/settings/profile" className="text-blue-600 hover:underline text-sm">
                                Profile Settings</Link>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
