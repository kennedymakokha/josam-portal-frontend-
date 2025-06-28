'use client'
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../../../context/themeContext';
// import { useRouter } from 'ne';
import { RootState } from '../../../../store/store';
import { lightenColor } from '../../../../utils/themeUtils';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  const { user } = useSelector((state: RootState) => state.auth)
  const {

    primaryColor,
    tagline,
    logo,
    app_name,
  } = useContext(ThemeContext);

  const router = useRouter();
  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);
  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-md p-6"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Example Cards */}
        <motion.div
          style={{ background: lightenColor(primaryColor, 10) }}
          whileHover={{ scale: 1.03 }}
          className="bg-blue-500 text-white p-4 rounded-lg shadow"
        >
          <p className="text-lg font-medium">Users</p>
          <p className="text-2xl font-bold">1,204</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-green-500 text-white p-4 rounded-lg shadow"
        >
          <p className="text-lg font-medium">Forms</p>
          <p className="text-2xl font-bold">$8,492</p>
        </motion.div>
        <motion.div
        style={{ background: lightenColor("#FF0000", 10) }}
          whileHover={{ scale: 1.03 }}
          className="bg-green-500 text-white p-4 rounded-lg shadow"
        >
          <p className="text-lg font-medium">Services</p>
          <p className="text-2xl font-bold">$8,492</p>
        </motion.div>
      </div>
    </motion.div>

  );
}
