export function pad(value: number | string, decimals = 2, padding = "0"): string {
    while (("" + value).length < decimals)
        value = padding + value;
    return value + "";
}

export function toIsoDateString(date: Date): string {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

export function toIsoTimeString(date: Date): string {
    return pad(date.getHours()) + ":" + pad(date.getMinutes())
}