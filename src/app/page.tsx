'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-700 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-lg mx-4 border border-white/20"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide">
          Dynamic Form Builder
        </h1>
        <p className="text-white/80 text-lg mb-8 leading-relaxed">
          Effortlessly create, customize, and deploy stunning forms without writing a single line of code.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/auth')}
          className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
