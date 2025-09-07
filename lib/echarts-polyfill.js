/**
 * ECharts Polyfill for React Native with Hermes
 * 
 * This file provides necessary polyfills for ECharts to work properly
 * in React Native environment with Hermes JavaScript engine.
 */

// TypeScript __extends polyfill for Hermes
if (typeof global.__extends === 'undefined') {
  global.__extends = function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}

// TypeScript __assign polyfill
if (typeof global.__assign === 'undefined') {
  global.__assign = function() {
    global.__assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return global.__assign.apply(this, arguments);
  };
}

// TypeScript __rest polyfill
if (typeof global.__rest === 'undefined') {
  global.__rest = function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
}

// TypeScript __values polyfill
if (typeof global.__values === 'undefined') {
  global.__values = function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function () {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
}

// TypeScript __read polyfill
if (typeof global.__read === 'undefined') {
  global.__read = function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
    }
    return ar;
  };
}

// TypeScript __spread polyfill
if (typeof global.__spread === 'undefined') {
  global.__spread = function () {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(global.__read(arguments[i]));
    return ar;
  };
}

// TypeScript __spreadArrays polyfill
if (typeof global.__spreadArrays === 'undefined') {
  global.__spreadArrays = function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
}

// Additional polyfills for ECharts compatibility
if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 16);
  };
}

if (typeof global.cancelAnimationFrame === 'undefined') {
  global.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

// Console polyfill for debugging
if (typeof console === 'undefined') {
  global.console = {
    log: function() {},
    warn: function() {},
    error: function() {},
    info: function() {},
    debug: function() {}
  };
}

console.log('ECharts polyfills loaded successfully');
