const section = require('.')
const test = require('tape')

test(t => {
  const h = ''
  t.equal(section.convert(h), h)
  t.end()
})

test(t => {
  const h = '<div>Hello</div>'
  t.equal(section.convert(h), h)
  t.end()
})

test(t => {
  const h = '<h1>Hello</h1>'
  t.equal(section.convert(h), `<section>
    <h1><span id="section_1"></span>1. Hello</h1>
</section>`)
  t.end()
})

test(t => {
  const h = `
<html><body>
<p>para zero</p>
<h1>HEAD-A</h1>
<p>para a1</p>
<p>para a2</p>
<h1>HEAD-B</h1>
<p>para b1</p>
<p>para b2</p>
<h2>HEAD-BA</h2>
<p>para ba1</p>
<p>para ba2</p>
<h2>HEAD-BB</h2>
<p>para bb1</p>
<p>para bb2</p>
<h1>HEAD-C</h1>
<p>para c1</p>
<p>para c2</p>


`
  const root = section.parse(h)
  // console.log('\n\n\nOUT\n\n', root.subs[0])
  // console.log('\n\n\nOUT\n\n', JSON.stringify(root, null, 4))
  // console.log('\n\n\nHTML\n\n', root.htmlTo())
  const html = root.htmlTo()
  t.equal(html, `<p>para zero</p>
<section>
    <h1><span id="section_1"></span>1. HEAD-A</h1>
    <p>para a1</p>
    <p>para a2</p>
</section>
<section>
    <h1><span id="section_2"></span>2. HEAD-B</h1>
    <p>para b1</p>
    <p>para b2</p>
    <section>
        <h2><span id="section_2_1"></span>2.1. HEAD-BA</h2>
        <p>para ba1</p>
        <p>para ba2</p>
    </section>
    <section>
        <h2><span id="section_2_2"></span>2.2. HEAD-BB</h2>
        <p>para bb1</p>
        <p>para bb2</p>
    </section>
</section>
<section>
    <h1><span id="section_3"></span>3. HEAD-C</h1>
    <p>para c1</p>
    <p>para c2</p>
</section>`)
  t.end()
})
