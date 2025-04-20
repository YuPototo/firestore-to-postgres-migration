import { User as FirebaseUser } from 'firebase/auth'

/**
 * Extended firebase user type
 * - email: string
 */
type User = FirebaseUser & {
    email: string
}

export type { User, FirebaseUser }
