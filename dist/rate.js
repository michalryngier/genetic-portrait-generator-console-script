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
const fs_1 = __importDefault(require("fs"));
const graphics_1 = require("@george_freeman/genetic-portrait-generator/dist/entities/graphics");
const dotenv = __importStar(require("dotenv"));
const helpers_1 = require("@george_freeman/genetic-portrait-generator/dist/helpers");
dotenv.config();
const publicDir = process.env.PUBLIC_DIR;
const readyPath = publicDir + '/image-ready';
const readyDir = fs_1.default.opendirSync(readyPath);
let readyFolder = readyDir.readSync();
(() => __awaiter(void 0, void 0, void 0, function* () {
    while (readyFolder !== null) {
        if (!readyFolder.isDirectory()) {
            readyFolder = readyDir.readSync();
            continue;
        }
        const name = readyFolder.name;
        const path = readyPath + '/' + name + '/';
        const oi = path + name + '/' + name + '_oi.png';
        const em = path + name + '/' + name + '_em.png';
        const generated = path + name + '.png';
        const ratingPath = path + name + '_rate.json';
        const oiImage = new graphics_1.Picture(oi, true);
        const emImage = new graphics_1.Picture(em, true);
        const generatedImage = new graphics_1.Picture(generated, true);
        yield oiImage.waitForInit();
        yield emImage.waitForInit();
        yield generatedImage.waitForInit();
        if (!(oiImage._oi && emImage._oi && generatedImage._oi)) {
            console.error('Cannot load images!!!!!!');
            return 0;
        }
        const rating = {
            edges: { ifWhiteBg: 0, ifBlackBg: 0, nofEdgePixels: 0, allPixels: 0, edgePercent: 0 },
            skinTone: { ifWhiteBg: 0, ifBlackBg: 0, nofSkinTonePixels: 0, allPixels: 0, skinPercent: 0 }
        };
        rating.edges = rateEdges(generatedImage._oi, emImage._oi);
        rating.skinTone = rateSkinTone(generatedImage._oi, oiImage._oi);
        fs_1.default.writeFileSync(ratingPath, JSON.stringify(rating));
        readyFolder = readyDir.readSync();
    }
}))();
function rateEdges(generated, edgeMatrix) {
    let diffThanWhite = 0;
    let diffThanBlack = 0;
    let sum = 0;
    for (let x = 1; x < edgeMatrix.width; x++) {
        for (let y = 1; y < edgeMatrix.height; y++) {
            const point = new graphics_1.Point(x, y);
            const colorRGBA = getRGBA(point, edgeMatrix);
            if (colorRGBA.r === 0 && colorRGBA.g === 0 && colorRGBA.b === 0) {
                continue;
            }
            sum++;
            const colorOnGenerated = getRGBA(point, generated);
            if (!isBlack(colorOnGenerated)) {
                diffThanBlack++;
            }
            else if (!isWhite(colorOnGenerated)) {
                diffThanWhite++;
            }
        }
    }
    return {
        ifWhiteBg: 1 - (diffThanWhite / sum),
        ifBlackBg: 1 - (diffThanBlack / sum),
        nofEdgePixels: sum,
        allPixels: edgeMatrix.width * edgeMatrix.height,
        edgePercent: sum / (edgeMatrix.width * edgeMatrix.height)
    };
}
function rateSkinTone(generated, originalImage) {
    let diffThanWhite = 0;
    let diffThanBlack = 0;
    let sum = 0;
    for (let x = 1; x < originalImage.width; x++) {
        for (let y = 1; y < originalImage.height; y++) {
            const point = new graphics_1.Point(x, y);
            const colorRGBA = getRGBA(point, originalImage);
            if (!isSkin(colorRGBA.r, colorRGBA.g, colorRGBA.b)) {
                continue;
            }
            sum++;
            const colorOnGenerated = getRGBA(point, generated);
            if (!isBlack(colorOnGenerated)) {
                diffThanBlack++;
            }
            else if (!isWhite(colorOnGenerated)) {
                diffThanWhite++;
            }
        }
    }
    return {
        ifWhiteBg: diffThanWhite / sum,
        ifBlackBg: diffThanBlack / sum,
        nofSkinTonePixels: sum,
        allPixels: originalImage.width * originalImage.height,
        skinPercent: sum / (originalImage.width * originalImage.height)
    };
}
function getRGBA(point, image) {
    return helpers_1.ColorHelper.getRGBAColorFromInt(image.getColorOnPosition(point, 0));
}
function isBlack(rgba) {
    return rgba.r === 0 && rgba.g === 0 && rgba.b === 0;
}
function isWhite(rgba) {
    return rgba.r === 255 && rgba.g === 255 && rgba.b === 255;
}
function isSkin(r, g, b) {
    let rgbClassifier = ((r > 95) && (g > 40 && g < 100) && (b > 20) && ((Math.max(r, g, b) - Math.min(r, g, b)) > 15) && (Math.abs(r - g) > 15) && (r > g) && (r > b));
    let sum = r + g + b;
    let nr = (r / sum), ng = (g / sum), nb = (b / sum), normRgbClassifier = (((nr / ng) > 1.185) && (((r * b) / (Math.pow(r + g + b, 2))) > 0.107) && (((r * g) / (Math.pow(r + g + b, 2))) > 0.112));
    let h = 0, mx = Math.max(r, g, b), mn = Math.min(r, g, b), dif = mx - mn;
    if (mx == r) {
        h = (g - b) / dif;
    }
    else if (mx == g) {
        h = 2 + ((g - r) / dif);
    }
    else {
        h = 4 + ((r - g) / dif);
    }
    h = h * 60;
    if (h < 0) {
        h = h + 360;
    }
    let s = 1 - (3 * ((Math.min(r, g, b)) / (r + g + b)));
    let hsvClassifier = (h > 0 && h < 35 && s > 0.23 && s < 0.68);
    return (rgbClassifier || normRgbClassifier || hsvClassifier);
}
//# sourceMappingURL=rate.js.map