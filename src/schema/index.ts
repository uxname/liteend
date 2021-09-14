/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import path from 'path';

const files: Array<string> = fs.readdirSync(__dirname);
let result = '';

for (const fileName of files) {
    if (fileName === path.basename(__filename)) {
        continue;
    }
    const schema = fs.readFileSync(path.join(__dirname, fileName)).toString('utf-8');
    result += `\n${schema}`;
}

export default result;
