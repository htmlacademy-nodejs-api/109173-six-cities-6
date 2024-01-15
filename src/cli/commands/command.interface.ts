export type ExecuteParameters = string[];

export interface Command {
  getName(): string;
  execute(...parameters: ExecuteParameters): void;
}
