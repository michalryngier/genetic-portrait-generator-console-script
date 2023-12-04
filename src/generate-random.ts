import * as dotenv from 'dotenv';
import * as fs from "fs";
import NoiseBuilder from "genetic-portrait-generator/dist/entities/builders/noiseBuilder/NoiseBuilder";

dotenv.config();

const publicDir = process.env.PUBLIC_DIR;
const queuePath = publicDir + '/image-queue';

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

    fs.writeFile(config.outputConfigFile, JSON.stringify(config), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log('JSON file has been saved:', config.outputConfigFile);
        }
    });
}

const getRandomFloat = (min: number, max: number) =>  {
    return Math.random() * (max - min) + min;
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomEvenInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    let randomInt = getRandomInt(min, max);

    return randomInt % 2 === 0 ? randomInt : randomInt + 1;
}

const generateRandomConfig = (config: any): any => {
    const crossoverChance = getRandomFloat(config['crossoverChance'][0], config['crossoverChance'][1]);
    const mutationChance = getRandomFloat(config['mutationChance'][0], config['mutationChance'][1]);
    const numberOfMixes = getRandomInt(config['numberOfMixes'][0], config['numberOfMixes'][1]);
    const divider = getRandomInt(
        config['populationConfig']['divider'][0],
        config['populationConfig']['divider'][1]
    );
    const size = getRandomEvenInt(
        config['populationConfig']['size'][0],
        config['populationConfig']['size'][1]
    );
    const nofPointsMax = getRandomInt(
        config['populationConfig']['nofPointsMax'][0],
        config['populationConfig']['nofPointsMax'][1]
    );
    const nofPointsMin = getRandomInt(
        config['populationConfig']['nofPointsMin'],
        nofPointsMax
    );
    const thicknessMax = getRandomInt(
        config['populationConfig']['thicknessMax'][0],
        config['populationConfig']['thicknessMax'][1]
    );
    const thicknessMin = getRandomInt(
        config['populationConfig']['thicknessMin'],
        thicknessMax
    );

    return {
        useRawImage: false,
        crossoverChance,
        mutationChance,
        numberOfMixes,
        populationConfig: {
            maxPoint: {
                x: 0,
                y: 0
            },
            nofPointsMax,
            nofPointsMin,
            thicknessMax,
            thicknessMin,
            divider,
            size,
        },
        outputImageConfig: {
            scale: 1,
            color: "FFFFFF",
            bgColor: "000000",
            lerpColor: true
        }
    };
}

async function runForFile(fileName: string) {
    const path = queuePath + '/' + fileName;
    let config = null;

    for (let i = 20; i < 100; i++) {
        try {
            config = fs.readFileSync(path + '/' + fileName + '.json', 'utf8');
            config = JSON.parse(config);
            let newConfig = generateRandomConfig(config);

            newConfig.imageUrl = path + '/' + fileName + '.jpg';

            const tmpFileName = `${fileName}-${i}`;
            newConfig.savePath = publicDir + '/image-ready/' + tmpFileName + '/' + fileName + '.png';
            newConfig.savePathOI = publicDir + '/image-ready/' + tmpFileName + '/' + fileName + '_oi.png';
            newConfig.savePathEM = publicDir + '/image-ready/' + tmpFileName + '/' + fileName + '_em.png';
            newConfig.outputConfigFile = publicDir + '/image-ready/' + tmpFileName + '/' + fileName + '.json';

            await wrapper(newConfig);
        } catch (e: any) {
            console.error(e.message);
        }
    }

}


(async () => {
    if (process.argv[2]) {
        await runForFile(process.argv[2]);
        return;
    }
})();

