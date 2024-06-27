'use client'
import { useRouter } from 'next/navigation';
export default function NotFound() {
    const router = useRouter()
    return (
        <main className="flex w-full h-full flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>The invite link is invalid or has expired</p>
            <button
                onClick={() => router.back()}
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
                Go Back
            </button>
        </main>
    );
}