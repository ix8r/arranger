import { existsSync, readFileSync } from "fs"
import { StructureBlock } from "../structure/types"
import { createPointTargets } from "./points"

export default (argv: {
    structure: string
}) => {
    if (!existsSync(argv.structure)) {
        console.error(`Structure file ${argv.structure} not found.`)
        process.exit(1)
    }

    const structure: StructureBlock[] = JSON.parse(
        readFileSync(argv.structure, "utf8")
    )

    const targets = createPointTargets(structure)
}