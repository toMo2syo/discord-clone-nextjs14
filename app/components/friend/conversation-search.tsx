export default function ConversationSearch() {
    return (
        <div className="h-[48px] flex items-center justify-center border-b-[2px]">
            <div className="px-[8px]">
                <input type="text" name="query" id="query" placeholder="Find or Start a conversation" className="placeholder:text-text-light dark:placeholder:text-[#949ba4] placeholder:text-xs placeholder:font-[500] px-[6px] py-[1px] bg-gray-primary w-full dark:bg-[#1e1f22] outline-none" />
            </div>
        </div>
    )
}
