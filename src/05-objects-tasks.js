/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // throw new Error('Not implemented');
  return {
    getArea() {
      return this.height * this.width;
    },
    width,
    height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  // throw new Error('Not implemented');
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  // throw new Error('Not implemented');
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  element(value) {
    if (this.element1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.id1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.element1 = value;
    return this;
  }

  id(value) {
    if (this.id1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.class1 || this.pseudoElement1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.id1 = `#${value}`;
    return this;
  }

  class(value) {
    if (this.attr1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (!this.class1) {
      this.class1 = `.${value}`;
    } else {
      this.class1 = `${this.class1}.${value}`;
    }
    return this;
  }

  attr(value) {
    if (this.pseudoClass1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.attr1 = `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElement1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (!this.pseudoClass1) {
      this.pseudoClass1 = `:${value}`;
    } else {
      this.pseudoClass1 = `${this.pseudoClass1}:${value}`;
    }
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElement1) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElement1 = `::${value}`;
    return this;
  }

  stringify() {
    const retStr = Object.values(JSON.parse(JSON.stringify(this))).join('');
    return retStr;
  }
}

const cssSelectorBuilder = {
  element(value) {
    const selector = new Selector();
    selector.element(value);
    return selector;
  },

  id(value) {
    const selector = new Selector();
    selector.id(value);
    return selector;
  },
  class(value) {
    const selector = new Selector();
    selector.class(value);
    this.class1 = selector;
    return this.class1;
  },
  attr(value) {
    if (!this.attr1) {
      const selector = new Selector();
      selector.attr(value);
      this.attr1 = selector;
      return selector;
    }
    return this.attr1.attr();
  },

  pseudoClass(value) {
    const selector = new Selector();
    selector.pseudoClass(value);
    this.pseudoClass1 = selector;
    return this.pseudoClass1;
  },

  pseudoElement(value) {
    if (!this.pseudoElement1) {
      const selector = new Selector();
      selector.pseudoElement(value);
      this.pseudoElement1 = selector;
      return selector;
    }
    return this.pseudoElement1;
  },

  combine(selector1, combinator, selector2) {
    this.combo = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  },
  stringify() {
    return this.combo;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
