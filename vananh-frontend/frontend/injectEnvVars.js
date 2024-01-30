const fs = require('fs');
const path = require('path');

require('dotenv').config();

const colorConfig = {
  REACT_APP_LOW_CONGESTION_PERCENTAGE_COLOR:
    process.env.REACT_APP_LOW_CONGESTION_PERCENTAGE_COLOR || 'blue',
  REACT_APP_MEDIUM_CONGESTION_PERCENTAGE_COLOR:
    process.env.REACT_APP_MEDIUM_CONGESTION_PERCENTAGE_COLOR || 'green',
  REACT_APP_HIGH_CONGESTION_PERCENTAGE_COLOR:
    process.env.REACT_APP_HIGH_CONGESTION_PERCENTAGE_COLOR || 'red'
};

const filePath = path.join(__dirname, 'src', 'pages', 'dia-man-machine', 'chart', 'styles.scss');

let fileContent = fs.readFileSync(filePath, 'utf-8');

// Remove the first five lines
fileContent = fileContent.split('\n').slice(4).join('\n');

const content =
  Object.entries(colorConfig)
    .map(([key, value]) => `$${key}: ${value};`)
    .join('\n') +
  '\n\n' +
  fileContent;

fs.writeFileSync(filePath, content);
