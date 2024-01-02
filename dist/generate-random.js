"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const NoiseBuilder_1 = __importDefault(require("genetic-portrait-generator/dist/entities/builders/noiseBuilder/NoiseBuilder"));
dotenv.config();
const publicDir = process.env.PUBLIC_DIR;
const queuePath = publicDir + '/image-queue';
const wrapper = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new NoiseBuilder_1.default();
    builder.setChances(config.crossoverChance, config.mutationChance);
    builder.setNumberOfMixes(config.numberOfMixes);
    yield builder.createPicture(config.imageUrl, config.useRawImage);
    builder.setPopulationConfig(config.populationConfig);
    builder.setOutputImageConfig(config.outputImageConfig);
    builder.createOutputImage();
    builder.createCauldron();
    builder.startCauldron();
    builder.saveImage(config.savePath);
    fs.writeFile(config.outputConfigFile, JSON.stringify(config), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        }
        else {
            console.log('JSON file has been saved:', config.outputConfigFile);
        }
    });
});
const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomEvenInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let randomInt = getRandomInt(min, max);
    return randomInt % 2 === 0 ? randomInt : randomInt + 1;
};
const generateRandomConfig = (config) => {
    const crossoverChance = getRandomFloat(config['crossoverChance'][0], config['crossoverChance'][1]);
    const mutationChance = getRandomFloat(config['mutationChance'][0], config['mutationChance'][1]);
    const numberOfMixes = getRandomInt(config['numberOfMixes'][0], config['numberOfMixes'][1]);
    const divider = getRandomInt(config['populationConfig']['divider'][0], config['populationConfig']['divider'][1]);
    const size = getRandomEvenInt(config['populationConfig']['size'][0], config['populationConfig']['size'][1]);
    const nofPointsMax = getRandomInt(config['populationConfig']['nofPointsMax'][0], config['populationConfig']['nofPointsMax'][1]);
    const nofPointsMin = getRandomInt(config['populationConfig']['nofPointsMin'], nofPointsMax);
    const thicknessMax = getRandomInt(config['populationConfig']['thicknessMax'][0], config['populationConfig']['thicknessMax'][1]);
    const thicknessMin = getRandomInt(config['populationConfig']['thicknessMin'], thicknessMax);
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
};
function runForFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield wrapper(newConfig);
            }
            catch (e) {
                console.error(e.message);
            }
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.argv[2]) {
        yield runForFile(process.argv[2]);
        return;
    }
}))();
//# sourceMappingURL=generate-random.js.map