import { db } from './prismaClient';
import { generateId } from './utils/ids';
import { isValidUrl } from './utils/validate';

export async function urlIdExists(id: string) {
  const url = await db.url.findFirst({ where: { id: id } });
  return url !== null && url?.id === id;
}

export async function getAllUrls() {
  const urls = await db.url.findMany({});
  return urls;
}

export async function insertNewUrl(url: string, alias: string, userId: string) {
  if (!url || !isValidUrl(url)) {
    return Promise.reject({ status: 400, message: 'Invalid url' });
  }
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
      alias: alias,
      userId,
    },
  });
}

export async function getUrlById(id: string) {
  const url = await db.url.findFirst({ where: { id: id } });
  return url;
}
