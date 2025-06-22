'use client';

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import DataTable from '@/app/components/DataTable';
import PreviewModal from '@/app/components/previewModal';
import ServiceFormModal from '@/app/components/createModal';
import ConfirmActionModal from '@/app/components/confirmactionModal';
import { ThemeContext } from '../../../../../context/themeContext';
import { getTextColorForBackground } from '../../../../../utils/themeUtils';
import {
    useGetServicesQuery,
    useDeleteServiceMutation,
    useToggleactiveServiceMutation,
} from '../../../../../store/features/serviceApi';

export interface Service {
    _id?: string;
    name: string;
    inputs: any[];
    apiEndpoint: string;
    image?: File | string | null;
    active?: boolean;
    category?: string;
}

// Handle either File or string URL image values
function ImageCell({ val }: { val: string | File | null | undefined }) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (val && !(typeof val === 'string')) {
            const url = URL.createObjectURL(val);
            setObjectUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setObjectUrl(null);
    }, [val]);

    if (!val) return <span className="text-gray-400 italic">No Image</span>;

    return (
        <Image
            src={typeof val === 'string' ? val : objectUrl!}
            alt="Service"
            width={60}
            height={60}
            className="rounded object-cover"
        />
    );
}

export default function ServiceManagerPage() {
    const { primaryColor } = useContext(ThemeContext);
    const textColor = getTextColorForBackground(primaryColor);

    const { data, refetch, isFetching } = useGetServicesQuery(undefined);
    const [deleteService] = useDeleteServiceMutation();
    const [toggleService] = useToggleactiveServiceMutation();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const servicesData: Service[] = (data as any)?.services?.map((s: Service) => ({
        ...s,
        inputs:
            typeof s.inputs?.[0] === 'string'
                ? JSON.parse(s.inputs[0])
                : s.inputs,
    })) || [];

    // States for modals and table
    const [showFormModal, setShowFormModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formService, setFormService] = useState<Service>({
        name: '',
        inputs: [],
        apiEndpoint: '',
        image: null,
        category: '',
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');
    const [confirmDanger, setConfirmDanger] = useState(false);

    const [previewService, setPreviewService] = useState<Service | null>(
        null
    );
    const [formData, setFormData] = useState<Record<string, string>>({});

    // Category filtering
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = [
        'All',
        ...Array.from(
            new Set(servicesData.map(s => s.category || 'Uncategorized'))
        ),
    ];
    const filtered = selectedCategory === 'All'
        ? servicesData
        : servicesData.filter(
            s => (s.category || 'Uncategorized') === selectedCategory
        );

    // Handlers
    const handleAdd = () => {
        setFormService({
            name: '',
            inputs: [],
            apiEndpoint: '',
            image: null,
            category: '',
        });
        setEditMode(false);
        setShowFormModal(true);
    };

    const handleEdit = (s: Service) => {
        setFormService(s);
        setEditMode(true);
        setShowFormModal(true);
    };

    const handleDelete = (s: Service) => {
        setConfirmTitle(`Delete '${s.name}'?`);
        setConfirmDescription('This action cannot be undone.');
        setConfirmDanger(true);
        setConfirmAction(() => async () => {
            await deleteService(s._id).unwrap();
            refetch();
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const handleToggle = (s: Service) => {
        setConfirmTitle(`${s.active ? 'Deactivate' : 'Activate'} '${s.name}'?`);
        setConfirmDescription(`This will ${s.active ? 'deactivate' : 'activate'} the service.`);
        setConfirmDanger(false);
        setConfirmAction(() => async () => {
            await toggleService(s._id).unwrap();
            refetch();
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const handlePreview = (s: Service) => {
        setFormData({});
        setPreviewService(s);
    };

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1
                    className="text-2xl font-bold"
                    style={{
                        backgroundColor: primaryColor,
                        color: textColor,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                    }}
                >
                    My Forms
                </h1>
                <div className="flex gap-4 items-center">
                    <label htmlFor="categoryFilter" className="font-medium">Filter:</label>
                    <select
                        id="categoryFilter"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded bg-white"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 rounded font-medium"
                        style={{
                            backgroundColor: primaryColor,
                            color: textColor,
                        }}
                    >
                        + Add
                    </button>
                </div>
            </div>

            {/* DataTable */}
            <DataTable<Service>
                data={filtered}
                columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'apiEndpoint', label: 'API Endpoint' },
                    {
                        key: 'image',
                        label: 'Image',
                        render: val => <ImageCell val={val} />,
                    },
                    {
                        key: 'active',
                        label: 'Status',
                        render: val => (
                            <span className={`font-semibold ${val ? 'text-green-600' : 'text-red-500'}`}>
                                {val ? 'Active' : 'Inactive'}
                            </span>
                        ),
                    },
                ]}
                actions={[
                    {
                        label: 'Preview',
                        onClick: handlePreview,
                        className: 'bg-slate-800 text-white px-2 py-1 rounded',
                        disabled: isFetching,
                    },
                    {
                        label: 'Edit',
                        onClick: handleEdit,
                        className: 'bg-yellow-500 text-white px-2 py-1 rounded',
                        disabled: isFetching,
                    },
                    {
                        label: 'Delete',
                        onClick: handleDelete,
                        className: 'bg-red-600 text-white px-2 py-1 rounded',
                        disabled: isFetching,
                    },
                    {
                        label: 'Toggle',
                        onClick: handleToggle,
                        className: 'bg-indigo-600 text-white px-2 py-1 rounded',
                        disabled: isFetching,
                    },
                ]}
            />

            {/* Modals */}
            {showFormModal && formService && (
                <ServiceFormModal
                    editMode={editMode}
                    newService={{
                        ...formService,
                        image:
                            editMode && formService.image instanceof File
                                ? formService.image
                                : null,
                    }}
                    refetch={refetch}
                    setNewService={setSelectedService} // update formService, not selectedService
                    onClose={() => setShowFormModal(false)}
                    onSave={() => {
                        setShowFormModal(false);
                        refetch();
                    }}
                />
            )}

            {showConfirmModal && (
                <ConfirmActionModal
                    title={confirmTitle}
                    description={confirmDescription}
                    danger={confirmDanger}
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            {previewService && (
                <PreviewModal
                    service={previewService}
                    formData={formData}
                    onChange={handleInputChange}
                    onClose={() => setPreviewService(null)}
                    onSubmit={() => {
                        alert(`Submitted form data:\n${JSON.stringify(formData, null, 2)}`);
                        setPreviewService(null);
                    }}
                />
            )}
        </div>
    );
}
