import { db } from '../models/prismaClient';
import { users } from './data/dev/users.json';
import { urls } from './data/dev/urls.json';

export async function seed() {
    try {
        await db.url.deleteMany({});
        await db.user.deleteMany({});

        await db.user.createMany({ data: users });
        const usersWithIds = await db.user.findMany({});
        const urlsWithIds = [
            { ...urls[0], user_id: usersWithIds[0].id },
            { ...urls[1], user_id: usersWithIds[1].id },
        ];
        await db.url.createMany({ data: urlsWithIds });
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}



