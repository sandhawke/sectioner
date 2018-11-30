
Turn HTML like this

```html
<p>para zero</p>
<h1>HEAD-A</h1>
<p>para a1</p>
<p>para a2</p>
<h1>HEAD-B</h1>
<p>para b1</p>
```

into an object tree like this:

```
Section {
  count: 0,
  intro: [ '<p>para zero</p>' ],
  subs:
   [ Section { count: 1, title: 'HEAD-A', 
               intro: [ '<p>para a1</p>', '<p>para a2</p>' ],
               subs: [], ids: [] },
     Section { count: 2, title: 'HEAD-B',
```

or new HTML something like this:

```html
<p>para zero</p>
<section>
    <h1><span id="section_1"></span>1. HEAD-A</h1>
    <p>para a1</p>
    <p>para a2</p>
</section>
<section>
    <h1><span id="section_2"></span>2. HEAD-B</h1>
    <p>para b1</p>
</section>
```

## Command line

That's from the command-line:
```bash
$ sectioner example/doc1.html
```
## API

```js
const sectioner = require('sectioner')
const root = sectioner.parse('...')

// do stuff with root, which is a Section.  For each Section s:
//
//   s.title  -- text of the title
//   s.ids    -- array of html ids you want for this section
//   s.intro  -- array of html bits, eg '<p>...</p>' before subsections
//   s.subs   -- array of subsections, new sectioner.Section()
//   s.head   -- null, or like intro for the HTML <head>

// after manipulating the tree how you like, optionally call

root.assignCoordinates()

// then you can use
//   s.coord  -- array like [1,3] for section 1.3
//   s.coordText   --- 1.3.
//   s.coordText('/', ':') --   1/3:
//   s.hLevel    2 (in this case), h2, because 1.3 is second level

// finally

const html = root.html()
send(html)
```
