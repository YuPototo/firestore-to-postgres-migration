import 'server-only'
import { NextRequest } from 'next/server'
import firebaseAdmin from './firebaseAdmin'

async function verifyRequest(req: NextRequest) {
    const h = req.headers.get('authorization') || ''
    const idToken = h.startsWith('Bearer ') ? h.split(' ')[1] : null
    if (!idToken) throw new Error('No token')
    return await firebaseAdmin.auth().verifyIdToken(idToken)
}

export default verifyRequest
