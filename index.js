const { optimize } = require('svgo');
const fs = require('fs').promises;
const path = require('path');

const svgDirPath = './covers/svg';
const outputJsonPath = './optimized.json';

const startTime = Date.now();

fs.readdir(svgDirPath)
    .then(files => {
        const svgFiles = files.filter(file => path.extname(file) === '.svg');

        const processingPromises = svgFiles.map(file => {
            const svgFilePath = path.join(svgDirPath, file);

            return fs.readFile(svgFilePath, 'utf-8')
                .then(svgData => {
                    const result = optimize(svgData, { path: svgFilePath });
                    return fs.writeFile(svgFilePath, result.data)
                        .then(() => {
                            console.log(`Optimized: ${file}`);
                        });
                });
        });

        return Promise.all(processingPromises);
    })
    .then(() => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;

        const resultJson = {
            timeTaken: `${timeTaken} ms`
        };

        return fs.writeFile(outputJsonPath, JSON.stringify(resultJson, null, 2))
            .then(() => {
                console.log(`Time taken: ${timeTaken} ms`);
            });
    })
    .catch(err => {
        console.error('Error:', err);
    });
