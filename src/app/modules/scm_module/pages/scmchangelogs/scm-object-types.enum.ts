export enum ScmObjectTypesEnum {
    //👇👇👇 https://stackoverflow.com/questions/34896909/is-it-correct-to-set-bit-31-in-javascript
    //👇👇👇 https://stackoverflow.com/a/18019051/11885414
    //👇👇👇
    'RESOURCE' = 2147483648,     //1 << 31,  alternative: 2*Math.pow(2,31 // Changelog only
    'RESOURCEGROUP' = 4294967296 //1 << 32,  alternative: 2*Math.pow(2,32) // Changelog only
}
