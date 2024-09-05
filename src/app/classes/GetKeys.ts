// https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript/55012175#55012175
// https://stackoverflow.com/a/67452316
export const GetKeys = <T>(obj: T) => {
    if (obj === null || typeof obj !== 'object') {
        return [];
    }

    return Object.keys(obj) as Array<keyof T>;
}
