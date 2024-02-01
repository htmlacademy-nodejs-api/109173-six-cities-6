export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string,
  dbname: string): string {
  return `mongodb://${username}:${password}@${host}:${port}/${dbname}/?authSource=admin`;
}

