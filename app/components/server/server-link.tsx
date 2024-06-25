'use client'
import { Server } from "@prisma/client"
import ActionTooltip from "../ui/action-tooltip"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function ServerLink({
  server
}: {
  server: Server
}) {
  let serverLink = null
  const pathname = usePathname()

  if (server.imageUrl) {
    serverLink = (
      <ActionTooltip side="right" delayDuration={100} key={server.serverId} label={server.serverName}>
        <div className="min-w-[48px] min-h-[48px]">
          <Link
            key={server.serverId}
            href={`/server/${server.serverId}`}
            className="w-full h-full relative"
          >
            {/* add adtional check to avoid "TypeError: Cannot read properties of null (reading 'default')" */}
            {server.imageUrl ? (
              <Image
                src={server.imageUrl!}
                alt={server.serverName}
                width={48}
                height={48}
                className="min-w-[48px] min-h-[48px] aspect-square object-cover rounded-full"
              />
            ) : null}
            {pathname.startsWith(`/server/${server.serverId}`) && (<span className="absolute w-[8px] h-[40px] rounded-r-[4px] top-[4px] -left-[16px] bg-[#060607] dark:bg-[#f2f3f5]"></span>)}
          </Link>
        </div>
      </ActionTooltip>
    )
  } else {
    serverLink = (
      <ActionTooltip side="right" delayDuration={100} key={server.serverId} label={server.serverName}>
        <div>
          <Link href={`/server/${server.serverId}`}
            className={clsx("w-[48px] h-[48px] relative dark:bg-[#313338] hover:text-white font-semibold  hover:font-semibold hover:rounded-2xl hover:bg-main-dark dark:hover:bg-main-dark transition-colors duration-50 ease-in flex items-center justify-center", {
              'rounded-full bg-white': !pathname.startsWith(`/server/${server.serverId}`),
              'text-white rounded-2xl bg-main-dark dark:dark:bg-main': pathname.startsWith(`/server/${server.serverId}`),
            }
            )}>
            {server.serverName.substring(0, 2)}
            {pathname.startsWith(`/server/${server.serverId}`) && (<span className="absolute w-[8px] h-[40px] rounded-r-[4px] top-[4px] -left-[16px] bg-[#060607] dark:bg-[#f2f3f5]"></span>)}
          </Link>
        </div>
      </ActionTooltip>
    )
  }

  return <div>
    {serverLink}
  </div>
}
