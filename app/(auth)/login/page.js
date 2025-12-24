'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

const Login = () => {
    const router = useRouter()

    // HAPUS middleware parameter, cukup ambil login, user, dan loading
    const { login, user, loading } = useAuth()

    const [loginField, setLoginField] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    // Redirect ke dashboard jika user sudah login
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Handle reset password status dari URL
    useEffect(() => {
        // Perbaiki cara mendapatkan query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const resetParam = urlParams.get('reset');
        
        if (resetParam && errors.length === 0) {
            setStatus(atob(resetParam));
        } else {
            setStatus(null);
        }
    }, [errors.length]);

    const submitForm = async event => {
        event.preventDefault()

        login({
            login: loginField,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    // Tampilkan loading jika sedang check auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Memeriksa sesi...</p>
                </div>
            </div>
        );
    }

    // Jika sudah login (tapi useEffect belum redirect), tampilkan loading
    if (user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Mengarahkan ke dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AuthSessionStatus className="mb-4" status={status} />
            <form onSubmit={submitForm}>
                {/* Login Field (Email/Username/NIK) */}
                <div>
                    <Label htmlFor="login">
                        Email, Username, atau NIK
                    </Label>

                    <Input
                        id="login"
                        type="text"
                        value={loginField}
                        className="block mt-1 w-full"
                        onChange={event => setLoginField(event.target.value)}
                        required
                        autoFocus
                        placeholder="Masukkan email, username (10 digit), atau NIK (16 digit)"
                    />

                    <InputError messages={errors.login} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                    />

                    <InputError
                        messages={errors.password}
                        className="mt-2"
                    />
                </div>

                {/* Remember Me */}
                <div className="block mt-4">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={event =>
                                setShouldRemember(event.target.checked)
                            }
                        />

                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href="/forgot-password"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Forgot your password?
                    </Link>

                    <Button className="ml-3">Login</Button>
                </div>
            </form>
        </>
    )
}

export default Login