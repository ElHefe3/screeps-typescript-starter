// prebuild-script.ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Converts a JSON file to a TypeScript file exporting the JSON data.
 * @param sourcePath Path to the source JSON file.
 * @param targetPath Path to the target TypeScript file.
 */
export const convertJsonToTsModule = (sourcePath: string, targetPath: string): void => {
    try {
        const jsonData = fs.readFileSync(sourcePath, { encoding: 'utf8' });
        const tsData = `const data: any = ${jsonData};\nexport default data;`;
        fs.writeFileSync(targetPath, tsData, { encoding: 'utf8' });
        console.log(`Converted ${sourcePath} to ${targetPath}`);
    } catch (error) {
        console.error('Failed to convert JSON to TypeScript module:', error);
    }
}
