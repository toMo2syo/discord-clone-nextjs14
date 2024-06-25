import { UploadDropzone } from "@/app/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ServerformDataType } from "@/app/lib/definition";
type FileUploadProps = {
    endpoint: 'serverImage' | 'messageFile'
    setServer: Dispatch<SetStateAction<ServerformDataType>>,
    server: ServerformDataType
}

export default function FileUpload({
    endpoint,
    setServer,
    server
}: FileUploadProps) {

    if (server.imageUrl) {
        return <div className="w-[80px] h-[80px] rounded-full relative">
            <Image
                src={server.imageUrl}
                alt={server.servername}
                className="object-cover w-full h-full rounded-full"
                width={80}
                height={80}
            />
            <div
                className="flex items-center cursor-pointer w-[20px] h-[20px] rounded-full justify-center absolute top-0 right-0 bg-rose-500"
                onClick={() => setServer({
                    ...server,
                    imageUrl: ''
                })}
            >
                <X width={12} height={12} color="#fff" />
            </div>
        </div>
    }
    return (
        <UploadDropzone endpoint={endpoint} onClientUploadComplete={(res) => {
            setServer({
                ...server,
                imageUrl: res[0].url
            })

        }} />
    )
}
