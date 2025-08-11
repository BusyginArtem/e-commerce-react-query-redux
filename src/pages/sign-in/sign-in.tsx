import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import z from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  LogIn,
  Eye,
  EyeOff,
  ShoppingBag,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { loginThunk, useLoginLoading } from '@/modules/auth/thunks/login';
import { Input } from '@/shared/ui/input';
import { authSlice } from '@/modules/auth/features/auth.slice';
import { cn } from '@/shared/utils/style-helpers';
import { useUserData } from '@/shared/hooks/useUserData';

const FormSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const dispatch = useAppDispatch();
  const isSubmitting = useLoginLoading();
  const loginError = useAppSelector(authSlice.selectors.selectError);

  const navigate = useNavigate();
  const { user } = useUserData();

  useEffect(() => {
    if (user?.id) {
      navigate('/');
    }
  }, [navigate, user?.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = FormSchema.safeParse({
      username: formData.username,
      password: formData.password,
    });

    if (!data.success) {
      const fieldErrors: Record<'username' | 'password', string> = {
        username: '',
        password: '',
      };

      data.error.issues.forEach((issue) => {
        const key = issue.path[0];

        if (key === 'username' || key === 'password') {
          fieldErrors[key] = issue.message;
        }
      });

      setErrors(fieldErrors);

      return;
    }

    if (data.success) {
      // If validation passes, dispatch the login thunk
      dispatch(loginThunk(data.data.username, data.data.password));
      setErrors({
        username: '',
        password: '',
      });
    }
  };

  const handleDemoLogin = () => {
    // Set demo credentials
    const demoUsername = 'emilys';
    const demoPassword = 'emilyspass';

    setFormData({
      username: demoUsername,
      password: demoPassword,
    });

    dispatch(loginThunk(demoUsername, demoPassword));
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'username' | 'password'
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });

    if (field === 'username') {
      setErrors({ ...errors, username: '' });
    } else if (field === 'password') {
      setErrors({ ...errors, password: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <Link to="/">
              <h1 className="text-3xl font-bold text-gray-900">My Store</h1>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-blue-600" />
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 mb-4">
              {/* Demo Login Helper */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm text-blue-700">
                    Demo: emilys / emilyspass
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDemoLogin}
                  className="text-blue-600 hover:text-blue-700 h-6 px-2 text-xs"
                >
                  Use Demo
                </Button>
              </div>

              {/* Email Field */}
              <div className="">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  User name
                </label>
                <div className="relative">
                  {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div> */}
                  <Input
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={(e) => handleChangeInput(e, 'username')}
                    className={cn(
                      'w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300 hover:border-gray-400',
                      {
                        'border-red-300 bg-red-50': errors.username,
                      }
                    )}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div> */}
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => handleChangeInput(e, 'password')}
                    className={cn(
                      'w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300 hover:border-gray-400',
                      {
                        'border-red-300 bg-red-50': errors.username,
                      }
                    )}
                    placeholder="Enter your password"
                  />
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full py-2.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              {/* General Error */}
              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{loginError}</span>
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/sign-up"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;
