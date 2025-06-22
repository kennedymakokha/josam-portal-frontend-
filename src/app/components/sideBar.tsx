'use client';

import Link from 'next/link';
import { useContext } from 'react';
import Image from 'next/image';
import { ThemeContext } from '../../../context/themeContext';

// Navigation items
const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Forms', path: '/admin/dashboard/forms' },
    { name: 'Settings', path: '/settings' },
];

// Helper: detect if color is white or near-white
function isColorWhite(hex: string): boolean {
    const color = hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return r > 240 && g > 240 && b > 240;
}

export default function Sidebar() {
    const {
        primaryColor,
        app_name,
        logo,
    } = useContext(ThemeContext);

    const isWhite = isColorWhite(primaryColor);
    const bgColor = isWhite ? '#f9fafb' : primaryColor;
    const textColor = isWhite ? '#111827' : '#ffffff';
    const hoverColor = isWhite ? '#e5e7eb' : '#2563eb';

    return (
        <div
            className="w-64 min-h-screen shadow-md hidden md:block"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            <div className="p-4 flex items-center gap-3 text-xl font-bold">
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
            </div>

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
                            {item.name}
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
