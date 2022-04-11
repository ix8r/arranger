import { availableLayers, ConductorLayerBlock } from "./layers"

export function printVisual(blocks: ConductorLayerBlock[]) {
    let output = ""

    const separator = "-".repeat(blocks.length * 5 + 10) + "\n"


    let sectionLabels = " ".repeat(9)
    let lastSectionLabel = null
    let sectionCounter = 0

    for (const block of blocks) {
        if (lastSectionLabel !== block.name) {
            lastSectionLabel = block.name

            sectionLabels = sectionLabels.substring(0, sectionCounter * 5 + 9)
            sectionLabels += "|" + block.name
        } else {
            sectionLabels += " ".repeat(5)
        }

        sectionCounter++
    }

    output += sectionLabels.substring(0, sectionCounter * 5 + 9) + "|\n"
    output += separator

    for (const layerName of availableLayers) {
        output += `${layerName.padEnd(8, " ")} |`

        for (const block of blocks) {
            const blockLayer = block.layers.find(layer => layer.name === layerName)

            if (blockLayer) {
                output += blockLayer.complexity.toString().repeat(4) + "|"
            } else {
                output += "    |"
            }
        }

        output += "\n"
    }

    return output
}