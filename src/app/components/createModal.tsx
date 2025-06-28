/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  useRegisterServiceMutation,
  useUpdateServiceMutation,
} from '../../../store/features/serviceApi';

import LoanDetailsSection from './ServiceFormModal/LoanDetailsSection';
import InputFieldSection from './ServiceFormModal/InputFieldSection';
import { Service } from '../../../types/forms';

type InputOption = {
  label: string;
  value: string;
};

type InputField = {
  name: string;
  type: 'text' | 'number' | 'password' | 'selectbox' | 'radio' | 'date' | 'checkbox';
  value: string | boolean | number | any[];
  required: boolean;
  options?: InputOption[];
};

type LoanDetails = {
  amount: number;
  interestRate?: number;
  tenure?: number;
  pros?: string[];
  termsAndConditions?: string;
};

type ServiceData = {
  name: string;
  _id?: string;
  inputs: InputField[];
  app_name: string;
  apiEndpoint?: string;
  image?: File | null;
  category?: string;
  loanDetails?: LoanDetails;
  loanType?: string; // <-- NEW
};

interface ServiceFormModalProps {
  editMode?: boolean;
  newService: ServiceData;
  setNewService: React.Dispatch<React.SetStateAction<Service | null>>;
  onClose: () => void;
  onSave: (service: ServiceData) => void;
  refetch: () => void;
  data?: []
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  editMode = false,
  newService,
  refetch,
  onClose,
  data
}) => {
  const [localService, setLocalService] = useState<ServiceData>(newService);

  useEffect(() => {
    setLocalService(newService);
  }, [newService]);

  const handleInputChange = (
    fieldIndex: number,
    key: keyof InputField,
    value: any
  ) => {
    const updated = [...localService.inputs];
    (updated[fieldIndex][key] as typeof value) = value;
    setLocalService((prev) => ({ ...prev, inputs: updated }));
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    key: keyof InputOption,
    value: string
  ) => {
    const updated = [...localService.inputs];
    const options = updated[fieldIndex].options || [];
    options[optionIndex][key] = value;
    updated[fieldIndex].options = options;
    setLocalService((prev) => ({ ...prev, inputs: updated }));
  };

  const addInputField = () => {
    setLocalService((prev) => ({
      ...prev,
      inputs: [
        ...prev.inputs,
        {
          name: '',
          type: 'text',
          value: '',
          required: false,
          options: [],
        },
      ],
    }));
  };

  const addOption = (fieldIndex: number) => {
    const updated = [...localService.inputs];
    if (!updated[fieldIndex].options) updated[fieldIndex].options = [];
    updated[fieldIndex].options!.push({ label: '', value: '' });
    setLocalService((prev) => ({ ...prev, inputs: updated }));
  };

  const [updateService] = useUpdateServiceMutation();
  const [submitService] = useRegisterServiceMutation();

  const handleSave = async () => {
    if (!localService.name.trim()) {
      return alert('Service name is required.');
    }

    const formData = new FormData();
    formData.append('name', localService.name);
    formData.append('app_name', localService.app_name || localStorage.getItem('app_name') || '');
    if (localService.apiEndpoint)
      formData.append('apiEndpoint', localService.apiEndpoint);
    if (localService.image) formData.append('image', localService.image);
    formData.append('category', localService.category || 'uncategorized');
    if (localService.loanType) formData.append('loanType', localService.loanType); // <-- NEW
    formData.append('inputs', JSON.stringify(localService.inputs));
    if (localService.category === 'loan' && localService.loanDetails) {
      formData.append('loanDetails', JSON.stringify(localService.loanDetails));
    }

    try {
      if (editMode) {
        if (localService._id) {
          await updateService({ data: formData, _id: localService._id }).unwrap();
        } else {
          console.error('Cannot edit service without _id');
        }
        refetch();
      } else {
        await submitService(formData).unwrap();
      }
      refetch();
      onClose();
    } catch (error) {
      console.error('Service submission failed:', error);
      alert('Failed to save the service.');
    }
  };

  return (
    <div className="fixed text-black inset-0 bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-700 opacity-96 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          {editMode ? 'Edit Service' : `Create ${localService.category || ''} Form`}
        </h2>

        <div className="space-y-4">
          {/* Category Selector */}
          <select
            className="w-full border px-3 py-2 rounded"
            value={localService.category || ''}
            onChange={(e) =>
              setLocalService((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
          >
            <option value="">Select Category</option>
            {!data!.some((item: any) => item.category === "registration") &&
              <option value="registration">Sign up</option>
            }
            {!data!.some((item: any) => item.category === "login") &&
              <option value="login">Login</option>
            }
            <option value="service">Service</option>
            <option value="loan">Loan</option>

          </select>

          {/* Form Type Selector */}
          {localService.category === 'loan' && <select
            className="w-full border px-3 py-2 rounded"
            value={localService.loanType || ''}
            onChange={(e) =>
              setLocalService((prev) => ({
                ...prev,
                loanType: e.target.value,
              }))
            }
          >
            <option value="">Select Form Type</option>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="employment">Employment</option>
          </select>}

          {/* Service Name */}
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder={`${localService.category || 'form'} name`}
            value={localService.name}
            onChange={(e) =>
              setLocalService((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          {/* API Endpoint */}
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="API Endpoint"
            value={localService.apiEndpoint || ''}
            onChange={(e) =>
              setLocalService((prev) => ({
                ...prev,
                apiEndpoint: e.target.value,
              }))
            }
          />

          {/* Image Upload */}
          {localService.category === 'service' && (
            <input
              type="file"
              accept="image/*"
              className="w-full border px-3 py-2 rounded"
              onChange={(e) =>
                setLocalService((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
          )}
          {localService.category === 'loan' && (
            <LoanDetailsSection
              loanDetails={localService.loanDetails}
              setLoanDetails={(details) =>
                setLocalService(prev => ({
                  ...prev,
                  loanDetails: {
                    ...details,
                    amount: Number(details.amount), // convert amount here
                  }
                }))
              }
            // setLoanDetails={(details) =>
            //   setLocalService(prev => ({
            //     ...prev,
            //     loanDetails: {
            //       ...prev.loanDetails,
            //       amount: Number(value),  // convert string to number explicitly
            //     },
            //   }))
            //   // setLocalService((prev) => ({
            //   //   ...prev,
            //   //   loanDetails: details,
            //   // }))
            // }
            />
          )}

          {localService.inputs.map((input, index) => (
            <InputFieldSection
              key={index}
              input={input}
              index={index}
              onInputChange={handleInputChange}
              onOptionChange={handleOptionChange}
              onAddOption={addOption}
            />
          ))}
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={addInputField}
          >
            + Add Input Field
          </button>

          <button
            type="button"
            className="mt-6 w-full bg-green-600 text-white py-3 rounded"
            onClick={handleSave}
          >
            {editMode ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal;
