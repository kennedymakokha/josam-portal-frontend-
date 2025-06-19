/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Modal({ isOpen, onClose, children }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-700 opacity-96 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-xl">×</button>
                {children}
            </div>
        </div>
    );
}
