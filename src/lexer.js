const isLetter = char => /^[^\s,]$/.test(char);

module.exports = function lex(input) {
  const tokens = [];

  let position = 0;
  const current = () => input[position];
  const valid = () => current() !== undefined;
  const advance = (amount = 1) => { position += amount; };
  const retreat = (amount = 1) => { position -= amount; };
  const captureIdentifier = () => {
    let name = '';
    while (isLetter(current())) {
      name += current();
      advance();
    }
    retreat();
    return { type: 'identifier', name };
  };

  while (valid()) {
    if (isLetter(current())) {
      tokens.push(captureIdentifier());
    } else if (current() === ',') {
      tokens.push({ type: 'comma' });
    }
    advance();
  }

  return tokens;
};
