'use client'

import SignInForm from '@/components/auth/SignInForm'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link
                            href="/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>
                <SignInForm />
            </div>
        </div>
    )
}
