const pack = require('../../package.json');
export const docOpts = {
  grouping: 'tags',
  info: {
    title: 'Ulix API',
    description:
      'The API is organized around [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer). ',
    version: pack.version,
  },
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      'x-keyPrefix': 'Bearer ',
    },
  },
  security: [{ jwt: [] }],
  documentationPage: true,
  swaggerUI: true,
  definitionPrefix: 'useLabel',
  reuseDefinitions: true,
  deReference: true,
  sortEndpoints: 'ordered',
  tags: [],
};
