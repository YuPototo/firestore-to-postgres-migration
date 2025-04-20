import { Comment as CommentType } from '@/types/comment'
import { Comment } from './Comment'

interface CommentListProps {
    comments: CommentType[]
}

export const CommentList = ({ comments }: CommentListProps) => {
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
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    )
}
