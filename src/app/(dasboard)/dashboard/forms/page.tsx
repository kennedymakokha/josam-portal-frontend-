/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { useDeleteServiceMutation, useGetServicesQuery, useToggleactiveServiceMutation } from '../../../../../store/features/serviceApi';
import ServiceFormModal from '@/app/components/createModal';
import PreviewModal from '@/app/components/previewModal';
import ConfirmActionModal from '@/app/components/confirmactionModal';
import Image from 'next/image';

interface Service {
    _id?: string;
    name: string;
    inputs: any[];
    apiEndpoint: string;
    image: string | null;
    active?: boolean;
    category?: string; // Added for filtering
}

export default function ServiceTable() {
    const [submit] = useToggleactiveServiceMutation();
    const [deleteService] = useDeleteServiceMutation();
    const { data, refetch } = useGetServicesQuery(undefined, {
        selectFromResult: (result) => ({
            data: result.data as { services: Service[] } | undefined,
            isSuccess: result.isSuccess,
            isLoading: result.isLoading,
            error: result.error,
        }),
    });

    const [options, setOptions] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmDescription, setConfirmDescription] = useState('');
    const [confirmDanger, setConfirmDanger] = useState(false);
    const [newService, setNewService] = useState<any>({
        name: '',
        inputs: [],
        apiEndpoint: '',
        image: null,
        category: '',
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Category Filter
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = (option: Service) => {
        setConfirmTitle(`Delete ${option.name}?`);
        setConfirmDescription('This action cannot be undone.');
        setConfirmDanger(true);
        setConfirmAction(() => async () => {
            try {
                await deleteService(option._id).unwrap();
                refetch();
            } catch (error) {
                console.error('Error deleting service:', error);
            } finally {
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const handleToggleStatus = (option: Service) => {
        const action = option.active ? 'Deactivate' : 'Activate';
        setConfirmTitle(`${action} ${option.name}?`);
        setConfirmDescription(`This will ${action.toLowerCase()} the service.`);
        setConfirmDanger(false);
        setConfirmAction(() => async () => {
            try {
                await submit(option._id).unwrap();
                refetch();
            } catch (error) {
                console.error('Error toggling service status:', error);
            } finally {
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const handleEdit = (option: Service) => {
        setEditMode(true);
        setNewService(option);
        setShowCreateModal(true);
    };

    const handleSubmit = () => {
        alert(`Submitted form data:\n` + JSON.stringify(formData, null, 2));
        setSelectedOption(null);
    };

    const services = data?.services || options;
    const parsedServices = services.map((option) => {
        const parsedInputs =
            typeof option.inputs?.[0] === 'string'
                ? JSON.parse(option.inputs[0])
                : option.inputs;
        return { ...option, inputs: parsedInputs };
    });

    // Categories
    const categories = ['All', ...Array.from(new Set(parsedServices.map((s) => s.category || 'Uncategorized')))];

    // Filter + Paginate
    const filteredServices = selectedCategory === 'All'
        ? parsedServices
        : parsedServices.filter((s) => (s.category || 'Uncategorized') === selectedCategory);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset page on data/filter change
    }, [parsedServices.length, selectedCategory]);

    return (
        <div className="space-y-10 text-black p-4 bg-gray-100 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold">My forms</h1>
                <div className="flex gap-4 items-center">
                    <label htmlFor="category" className="font-medium">Filter by Category:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded bg-white"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            setEditMode(false);
                            setNewService({ name: '', inputs: [], image: null, apiEndpoint: '', category: '' });
                            setShowCreateModal(true);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        + Add Form
                    </button>
                </div>
            </div>

            {paginatedServices.map((option: Service) => (
                <div key={option._id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{option.name} Form</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedOption(option);
                                    setFormData({});
                                }}
                                className="bg-slate-800 text-white px-3 py-1 rounded"
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => handleEdit(option)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(option)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handleToggleStatus(option)}
                                className={`px-3 py-1 rounded text-white ${option.active ? 'bg-gray-500' : 'bg-green-600'}`}
                            >
                                {option.active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div>
                            <strong>API Endpoint:</strong>{' '}
                            <span className="text-gray-700">{option.apiEndpoint || <em className="text-gray-400">N/A</em>}</span>
                        </div>

                        <div>
                            <strong>Form Image:</strong>
                            <div className="mt-2">
                                {option.image ? (
                                    typeof option.image === 'string' ? (
                                        <Image width={100} height={100} src={option.image} alt="" className="w-32 h-32 object-cover rounded border" />
                                    ) : (
                                        <Image height={1000} width={100} src={URL.createObjectURL(option.image)} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                                    )
                                ) : (
                                    <span className="text-gray-400 italic">No image provided</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <strong>Category:</strong>{' '}
                            <span className="text-gray-700">{option.category || <em className="text-gray-400">Uncategorized</em>}</span>
                        </div>

                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-gray-200 text-black">
                                <tr>
                                    <th className="px-4 py-2 text-left">Input Name</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Required</th>
                                    <th className="px-4 py-2 text-left">Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {option.inputs.length > 0 ? (
                                    option.inputs.map((input: any, idx: number) => (
                                        <tr key={idx} className="border-t">
                                            <td className="px-4 py-2">{input.name || <em className="text-gray-400">Unnamed</em>}</td>
                                            <td className="px-4 py-2 capitalize">{input.type}</td>
                                            <td className="px-4 py-2">{input.required ? 'Yes' : 'No'}</td>
                                            <td className="px-4 py-2">
                                                {(input.type === 'selectbox' || input.type === 'radio') && input.options?.length ? (
                                                    <ul className="list-disc pl-5">
                                                        {input.options.map((opt: { label: string; value: string }, i: number) => (
                                                            <li key={i}>
                                                                {opt.label || <em className="text-gray-400">No Label</em>}{' '}
                                                                <span className="text-gray-500">({opt.value || 'No Value'})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-400 italic">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                                            No input fields defined.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Modals */}
            {selectedOption && (
                <PreviewModal
                    service={selectedOption}
                    formData={formData}
                    onChange={handleInputChange}
                    onClose={() => setSelectedOption(null)}
                    onSubmit={handleSubmit}
                />
            )}

            {showCreateModal && (
                <ServiceFormModal
                    editMode={editMode}
                    newService={newService}
                    refetch={async () => await refetch()}
                    setNewService={setNewService}
                    onClose={() => setShowCreateModal(false)}
                    onSave={(service) => {
                        if (editMode) {
                            setOptions((prev) =>
                                prev.map((item) =>
                                    item.name === service.name ? service : item
                                )
                            );
                        } else {
                            setOptions((prev) => [...prev, service]);
                        }
                        setShowCreateModal(false);
                    }}
                />
            )}

            {showConfirmModal && confirmAction && (
                <ConfirmActionModal
                    title={confirmTitle}
                    description={confirmDescription}
                    danger={confirmDanger}
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
}
