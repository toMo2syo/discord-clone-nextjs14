import { RefObject, useEffect, useState, useRef } from "react"

type ChatScrollProps = {
    chatRef: RefObject<HTMLDivElement>;
    bottomRef: RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadmore: () => void;
    count: number;
}

export function useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadmore,
    count,
}: ChatScrollProps) {
    const [hasInitialized, setInitialized] = useState(false)
    const hasMounted = useRef(false)

    // Scroll to the top when loading more content
    useEffect(() => {
        const chatDiv = chatRef?.current

        function handleScroll() {
            const scrollTop = chatDiv?.scrollTop
            if (scrollTop === 0 && shouldLoadMore) {
                //@ts-ignore
                loadmore().then(() => {
                    // Adjust the scroll position slightly after loading more content to ensure scroll event is triggered again when scrolling to the top
                    if (chatDiv) {
                        chatDiv.scrollTop = 1
                    }
                })
            }
        }
        chatDiv?.addEventListener('scroll', handleScroll)

        return () => chatDiv?.removeEventListener('scroll', handleScroll)
    }, [chatRef, loadmore, shouldLoadMore])


    useEffect(() => {
        const bottomDiv = bottomRef?.current
        const chatDiv = chatRef?.current

        function shouldAutoScroll() {
            if (hasInitialized && bottomDiv) {
                return true
            }
            if (!chatDiv) {
                return false
            }
            const distanceFromBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight

            return distanceFromBottom <= 100
        }

        if (hasMounted.current) {
            // Auto scroll to the bottom when send message in the postion of bottom
            if (shouldAutoScroll()) {
                setTimeout(() => {
                    bottomRef.current?.scrollIntoView({
                        behavior: 'smooth'
                    })
                }, 100)
            }
        } else {
            // Scroll to the bottom on the initial load
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: 'smooth'
                })
            }, 100)
            hasMounted.current = true
        }

        setInitialized(true)
    }, [bottomRef, chatRef, count, hasInitialized])
}
