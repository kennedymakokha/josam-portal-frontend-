'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetThemeQuery, useUpdateThemeMutation } from '../../../../../store/features/appApi';
import { RootState } from '../../../../../store/store';
import Image from 'next/image';

interface AppData {
    _id?: string;
    app_name: string;
    tagline: string;
    logo: string;
    code: string;
    primaryColor: string;
}


export default function AppProfile() {

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<AppData | null>(null);
    const [updateTheme] = useUpdateThemeMutation();
    const { user } = useSelector((state: RootState) => state.auth)
    const { data: app, refetch } = useGetThemeQuery(
        { id: user?.app_id as string },
        { skip: !user?.app_id }
    );


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (form) {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async () => {
        if (!form || !form._id) return;

        // Create a FormData instance
        const formData = new FormData();
        formData.append('app_name', form.app_name);
        formData.append('tagline', form.tagline);
        formData.append('logo', form.logo);
        formData.append('code', form.code);
        formData.append('primaryColor', form.primaryColor);

        const payload = {
            _id: form._id,
            data: formData,
        };

        try {
            await updateTheme(payload).unwrap();
            setForm(null);
            await refetch();
            setEditing(false);
        } catch (error) {
            console.error('Failed to update theme', error);
            alert('Failed to save changes.');
        }
    };


    if (!app) return <p className="text-center text-gray-500">Loading...</p>;
    const toggleEditing = () => {
        if (!editing) {
            // Enter edit mode, initialize form with app data
            setForm(app as AppData);
            setEditing(true);
        } else {
            // Cancel edit mode, clear form
            setForm(null);
            setEditing(false);
        }
    };
    return (
        <div className="max-w-xl mx-auto p-6 bg-white text-black rounded shadow mt-10">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">App Profile</h1>
                {/* <button
                    onClick={() => { setEditing(!editing); setForm(app !== undefined && app) }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {editing ? 'Cancel' : 'Edit'}
                </button> */}
                <button
                    onClick={toggleEditing}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {editing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">App Name</label>
                    {editing ? (
                        <input
                            name="app_name"
                            value={form?.app_name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    ) : (
                        <p className="mt-1 text-gray-800">{app.app_name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Tagline</label>
                    {editing ? (
                        <input
                            name="tagline"
                            value={form?.tagline}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    ) : (
                        <p className="mt-1 text-gray-800">{app?.tagline}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Primary Color</label>
                    {editing ? (
                        <input
                            type="color"
                            name="primaryColor"
                            value={form?.primaryColor}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    ) : (
                        <div className="mt-1 w-6 h-6 rounded-full" style={{ backgroundColor: app.primaryColor }} />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Logo URL</label>
                    {editing ? (
                        <input
                            name="logo"
                            value={form?.logo}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded p-2"
                        />
                    ) : (
                        <Image height={68} width={68} src={app.logo ?? ''} alt="App Logo" className="h-16 mt-1 rounded" />
                    )}
                </div>

                {editing && (
                    <button
                    
                        onClick={handleSave}
                        className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
}
