import { StructureBlock, StructureFile, StructureFileBlock, StructureFileLengthRange, StructureTransitionBlock } from "./types"

function rollLength(lengthRange: StructureFileLengthRange): number {
    return Math.floor(
        Math.random() * (lengthRange.max - lengthRange.min + 1)
    ) + lengthRange.min
}

function determineLengths(data: StructureFile): { [key: string]: number } {
    const lengths: { [key: string]: number } = {}

    for (const key in data.lengths) {
        const lengthRange = data.lengths[key]

        lengths[key] = rollLength(lengthRange)
    }

    return lengths
}

function processBlock(
    block: StructureFileBlock,
    lengths: { [key: string]: number },
    skipOptional?: boolean
): StructureTransitionBlock[] {
    if (block.optional && Math.random() >= 0.5 && !skipOptional) {
        return []
    }

    if (block.type === "oneshot") {
        if (!(block.name in lengths)) {
            console.error(`Malformed structure file: no length defined for ${block.name}`)
            process.exit(1)
        }

        return [{
            name: block.name,
            length: lengths[block.name]
        }]
    } else if (block.type === "loop") {
        const blocks: StructureTransitionBlock[] = []

        if (block.prefix) {
            blocks.push(...processBlock(block.prefix, lengths))
        }

        const count = rollLength(block.count)

        const blockOptionality: boolean[] = Array(block.blocks.length).fill(true)
        block.blocks.forEach((block, j) => {
            if (block.optional) {
                blockOptionality[j] = Math.random() >= 0.5
            }
        })

        for (let i = 0; i < count; i++) {
            block.blocks.forEach((block, j) => {
                if (!blockOptionality[j]) {
                    return
                }
                blocks.push(...processBlock(block, lengths, true))
            })

            if (i < count - 1 && block.infix) {
                blocks.push(...processBlock(block.infix, lengths))
            }
        }

        if (block.suffix) {
            blocks.push(...processBlock(block.suffix, lengths))
        }

        return blocks
    }

    console.log(block)

    console.error(`Malformed structure file: unknown block`)
    process.exit(1)
}

function expandBlocks(
    blocks: StructureTransitionBlock[]
): StructureBlock[] {
    const expanded: StructureBlock[] = []
    const occurences: {
        [key: string]: number
    } = {}

    for (const block of blocks) {
        if (!(block.name in occurences)) {
            occurences[block.name] = 0
        } else {
            occurences[block.name] += 1
        }

        expanded.push({
            name: block.name,
            length: block.length,
            occurence: occurences[block.name]
        })
    }

    return expanded
}

function processBlocks(
    blocks: StructureFileBlock[],
    lengths: { [key: string]: number }
): StructureTransitionBlock[] {
    return blocks.map(block => processBlock(block, lengths)).flat()
}

export function processTemplate(data: StructureFile) {
    const lengths = determineLengths(data)

    const blocks = expandBlocks(processBlocks(data.blocks, lengths))

    console.log(blocks)
}