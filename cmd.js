#!/usr/bin/env node

const sectioner = require('.')
const fs = require('fs')

if (process.argv.length === 3) {
  const text = fs.readFileSync(process.argv[2], 'utf8')
  console.log(sectioner.convert(text))
} else {
  console.error('usage: <input filename>')
}
