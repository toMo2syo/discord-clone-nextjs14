import clsx from "clsx"
import Image from "next/image"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt: string;
    size?: number;
    className?: string;
    name?: string
}
export default function Avatar({
    src,
    alt,
    size = 48,
    className,
    name,
    ...props
}: AvatarProps) {
    const avatarClass = clsx(
        "inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold",
        className,
        {
            [`w-${size}`]: size,
            [`h-${size}`]: size,
        }
    )
    return (
        <div className={avatarClass} style={{ width: size, height: size }} {...props}>
            {src ? (
                <Image src={src} alt={alt} width={size} height={size} className="w-full h-full rounded-full object-cover" />
            ) : (
                <span className="">{name}</span>
            )}
        </div>
    )
}