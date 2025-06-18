'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { logout } from '../../../store/slices/authSlice';
// import { logout } from '../../../store/authSlice'; // Update path as needed

export default function Header() {
    const { user } = useSelector((state: RootState) => state.auth);
    
    console.log(user)
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userName = user?.name || 'Guest';
    const userEmail = user?.email || 'guest@example.com';
    const userInitials = userName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-slate-800 shadow p-4 flex justify-between items-center text-white relative">
            <h1 className="text-lg font-semibold">{userName}</h1>

            <div className="relative" ref={dropdownRef}>
                <div
                    className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-slate-800 font-bold cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {userInitials}
                </div>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md z-10">
                        <div className="px-4 py-2 border-b">
                            <p className="font-medium">{userName}</p>
                            <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
