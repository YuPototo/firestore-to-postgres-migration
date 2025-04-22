'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { CreateCommentPayload } from '@/types/comment'

interface AddCommentProps {
    postId: string
    onCommentAdded: () => void
}

export const AddComment = ({ postId, onCommentAdded }: AddCommentProps) => {
    const { user } = useAuth()
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !content.trim()) return

        setIsSubmitting(true)
        setError('')

        try {
            const payload: CreateCommentPayload = {
                postId,
                content: content.trim(),
                authorId: user.uid,
                authorEmail: user.email || '',
            }

            const token = await user.getIdToken()

            const response = await fetch(`/api/v0/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                setError('Failed to add comment')
                return
            }

            setContent('')
            onCommentAdded()
        } catch (err) {
            console.error(err)
            setError('Failed to add comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div className="text-center text-gray-500 py-4">
                Please sign in to leave a comment
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    rows={4}
                    required
                />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Add Comment'}
                </button>
            </div>
        </form>
    )
}
