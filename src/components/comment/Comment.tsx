import { Comment as CommentType } from '@/types/comment'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useState } from 'react'

interface CommentProps {
    comment: CommentType
    onDelete: () => void
}

export const Comment = ({ comment, onDelete }: CommentProps) => {
    const { user } = useAuth()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const token = await user?.getIdToken()
            const response = await fetch(`/api/v0/comments/${comment.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to delete comment')
            }

            onDelete()
        } catch (err) {
            console.error(err)
        } finally {
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                        {comment.authorEmail}
                    </span>
                    <span className="text-sm text-gray-500">
                        {formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                        })}
                    </span>
                </div>
                {user && user.uid === comment.authorId && (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-500 text-sm"
                    >
                        Delete
                    </button>
                )}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
            </p>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Are you sure you want to delete this comment?
                        </h3>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
