'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/')
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href="/"
                                className="text-xl font-bold text-indigo-600"
                            >
                                Blog
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link
                                    href="/post/create"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Create Post
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign Out
                                </button>
                                <span className="text-gray-700 text-sm">
                                    {user.email}
                                </span>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
