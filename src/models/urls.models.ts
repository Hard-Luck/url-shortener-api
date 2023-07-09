import { db } from "./prismaClient";

export async function urlIdExists(id: string) {
    const url = await db.url.findFirst({ where: { id: id } })
    return url !== null && url?.id === id;

}
