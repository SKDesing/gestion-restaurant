module.exports = {
  "src/**/*.{js,jsx,ts,tsx,json,md}": [
    "prettier --write",
    "eslint --fix",
    "git add"
  ],
  "package.json": [
    "prettier --write",
    "git add"
  ]
};
