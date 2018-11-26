const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const finder = require('findit')
const collectMessages = require('./collect');

function extractOnCollect(aggregatedMessages, targetPath) {
  const sortedMessages = _.sortBy(aggregatedMessages, 'id');
  const file = sortedMessages.reduce((agg, { defaultMessage, id }) => {
    return Object.assign({}, agg, {
      [id]: defaultMessage,
    });
  }, {});

  fs.writeFileSync(
    targetPath,
    JSON.stringify(file, null, 2) + '\n',
    'utf8'
  );
  console.log(chalk`{green Successfully extracted messages to intl file!}`);
}

function extract(sourcePath, targetPath, babelConfigPath) {
  console.log(chalk`{white Extracting messages to intl file...}`);
  collectMessages(
    finder(sourcePath),
    (aggregatedMessages) => extractOnCollect(aggregatedMessages, targetPath),
    babelConfigPath
  );
};

module.exports = {
  extract,
  extractOnCollect,
};
