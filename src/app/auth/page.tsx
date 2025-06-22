'use client';
import { useEffect, useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    // const router = useRouter();

    // const { user } = useSelector((state: RootState) => state.auth)

    // useEffect(() => {
    //     if (user) {
    //         router.push('/admin');
    //     }
    // }, [user, router]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-700">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl text-slate-800 font-bold mb-6 text-center">
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h1>
                <AuthForm setIsLogin={setIsLogin} isLogin={isLogin} />
                <p className="mt-4 text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}
