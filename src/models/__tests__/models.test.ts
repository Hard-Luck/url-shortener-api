import { seed } from "../../db/seed";
import { db } from "../prismaClient";
import { urlIdExists } from "../urls.models";

beforeEach(async () => await seed());
afterAll(async () => await db.$disconnect())

describe("idExists", () => {
    it("should return true if id exists", async () => {
        expect(await urlIdExists("1")).toBe(true);
    })
    it('should return false if id does not exist', async () => {
        expect(await urlIdExists("50")).toBe(false);
    });
});