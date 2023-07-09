export function generateId(length = 10) {
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += possibleChars[Math.floor(Math.random() * possibleChars.length)];
    }
    return result
}