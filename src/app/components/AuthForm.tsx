'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLoginMutation, useSignupMutation } from '../../../store/features/authApi';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSuccess } from '../../../store/slices/authSlice';
import { useDispatch } from 'react-redux';

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AuthForm({ setIsLogin, isLogin }: AuthFormProps) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    fcm_token: "fSUKQBQSTnOU6Vn7aygyPw:APA91bHFRWNbsOCj6Vdrri4QY-NBZz-H4ZhmzKVlJu6EoI9kYWP6nY2cgP9WI0MIOhn8FLmGjiMzLYg1CbMmpfdJbxHoeteJKCSieSu_xvf8ZMOQekgg09Y",
    name: '',
    phone_number: '',
    app_no: "0997",
    email: '',
  });
  const dispatch = useDispatch()
  const [registerUser] = useSignupMutation();
  const [loginUser] = useLoginMutation();

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  // Inside the component
  // const { data: session } = useSession();
  // console.log(session)
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/admin/dashboard' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear message on new input
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await loginUser({ app_no: formData.identifier !== "0700000000" ? "" : formData.app_no, fcm_token: formData.fcm_token, identifier: formData.identifier, password: formData.password }).unwrap() as LoginResponse;
        console.log(res, "login response")
        dispatch(loginSuccess({
          token: res.token,
          user: {
            _id: res.user._id,
            phone_number: res.user.phone_number,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            app_id: res.user?.app_id
          }
        }))
        setMessage(`Logged in successfully with ${formData.identifier}`);
        setMessageType('success');

        // if (res.user.role === 'superadmin') {
        //   router.push("/admin")
        // } else if (res.user.role === 'admin') {
        //   console.log(res.user.role,"admin")
        router.push("/admin/dashboard");
        // }
        // else {
        //   router.push("/404");
        // }
      } else {
        await registerUser({
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password,
        }).unwrap();
        setMessage(`Signed up successfully as ${formData.name}`);
        setMessageType('success');
        setIsLogin(true)
      }
    } catch (error) {

      if (error instanceof Error) {
        const err = error as ApiError;
        const errorMsg = err.data || err.error || err.message || 'Something went wrong';
        setMessage(errorMsg);
        setMessageType('error');
      }

    }
    clearMessage();
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-4 text-slate-800"
      >
        {!isLogin && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                required
              />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                placeholder="+1234567890"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                required
              />
            </motion.div>
          </>
        )}

        {isLogin && (
          <div>
            <label className="block text-sm font-medium">Email or Phone Number</label>
            <input
              type="text"
              name="identifier"
              placeholder="Email or phone number"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Sign in with Google
        </button>
      </motion.form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </>
  );
}
