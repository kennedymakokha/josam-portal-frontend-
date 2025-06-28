import React from 'react';
import { InputField, InputOption } from './types';

interface InputFieldSectionProps {
  input: InputField;
  index: number;
  // @ts-ignore
  onInputChange: (index: number, key: keyof InputField, value: any) => void;
  onOptionChange: (
    fieldIndex: number,
    optionIndex: number,
    key: keyof InputOption,
    value: string
  ) => void;
  onAddOption: (fieldIndex: number) => void;
}

const InputFieldSection: React.FC<InputFieldSectionProps> = ({
  input,
  index,
  onInputChange,
  onOptionChange,
  onAddOption,
}) => {
  return (
    <div className="p-4 bg-gray-100 border rounded space-y-2">
      <input
        type="text"
        className="w-full border px-3 py-2 rounded"
        placeholder="Input name"
        value={input.name}
        onChange={(e) => onInputChange(index, 'name', e.target.value)}
      />
      <select
        className="w-full border px-3 py-2 rounded"
        value={input.type}
        onChange={(e) => onInputChange(index, 'type', e.target.value)}
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
        value={String(input.value ?? '')}
        onChange={(e) => onInputChange(index, 'value', e.target.value)}
      />
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={input.required}
          onChange={(e) => onInputChange(index, 'required', e.target.checked)}
        />
        Required
      </label>

      {(input.type === 'selectbox' || input.type === 'radio') && (
        <div className="mt-2 space-y-2">
          <label className="block font-semibold">Options</label>
          {(input.options || []).map((option, optIdx) => (
            <div key={optIdx} className="flex gap-2 items-center">
              <input
                type="text"
                className="border px-2 py-1 rounded flex-grow"
                placeholder="Label"
                value={option.label}
                onChange={(e) => onOptionChange(index, optIdx, 'label', e.target.value)}
              />
              <input
                type="text"
                className="border px-2 py-1 rounded flex-grow"
                placeholder="Value"
                value={option.value}
                onChange={(e) => onOptionChange(index, optIdx, 'value', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm underline text-blue-600"
            onClick={() => onAddOption(index)}
          >
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
};

export default InputFieldSection;
