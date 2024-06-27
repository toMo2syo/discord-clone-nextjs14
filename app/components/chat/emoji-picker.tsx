'use client'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// Filter the emoji that do not show correctly on the screen
//@ts-ignore
const emojis = Object.values(data.emojis).slice(2, 107).filter((_, i) => ![10, 19, 22, 31, 32, 35, 41, 42, 47, 49, 65, 69, 74, 83].includes(i))

export default function EmojiPicker({
    onSelect
}: {
    onSelect: (value: string) => void
}) {
    const { resolvedTheme } = useTheme()
    const [hoverEmoji, setHoverEmoji] = useState<string | null>(null)

    const handleMouseEnter = () => {
        // Randomly select an emoji from the data
        //@ts-ignore
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)].skins[0].native
        setHoverEmoji(randomEmoji)
    }


    useEffect(() => {
        //@ts-ignore
        setHoverEmoji(emojis[0].skins[0].native)
    }, [])

    return (
        <Popover>
            <PopoverTrigger onMouseEnter={handleMouseEnter} >
                <div className="w-[44px] h-full">
                    <span
                        className={`text-[24px] transition-all ease-in-out hover:text-[26px]`}
                    >
                        {hoverEmoji}
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent side='right' sideOffset={40} className='bg-transparent border-none shadow-none drop-shadow-none mb-16'>
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                        onSelect(emoji.native)
                    }}
                    theme={resolvedTheme}
                />
            </PopoverContent>
        </Popover>
    )
}
