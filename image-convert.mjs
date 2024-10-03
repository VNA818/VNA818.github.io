import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync, copyFileSync } from "fs";

const INPUT_PATH = "./images";
const OUTPUT_PATH = "./dist/images";

const convertImages = async () => {
    if(!existsSync(OUTPUT_PATH)) {
        mkdirSync("./dist");
        mkdirSync("./dist/images");
    }
    const replacements = [];
    const files = readdirSync(INPUT_PATH, { recursive: true });
    for(const file of files) {
        const regex = /(\.jpeg)|(\.png)|(\.jpg)/i;
        if(regex.test(file)) {
            const newFileName = file.replace(regex, ".webp");
            const output = `${OUTPUT_PATH}/${newFileName}`;
            const outputSplit = output.split("/")
            outputSplit.pop();
            const folder = outputSplit.join("/");
            if(!existsSync(folder)) {
                mkdirSync(folder);
            }
            await sharp(`${INPUT_PATH}/${file}`).toFile(output);
            replacements.push([file, newFileName]);
            console.log(`./images/${file} -> ${output}`);
        } else if(/(\.webp)/i.test(file)) {
            const fileName = `${INPUT_PATH}/${file}`;
            const output = `./dist/images/${file}`;
            copyFileSync(fileName, output);
            console.log(`${fileName} -> ${output}`);
        }
    }
    return replacements;
}

const convertImagesPlugin = () => {
    let replacements = [];

    return {
        async buildStart() {
          replacements = await convertImages();
       },
       generateBundle(options, bundle) {
        for (const file of Object.keys(bundle)) {
          if (bundle[file].type === 'chunk') {
            for(const r of replacements) {
                bundle[file].code = bundle[file].code.replace(r[0], r[1]);
            }
          }
        }
      },
    }
}

export default convertImagesPlugin;
