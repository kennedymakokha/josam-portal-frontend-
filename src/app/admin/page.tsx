'use client';

import { useContext, ChangeEvent, useState } from 'react';
import { ThemeContext } from '../../../context/themeContext';
import {
    useGetThemeQuery,
    useRegisterThemeMutation,
} from '../../../store/features/appApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
type Theme = {
    primaryColor: string;
    tagline: string;
    app_name: string;
    logo: string | null;
};
export default function AdminPage() {
    const {
        primaryColor,
        setPrimaryColor,
        app_name,
        setAppname,
        tagline,
        setTagline,
        logo,
        setLogo,
    } = useContext(ThemeContext);

    const router = useRouter();
    const [submit, { isLoading: saving }] = useRegisterThemeMutation();
    const { data: apps, refetch } = useGetThemeQuery<{ data: Theme[] }>({ name: 'all' });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const saveTheme = async () => {
        if (!app_name || app_name.trim() === '') {
            alert('App name is required');
            return;
        }

        try {
            await submit({
                primaryColor,
                tagline,
                logo,
                app_name,
            }).unwrap();

            setIsModalOpen(false);
            await refetch()
            router.refresh();
        } catch (error) {
            console.error('Theme save failed:', error);
            alert('An error occurred while saving the theme.');
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Applications</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                    + Add New App
                </button>
            </div>

            {/* App List Table */}
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4">App Name</th>
                            <th className="py-3 px-4">Tagline</th>
                            <th className="py-3 px-4">Primary Color</th>
                            <th className="py-3 px-4">Logo</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps?.length > 0 ? (
                            apps.map((app: any) => (
                                <tr key={app._id} className="border-t">
                                    <td className="py-2 px-4">{app.app_name}</td>
                                    <td className="py-2 px-4">{app.tagline}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className="inline-block w-6 h-6 rounded-full"
                                            style={{ backgroundColor: app.primaryColor }}
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        {app.logo ? (
                                            <Image
                                                height={400}
                                                width={200}
                                                src={app.logo}
                                                alt="Logo"
                                                className="w-10 h-10 object-contain"
                                            />
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() =>
                                                router.push(`/admin/dashboard?name=${app.app_name}`)
                                            }
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No apps found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 text-black bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add New App</h2>

                        <div className="space-y-4">
                            {/* App Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">App Name</label>
                                <input
                                    type="text"
                                    value={app_name || ''}
                                    onChange={(e) => setAppname(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    placeholder="Enter app name"
                                />
                            </div>

                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Primary Color</label>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-16 h-10 border rounded"
                                />
                            </div>

                            {/* Tagline */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    className="border p-2 w-full rounded"
                                    placeholder="Enter a tagline"
                                />
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                                {logo && (
                                    <Image
                                        height={200}
                                        width={200}
                                        src={logo}
                                        alt="Preview Logo"
                                        className="w-20 h-20 mt-2 object-contain border rounded"
                                    />
                                )}
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={saveTheme}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow mt-2"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
