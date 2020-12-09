# regex-analyser


A regular expression engine implementation in JavaScript. It supports concatenation, union (|) and closure (\*) operations as well as grouping. It follows Ken Thompson's algorithm for constructing an NFA from a regular expression.

It also draw the corresponding NFA. This work is inpire by the work of Deniskyashif. I find that his implementation is really complete. I just add some new future like normalisation and and conversion to DFA. Also add graph drawing and transition table.

Check out his blog [blog post](https://deniskyashif.com/2019/02/17/implementing-a-regular-expression-engine/) for the complete implementation details.

### Example
```javascript
const { createMatcher } = require('./regex');
const match = createMatcher('(a|b)*c');

match('ac'); // true
match('abc'); // true
match('aabababbbc'); // true
match('aaaab'); // false
```

### Try It
```
git clone https://github.com/divinjordan/regex-analyser.git
cd regexjs
npm i
npm start
```

### Run the tests
`npm t`
