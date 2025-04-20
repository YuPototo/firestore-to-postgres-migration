import { Comment as CommentType } from '@/types/comment'
import { Comment } from './Comment'

interface CommentListProps {
    comments: CommentType[]
    onCommentsChange: () => void
}

export const CommentList = ({
    comments,
    onCommentsChange,
}: CommentListProps) => {
    if (comments.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No comments yet
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    onDelete={onCommentsChange}
                />
            ))}
        </div>
    )
}
