// components/ServerRedirect.tsx
'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Server } from '@prisma/client';

export default function ServerRedirect({ servers }: { servers: Server[] }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isOnServerPage = servers.some(server => pathname.startsWith(`/server/${server.serverId}`));

        if (!isOnServerPage && servers.length > 0) {
            router.push(`/server/${servers[0].serverId}`);
        }
    }, [pathname, servers, router]);

    return null;
}
