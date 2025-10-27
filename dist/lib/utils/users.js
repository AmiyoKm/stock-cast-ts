export function cleanUser(user) {
    const { password, id, version, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
}
