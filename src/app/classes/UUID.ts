export class UUID {
    public v4(): string {
        // Update from 2023: The Web Crypto API is now supported in all browsers.
        // The only limitation is, that it requires https to be enabled. (Secure Context)
        // openITCOCKPIT uses https by default so this should not be an issue.
        // If it is an issue, you can use the fallback implementation.
        return crypto.randomUUID();
    }

    /**
     * @deprecated The method should not be used
     */
    public v4LegacyBrowser(): string {
        // Fallback implementation
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public isUuid(uuid: string): boolean {
        var RegExObject = new RegExp('([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', 'i');
        return uuid.match(RegExObject) !== null;
    }
}
