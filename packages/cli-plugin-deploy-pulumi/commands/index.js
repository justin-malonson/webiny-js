const { red } = require("chalk");
const destroy = require("./destroy");
const deploy = require("./deploy");
const build = require("./build");
const watch = require("./watch");
const output = require("./output");

module.exports = [
    {
        type: "cli-command",
        name: "cli-command-deployment",
        create({ yargs, context }) {
            yargs.example("$0 deploy api --env=dev");
            yargs.example("$0 build api --env=dev");
            yargs.example("$0 destroy api --env=dev");
            yargs.example("$0 output api --env=dev");
            yargs.example("$0 pulumi api --env dev -- config set foo bar --secret");

            yargs.command(
                "deploy [folder]",
                `Deploys cloud infrastructure for given project application`,
                yargs => {
                    yargs.example("$0 deploy api --env=dev");
                    yargs.example("$0 deploy --env=dev");
                    yargs.positional("folder", {
                        describe: `Project application folder`,
                        type: "string"
                    });
                    yargs.option("env", {
                        describe: `Environment`,
                        type: "string"
                    });
                    // yargs.option("variant", {
                    //     describe: `Variant (only for staged rollouts)`,
                    //     type: "string"
                    // });
                    yargs.option("build", {
                        default: true,
                        describe: `Build packages before deploying`,
                        type: "boolean"
                    });
                    yargs.option("deploy", {
                        default: true,
                        describe: `Deploy project application after the application code has been built`,
                        type: "boolean"
                    });
                    yargs.option("preview", {
                        default: false,
                        describe: `Preview the deploy instead of actually performing it`,
                        type: "boolean"
                    });
                    yargs.option("debug", {
                        default: false,
                        describe: `Turn on debug logs`,
                        type: "boolean"
                    });
                    yargs.option("logs", {
                        default: undefined,
                        describe: `Enable base compilation-related logs`,
                        type: "boolean"
                    });
                },
                async argv => {
                    await deploy(argv, context);
                    process.exit(0);
                }
            );

            yargs.command(
                "build [folder]",
                `Builds application code for given project application`,
                yargs => {
                    yargs.example("$0 build api --env=dev");
                    yargs.example("$0 build --env=dev");
                    yargs.positional("folder", {
                        describe: `Project application folder`,
                        type: "string"
                    });
                    yargs.option("env", {
                        describe: `Environment`,
                        type: "string"
                    });
                    // yargs.option("variant", {
                    //     describe: `Variant (only for staged rollouts)`,
                    //     type: "string"
                    // });
                    yargs.option("debug", {
                        default: false,
                        describe: `Turn on debug logs`,
                        type: "boolean"
                    });
                    yargs.option("logs", {
                        default: undefined,
                        describe: `Enable base compilation-related logs`,
                        type: "boolean"
                    });
                },
                async argv => {
                    await build(argv, context);
                    process.exit(0);
                }
            );

            yargs.command(
                "watch [folder]",
                `Rebuild and deploy specified specified project application while making changes to it`,
                yargs => {
                    yargs.example("$0 watch api --env=dev");
                    yargs.example(
                        "$0 watch api --env=dev --scope my-package-1 --scope my-package-2"
                    );
                    yargs.example("$0 watch api --env=dev --depth 2");
                    yargs.example('$0 watch api --env=dev -r "my-function*"');
                    yargs.example('$0 watch --env=dev --scope "my/{package1,package2}" ');

                    yargs.positional("folder", {
                        describe: `Project application folder`,
                        type: "string"
                    });
                    yargs.option("env", {
                        describe: `Environment`,
                        type: "string"
                    });
                    yargs.option("build", {
                        describe: `While making code changes, re-build all relevant packages`,
                        type: "boolean"
                    });
                    yargs.option("deploy", {
                        describe: `While making code changes, re-deploy cloud infrastructure`,
                        type: "boolean"
                    });
                    yargs.option("package", {
                        alias: "p",
                        describe: `Override watch packages (list of packages that need to be watched for code changes)`,
                        type: "string"
                    });
                    yargs.option("depth", {
                        describe: `The level of dependencies that needs to be watched for code changes (does not work when "scope" is passed)`,
                        type: "number",
                        default: 2
                    });
                    yargs.option("output", {
                        describe: `Specify the output destination to which all of the logs will be forwarded`,
                        default: "simple",
                        type: "string"
                    });
                    yargs.option("logs", {
                        default: undefined,
                        describe: `Enable base compilation-related logs`,
                        type: "boolean"
                    });
                    yargs.option("remoteRuntimeLogs", {
                        alias: "r",
                        describe: `Forward logs from deployed application code to your terminal (optionally accepts a glob pattern for filtering purposes)`,
                        type: "string"
                    });
                    yargs.option("show-timestamps", {
                        alias: "t",
                        describe: `Includes timestamps in the logs`,
                        type: "boolean"
                    });
                    yargs.option("debug", {
                        default: false,
                        describe: `Turn on debug logs`,
                        type: "boolean"
                    });
                    yargs.option("allowProduction", {
                        default: false,
                        describe: `Enables running the watch command with "prod" and "production" environments (not recommended).`,
                        type: "boolean"
                    });
                },
                async argv => watch(argv, context)
            );

            yargs.command(
                "destroy [folder]",
                `Destroys deployed cloud infrastructure for given project application`,
                yargs => {
                    yargs.example("$0 destroy api --env=dev");
                    yargs.positional("folder", {
                        describe: `Project application folder`,
                        type: "string"
                    });
                    yargs.option("env", {
                        required: true,
                        describe: `Environment`,
                        type: "string"
                    });

                    yargs
                        .option("confirm-destroy-env", {
                            describe: `Confirm environment name to destroy. Must be passed when destroying the whole project.`,
                            type: "string"
                        })
                        .check(args => {
                            const { folder, confirmDestroyEnv } = args;

                            // If the folder is not defined, we are destroying the whole project.
                            // In that case, we must confirm the environment name to destroy.
                            if (!folder) {
                                if (!confirmDestroyEnv) {
                                    throw new Error(
                                        `Please confirm complete project destruction by appending ${red(
                                            `--confirm-destroy-env=${args.env}`
                                        )} to the command.`
                                    );
                                }

                                if (confirmDestroyEnv !== args.env) {
                                    throw new Error(
                                        `The ${red(
                                            `--confirm-destroy-env`
                                        )} option value must match the ${red("env")} option value.`
                                    );
                                }
                            }

                            return true;
                        });

                    yargs.option("debug", {
                        default: false,
                        describe: `Turn on debug logs`,
                        type: "boolean"
                    });
                },
                async argv => {
                    await destroy(argv, context);
                    process.exit(0);
                }
            );

            yargs.command(
                "output <folder>",
                `Prints deployed cloud infrastructure' output for given project application and environment`,
                yargs => {
                    yargs.example("$0 output api --env=dev --json");
                    yargs.positional("folder", {
                        describe: `Project application folder`,
                        type: "string"
                    });
                    yargs.option("env", {
                        required: true,
                        describe: `Environment`,
                        type: "string"
                    });
                    // yargs.option("variant", {
                    //     describe: `Variant (staged rollouts only)`,
                    //     type: "string"
                    // });
                    yargs.option("json", {
                        describe: `Emit output as JSON`,
                        type: "boolean"
                    });
                    yargs.option("debug", {
                        default: false,
                        describe: `Turn on debug logs`,
                        type: "boolean"
                    });
                },
                async argv => {
                    await output(argv, context);
                    process.exit(0);
                }
            );

            yargs.command(
                "pulumi <folder>",
                `Runs a Pulumi command in the provided project application folder. Note: make sure to use "--" before the actual Pulumi command.`,
                () => {
                    yargs.example("$0 pulumi api --env dev -- config set foo bar --secret");

                    yargs.positional("folder", {
                        describe: `Project application folder`,
                        type: "string"
                    });

                    yargs.option("env", {
                        describe: `Environment`,
                        type: "string"
                    });
                    // yargs.option("variant", {
                    //     describe: `Variant (only for staged rollouts)`,
                    //     type: "string"
                    // });
                    yargs.option("debug", {
                        default: false,
                        describe: `Turn on debug logs`,
                        type: "boolean"
                    });
                },
                async argv => {
                    await require("./pulumiRun")(argv, context);
                    process.exit(0);
                }
            );

            yargs.command(
                "execute-migrations [pattern]",
                `Execute data migrations Lambda. If pattern is provided, only the matching migrations will be executed.`,
                () => {
                    yargs.example("$0 execute-migrations --env dev");
                    yargs.example("$0 execute-migrations 5.35.0-001 --env dev");
                    yargs.example(`$0 execute-migrations "5.35.*" --env dev`);

                    yargs.positional("pattern", {
                        describe: `Pattern to match against the migration ID.`,
                        type: "string"
                    });

                    yargs.option("env", {
                        describe: `Environment`,
                        type: "string",
                        required: true
                    });
                },
                async argv => {
                    await require("./executeMigrations")(argv, context);
                    process.exit(0);
                }
            );
        }
    }
];
