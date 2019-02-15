const isLetter = char => /^[^\s,]$/.test(char);

module.exports = function lex(input) {
  const tokens = [];

  let position = 0;
  const current = () => input[position];
  const valid = () => current() !== undefined;
  const advance = (amount = 1) => { position += amount; };
  const retreat = (amount = 1) => { position -= amount; };

  for (; valid(); position += 1) {
    if (isLetter(current())) {
      let name = '';
      while (isLetter(current()) && valid()) {
        name += current();
        advance();
      }
      retreat();
      tokens.push({ type: 'identifier', name });
      continue; // eslint-disable-line no-continue
    }

    switch (current()) {
      case ',':
        tokens.push({ type: 'comma' });
        break;
      default:
        break;
    }
  }

  return tokens;
};
