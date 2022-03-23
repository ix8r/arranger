// Structure JSON

export type StructureFileLengthRange = {
    min: number,
    max: number
}

export type StructureFileBlock = StructureFileOneShotBlock | StructureFileLoopBlock

export type StructureFileOneShotBlock = {
    type: "oneshot",
    name: string,
    optional?: boolean
}

export type StructureFileLoopBlock = {
    type: "loop",
    count: StructureFileLengthRange,
    optional?: boolean,

    prefix?: StructureFileBlock,
    infix?: StructureFileBlock,
    suffix?: StructureFileBlock,

    blocks: StructureFileBlock[]
}

export type StructureFile = {
    description: string,
    lengths: {
        [key: string]: StructureFileLengthRange
    },
    blocks: StructureFileBlock[]
}

// Structure "transition" data (before lengths are expanded)

export type StructureTransitionBlock = {
    name: string,
    length: number
}

// Final expanded unit structure block (8 bars)

export type StructureBlock = {
    name: string,
    length: number,
    occurence: number
}