const debug = require('debug')('gdoc2respec-section')
const cheerio = require('cheerio')
const H = require('escape-html-template-tag')

function convert (str) {
  const root = parse(str)
  return root.htmlTo()
}

function createSection (...args) {
  debug('createSection called', args)
  const s = new Section(...args)
  debug('created section', s)
  return s
}

// just helps with debugging
let counter = 0
class Section {
  constructor (state) {
    this.count = counter++
    Object.assign(this, state || {})
    if (!this.intro) this.intro = [] // child elements, if any, not subsections
    if (!this.subs) this.subs = [] // then come the subsections
    if (!this.ids) this.ids = []
    // this.title
  }

  // Assign .coord to this node and its subs
  assignCoordinates (coord = []) {
    this.coord = coord
    for (const [i, sub] of this.subs.entries()) {
      sub.assignCoordinates(this.coord.concat([i + 1]))
    }
  }

  coordText (sep = '.', final = '.') {
    return this.coord.join(sep) + final
  }

  get hLevel () {
    return this.coord.length
  }

  htmlTo (log, level = 0) {
    if (!this.coord) this.assignCoordinates()
    const out = []
    if (!log) log = defaultLog

    function defaultLog (data, level) {
      debug('logged', level, data)
      const i = indent(level)
      if (Array.isArray(data)) {
        // some modifications might want to be returning arrays
        data[0] = i + data[0]
      } else {
        data = i + data
      }
      out.push(data)
    }

    function indent (level) {
      return (''.padStart(level * 4, ' '))
    }

    if (this.hLevel > 0) {
      log('<section>', level)
      level++
      const defaultId = 'section_' + this.coordText('_', '')
      const ids = this.ids.concat([defaultId]).map(id => H`<span id="${id}"></span>`)

      log(H`<h${this.hLevel}>${ids}${this.coordText()} ${this.title || ''}</h${this.hLevel}>`, level)
    }

    for (const child of this.intro) {
      log(child, level)
    }

    for (const sub of this.subs) {
      sub.htmlTo(log, level)
    }

    if (this.hLevel > 0) {
      level--
      log('</section>', level)
    }
    return out.join('\n')
  }
}

/*
  Given a cheerio document, divide it into a hierarchy based on H1,
  H2, etc.

  Return the root of a tree of Section objects, with hLevel=0, coord [].

  set config.createSection if you want to be making instances of a
  subclass of Section
*/

function parse ($, config = {}) {
  if (typeof $ === 'string') $ = cheerio.load($)
  let creator = config.createSection || createSection
  let cur = creator()
  debug('init cur = ', cur)
  let curLevel = 0

  $('body').children().each(function (index) {
    const t = $(this).prop('tagName')
    if (t[0] === 'H' && t.length === 2) {
      const level = parseInt(t[1])
      const title = $(this).text()

      while (level <= curLevel) {
        curLevel--
        sectionIntroEnds()
        sectionEnds()
      }
      while (level > curLevel) {
        sectionIntroEnds()
        sectionStarts(title)
        curLevel++
      }
    } else {
      cur.intro.push($(this).clone().wrap('<p>').parent().html())
    }
  })

  while (curLevel >= 1) {
    curLevel--
    sectionIntroEnds()
    sectionEnds()
  }

  return cur

  function sectionStarts (title) {
    const me = creator({ title })
    me.parent = cur
    cur.subs.push(me)
    cur = me
    debug('start section cur = ', cur)
  }

  function sectionEnds () {
    const parent = cur.parent
    delete cur.parent // easier to debug non-cyclical structures
    cur = parent
    debug('ended section cur = ', cur)
  }

  function sectionIntroEnds () {
    //
  }
}

// MAYBE we shouldn't parse the table exactly, but should
// return an object which can parse/present the table in
// various ways?
//
// part.isTable, part.cell(0,2).text, part.rows, part.columns
//
/*
function parseTable (html) {
  const rows = []
  const $ = cheerio.load(html) // hack because I'm a little lost
  $('tr').each(function (i, row) {
    if (i >= 0) { // maybe skip header?   nope, do header like this.
      const row = {}
      $(this).find('td').each(function (j, td) {
        // console.log('      TD %d %d  %j', i, j, $(this).text())
        const val = $(this) // .html().trim()   // or text?   or node?
        row[j] = val // rows[3][1]
        // row[rows[0][j]] = val // rows[3].secondColumnHeading
      })
      rows.push(row)
    }
  })
  return rows
}
*/

module.exports = { convert, parse, Section, createSection }
