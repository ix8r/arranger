import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import conductor from "./conductor"

import structure from "./structure"

yargs(hideBin(process.argv))
    .command("structure", "construct song structure", yargs => {
        return yargs.option(
            "template", {
                type: "string",
                describe: "Song structure template",
                alias: "t"
            }
        ).option(
            "output", {
                type: "string",
                describe: "Output file",
                alias: "o"
            }
        )
    }, argv => structure(argv))
    .command("conductor", "generate instrument sequence", yargs => {
        return yargs.option(
            "structure", {
                type: "string",
                describe: "Song structure file",
                alias: "s",
                demandOption: true
            }
        ).option(
            "output", {
                type: "string",
                describe: "Output file",
                alias: "o"
            }
        ).option(
            "visual", {
                type: "boolean",
                describe: "Output a visual representation instead of JSON",
                alias: "v"
            }
        )
    }, argv => conductor(argv))
    .parse()