const isLetter = char => /^[^\s,]$/.test(char);

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.tokens = [];
  }

  get current() {
    return this.input[this.position];
  }

  valid() {
    return this.current !== undefined;
  }

  advance(amount = 1) {
    this.position += amount;
  }

  retreat(amount = 1) {
    this.position -= amount;
  }

  captureIdentifier() {
    let name = '';
    while (isLetter(this.current)) {
      name += this.current;
      this.advance();
    }
    this.retreat();
    this.tokens.push({ type: 'identifier', name });
  }

  lex() {
    while (this.valid()) {
      if (isLetter(this.current)) {
        this.captureIdentifier();
      } else if (this.current === ',') {
        this.tokens.push({ type: 'comma' });
      }
      this.advance();
    }

    return this.tokens;
  }
}

module.exports = Lexer;
