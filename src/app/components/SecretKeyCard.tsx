// components/SecretKeyCard.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateSecretKey } from '../../../utils/keygen';
import { useUpdateKeyMutation } from '../../../store/features/authApi';

export default function SecretKeyCard() {
    const [key, setKey] = useState('');
    const [copied, setCopied] = useState(false);
    const [upateKey] = useUpdateKeyMutation()
    const handleCopy = async () => {
        if (!key) return;
        try {
            await navigator.clipboard.writeText(key);
            // await upateKey({ secret_key: key }).unwrap()
            setCopied(true);
            setTimeout(() => { setCopied(false); setKey('') }, 2000); // Reset after 2s
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <motion.div
            className="bg-white shadow-md rounded-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="text-xl font-semibold mb-4">Secret Key Generator</h2>
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className={`flex items-center px-4 py-2 rounded-md ${key ? "bg-slate-300 text-sm italic" : "bg-gray-100"}`}>
                    <p className="break-all">{key || 'Click below to generate a key'}</p>
                </div>

                <div className="flex gap-2">
                    {
                        key ? <button
                            onClick={handleCopy}
                            disabled={!key}
                            className={`px-4 py-2 rounded ${key ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button> :
                            <button
                                onClick={() => setKey(generateSecretKey())}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded"
                            >
                                Generate Key
                            </button>

                    }
                </div>
            </div>
        </motion.div>
    );
}
