import { Url } from "@prisma/client";

export function isApiUrl(url: unknown): url is Url {
    return (
        typeof url === 'object'
        && url !== null
        && 'id' in url
        && "clicked" in url
        && 'originalUrl' in url
        && 'isActive' in url
        && 'userId' in url
    )
}