/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import {
  useRegisterServiceMutation,
  useUpdateServiceMutation,
} from '../../../store/features/serviceApi';

type InputOption = {
  label: string;
  value: string;
};

type InputField = {
  name: string;
  type: 'text' | 'number' | 'password' | 'selectbox' | 'radio' | 'date' | 'checkbox';
  value: string;
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
  apiEndpoint?: string;
  image?: File | null;
  category?: string;
  loanDetails?: LoanDetails;
};

interface ServiceFormModalProps {
  editMode?: boolean;
  newService: ServiceData;
  setNewService: React.Dispatch<React.SetStateAction<ServiceData>>;
  onClose: () => void;
  onSave: (service: ServiceData) => void;
  refetch: () => void;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  editMode = false,
  newService,
  refetch,
  onClose,
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
    if (localService.apiEndpoint)
      formData.append('apiEndpoint', localService.apiEndpoint);
    if (localService.image) formData.append('image', localService.image);
    formData.append('category', localService.category || 'uncategorized'); // Ensure always sent
    formData.append('inputs', JSON.stringify(localService.inputs));
    if (localService.category === 'loan' && localService.loanDetails) {
      formData.append('loanDetails', JSON.stringify(localService.loanDetails));
    }

    try {
      if (editMode) {
        await updateService({ data: formData, _id: localService?._id }).unwrap();
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
            <option value="service">Service</option>
            <option value="loan">Loan</option>
          </select>

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

          {/* Loan Details Section */}
          {localService.category === 'loan' && (
            <div className="p-4 bg-gray-100 border rounded space-y-3">
              <h3 className="font-semibold text-lg">Loan Details</h3>

              <label>
                Amount
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={localService.loanDetails?.amount || ''}
                  onChange={(e) =>
                    setLocalService((prev) => ({
                      ...prev,
                      loanDetails: {
                        ...(prev.loanDetails || {}),
                        amount: Number(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </label>

              <label>
                Interest Rate (%)
                <input
                  type="number"
                  step="0.1"
                  className="w-full border px-3 py-2 rounded"
                  value={localService.loanDetails?.interestRate || ''}
                  onChange={(e) =>
                    setLocalService((prev) =>
                    ({
                      ...prev,
                      loanDetails: {
                        ...(prev.loanDetails ?? {}),
                        interestRate: Number(e.target.value) || 0,
                      },
                    } as ServiceData)
                    )
                  }

                />
              </label>

              <label>
                Tenure (months)
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={localService.loanDetails?.tenure || ''}
                  onChange={(e) =>
                    setLocalService((prev) =>
                    ({
                      ...prev,
                      loanDetails: {
                        ...(prev.loanDetails ?? {}),
                        tenure: Number(e.target.value) || 0,
                      },
                    } as ServiceData)
                    )
                  }

                />
              </label>

              <div>
                <label className="block font-semibold mb-1">Pros</label>
                {(localService.loanDetails?.pros || []).map((pro, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full border px-3 py-2 rounded mb-2"
                    value={pro}

                    onChange={(e) => {
                      const newPros = [...(localService.loanDetails?.pros || [])];
                      newPros[index] = e.target.value;
                      setLocalService((prev) =>
                      ({
                        ...prev,
                        loanDetails: {
                          ...(prev.loanDetails ?? {}),
                          pros: newPros,
                        },
                      } as ServiceData)

                      )
                    }}
                  />
                ))}
                <button
                  type="button"
                  className="text-sm underline text-blue-600"
                  onClick={() => {
                    const newPros = [...(localService.loanDetails?.pros || []), ''];
                    setLocalService((prev) =>
                    ({
                      ...prev,
                      loanDetails: {
                        ...(prev.loanDetails ?? {}),
                        pros: newPros,
                      },
                    } as ServiceData)

                    )
                  }}
                >
                  + Add More Pros
                </button>
              </div>

              <label>
                Terms and Conditions
                <textarea
                  rows={4}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Terms and Conditions"
                  value={localService.loanDetails?.termsAndConditions || ''}
                  onChange={(e) =>
                    setLocalService((prev) =>
                    ({
                      ...prev,
                      loanDetails: {
                        ...(prev.loanDetails ?? {}),
                        termsAndConditions: e.target.value,
                      },
                    } as ServiceData)
                    )
                  }

                />
              </label>
            </div>
          )}

          {/* Dynamic Inputs */}
          {localService.inputs.map((input, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 border rounded space-y-2"
            >
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Input name"
                value={input.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              />
              <select
                className="w-full border px-3 py-2 rounded"
                value={input.type}
                onChange={(e) =>
                  handleInputChange(index, 'type', e.target.value as InputField['type'])
                }
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="password">Password</option>
                <option value="selectbox">Select Box</option>
                <option value="radio">Radio</option>
                <option value="date">Date</option>
                <option value="checkbox">Checkbox</option>
              </select>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                placeholder="Input value"
                value={input.value}
                onChange={(e) => handleInputChange(index, 'value', e.target.value)}
              />
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.required}
                  onChange={(e) => handleInputChange(index, 'required', e.target.checked)}
                />
                Required
              </label>

              {/* Options for selectbox, radio */}
              {(input.type === 'selectbox' || input.type === 'radio') && (
                <div className="mt-2 space-y-2">
                  <label className="block font-semibold">Options</label>
                  {(input.options || []).map((option, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="border px-2 py-1 rounded flex-grow"
                        placeholder="Label"
                        value={option.label}
                        onChange={(e) =>
                          handleOptionChange(index, idx, 'label', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="border px-2 py-1 rounded flex-grow"
                        placeholder="Value"
                        value={option.value}
                        onChange={(e) =>
                          handleOptionChange(index, idx, 'value', e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-sm underline text-blue-600"
                    onClick={() => addOption(index)}
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
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
