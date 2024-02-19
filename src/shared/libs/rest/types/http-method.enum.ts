export const HttpMethod = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PATCH: 'patch',
  PUT: 'put'
} as const;

export type HttpMethodType = (typeof HttpMethod)[keyof typeof HttpMethod];
