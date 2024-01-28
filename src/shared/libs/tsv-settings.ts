export const TSVSettings = {
  DELIMITER: {
    LINE: '\n',
    PARAMS: '|',
    VALUES: ';'
  }
} as const;


export const ReadEvent = {
  READ_ROW: 'readRow',
  ERROR: 'errorReadRow',
  END: 'endReadRow',
} as const;
