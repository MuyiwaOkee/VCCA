import { verifySession } from '@/lib/session';

export async function GET(request: Request) {
    const session = await verifySession();
    if (!session) {
        return new Response(JSON.stringify({ error: 'No session' }), { status: 401 });
    }

    const response = await fetch(`http://localhost:8000/user/${session?.userid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "No user data found" }), { status: 404 });
    }

    const data = await response.json();

    return new Response(JSON.stringify({ role: data.role }), { status: 200 });
}