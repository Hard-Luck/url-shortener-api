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

export async function incrementClicked(id: string) {
  return db.url.update({
    where: { id: id },
    data: {
      clicked: { increment: 1 },
    },
  });
}

export async function redirect(id: string) {
  const url = await getUrlById(id);
  if (url !== null) {
    await incrementClicked(id);
  }
  return url;
}

export async function getUrlsByUserId(id: string) {
  const user = await db.user.findFirst({
    where: { id: id },
    include: { urls: true },
  });
  if (user === null) throw new Error('Internal server error');
  return user.urls;
}
