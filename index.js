const { optimize } = require('svgo');
const fs = require('fs').promises;
const path = require('path');

const svgDirPath = './covers/svg';

console.time('Optimization Time');

fs.readdir(svgDirPath)
    .then(files => {
        const svgFiles = files.filter(file => path.extname(file) === '.svg');

        return Promise.all(svgFiles.map(async file => {
            const svgFilePath = path.join(svgDirPath, file);
            const svgData = await fs.readFile(svgFilePath, 'utf-8');

            const result = optimize(svgData, { path: svgFilePath });

            await fs.writeFile(svgFilePath, result.data);
            console.log(`Optimized: ${file}`);
        }));
    })
    .then(() => {
        console.timeEnd('Optimization Time');
    })
    .catch(err => {
        console.error('Error:', err);
    });
