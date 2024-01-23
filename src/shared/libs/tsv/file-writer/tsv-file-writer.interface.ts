export interface TSVFileWriter {
  write(data: string): void
  checkWriteStatus(writeStatus: boolean): Promise<unknown>
}
