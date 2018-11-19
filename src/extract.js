/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const intlCollectMessages = require('./collect');

const sourcePath = path.join(__dirname, '..', '..', 'src');
const targetPath = path.join(__dirname, '..', '..', 'locales');

console.log(chalk`{white Extracting messages to intl file...}`);

intlCollectMessages(sourcePath, function onFinderEnd(aggregatedMessages) {
  const sortedMessages = _.sortBy(aggregatedMessages, 'id');
  const file = sortedMessages.reduce((agg, { defaultMessage, id }) => {
    return Object.assign({}, agg, {
      [id]: defaultMessage,
    });
  }, {});

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  fs.writeFileSync(
    path.join(targetPath, 'en-GB.json'),
    JSON.stringify(file, null, 2) + '\n',
    'utf-8'
  );
  console.log(chalk`{green Successfully extracted messages to intl file!}`);
});
