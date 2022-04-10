import { StructureBlock } from "../structure/types"

export type ConductorPointBlock = {
    name: string,
    points: number,
    start?: boolean
}

const customPointDiffs: {
    [key: string]: number
} = {
    "prechorus": -2,
    "postchorus": -2,
    "bridge": -6,
    "outro": -4
}

const customPointSlopes: {
    [key: string]: number
} = {
    "outro": -1
}

export function createPointTargets(blocks: StructureBlock[]) {
    const pointMemory: {
        [key: string]: number
    } = {}
    let lastPointValue = 0

    const blockPoints = blocks.map(block => {
        if (block.name in pointMemory) {
            pointMemory[block.name] += 1
        } else {
            if (block.name in customPointDiffs) {
                pointMemory[block.name] = Math.max(lastPointValue + customPointDiffs[block.name], 2)
            } else {
                pointMemory[block.name] = lastPointValue + 2
            }
        }

        lastPointValue = pointMemory[block.name]

        return {
            name: block.name,
            length: block.length,
            points: pointMemory[block.name]
        }
    })

    const finalBlocks: ConductorPointBlock[] = []

    blockPoints.forEach(block => {
        let slope = 1

        if (block.name in customPointSlopes) {
            slope = customPointSlopes[block.name]
        }

        for (let i = 0; i < block.length; i++) {
            finalBlocks.push({
                name: block.name,
                points: block.points + i * slope,
                start: i == 0
            })
        }
    })

    return finalBlocks
}