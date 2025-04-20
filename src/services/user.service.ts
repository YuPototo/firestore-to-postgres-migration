import { FirebaseUser, User } from '@/types/user'

function isValidUser(user: FirebaseUser | null): user is User {
    return user !== null && 'email' in user
}

const userService = {
    isValidUser,
}

export default userService
