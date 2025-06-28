'use client';

import Link from 'next/link';
import { useContext } from 'react';
import Image from 'next/image';
import { ThemeContext } from '../../../context/themeContext';
import { isColorWhite, lightenColor } from '../../../utils/themeUtils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';



// Helper: detect if color is white or near-white


export default function Sidebar() {
    const {
        primaryColor,
        app_name,
        logo,
    } = useContext(ThemeContext);
    const { user } = useSelector((state: RootState) => state.auth)
    const isWhite = isColorWhite(primaryColor);
    const bgColor = isWhite ? '#f9fafb' : primaryColor;
    const textColor = isWhite ? '#111827' : '#ffffff';
    const hoverColor = isWhite ? '#e5e7eb' : lightenColor(primaryColor,20);
    const Adminroutes = [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            nested: true,
            icon: "wallet-sharp"
        },
        { title: 'Forms', path: '/admin/dashboard/forms' },
        { title: 'Settings', path: '/settings' },
    ]

    const superAdminroutes = [
        {
            title: "Dashboard",
            path: "/admin",
            nested: true,
            icon: "swap-horizontal-outline"
        },

    ]
    const navItems = user?.role === 'superadmin' ? superAdminroutes : Adminroutes;
    return (
        <div
            className="w-64 min-h-screen shadow-md hidden md:block"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <Link href='/admin/dashboard' className="p-4 flex items-center gap-3 text-xl font-bold">
                {logo && typeof logo === 'string' ? (
                    <Image
                        src={logo}
                        alt="Logo"
                        width={36}
                        height={36}
                        className="object-contain rounded"
                    />
                ) : (
                    <div className="w-9 h-9 bg-gray-300 rounded" />
                )}
                <span>{app_name || 'App'} Portal</span>
            </Link>

            <nav className="p-4 space-y-2">
                {navItems.map(item => (
                    <Link key={item.path} href={item.path}>
                        <span
                            className="block p-2 rounded cursor-pointer transition"
                            style={{ backgroundColor: 'transparent' }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = hoverColor)
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = 'transparent')
                            }
                        >
                            {item.title}
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
