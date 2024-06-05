export default function SidebarToggle() {
    return (
        <div className="flex h-6 w-6 flex-col items-center group cursor-pointer">
            <div className="h-3 w-1 rounded-full bg-[#cdcdcd] translate-y-[1px] group-hover:rotate-[15deg] group-hover:bg-[#0d0d0d] transition" ></div>
            <div className="h-3 w-1 rounded-full bg-[#cdcdcd] -translate-y-[1px] group-hover:-rotate-[15deg] group-hover:bg-[#0d0d0d] transition" ></div>
        </div >
    )
}
