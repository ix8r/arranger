import { existsSync, readFileSync, writeFileSync } from "fs"
import { StructureBlock } from "../structure/types"
import { createLayerBlocks } from "./layers"
import { createPointTargets } from "./points"
import { printVisual } from "./visual"

export default (argv: {
    structure: string,
    output?: string,
    visual?: boolean
}) => {
    if (!existsSync(argv.structure)) {
        console.error(`Structure file ${argv.structure} not found.`)
        process.exit(1)
    }

    const structure: StructureBlock[] = JSON.parse(
        readFileSync(argv.structure, "utf8")
    )

    const targets = createPointTargets(structure)

    const layers = createLayerBlocks(targets)
    const layersText = argv.visual ?
                       printVisual(layers) :
                       JSON.stringify(layers, null, 4)

    if (!argv.output) {
        console.log(layersText)
    } else {
        writeFileSync(argv.output, layersText, "utf8")
    }
}