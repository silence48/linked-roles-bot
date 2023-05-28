const fs = require('fs');
const path = require('path');

const badgesDir = path.join(__dirname, 'assets', 'badges');
const files = fs.readdirSync(badgesDir);
let importStatements = '';
let exportMappings = '';

files.forEach((file) => {
  const baseName = path.basename(file, path.extname(file));
  const validJsName = baseName.replace(/[^a-zA-Z0-9_$]/g, '_'); // replace invalid characters with underscore
  importStatements += `import ${validJsName} from './${file}';\n`;
  exportMappings += `'${file}': ${validJsName},\n`;
});

console.log(`${importStatements}\nexport const allBadges = {\n${exportMappings}};`);
