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
      while (isLetter(current())) {
        name += current();
        advance();
      }
      retreat();
      tokens.push({ type: 'identifier', name });
    } else if (current() === ',') {
      tokens.push({ type: 'comma' });
    }
  }

  return tokens;
};
