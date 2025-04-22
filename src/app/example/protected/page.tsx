'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function Page() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const auth = useAuth()

    const getProtectedData = async (withToken: boolean = false) => {
        setLoading(true)
        setError(null)
        setData(null)

        let token = null
        if (withToken) {
            token = await auth.user?.getIdToken()

            if (!token) {
                setError('No token found')
                setLoading(false)
                return
            }
        }

        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            const response = await fetch('/api/example/protected', options)

            if (!response.ok) {
                setError(response.statusText)
                setLoading(false)
                return
            }

            const data = await response.json()
            setData(data)
            setLoading(false)
        } catch (err) {
            setError(JSON.stringify(err))
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1>Get protected data</h1>

            <div>
                <p>This page let users get data from a protected API.</p>
                <p>If users have no token, the API will return 401.</p>
                <p>If users have a token, the API will return the data.</p>
            </div>

            <div className="flex gap-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => getProtectedData(false)}
                >
                    Get protected data without token
                </button>

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => getProtectedData(true)}
                >
                    Get protected data with token
                </button>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}

            {data && (
                <div>
                    <div>data</div>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
