import * as dotenv from 'dotenv';
import * as fs from "fs";
import NoiseBuilder from "genetic-portrait-generator/dist/entities/builders/noiseBuilder/NoiseBuilder";

dotenv.config();

const publicDir = process.env.PUBLIC_DIR;

const queuePath = publicDir + '/image-queue';
const queueDir = fs.opendirSync(queuePath);
let queueFolder = queueDir.readSync();
let queueLock = publicDir + '/image-lock';

let lockedFiles = fs.readdirSync(queueLock);

const wrapper = async (config: any) => {
    const builder = new NoiseBuilder();
    builder.setChances(config.crossoverChance, config.mutationChance);
    builder.setNumberOfMixes(config.numberOfMixes);
    await builder.createPicture(config.imageUrl, config.useRawImage);
    builder.setPopulationConfig(config.populationConfig);
    builder.setOutputImageConfig(config.outputImageConfig);
    builder.createOutputImage();
    builder.createCauldron();
    builder.startCauldron();
    builder.saveImage(config.savePath);

    if (builder.picture && builder.picture._oi && builder.picture._em) {
        builder.picture._em.writeImage(config.savePathEM)
        builder.picture._oi.writeImage(config.savePathOI)
    }
}

async function runForFile(fileName: string) {
    const path = queuePath + '/' + fileName;
    let config = null;

    try {
        config = fs.readFileSync(path + '/' + fileName + '.json', 'utf8');
        config = JSON.parse(config);
        config.imageUrl = path + '/' + fileName + '.jpg';
        config.savePath = publicDir + '/image-ready/' + fileName + '/' + fileName + '.png';
        config.savePathOI = publicDir + '/image-ready/' + fileName + '/' + fileName + '_oi.png';
        config.savePathEM = publicDir + '/image-ready/' + fileName + '/' + fileName + '_em.png';

        await wrapper(config);
    } catch (e: any) {
        console.error(e.message);
    }
}


(async () => {
    if (process.argv[2]) {
        await runForFile(process.argv[2]);
        return;
    }

    while (queueFolder !== null) {
        const lockName = queueFolder.name + '.lock';
        if (!queueFolder.isDirectory() || lockedFiles.includes(lockName)) {
            queueFolder = queueDir.readSync();
            continue;
        }

        const filename = queueFolder.name;
        fs.writeFileSync(queueLock + '/' + lockName, '');

        runForFile(filename);

        fs.unlinkSync(queueLock + '/' + lockName);

        queueFolder = queueDir.readSync();
    }
})();

