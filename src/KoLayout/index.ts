import { Base, IPromptOptions } from "yeoman-generator";
import { createConfig, getConfig } from "./../config";
import * as Q from "q";

class KoLayoutGenerator extends Base {

    constructor(args: string | string[], options: any) {
        super(args, options);
    }

    installDepedencies() {
        this.npmInstall([
            "kolayout"
        ], { 'save': true });
    }
}

export = KoLayoutGenerator;