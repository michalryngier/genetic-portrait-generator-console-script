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
const NoiseBuilder_1 = __importDefault(require("@george_freeman/genetic-portrait-generator/dist/entities/builders/noiseBuilder/NoiseBuilder"));
dotenv.config();
const publicDir = process.env.PUBLIC_DIR;
const queuePath = publicDir + '/image-queue';
const queueDir = fs.opendirSync(queuePath);
let queueFolder = queueDir.readSync();
let queueLock = publicDir + '/image-lock';
let lockedFiles = fs.readdirSync(queueLock);
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
    if (builder.picture && builder.picture._oi && builder.picture._em) {
        builder.picture._em.writeImage(config.savePathEM);
        builder.picture._oi.writeImage(config.savePathOI);
    }
});
function runForFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = queuePath + '/' + fileName;
        let config = null;
        try {
            config = fs.readFileSync(path + '/' + fileName + '.json', 'utf8');
            config = JSON.parse(config);
            config.imageUrl = path + '/' + fileName + '.jpg';
            config.savePath = publicDir + '/image-ready/' + fileName + '/' + fileName + '.png';
            config.savePathOI = publicDir + '/image-ready/' + fileName + '/' + fileName + '_oi.png';
            config.savePathEM = publicDir + '/image-ready/' + fileName + '/' + fileName + '_em.png';
            yield wrapper(config);
        }
        catch (e) {
            console.error(e.message);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.argv[2]) {
        yield runForFile(process.argv[2]);
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
        yield runForFile(filename);
        fs.unlinkSync(queueLock + '/' + lockName);
        queueFolder = queueDir.readSync();
    }
}))();
//# sourceMappingURL=scan.js.map