import { useRef } from 'react';

export interface Command {
  execute(...args: unknown[]): void;
  undo(): void;
}

/**
 * Command executor
 * Every command execute by this class will be tracked.
 */
export class CommandInvoker {
  /**
   * History stacks that saved all undo-able commands.
   */
  private history: Command[] = [];

  /**
   * History stacks that saved all command that has been undo.
   */
  private undoHistory: Command[] = [];

  public get isHistoryEmpty(): boolean {
    return this.history.length === 0;
  }

  public get isUndoHistoryEmpty(): boolean {
    return this.undoHistory.length === 0;
  }

  executeCommand(command: Command) {
    command.execute();
    this.history.push(command);
  }

  undoLastCommand() {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.undoHistory.push(command);
    }
  }

  redoLastCommand() {
    const command = this.undoHistory.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }

  reset(resetCommand: Command) {
    resetCommand.execute();
    this.history.length = 0;
    this.undoHistory.length = 0;
  }
}

/**
 * Initialize Invoker hook.
 */
export function useCommandInvoker() {
  const invoker = useRef(new CommandInvoker());
  return { invoker: invoker.current };
}
