// Heavily inspired by jsh: https://github.com/bradymholt/jsh

import { spawnSync } from "child_process";

interface ICommandOptions {
  captureStdout: boolean;
  echoCommand: true;
  noThrow: boolean;
  shell: true;
  maxBuffer: number | undefined;
  timeout: number | undefined;
}

export class CommandError extends Error {
  public command: string;
  public params: string;
  public stdout: string;
  public stderr: string;
  public status: number;

  constructor(
    command: string,
    params: ReadonlyArray<string>,
    stdout: string,
    stderr: string,
    status: number
  ) {
    super(stderr || stdout);
    this.command = command;
    this.params = JSON.stringify(params);
    this.stdout = stdout;
    this.stderr = stderr;
    this.status = status;
  }
}

export function syncExecCommand(
  command: string,
  parameters: ReadonlyArray<string>,
  optionsParam: Partial<ICommandOptions> = {}
) {
  // Set default options for those not provided
  const options: ICommandOptions = Object.assign(
    {
      captureStdout: true,
      echoCommand: true,
      noThrow: false,
      shell: true,
      maxBuffer: 1024 * 1024 * 5 /* 5MB */,
      timeout: 0,
    },
    optionsParam
  );
  if (options.echoCommand) {
    console.log(command, parameters);
  }
  let result = spawnSync(command, parameters, {
    stdio: [
      0,
      options.captureStdout ? "pipe" : "inherit",
      options.captureStdout ? "pipe" : "inherit",
    ],
    shell: options.shell,
    windowsHide: true,
    maxBuffer: options.maxBuffer,
    encoding: "utf-8",
    timeout: options.timeout,
  });
  const scrubOutput = (output: string) => {
    return output?.replace("/bin/sh: ", "").replace(/^\n|\n$/g, "") ?? "";
  };
  const stdout = scrubOutput(result.stdout);
  const stderr = scrubOutput(result.stderr);
  const status = result.status ?? 0;
  if (status != 0) {
    if (options.noThrow === true) {
      return stderr || stdout;
    } else {
      throw new CommandError(command, parameters, stdout, stderr, status);
    }
  } else {
    return stdout;
  }
}
