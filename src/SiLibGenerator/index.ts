
import { Base, IPromptOptions } from "yeoman-generator";
import { createConfig, getConfig, SiLibGlobalConfig } from "./../config";
import * as Q from "q";
declare module "yeoman-generator" {
    interface YeomanGeneratorBase {
        log(message: string, data: any): void;

        config: any;
    }
}

function extend(...args: Array<any>) {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}


export class SiLibGenerator extends Base {

    protected libraryName: string;

    constructor(args: string | string[], options: any) {
        super(args, options);

        // Next, add your custom code
        this.option('coffee'); // This method adds support for a `--coffee` flag

        // This makes `appname` a required argument.
        this.argument('libraryName', { type: "string", required: false, desc:"the library name" });
    }

 //   private configExists = false;
 //   private defaultAuthorName: string;
 //   private defaultAuthorURI: string;
 //   private defaultAppInsights: boolean;

    private defaults: SiLibGlobalConfig;

    private initializingConfig() {
        var cb = this.async();
            

        //this.configExists = false

        getConfig((err, data)=> {
            if (!err) {
               // this.configExists = true
            }
            this.defaults = data;
            console.log('initializingConfig just ran');
            cb()
        })
    }

    /**
     * Your initialization methods (checking current project state, getting configs, etc)
     */
    public initializingMethod1() {
        console.log('initializingMethod1 just ran');

        if (this.defaults.appInsight === null) {
            let cb = this.async();
            this.prompt([{
                type: 'confirm',
                name: 'appInsight',
                message: 'May we gather user statistics and application insights to improve our generator?',
                default: 'Y'
            }]).then((answers: { appInsight: boolean }) => {
                this.defaults.appInsight = answers.appInsight;
                createConfig(this.defaults, cb);
            });
        }
    }

    /**
     * Where you prompt users for options (where you'd call this.prompt())
     */
    public promptingMethod1() {
        console.log('prompting just ran');

        let prompts = new Array<IPromptOptions>();

        if (!this.libraryName) {
            prompts.push({
                type: 'input',
                name: 'libraryName',
                message: 'Your library name',
                default: this.appname.replace(" ","-") // Default to current folder name
            });
        }

        let promptValues: { [key: string]: string } = {
            "authorName": "npm package author name",
            "authorEmail": "npm package author email",
            "authorUri": "npm package author uri",
            "homepage": "npm package homepage",
            "githubAccount": "github organization or user name",

        };

        for (let key in promptValues) {
            prompts.push({
                type: 'input',
                name: key,
                message: promptValues[key],
               default: this.defaults[key] || ''
            });
        }
        
        if (prompts.length > 0) {
            let cb = this.async();

            this.prompt(prompts).then((answers: SiLibGlobalConfig & { libraryName: string }) => {
                this.libraryName = answers.libraryName;
                for (let key in promptValues) {
                    this.defaults[key] = answers[key]
                }
                createConfig(this.defaults, cb);
            });
        }
    }
    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    public configuringMethod() {
        console.log('configuring just ran');
    }


    public method1() {
        console.log('method 1 just ran');
        let deffered = Q.defer();
        setTimeout(() => {
            console.log('method 1 just completed');
            deffered.resolve();
        },1000);

        return deffered.promise;
    }

    public method2() {
        console.log('method 2 just ran');
    }

    private _helper() {
        console.log('method 3 just ran');
    }

    /**
     *  Where you write the generator specific files (routes, controllers, etc)
     */
    public writingMethod() {
        console.log('writingMethod just ran');

        let values = extend({ libraryName: this.libraryName }, this.defaults);
        this.fs.copyTpl(           
            this.templatePath('package.json.template'),
            this.destinationPath('package.json'),
            values
        );  
        this.fs.copyTpl(
            
            this.templatePath('project.json.template'),
            this.destinationPath('project.json'),
            values
        );
        this.fs.copyTpl(
            this.templatePath('global.json.template'),
            this.destinationPath('global.json'),
            values
        );
        this.fs.copyTpl(
            this.templatePath('README.md.template'),
            this.destinationPath('README.md'),
            values
        );
        this.fs.copyTpl(
            this.templatePath('tsconfig.json.template'),
            this.destinationPath('tsconfig.json'),
            values
        );
        this.fs.copyTpl(
            this.templatePath('project.xproj.template'),
            this.destinationPath(this.libraryName+ '.xproj'),
            values
        );
        this.fs.copyTpl(
            this.templatePath('test-tsconfig.json.template'),
            this.destinationPath("tests/tsconfig.json"),
            values
        );
        this.fs.copyTpl(
            this.templatePath('.gitattributes.template'),
            this.destinationPath(".gitattributes"),
            values
        );

        this.fs.copyTpl(
            this.templatePath('.gitignore.template'),
            this.destinationPath(".gitignore"),
            values
        );



        this.fs.write(this.destinationPath("src/vendors.d.ts"), "");


        this.gruntfile.insertConfig("jasmine", `{"tests":{"src":["dist/src/**/*.js"],"summary":true,"phantomjs":{"resourceTimeout":25000},"options":{"specs":["tests/*.js"],"junit":{"path":"build/junit"},"template":require("grunt-template-jasmine-istanbul"),"templateOptions":{"coverage":"build/coverage/coverage.json","report":[{"type":"lcov","options":{"dir":"build/coverage/lcov"}},{"type":"cobertura","options":{"dir":"build/coverage/cobertura"}}],"template":require("grunt-template-jasmine-requirejs"),"templateOptions":{"requireConfig":{"shim":{},"baseUrl":".grunt/grunt-contrib-jasmine/dist/src/","paths":{},"packages":[{name:"${this.libraryName}",main:"index",location:"."}]}}}}}}`);

        let coverall = {
            // Options relevant to all targets
            options: {
                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },

            upload: {
                // LCOV coverage file (can be string, glob or array)
                src: 'build/coverage/lcov/*.info',
                options: {
                    // Any options for just this target
                }
            },
        };

        this.gruntfile.insertConfig("coverall", JSON.stringify(coverall));

        this.gruntfile.registerTask("tests", ["jasmine:tests"]);
        this.gruntfile.loadNpmTasks("grunt-coveralls"); 
        this.gruntfile.loadNpmTasks("grunt-contrib-jasmine");



        this.config.save();
    }
    /**
     * conflicts - Where conflicts are handled (used internally)
     */
    public conflictsMethod() {
        console.log('conflicts just ran');
    }

    /**
     *install - Where installation are run (npm, bower)
     */
    public installMethod() {
        console.log('install just ran');

        this.npmInstall([
            '@types/jasmine',
            "grunt",
            "grunt-contrib-jasmine",
            "grunt-coveralls",
            "grunt-template-jasmine-istanbul",
            "typescript",
            "grunt-template-jasmine-requirejs@mikeapr4/grunt-template-jasmine-requirejs#311e8ddfa89566a03444964e013c6825c0263795"
        ], { 'save-dev': true });
    }

    /**
     * cend - Called last, cleanup, say good bye, etc
     */
    public endMetod() {
        console.log('endMetod just ran');

      
    }
    
}


