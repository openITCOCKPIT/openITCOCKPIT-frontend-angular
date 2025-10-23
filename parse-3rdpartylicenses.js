/**
 * MIT License
 *
 * Copyright (c) 2025 Daniel Ziegler
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs');
const path = require('path');
const {forEach} = require('lodash');

/**
 * Parses the 3rdpartylicenses.txt file.
 * @param {string} filePath - Path to the license file.
 * @returns {Array<{package: string, license: string, licenseText: string}>} Array of license entries.
 */
function parse3rdPartyLicenses(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const blocks = content.split(/^-{80,}$/m).map(b => b.trim()).filter(Boolean);

    const entries = [];

    for(const block of blocks) {
        // Try to extract package name (first line), license (second line), rest is license text
        const lines = block.split(/\r?\n/).map(l => l.trim());
        if(lines.length < 2) {
            continue;
        }

        const pkg = lines[0].replace('Package: ', '').trim();
        const license = lines[1].replace('License: ', '').replaceAll('"', '').replaceAll('\'', '').trim();
        const licenseText = lines.slice(2).join('\n');
        entries.push({package: pkg, license, licenseText});
    }
    return entries;
}

/**
 * @param {string} license
 * @param allowedLicenses
 * @returns {boolean}
 */
function isAllowedLicense(license, allowedLicenses) {
    return allowedLicenses.includes(license);
}

/**
 *
 * @param {string} packageName
 * @param {string} licenseText
 * @returns {boolean}
 */
function deepLicenseCheck(packageName, licenseText) {
    switch(packageName) {
        case "primeng":
        case "@primeng/themes":
            return licenseText.includes("The MIT License (MIT)");

        // FontAwesome special cases
        case "Font Awesome Free License":
            return licenseText.includes("Font Awesome Free is free, open source, and GPL friendly.");

        case "# Icons: CC BY 4.0 License (https://creativecommons.org/licenses/by/4.0/)":
            return licenseText.includes("Attribution 4.0 International License");

        case "# Fonts: SIL OFL 1.1 License":
            return licenseText.includes("In the Font Awesome Free download, the SIL OFL license applies to all icons");

        case "# Code: MIT License (https://opensource.org/licenses/MIT)":
            return licenseText.includes("In the Font Awesome Free download, the MIT license applies to all non-font and");

        case "# Attribution":
            return licenseText.includes("Attribution is required by MIT, SIL OFL, and CC BY licenses. Downloaded Font");

        case "# Brand Icons":
            return licenseText.includes("All brand icons are trademarks of their respective owners. The use of these");

    }

    return false;
}

if(require.main === module) {
    const filePath = process.argv[2] || path.join(__dirname, '3rdpartylicenses.txt');
    if(!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const allowedLicenses = [
        'MIT',
        'ISC',
        'Apache-2.0',
        '(Apache-2.0 OR MIT)', // vis-timeline
        '0BSD',
        'BSD-2-Clause',
        'BSD-3-Clause',
        '(CC-BY-4.0 AND MIT)' // FontAwesome
    ];

    const packages = parse3rdPartyLicenses(filePath);

    let errors = {};
    forEach(packages, (pkg) => {
        if(!isAllowedLicense(pkg.license, allowedLicenses)) {
            errors[pkg.package] = pkg;
            // Strange license found - further investigation needed
            if(!deepLicenseCheck(pkg.package, pkg.licenseText)) {
                console.error(`Package "${pkg.package}" has a non-allowed license: "${pkg.license}"`);
                process.exit(1);
            } else {
                // Clear error
                delete errors[pkg.package];
            }
        }
    });

    if(Object.keys(errors).length > 0) {
        console.error('License check failed for the following packages:');
        forEach(errors, (err) => {
            console.error(`- ${err.package}: ${err.license}`);
        });
        process.exit(1);
    }

    console.log('All package licenses are allowed.');

}

