const Methods = [
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT',
];

class Parser {
  constructor(tokenLists, values) {
    if (!tokenLists || !values) {
      throw new Error();
    }

    this.tokenLists = tokenLists;
    this.tokenListPosition = 0;
    this.tokenPosition = 0;
    this.values = values;
    this.valuePosition = 0;
  }

  get currentValue() {
    return this.values[this.valuePosition];
  }

  hasMoreValues() {
    return this.valuePosition < this.values.length;
  }

  advanceValues() {
    this.valuePosition += 1;
  }

  consumeValue() {
    const value = this.currentValue;
    this.advanceValues();
    return value;
  }

  get currentTokenList() {
    return this.tokenLists[this.tokenListPosition];
  }

  hasMoreTokenLists() {
    return this.tokenListPosition < this.tokenLists.length;
  }

  advanceTokenList() {
    this.tokenListPosition += 1;
    this.tokenPosition = 0;
  }

  get currentToken() {
    return this.currentTokenList[this.tokenPosition];
  }

  hasMoreTokens() {
    return this.currentTokenList && this.tokenPosition < this.currentTokenList.length;
  }

  advanceToken() {
    this.tokenPosition += 1;
  }

  matchToken(type) {
    if (this.hasMoreTokens() && this.currentToken.type === type) {
      this.advanceToken();
      return true;
    }
    return false;
  }

  whileList(fn) {
    do {
      fn();
    } while (this.matchToken('comma'));
  }

  parseMethods() {
    const methods = [];

    this.whileList(() => {
      if (this.hasMoreTokens()) {
        if (this.currentToken.type !== 'identifier') {
          throw new SyntaxError(`Expected identifier, found ${this.currentToken.type}`);
        }
        const { name } = this.currentToken;
        if (!Methods.includes(name)) {
          throw new SyntaxError(`Invalid method ${name}`);
        }
        methods.push(name.toLowerCase());
        this.advanceToken();
      } else {
        if (!this.hasMoreValues()) {
          throw new SyntaxError('Expected method or interpolated value');
        }
        methods.push(this.consumeValue());
        this.advanceTokenList();
      }
    });

    return methods;
  }

  parsePaths() {
    const paths = [];

    this.whileList(() => {
      if (this.hasMoreTokens()) {
        if (this.currentToken.type !== 'identifier') {
          throw new SyntaxError(`Expected identifier, found ${this.currentToken.type}`);
        }
        const { name } = this.currentToken;
        paths.push(name);
        this.advanceToken();
      } else {
        if (!this.hasMoreValues()) {
          throw new SyntaxError('Expected path or interpreted value');
        }
        paths.push(this.consumeValue());
        this.advanceTokenList();
      }
    });

    return paths;
  }

  parseHandlers() {
    if (!this.hasMoreValues()) {
      throw new SyntaxError('Expected handler');
    }
    const value = this.consumeValue();
    return Array.isArray(value) ? value : [value];
  }

  parse() {
    const routes = [];

    while (this.hasMoreTokenLists() || this.hasMoreTokens()) {
      const methods = this.parseMethods();
      const paths = this.parsePaths();
      const handlers = this.parseHandlers();

      routes.push({ methods, paths, handlers });
      if (!this.hasMoreTokens()) {
        this.advanceTokenList();
      }
    }

    return routes;
  }
}

module.exports = Parser;
