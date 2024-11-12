export const stringToUints8 = (input: string) =>
    new Uint8Array(Buffer.from(input), 0, 32);