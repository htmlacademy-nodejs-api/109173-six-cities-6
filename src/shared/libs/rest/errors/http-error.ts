export class HttpError extends Error {
  public statusCode: number;
  public detail?: string;

  constructor(statusCode: number, message: string, detail?: string){
    super(message);

    this.statusCode = statusCode;
    this.detail = detail;
  }
}
