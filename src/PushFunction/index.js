const app = require('./app');
const filterOutDuplicatedContent = require('./app/filterOutDuplicatedContent');
const pushContent = require('./app/pushContent');

const handler = app(filterOutDuplicatedContent, pushContent, console);

exports.handler = handler;
