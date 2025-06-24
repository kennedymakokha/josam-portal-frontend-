'use client';

import { useContext, ChangeEvent, useState } from 'react';
import { ThemeContext } from '../../../context/themeContext';
import { useGetThemeQuery, useRegisterThemeMutation } from '../../../store/features/appApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DataTable from '../components/DataTable';

import { useGenerateCodeMutation } from '../../../store/features/codeApi';
type Theme = {
    primaryColor: string;
    tagline: string;
    app_name: string;
    code?: string | null; // Assuming code is a string or null
    _id?: string;
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
    const { data: apps, refetch } = useGetThemeQuery<{ data: Theme[] }>({ id: 'all' });
    const [submit, { isLoading: saving }] = useRegisterThemeMutation();
    const [generate] = useGenerateCodeMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [qrImage, setQrImage] = useState('');

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogo(URL.createObjectURL(file)); // Preview only
        }
    };
    const handleGenerate = async (id: string) => {


        setQrImage('');

        try {
            const formData = new FormData();
            if (!app_name) {
                throw new Error('App name is required before generating.');
            }
            formData.append('app_name', app_name);
            formData.append('color', primaryColor);
            formData.append('id', id);
            formData.append('background', '#ffffff');
            if (logoFile) formData.append('logo', logoFile);

            // Correct endpoints matching your backend
            const res = await generate(formData).unwrap()

            setQrImage(res.qrImage);
        } catch (err) {

            console.error('Error generating QR code:', err);
            // setError((err instanceof Error ? err.message : 'An unknown error occurred') || 'Failed to fetch QR codes');
        } finally {

        }
    };
    const saveTheme = async () => {
        if (!app_name || app_name.trim() === '') {
            alert('App name is required');
            return;
        }



        try {
            const formData = new FormData();
            formData.append('app_name', app_name);
            formData.append('primaryColor', primaryColor);
            formData.append('tagline', tagline);
            if (logoFile) {
                formData.append('logo', logoFile);
            }
            const response = await submit(formData).unwrap();
            await handleGenerate(response._id); // Trigger QR code generation after saving them
            handlecloseModal();
            await refetch();
            // router.push(`/admin/dashboard?name=${app_name}`);
        } catch (error) {
            console.error('Theme save failed:', error);
            alert('An error occurred while saving the theme.');
        }
    };
    const handleopenModal = () => {
        setIsModalOpen(true);
        setAppname('');
        setPrimaryColor('#000000');
        setTagline('');
        setLogo(null);
        setLogoFile(null);
    }
    const handlecloseModal = () => {
        setIsModalOpen(false);
        setAppname('');
        setPrimaryColor('#000000');
        setTagline('');
        setLogo(null);
        setLogoFile(null);
    };
    return (
        <div className="min-h-screen p-8 text-black mx-auto bg-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Your Applications</h1>
                <button
                    onClick={() => handleopenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                    + Add New App
                </button>
            </div>

            {apps?.length ? (
                <DataTable<Theme>
                    data={apps}
                    columns={[
                        { key: 'app_name', label: 'App Name' },
                        { key: 'tagline', label: 'Tagline' },
                        {
                            key: 'primaryColor',
                            label: 'Primary Color',
                            render: (value) => (
                                <span
                                    className="inline-block w-6 h-6 rounded-full"
                                    style={{ backgroundColor: value }}
                                />
                            ),
                        },
                        {
                            key: 'logo',
                            label: 'Logo',
                            render: (value) =>
                                value ? (
                                    <Image
                                        src={value}
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain w-10 h-10"
                                    />
                                ) : (
                                    'N/A'
                                ),
                        },
                        {
                            key: 'code',
                            label: 'Code',
                            render: (value) =>
                                value ? (
                                    <Image
                                        src={value}
                                        alt="Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain w-10 h-10"
                                    />
                                ) : (
                                    'N/A'
                                ),
                        },
                    ]}
                    actions={[
                        {
                            icon: (
                                <svg style={{ color: `${primaryColor}` }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            ),
                            onClick: (row) => {
                                router.push(`/admin/dashboard`);
                                setAppname(row.app_name);
                                setPrimaryColor(row.primaryColor);
                                setTagline(row.tagline);
                                setLogo(row.logo || null);
                                localStorage.setItem('app_name', row.app_name);
                            },
                            className: 'text-white/20 border border-slate-400  rounded p-1 flex items-center justify-center',
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            ),
                            onClick: (row) =>
                                router.push(`/admin/dashboard?name=${row.app_name}`),
                            className: 'text-blue-600 border border-white/20 bg-slate-200 rounded p-1 flex items-center justify-center',
                        },
                        {
                            icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            ),
                            onClick: (row) =>
                                router.push(`/admin/dashboard?name=${row.app_name}`),
                            className: 'text-white border border-white/20 bg-red-500 rounded p-1 flex items-center justify-center',
                        },
                    ]}
                    itemsPerPage={5}
                />
            ) : (
                <p className="text-center text-gray-500">No apps found.</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 text-black bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-700 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
                            onClick={() => handlecloseModal()}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Add New App</h2>

                        <div className="space-y-4">
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

                            <div>
                                <label className="block text-sm font-medium mb-1">Primary Color</label>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-16 h-10 border rounded"
                                />
                            </div>

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

                            <div>
                                <label className="block text-sm font-medium mb-1">Logo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                                {logo && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex border  size-32 items-center justify-center">
                                            <span className="text-sm text-gray-700">
                                                {logoFile ? <Image
                                                    height={200}
                                                    width={200}
                                                    src={logo}
                                                    alt="Preview Logo"
                                                    className="size-28 mt-2 object-contain border rounded"
                                                /> : 'No logo uploaded'}
                                            </span>
                                        </div>
                                        <div className="flex border size-32 items-center justify-center">
                                            <span className="text-sm text-gray-700">
                                                {qrImage ? <Image width={100} height={100} src={qrImage} alt="QR Code" className="mx-auto max-w-full" /> : 'No logo uploaded'}
                                            </span>
                                        </div>
                                    </div>

                                )}
                            </div>

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
