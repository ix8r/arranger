import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import structure from "./structure"

yargs(hideBin(process.argv))
    .command("structure", "construct song structure", yargs => {
        return yargs.option(
            "template", {
                type: "string",
                describe: "Song structure template",
                alias: "t"
            }
        )
    }, argv => structure(argv))
    .parse()