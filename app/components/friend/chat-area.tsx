export default function ChatArea() {
    return (
        <div className="flex-1 bg-gray-700 text-white p-4">
            {/* Chat area content */}
            <div className="h-96 bg-gray-800 p-4 mb-4">Messages</div>
            <input
                type="text"
                placeholder="Type a message"
                className="w-full p-2 rounded bg-gray-600 text-white"
            />
        </div>
    );
}
