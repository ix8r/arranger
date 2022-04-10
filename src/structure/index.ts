import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { processTemplate } from "./algorithm"
import { StructureFile } from "./types"

const templatesDir = join(__dirname, "../../data/structure")

function getKnownTemplates(): StructureFile[] {
    const knownTemplates: StructureFile[] = []

    for (const item of readdirSync(templatesDir)) {
        if (item.endsWith(".json")) {
            const templatePath = join(templatesDir, item)

            knownTemplates.push(JSON.parse(readFileSync(templatePath, "utf-8")))
        }
    }

    return knownTemplates
}

export default (argv: {
    template?: string,
    output?: string
}) => {
    let template: StructureFile

    if (argv.template) {
        const templatePath = join(templatesDir, argv.template + ".json")

        if (existsSync(templatePath)) {
            template = JSON.parse(readFileSync(templatePath, "utf-8"))
        } else {
            console.error(`Template ${argv.template} not found.`)
            process.exit(1)
        }
    } else {
        const knownTemplates = getKnownTemplates()

        template = knownTemplates[Math.floor(knownTemplates.length * Math.random())]
    }
    
    const blocks = processTemplate(template)
    const blocksText = JSON.stringify(blocks, null, 4)

    if (!argv.output) {
        console.log(blocksText)
    } else {
        writeFileSync(argv.output, blocksText, "utf8")
    }
}