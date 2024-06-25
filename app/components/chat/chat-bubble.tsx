import React from 'react';
import Avatar from '../server/avatar';
import { Profile } from '@prisma/client';
import Image from 'next/image';
import pdfIcon from '@/public/pdfIcon.svg'
import clsx from 'clsx';
type ChatBubbleProps = {
    content: string,
    sender: Profile,
    isSender: boolean,
    fileUrl: string | null
}
const ChatBubble = ({ content, sender, isSender, fileUrl }: ChatBubbleProps) => {

    const fileType = fileUrl?.split('.').pop()
    const isPDF = (fileType === 'pdf' && fileUrl !== null)
    const isImage = (!isPDF && fileUrl !== null)
    return (
        <div className={clsx('flex items-start mb-10', {
            'justify-end': isSender,
            'justify-start': !isSender
        })}>
            {!isSender && (
                <Avatar className="mr-6" size={42} src={sender.avatarUrl} alt="Sender Avatar" />
            )}
            {isImage && (
                <div>
                    <a
                        href={fileUrl === null ? undefined : fileUrl}
                        target="_blank"
                        rel="noopener onreferer"
                        className="relative aspect-square rounded-md mt-2 w-48 h-48"
                    >
                        <Image
                            src={fileUrl!}
                            alt={content}
                            className="object-cover rounded-sm"
                            width={192}
                            height={192}
                        />
                    </a>
                </div>
            )}
            {isPDF && (
                <div className="my-4 flex gap-2 p-2 items-center">
                    <Image
                        src={pdfIcon}
                        alt={content}
                        width={24}
                        height={24}
                    />
                    <a href={fileUrl!} target="_blank" rel="noopener noreferer" className="underline">
                        {content}
                    </a>
                </div>
            )
            }
            {!fileUrl && (
                <div className={clsx("inline-block relative lg:w-[300px] w-[200px] h-auto rounded-[30px] after:content-[''] after:absolute after:w-0 after:h-0 after:top-[19px] after:bottom-auto after:border-[12px]", {
                    "bg-[#eaeaec] text-black after:-left-[18px] after:right-auto after:border-t-[#eaeaec] after:border-r-[#eaeaec] after:border-b-transparent after:border-l-transparent": !isSender,
                    "bg-main text-white after:left-auto after:-right-[18px] after:border-t-main after:border-r-transparent after:border-b-transparent after:border-l-main": isSender,
                })}>
                    <div className='p-4 text-left leading-6 select-text'>
                        <p>{content}</p>
                    </div>
                </div>
            )}
            {isSender && (
                <Avatar className="ml-6" size={42} src={sender.avatarUrl} alt="Sender Avatar" />
            )}
        </div>
    );
};

export default ChatBubble;
