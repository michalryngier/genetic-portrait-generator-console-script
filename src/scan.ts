import * as dotenv from 'dotenv';
import * as fs from "fs";
import NoiseBuilder from "@george_freeman/genetic-portrait-generator/dist/entities/builders/noiseBuilder/NoiseBuilder";
import { LoggerService } from '@george_freeman/genetic-portrait-generator/dist/services';
import WindowsLogger from './loggers/WindowsLogger';

dotenv.config();

const publicDir = process.env.PUBLIC_DIR;

const queuePath = publicDir + '/image-queue';
const queueDir = fs.opendirSync(queuePath);
let queueFolder = queueDir.readSync();
let queueLock = publicDir + '/image-lock';

let lockedFiles = fs.readdirSync(queueLock);

const wrapper = async (config: any) => {
    LoggerService._loggers = [new WindowsLogger()];
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
            config.savePath = publicDir + '/image-ready/' + name + '.png';

            await wrapper(config);
        } catch (e: any) {
            console.error(e.message);
        }
        fs.unlinkSync(queueLock + '/' + lockName);
        // queueFolder = null;
        queueFolder = queueDir.readSync();
    }
})();


