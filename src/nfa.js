/*
    Construction de Thompson et recherches
*/

/*
  Un État de la AFN de Thompson peut soit avoir 
   - un symbole unique de transition vers un État
    ou
   - jusqu'à deux transitions epsilon vers d'autres États
  mais pas les deux.   
*/
function createState(isEnd) {
    return {
        isEnd,
        transition: {},
        epsilonTransitions: []
    };
}

function addEpsilonTransition(from, to) {
    from.epsilonTransitions.push(to);
}

/*
  L'État de la AFN de Thompson ne peut avoir qu'une seule transition vers un autre État pour un symbole donné.
*/
function addTransition(from, to, symbol) {
    from.transition[symbol] = to;
}

/*
  Construisez une AFN qui ne reconnaît que la chaîne vide.
*/
function fromEpsilon() {
    const start = createState(false);
    const end = createState(true);
    addEpsilonTransition(start, end);

    return { start, end };
}

/* 
 Construire une AFN qui ne reconnaît qu'une seule chaîne de caractères.
*/
function fromSymbol(symbol) {
    const start = createState(false);
    const end = createState(true);
    addTransition(start, end, symbol);

    return { start, end };
}

/* 
   Concatène deux AFN.
*/
function concat(first, second) {
    addEpsilonTransition(first.end, second.start);
    first.end.isEnd = false;

    return { start: first.start, end: second.end };
}

/* 
   Unions de AFNs
*/
function union(first, second) {
    const start = createState(false);
    addEpsilonTransition(start, first.start);
    addEpsilonTransition(start, second.start);

    const end = createState(true);

    addEpsilonTransition(first.end, end);
    first.end.isEnd = false;
    addEpsilonTransition(second.end, end);
    second.end.isEnd = false;

    return { start, end };
}


/* 
   Appliquer la fermeture (Kleene's Star) sur un AFN.
*/
function closure(nfa) {
    const start = createState(false);
    const end = createState(true);

    addEpsilonTransition(start, end);
    addEpsilonTransition(start, nfa.start);

    addEpsilonTransition(nfa.end, end);
    addEpsilonTransition(nfa.end, nfa.start);
    nfa.end.isEnd = false;

    return { start, end };
}

/*
  Convertit une expression régulière postfix en une NFA Thompson.
*/
function toNFA(postfixExp) {
    if (postfixExp === '') {
        return fromEpsilon();
    }

    const stack = [];

    for (const token of postfixExp) {

        if (token === '*') {

            stack.push(closure(stack.pop()));

        }  else if (token === '|') {

            const right = stack.pop();
            const left = stack.pop();
            stack.push(union(left, right));

        } else if (token === '.') {

            const right = stack.pop();
            const left = stack.pop();
            stack.push(concat(left, right));

        } else {

            stack.push(fromSymbol(token));
            
        }
    }

    return stack.pop();
}

/* 
   Suit les transitions epsilon d'un État jusqu'à ce qu'il atteigne
   un État avec une transition de symbole qui s'ajoute à l'ensemble des États suivants.
*/

function addNextState(state, nextStates, visited) {
    if (state.epsilonTransitions.length) {
        for (const st of state.epsilonTransitions) {
            if (!visited.find(vs => vs === st)) {
                visited.push(st);
                addNextState(st, nextStates, visited);
            }
        }
    } else {
        nextStates.push(state);
    }
}

/*
  Traiter une chaîne par le biais d'une NFA. Pour chaque symbole d'entrée, il passe dans plusieurs états en même temps.
  La chaîne correspond si, après avoir lu le dernier symbole, elle a effectué une transition vers au moins un état final.

  Pour un NFA avec N états en peut être au plus N états à la fois. Cet algorithme trouve une correspondance en traitant le mot d'entrée une fois.
*/
function search(nfa, word) {
    let currentStates = [];
    /* L'ensemble initial des états actuels est soit l'état de départ, soit
       l'ensemble des états accessibles par les transitions epsilon à partir de l'état de départ */
    addNextState(nfa.start, currentStates, []);

    for (const symbol of word) {
        const nextStates = [];

        for (const state of currentStates) {
            const nextState = state.transition[symbol];
            if (nextState) {
                addNextState(nextState, nextStates, []);
            }
        }

        currentStates = nextStates;
    }

    return currentStates.find(s => s.isEnd) ? true : false;
}

function recognize(nfa, word) {
    return search(nfa, word);
}

module.exports = {
    toNFA,
    recognize
};
