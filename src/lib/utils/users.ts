import { type User } from "../../models/users/index.ts";

export function cleanUser(user: User) {
    const { password, id, version, ...userWithoutSensitive } = user;
    return userWithoutSensitive
}
