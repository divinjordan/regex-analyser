const { insertExplicitConcatOperator, toPostfix } = require('./parser');
const { toNFA, recognize } = require('./nfa');

function createMatcher(expression) {

    const exp = toPostfix(insertExplicitConcatOperator(expression));

    const nfa = toNFA(exp);

    return word => recognize(nfa, word);
}

module.exports = { createMatcher };
