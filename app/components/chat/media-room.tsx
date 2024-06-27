"use client";

import { useUser } from "@clerk/nextjs";
import {
    LiveKitRoom,
    VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type MediaRoomProps = {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export default function MediaRoom({
    chatId,
    video,
    audio,
}: MediaRoomProps) {
    const [token, setToken] = useState('')
    const { user } = useUser()

    const name = user?.fullName || 'Wumpus'
    useEffect(() => {
        if (!user) return
        (async () => {
            try {
                const resp = await fetch(
                    `/api/get-participant-token?room=${chatId}&username=${name}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [name, user, token, chatId]);

    if (token === "") {
        return (
            <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-zinc-500" />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full" data-lk-theme="default">
            <LiveKitRoom
                video={video}
                audio={audio}
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                style={{ maxHeight: "100%", width: "100%", marginRight: '-50px', borderRadius: '2px' }}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
}