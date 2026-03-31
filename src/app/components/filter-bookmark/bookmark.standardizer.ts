
export function mergeWithDefaults(
    saved: Record<string, any>,
    defaults: Record<string, any>
): Record<string, any> {
    const result = { ...defaults };

    for (const key of Object.keys(defaults)) {
        const defaultValue = defaults[key];
        const savedValue = saved[key];

        if (savedValue === undefined) {
            result[key] = defaultValue;
        } else if (
            typeof defaultValue === 'object' &&
            defaultValue !== null &&
            !Array.isArray(defaultValue) &&
            typeof savedValue === 'object' &&
            savedValue !== null &&
            !Array.isArray(savedValue)
        ) {
            result[key] = mergeWithDefaults(savedValue, defaultValue);
        } else {
            result[key] = savedValue;
        }
    }

    return result;
}