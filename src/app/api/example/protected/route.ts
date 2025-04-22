import { NextResponse, NextRequest } from 'next/server'
import verifyRequest from '@/server/verifyToken'

/**
 * This GET api requires authentication
 */
export async function GET(req: NextRequest) {
    let decoded
    try {
        decoded = await verifyRequest(req)
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = {
        message: 'Hello, world!',
    }

    return NextResponse.json(data)
}
