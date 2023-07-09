import { db } from './prismaClient';
import { generateId } from './utils/ids';

export async function urlIdExists(id: string) {
  const url = await db.url.findFirst({ where: { id: id } });
  return url !== null && url?.id === id;
}

export async function getAllUrls() {
  const urls = await db.url.findMany({});
  return urls;
}

export async function insertNewUrl(url: string, userId: string) {
  let id: string;
  let condition: boolean;
  do {
    id = generateId();
    condition = await urlIdExists(id);
  } while (condition);

  return db.url.create({
    data: {
      id: id,
      originalUrl: url,
      userId,
    },
  });
}

export async function getUrlById(id: string) {
  const url = await db.url.findFirst({ where: { id: id } });
  return url;
}