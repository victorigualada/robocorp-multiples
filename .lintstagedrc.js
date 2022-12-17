module.exports = {
  "*.ts": [
    "prettier --write",
    () => 'tsc -p tsconfig.json --noEmit',
    "eslint --fix"
  ],
  "*.{md, json}": [
    "prettier --write"
  ],
  "CHANGELOG.md": [
    "kacl lint"
  ]
};
