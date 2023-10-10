module.exports = {
  extends: [
    '@dcwjoy',
  ],
  rules: {
    'unused-imports/no-unused-imports': 'off',
    'import/named': 'off',
  },
  ignorePatterns: [
    '%ProgramData%/*',
    '*.otf',
  ],
}
