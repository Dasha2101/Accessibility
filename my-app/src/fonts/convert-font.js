import fs from 'fs';
import path from 'path';

const fontPath = path.join(
  process.cwd(),
  'my-app',
  'src',
  'fonts',
  'Roboto-Regular.ttf'
);

const fontBase64 = fs.readFileSync(fontPath).toString('base64');
const tsContent = `const robotoBase64 = "${fontBase64}";\nexport default robotoBase64;`;

fs.writeFileSync(
  path.join(process.cwd(), 'my-app', 'src', 'fonts', 'RobotoBase64.ts'),
  tsContent
);

console.log('Готово! Файл RobotoBase64.ts создан.');