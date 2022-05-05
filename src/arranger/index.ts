import { writeFileSync } from "fs"
import { ConductorLayerBlock, createLayerBlocks } from "../conductor/layers"
import { createPointTargets } from "../conductor/points"
import { findTemplate } from "../structure"
import { processTemplate } from "../structure/algorithm"

export type ArrangerOutput = {
    bpm: number,
    blocks: ConductorLayerBlock[]
}

export default function(argv: {
    template?: string,
    output?: string
}) {
    const template = findTemplate(argv.template)
    const blocks = processTemplate(template)
    
    const targets = createPointTargets(blocks)
    const layers = createLayerBlocks(targets)

    const data: ArrangerOutput = {
        bpm: Math.round(Math.random() * 60 + 90),
        blocks: layers
    }
    const dataText = JSON.stringify(data, null, 4)

    if (!argv.output) {
        console.log(dataText)
    } else {
        writeFileSync(argv.output, dataText, "utf8")
    }
}