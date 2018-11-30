
Turn HTML like this

```html
<html><body>
<p>para zero</p>
<h1>HEAD-A</h1>
<p>para a1</p>
<p>para a2</p>
<h1>HEAD-B</h1>
<p>para b1</p>
</body></html>```

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

That's from the command-line:
```bash
$ sectioner example/doc1.html
```

