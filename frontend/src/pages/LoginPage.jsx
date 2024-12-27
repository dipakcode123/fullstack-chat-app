import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, MailIcon, MessageSquare} from 'lucide-react'
import { Link } from 'react-router-dom'


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState
  ({
    email: "",
    password: ""
  })

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  }

  return (
    <div className='min-h-screen grid'>
      <div className="flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12  rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className="text-base-content/60">Login into your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="form-control">
              <label className='label'>
                <span className=' label-text font-medium'>Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className=' size-5 to-base-content/40' />
                </div>
                <input type="text" className={`input input-bordered w-full pl-10`}
                  placeholder='john@doe.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-control">
              <label className='label'>
                <span className=' label-text font-medium'>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                  <Lock className=' size-5 to-base-content/40' />
                </div>
                <input type={showPassword ? "text" : "password"} className={`input input-bordered w-full pl-10  placeholder:text-sm`}
                  placeholder='●●●●●●●●'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button className=' absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                  // disabled={isLoggingIn}
                  type='button'
                >
                  {
                    showPassword ? (
                      <EyeOff className='size-5 text-base-content/40' />
                    ) : (
                      <Eye className='size-5 text-base-content/40' />
                    )
                  }
                </button>
              </div>
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
              {
                isLoggingIn ? (
                  <>
                    <Loader2 className='size-5 animate-spin' />
                    Loading...
                  </>
                ) : (
                  "Login "
                )
              }
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              don't have an account?{" "}
              <Link to='/signup' className='link link-primary' >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
