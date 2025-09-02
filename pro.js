// TypeScript __extends polyfill for Hermes
if (typeof global.__extends === 'undefined') {
  global.__extends = function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}

// 最优先加载 Buffer
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// 然后是其他 polyfill
import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';
// // Import required polyfills first
// import 'fast-text-encoding';
// import 'react-native-get-random-values';
// import '@ethersproject/shims';

// // Buffer polyfill - 确保完整的 Buffer 功能
// import { Buffer } from 'buffer';
global.Buffer = Buffer;

// 确保 Buffer 原型方法可用
if (!Buffer.prototype.readUIntLE) {
  Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
      checkInt(this, offset, byteLength);
    }

    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val;
  };
}

// 辅助函数
function checkInt(buf, offset, byteLength) {
  if (offset + byteLength > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

// Polyfill for structuredClone
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Then import the expo router
import 'expo-router/entry';