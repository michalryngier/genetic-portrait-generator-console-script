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

(async () => {
    while (queueFolder !== null) {
        const lockName = queueFolder.name + '.lock';
        if (!queueFolder.isDirectory() || lockedFiles.includes(lockName)) {
            queueFolder = queueDir.readSync();
            continue;
        }
        const name = queueFolder.name;
        fs.writeFileSync(queueLock + '/' + lockName, '');

        const path = queuePath + '/' + name;
        let config = null;
        try {
            config = fs.readFileSync(path + '/' + name + '.json', 'utf8');
            config = JSON.parse(config);
            config.imageUrl = path + '/' + name + '.jpg';
            config.savePath = publicDir + '/image-ready/' + name + '/' + name + '.png';
            config.savePathOI = publicDir + '/image-ready/' + name + '/' + name + '_oi.png';
            config.savePathEM = publicDir + '/image-ready/' + name + '/' + name + '_em.png';

            await wrapper(config);
        } catch (e: any) {
            console.error(e.message);
        }
        fs.unlinkSync(queueLock + '/' + lockName);
        // queueFolder = null;
        queueFolder = queueDir.readSync();
    }
})();


