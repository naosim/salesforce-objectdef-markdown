import { execSync } from 'node:child_process';
import fs from 'node:fs';
import config from './config.mjs';

const columns = ['Label', 'QualifiedApiName', 'Length', 'DataType', 'IsNillable', 'IsIndexed', 'EntityDefinition.Label'];

function getObjectDef({objectName, alias}) {
  const result = execSync(`sf data query --query "SELECT ${columns.join(',')} FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = '${objectName}'" --json --target-org "${alias}"`).toString();
  return JSON.parse(result);
}

function getObjectDefFilePath(objectName) {
  return `${config.dir}/object_${config.alias}_${objectName}.json`
}


// 保存先ディレクトリの作成
await fs.promises.mkdir(config.dir, { recursive: true })
await fs.promises.mkdir(config.markdownDir, { recursive: true })

if(config.mode !== 'onlymarkdown') {
  config.objectNames.forEach((objectName) => {
  // データの取得
  const objectDefData = getObjectDef({ objectName, alias:config.alias });

  // データの保存
  const filePath = getObjectDefFilePath(objectName);
  fs.writeFileSync(filePath, JSON.stringify(objectDefData, null, 2));
});
}

// Markdownの作成
const body = config.objectNames.map((objectName) => {
  const displayColumns = columns.slice(0, -1);
  const filePath = getObjectDefFilePath(objectName);
  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8')).result.records;
  const rows = records.map((record) => displayColumns.map((column) => record[column]).join(' | '));
  const objectLabel = records[0].EntityDefinition.Label;
  const markdown = `
## ${objectLabel}(${objectName}) 
${displayColumns.join(' | ')}
${displayColumns.map(v => '----').join('|')}
${rows.join('\n')}
`.trim();
  return markdown;
}).join('\n\n');
const markdown = `
# オブジェクト定義  
出力日時:${new Date().toLocaleString()}  
環境:${config.alias}  

${body}
`.trim();

// ファイルに保存
fs.writeFileSync(`${config.markdownDir}/オブジェクト定義_${config.alias}.md`, markdown, 'utf-8');