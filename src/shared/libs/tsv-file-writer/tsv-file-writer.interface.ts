export interface FileWriter {
  write(data: string): void
  checkWriteStatus(writeStatus: boolean): Promise<unknown>
}
