export function debounce(ms: number) {
    return (
        target: unknown,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): void => {
        let timer: ReturnType<typeof setTimeout>;
        const originalMethod = descriptor.value;


        descriptor.value = function (...args: any[]) {
            new Promise((resolve) => {
                if (timer) {
                    clearTimeout(timer);
                }


                timer = setTimeout(() => {
                    resolve(originalMethod.apply(this, ...args));
                }, ms);
            });
        };
    };
}