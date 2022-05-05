import select from "weighted"
import { ConductorPointBlock } from "./points"

export const availableLayers = [
    "drums", "bass", "chords",
    "arps", "pads"
]

const layerWeights: {
    [key: string]: number
} = {
    "drums": 5,
    "bass": 3,
    "chords": 3,
    "arps": 3,
    "pads": 3
}

const maxLayerComplexity = 3

type ConductorLayer = {
    name: string,
    complexity: number
}

export type ConductorLayerBlock = {
    name: string,
    points: number,
    layers: ConductorLayer[]
}

type ConductorMemory = {
    first: ConductorLayer[],
    last: ConductorLayer[]
}

function calculateLayerPoints(layers: ConductorLayer[]) {
    return layers.reduce((acc, layer) => acc + 1 + layer.complexity, 0)
}

function pointsToLayerProbability(n: number, i: number) {
    if (i === 0) {
        return 1
    }

    return 0.5
}

function pickNewLayer(existingLayers: string[]) {
    if (existingLayers.length === availableLayers.length) {
        return null
    }

    const pick = availableLayers.filter(s => !existingLayers.includes(s))
    const weights = pick.map(layer => layerWeights[layer])

    return select(pick, weights)
}

function advanceLayers(layers: ConductorLayer[], target: number, pass = 0) {
    if (pass === 0 && layers.length) {
        pass = calculateLayerPoints(layers)
    }

    if (pass === target) {
        return
    }

    if (pass < target) {
        while (calculateLayerPoints(layers) !== pass + 1) {
            const existingLayers = layers.map(layer => layer.name)
        
            const newLayerProbability = pointsToLayerProbability(target, pass)
            const newLayerName = pickNewLayer(existingLayers)
        
            if (newLayerName !== null && Math.random() < newLayerProbability) {
                layers.push({
                    name: newLayerName,
                    complexity: 0
                })
            } else {
                const layer = layers[Math.floor(Math.random() * layers.length)]
        
                if (layer.complexity < maxLayerComplexity) {
                    layer.complexity += 1
                }
            }
        }
    
        advanceLayers(layers, target, pass + 1)
    } else if (pass > target) {
        const layer = layers[Math.floor(Math.random() * layers.length)]

        if (!layer) {
            return
        }

        if (layer.complexity) {
            layer.complexity -= 1
        } else {
            const index = layers.indexOf(layer)

            layers.splice(index, 1)
        }
        
        advanceLayers(layers, target, pass - 1)
    }
}

export function createLayerBlocks(blocks: ConductorPointBlock[]): ConductorLayerBlock[] {
    const memory: {
        [key: string]: ConductorMemory
    } = {}
    
    return blocks.map(block => {
        if (block.name in memory) {
            const mem = memory[block.name]

            if (block.start) {
                advanceLayers(mem.first, block.points)
                mem.last = JSON.parse(JSON.stringify(mem.first))

                return {
                    name: block.name,
                    points: block.points,
                    layers: JSON.parse(JSON.stringify(mem.first))
                }
            } else {
                advanceLayers(mem.last, block.points)

                return {
                    name: block.name,
                    points: block.points,
                    layers: JSON.parse(JSON.stringify(mem.last))
                }
            }
        } else {
            const layers: ConductorLayer[] = []
            advanceLayers(layers, block.points)

            memory[block.name] = {
                first: layers,
                last: JSON.parse(JSON.stringify(layers))
            }

            return {
                name: block.name,
                points: block.points,
                layers: JSON.parse(JSON.stringify(layers))
            }
        }
    })
}