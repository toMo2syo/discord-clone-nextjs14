import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz';

export function formatDateTime(date: Date) {
    const timeZone = 'Asia/ShangHai'

    const zonedDate = toZonedTime(date, timeZone)

    const formattedDate = format(zonedDate, 'yyyy-MM-dd HH:mm')

    return formattedDate
}