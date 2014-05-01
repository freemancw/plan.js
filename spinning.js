
var Module;
if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    }
    var PACKAGE_NAME = 'spinning.data';
    var REMOTE_PACKAGE_NAME = (Module['filePackagePrefixURL'] || '') + 'spinning.data';
    var REMOTE_PACKAGE_SIZE = 321540;
    var PACKAGE_UUID = 'e29cf1ed-5c1e-4083-a026-c9640f4f48f0';
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

function assert(check, msg) {
  if (!check) throw msg + new Error().stack;
}

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;
        Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
          Module['removeRunDependency']('fp ' + that.name);
        }, function() {
          if (that.audio) {
            Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
          } else {
            Module.printErr('Preloading file ' + that.name + ' failed');
          }
        }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        this.requests[this.name] = null;
      },
    };
      new DataRequest(0, 205135, 0, 0).open('GET', '/bunny.tris');
    new DataRequest(205135, 321540, 0, 0).open('GET', '/torus.tris');

    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
      // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though.
      var ptr = Module['_malloc'](byteArray.length);
      Module['HEAPU8'].set(byteArray, ptr);
      DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
          DataRequest.prototype.requests["/bunny.tris"].onload();
          DataRequest.prototype.requests["/torus.tris"].onload();
          Module['removeRunDependency']('datafile_spinning.data');

    };
    Module['addRunDependency']('datafile_spinning.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

})();

// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = (typeof Module !== 'undefined' ? Module : null) || {};

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    window['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    var source = Pointer_stringify(code);
    if (source[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (source.indexOf('"', 1) === source.length-1) {
        source = source.substr(1, source.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + source + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    try {
      var evalled = eval('(function(' + args.join(',') + '){ ' + source + ' })'); // new Function does not allow upvars in node
    } catch(e) {
      Module.printErr('error in executing inline EM_ASM code: ' + e + ' on: \n\n' + source + '\n\nwith args |' + args + '| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)');
      throw e;
    }
    return Runtime.asmConstCache[code] = evalled;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      /* TODO: use TextEncoder when present,
        var encoder = new TextEncoder();
        encoder['encoding'] = "utf-8";
        var utf8Array = encoder['encode'](aMsg.data);
      */
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  var i = 3;
  // params, etc.
  var basicTypes = {
    'v': 'void',
    'b': 'bool',
    'c': 'char',
    's': 'short',
    'i': 'int',
    'l': 'long',
    'f': 'float',
    'd': 'double',
    'w': 'wchar_t',
    'a': 'signed char',
    'h': 'unsigned char',
    't': 'unsigned short',
    'j': 'unsigned int',
    'm': 'unsigned long',
    'x': 'long long',
    'y': 'unsigned long long',
    'z': '...'
  };
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
  function parseNested() {
    i++;
    if (func[i] === 'K') i++; // ignore const
    var parts = [];
    while (func[i] !== 'E') {
      if (func[i] === 'S') { // substitution
        i++;
        var next = func.indexOf('_', i);
        var num = func.substring(i, next) || 0;
        parts.push(subs[num] || '?');
        i = next+1;
        continue;
      }
      if (func[i] === 'C') { // constructor
        parts.push(parts[parts.length-1]);
        i += 2;
        continue;
      }
      var size = parseInt(func.substr(i));
      var pre = size.toString().length;
      if (!size || !pre) { i--; break; } // counter i++ below us
      var curr = func.substr(i + pre, size);
      parts.push(curr);
      subs.push(curr);
      i += pre + size;
    }
    i++; // skip E
    return parts;
  }
  function parse(rawList, limit, allowVoid) { // main parser
    limit = limit || Infinity;
    var ret = '', list = [];
    function flushList() {
      return '(' + list.join(', ') + ')';
    }
    var name;
    if (func[i] === 'N') {
      // namespaced N-E
      name = parseNested().join('::');
      limit--;
      if (limit === 0) return rawList ? [name] : name;
    } else {
      // not namespaced
      if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
      var size = parseInt(func.substr(i));
      if (size) {
        var pre = size.toString().length;
        name = func.substr(i + pre, size);
        i += pre + size;
      }
    }
    first = false;
    if (func[i] === 'I') {
      i++;
      var iList = parse(true);
      var iRet = parse(true, 1, true);
      ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
    } else {
      ret = name;
    }
    paramLoop: while (i < func.length && limit-- > 0) {
      //dump('paramLoop');
      var c = func[i++];
      if (c in basicTypes) {
        list.push(basicTypes[c]);
      } else {
        switch (c) {
          case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
          case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
          case 'L': { // literal
            i++; // skip basic type
            var end = func.indexOf('E', i);
            var size = end - i;
            list.push(func.substr(i, size));
            i += size + 2; // size + 'EE'
            break;
          }
          case 'A': { // array
            var size = parseInt(func.substr(i));
            i += size.toString().length;
            if (func[i] !== '_') throw '?';
            i++; // skip _
            list.push(parse(true, 1, true)[0] + ' [' + size + ']');
            break;
          }
          case 'E': break paramLoop;
          default: ret += '?' + c; break paramLoop;
        }
      }
    }
    if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
    if (rawList) {
      if (ret) {
        list.push(ret + '?');
      }
      return list;
    } else {
      return ret + flushList();
    }
  }
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===





STATIC_BASE = 8;

STATICTOP = STATIC_BASE + Runtime.alignMemory(2059);
/* global initializers */ __ATINIT__.push({ func: function() { __GLOBAL__I_a() } });


/* memory initializer */ allocate([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,80,81,80,32,68,101,109,111,32,45,32,83,112,105,110,110,105,110,103,0,0,0,0,0,98,117,110,110,121,46,116,114,105,115,0,0,0,0,0,0,114,0,0,0,0,0,0,0,67,111,117,108,100,110,39,116,32,111,112,101,110,32,98,117,110,110,121,46,116,114,105,115,10,0,0,0,0,0,0,0,37,100,0,0,0,0,0,0,37,108,102,32,37,108,102,32,37,108,102,32,37,108,102,32,37,108,102,32,37,108,102,32,37,108,102,32,37,108,102,32,37,108,102,0,0,0,0,0,116,111,114,117,115,46,116,114,105,115,0,0,0,0,0,0,67,111,117,108,100,110,39,116,32,111,112,101,110,32,116,111,114,117,115,46,116,114,105,115,10,0,0,0,0,0,0,0,80,81,80,32,68,101,109,111,32,45,32,83,112,105,110,110,105,110,103,58,10,80,114,101,115,115,32,39,113,39,32,116,111,32,113,117,105,116,46,10,80,114,101,115,115,32,97,110,121,32,111,116,104,101,114,32,107,101,121,32,116,111,32,116,111,103,103,108,101,32,97,110,105,109,97,116,105,111,110,46,10,76,101,102,116,45,100,114,97,103,32,108,101,102,116,32,38,32,114,105,103,104,116,32,116,111,32,99,104,97,110,103,101,32,97,110,103,108,101,32,111,102,32,118,105,101,119,46,10,76,101,102,116,45,100,114,97,103,32,117,112,32,38,32,100,111,119,110,32,116,111,32,99,104,97,110,103,101,32,101,108,101,118,97,116,105,111,110,32,111,102,32,118,105,101,119,46,10,82,105,103,104,116,45,100,114,97,103,32,117,112,32,38,32,100,111,119,110,32,116,111,32,99,104,97,110,103,101,32,100,105,115,116,97,110,99,101,32,111,102,32,118,105,101,119,46,0,0,0,0,0,0,114,0,0,0,0,0,0,0,77,111,100,101,108,32,67,111,110,115,116,114,117,99,116,111,114,58,32,67,111,117,108,100,110,39,116,32,111,112,101,110,32,37,115,10,0,0,0,0,37,100,0,0,0,0,0,0,37,102,32,37,102,32,37,102,32,37,102,32,37,102,32,37,102,32,37,102,32,37,102,32,37,102,0,0,0,0,0,0,80,81,80,32,69,114,114,111,114,33,32,32,79,117,116,32,111,102,32,109,101,109,111,114,121,32,102,111,114,32,116,114,105,32,97,114,114,97,121,32,111,110,32,66,101,103,105,110,77,111,100,101,108,40,41,32,99,97,108,108,33,10,0,0,80,81,80,32,87,97,114,110,105,110,103,33,32,67,97,108,108,101,100,32,66,101,103,105,110,77,111,100,101,108,40,41,32,111,110,32,97,32,80,81,80,95,77,111,100,101,108,32,116,104,97,116,32,10,119,97,115,32,110,111,116,32,101,109,112,116,121,46,32,84,104,105,115,32,109,111,100,101,108,32,119,97,115,32,99,108,101,97,114,101,100,32,97,110,100,32,112,114,101,118,105,111,117,115,10,116,114,105,97,110,103,108,101,32,97,100,100,105,116,105,111,110,115,32,119,101,114,101,32,108,111,115,116,46,10,0,80,81,80,32,87,97,114,110,105,110,103,33,32,67,97,108,108,101,100,32,65,100,100,84,114,105,40,41,32,111,110,32,80,81,80,95,77,111,100,101,108,32,10,111,98,106,101,99,116,32,116,104,97,116,32,119,97,115,32,97,108,114,101,97,100,121,32,101,110,100,101,100,46,32,65,100,100,84,114,105,40,41,32,119,97,115,10,105,103,110,111,114,101,100,46,32,32,77,117,115,116,32,100,111,32,97,32,66,101,103,105,110,77,111,100,101,108,40,41,32,116,111,32,99,108,101,97,114,32,116,104,101,10,109,111,100,101,108,32,102,111,114,32,97,100,100,105,116,105,111,110,32,111,102,32,110,101,119,32,116,114,105,97,110,103,108,101,115,10,0,0,0,0,0,0,0,80,81,80,32,69,114,114,111,114,33,32,32,79,117,116,32,111,102,32,109,101,109,111,114,121,32,102,111,114,32,116,114,105,32,97,114,114,97,121,32,111,110,32,65,100,100,84,114,105,40,41,32,99,97,108,108,33,10,0,0,0,0,0,0,80,81,80,32,87,97,114,110,105,110,103,33,32,67,97,108,108,101,100,32,69,110,100,77,111,100,101,108,40,41,32,111,110,32,80,81,80,95,77,111,100,101,108,32,10,111,98,106,101,99,116,32,116,104,97,116,32,119,97,115,32,97,108,114,101,97,100,121,32,101,110,100,101,100,46,32,69,110,100,77,111,100,101,108,40,41,32,119,97,115,10,105,103,110,111,114,101,100,46,32,32,77,117,115,116,32,100,111,32,97,32,66,101,103,105,110,77,111,100,101,108,40,41,32,116,111,32,99,108,101,97,114,32,116,104,101,10,109,111,100,101,108,32,102,111,114,32,97,100,100,105,116,105,111,110,32,111,102,32,110,101,119,32,116,114,105,97,110,103,108,101,115,10,0,0,0,80,81,80,32,69,114,114,111,114,33,32,69,110,100,77,111,100,101,108,40,41,32,99,97,108,108,101,100,32,111,110,32,109,111,100,101,108,32,119,105,116,104,32,110,111,32,116,114,105,97,110,103,108,101,115,10,0,0,0,0,0,0,0,0,80,81,80,32,69,114,114,111,114,33,32,32,79,117,116,32,111,102,32,109,101,109,111,114,121,32,102,111,114,32,116,114,105,32,97,114,114,97,121,32,105,110,32,69,110,100,77,111,100,101,108,40,41,32,99,97,108,108,33,10,0,0,0,0,101,105,103,101,110,58,32,116,111,111,32,109,97,110,121,32,105,116,101,114,97,116,105,111,110,115,32,105,110,32,74,97,99,111,98,105,32,116,114,97,110,115,102,111,114,109,46,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,1,0,0,0,2,0,0,0,1,0,0,0,0,0,0,0,115,116,100,58,58,98,97,100,95,97,108,108,111,99,0,0,83,116,57,98,97,100,95,97,108,108,111,99,0,0,0,0,8,0,0,0,240,7,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);




var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  
  function _atexit(func, arg) {
      __ATEXIT__.unshift({ func: func, arg: arg });
    }var ___cxa_atexit=_atexit;

  
  var GL={counter:1,lastError:0,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],currArrayBuffer:0,currElementArrayBuffer:0,byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},packAlignment:4,unpackAlignment:4,init:function () {
        GL.createLog2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        Browser.moduleContextCreatedCallbacks.push(GL.initExtensions);
      },recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },getNewId:function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },MINI_TEMP_BUFFER_SIZE:16,miniTempBuffer:null,miniTempBufferViews:[0],MAX_TEMP_BUFFER_SIZE:2097152,tempVertexBuffers1:[],tempVertexBufferCounters1:[],tempVertexBuffers2:[],tempVertexBufferCounters2:[],numTempVertexBuffersPerSize:64,tempIndexBuffers:[],tempQuadIndexBuffer:null,log2ceilLookup:null,createLog2ceilLookup:function (maxValue) {
        GL.log2ceilLookup = new Uint8Array(maxValue+1);
        var log2 = 0;
        var pow2 = 1;
        GL.log2ceilLookup[0] = 0;
        for(var i = 1; i <= maxValue; ++i) {
          if (i > pow2) {
            pow2 <<= 1;
            ++log2;
          }
          GL.log2ceilLookup[i] = log2;
        }
      },generateTempBuffers:function (quads) {
        var largestIndex = GL.log2ceilLookup[GL.MAX_TEMP_BUFFER_SIZE];
        GL.tempVertexBufferCounters1.length = GL.tempVertexBufferCounters2.length = largestIndex+1;
        GL.tempVertexBuffers1.length = GL.tempVertexBuffers2.length = largestIndex+1;
        GL.tempIndexBuffers.length = largestIndex+1;
        for(var i = 0; i <= largestIndex; ++i) {
          GL.tempIndexBuffers[i] = null; // Created on-demand
          GL.tempVertexBufferCounters1[i] = GL.tempVertexBufferCounters2[i] = 0;
          var ringbufferLength = GL.numTempVertexBuffersPerSize;
          GL.tempVertexBuffers1[i] = [];
          GL.tempVertexBuffers2[i] = [];
          var ringbuffer1 = GL.tempVertexBuffers1[i];
          var ringbuffer2 = GL.tempVertexBuffers2[i];
          ringbuffer1.length = ringbuffer2.length = ringbufferLength;
          for(var j = 0; j < ringbufferLength; ++j) {
            ringbuffer1[j] = ringbuffer2[j] = null; // Created on-demand
          }
        }
  
        if (quads) {
          // GL_QUAD indexes can be precalculated
          GL.tempQuadIndexBuffer = GLctx.createBuffer();
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.tempQuadIndexBuffer);
          var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
          var quadIndexes = new Uint16Array(numIndexes);
          var i = 0, v = 0;
          while (1) {
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+1;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+3;
            if (i >= numIndexes) break;
            v += 4;
          }
          GLctx.bufferData(GLctx.ELEMENT_ARRAY_BUFFER, quadIndexes, GLctx.STATIC_DRAW);
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, null);
        }
      },getTempVertexBuffer:function getTempVertexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup[sizeBytes];
        var ringbuffer = GL.tempVertexBuffers1[idx];
        var nextFreeBufferIndex = GL.tempVertexBufferCounters1[idx];
        GL.tempVertexBufferCounters1[idx] = (GL.tempVertexBufferCounters1[idx]+1) & (GL.numTempVertexBuffersPerSize-1);
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
          return vbo;
        }
        var prevVBO = GLctx.getParameter(GLctx.ARRAY_BUFFER_BINDING);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(GLctx.ARRAY_BUFFER, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(GLctx.ARRAY_BUFFER, 1 << idx, GLctx.DYNAMIC_DRAW);
        GLctx.bindBuffer(GLctx.ARRAY_BUFFER, prevVBO);
        return ringbuffer[nextFreeBufferIndex];
      },getTempIndexBuffer:function getTempIndexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup[sizeBytes];
        var ibo = GL.tempIndexBuffers[idx];
        if (ibo) {
          return ibo;
        }
        var prevIBO = GLctx.getParameter(GLctx.ELEMENT_ARRAY_BUFFER_BINDING);
        GL.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.tempIndexBuffers[idx]);
        GLctx.bufferData(GLctx.ELEMENT_ARRAY_BUFFER, 1 << idx, GLctx.DYNAMIC_DRAW);
        GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, prevIBO);
        return GL.tempIndexBuffers[idx];
      },newRenderingFrameStarted:function newRenderingFrameStarted() {
        var vb = GL.tempVertexBuffers1;
        GL.tempVertexBuffers1 = GL.tempVertexBuffers2;
        GL.tempVertexBuffers2 = vb;
        vb = GL.tempVertexBufferCounters1;
        GL.tempVertexBufferCounters1 = GL.tempVertexBufferCounters2;
        GL.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup[GL.MAX_TEMP_BUFFER_SIZE];
        for(var i = 0; i <= largestIndex; ++i) {
          GL.tempVertexBufferCounters1[i] = 0;
        }
      },findToken:function (source, token) {
        function isIdentChar(ch) {
          if (ch >= 48 && ch <= 57) // 0-9
            return true;
          if (ch >= 65 && ch <= 90) // A-Z
            return true;
          if (ch >= 97 && ch <= 122) // a-z
            return true;
          return false;
        }
        var i = -1;
        do {
          i = source.indexOf(token, i + 1);
          if (i < 0) {
            break;
          }
          if (i > 0 && isIdentChar(source[i - 1])) {
            continue;
          }
          i += token.length;
          if (i < source.length - 1 && isIdentChar(source[i + 1])) {
            continue;
          }
          return true;
        } while (true);
        return false;
      },getSource:function (shader, count, string, length) {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var frag;
          if (length) {
            var len = HEAP32[(((length)+(i*4))>>2)];
            if (len < 0) {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
            } else {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)], len);
            }
          } else {
            frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
          }
          source += frag;
        }
        // Let's see if we need to enable the standard derivatives extension
        type = GLctx.getShaderParameter(GL.shaders[shader], 0x8B4F /* GL_SHADER_TYPE */);
        if (type == 0x8B30 /* GL_FRAGMENT_SHADER */) {
          if (GL.findToken(source, "dFdx") ||
              GL.findToken(source, "dFdy") ||
              GL.findToken(source, "fwidth")) {
            source = "#extension GL_OES_standard_derivatives : enable\n" + source;
            var extension = GLctx.getExtension("OES_standard_derivatives");
          }
        }
        return source;
      },computeImageSize:function (width, height, sizePerPixel, alignment) {
        function roundedToNextMultipleOf(x, y) {
          return Math.floor((x + y - 1) / y) * y
        }
        var plainRowSize = width * sizePerPixel;
        var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
        return (height <= 0) ? 0 :
                 ((height - 1) * alignedRowSize + plainRowSize);
      },get:function (name_, p, type) {
        // Guard against user passing a null pointer.
        // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
        // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
        // better to report an error instead of doing anything random.
        if (!p) {
          GL.recordError(0x0501 /* GL_INVALID_VALUE */);
          return;
        }
        var ret = undefined;
        switch(name_) { // Handle a few trivial GLES values
          case 0x8DFA: // GL_SHADER_COMPILER
            ret = 1;
            break;
          case 0x8DF8: // GL_SHADER_BINARY_FORMATS
            if (type !== 'Integer') {
              GL.recordError(0x0500); // GL_INVALID_ENUM
            }
            return; // Do not write anything to the out pointer, since no binary formats are supported.
          case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
            ret = 0;
            break;
          case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
            // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
            // so implement it ourselves to allow C++ GLES2 code get the length.
            var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
            ret = formats.length;
            break;
          case 0x8B9A: // GL_IMPLEMENTATION_COLOR_READ_TYPE
            ret = 0x1401; // GL_UNSIGNED_BYTE
            break;
          case 0x8B9B: // GL_IMPLEMENTATION_COLOR_READ_FORMAT
            ret = 0x1908; // GL_RGBA
            break;
        }
  
        if (ret === undefined) {
          var result = GLctx.getParameter(name_);
          switch (typeof(result)) {
            case "number":
              ret = result;
              break;
            case "boolean":
              ret = result ? 1 : 0;
              break;
            case "string":
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
            case "object":
              if (result === null) {
                // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
                // can mean an invalid name_, which we need to report as an error
                switch(name_) {
                  case 0x8894: // ARRAY_BUFFER_BINDING
                  case 0x8B8D: // CURRENT_PROGRAM
                  case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                  case 0x8CA6: // FRAMEBUFFER_BINDING
                  case 0x8CA7: // RENDERBUFFER_BINDING
                  case 0x8069: // TEXTURE_BINDING_2D
                  case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                    ret = 0;
                    break;
                  }
                  default: {
                    GL.recordError(0x0500); // GL_INVALID_ENUM
                    return;
                  }
                }
              } else if (result instanceof Float32Array ||
                         result instanceof Uint32Array ||
                         result instanceof Int32Array ||
                         result instanceof Array) {
                for (var i = 0; i < result.length; ++i) {
                  switch (type) {
                    case 'Integer': HEAP32[(((p)+(i*4))>>2)]=result[i];   break;
                    case 'Float':   HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                    case 'Boolean': HEAP8[(((p)+(i))|0)]=result[i] ? 1 : 0;    break;
                    default: throw 'internal glGet error, bad type: ' + type;
                  }
                }
                return;
              } else if (result instanceof WebGLBuffer ||
                         result instanceof WebGLProgram ||
                         result instanceof WebGLFramebuffer ||
                         result instanceof WebGLRenderbuffer ||
                         result instanceof WebGLTexture) {
                ret = result.name | 0;
              } else {
                GL.recordError(0x0500); // GL_INVALID_ENUM
                return;
              }
              break;
            default:
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
          }
        }
  
        switch (type) {
          case 'Integer': HEAP32[((p)>>2)]=ret;    break;
          case 'Float':   HEAPF32[((p)>>2)]=ret;  break;
          case 'Boolean': HEAP8[(p)]=ret ? 1 : 0; break;
          default: throw 'internal glGet error, bad type: ' + type;
        }
      },getTexPixelData:function (type, format, width, height, pixels, internalFormat) {
        var sizePerPixel;
        switch (type) {
          case 0x1401 /* GL_UNSIGNED_BYTE */:
            switch (format) {
              case 0x1906 /* GL_ALPHA */:
              case 0x1909 /* GL_LUMINANCE */:
                sizePerPixel = 1;
                break;
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4;
                break;
              case 0x190A /* GL_LUMINANCE_ALPHA */:
                sizePerPixel = 2;
                break;
              default:
                throw 'Invalid format (' + format + ')';
            }
            break;
          case 0x1403 /* GL_UNSIGNED_SHORT */:
            if (format == 0x1902 /* GL_DEPTH_COMPONENT */) {
              sizePerPixel = 2;
            } else {
              throw 'Invalid format (' + format + ')';
            }
            break;
          case 0x1405 /* GL_UNSIGNED_INT */:
            if (format == 0x1902 /* GL_DEPTH_COMPONENT */) {
              sizePerPixel = 4;
            } else {
              throw 'Invalid format (' + format + ')';
            }
            break;
          case 0x84FA /* UNSIGNED_INT_24_8_WEBGL */:
            sizePerPixel = 4;
            break;
          case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
          case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
          case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
            sizePerPixel = 2;
            break;
          case 0x1406 /* GL_FLOAT */:
            switch (format) {
              case 0x1907 /* GL_RGB */:
                sizePerPixel = 3*4;
                break;
              case 0x1908 /* GL_RGBA */:
                sizePerPixel = 4*4;
                break;
              default:
                throw 'Invalid format (' + format + ')';
            }
            internalFormat = GLctx.RGBA;
            break;
          default:
            throw 'Invalid type (' + type + ')';
        }
        var bytes = GL.computeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
        if (type == 0x1401 /* GL_UNSIGNED_BYTE */) {
          pixels = HEAPU8.subarray((pixels),(pixels+bytes));
        } else if (type == 0x1406 /* GL_FLOAT */) {
          pixels = HEAPF32.subarray((pixels)>>2,(pixels+bytes)>>2);
        } else if (type == 0x1405 /* GL_UNSIGNED_INT */ || type == 0x84FA /* UNSIGNED_INT_24_8_WEBGL */) {
          pixels = HEAPU32.subarray((pixels)>>2,(pixels+bytes)>>2);
        } else {
          pixels = HEAPU16.subarray((pixels)>>1,(pixels+bytes)>>1);
        }
        return {
          pixels: pixels,
          internalFormat: internalFormat
        }
      },initExtensions:function () {
        if (GL.initExtensions.done) return;
        GL.initExtensions.done = true;
  
        if (!Module.useWebGL) return; // an app might link both gl and 2d backends
  
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
          GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i+1);
        }
  
        GL.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
  
        // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist. 
        GL.compressionExt = GLctx.getExtension('WEBGL_compressed_texture_s3tc') ||
                            GLctx.getExtension('MOZ_WEBGL_compressed_texture_s3tc') ||
                            GLctx.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
  
        GL.anisotropicExt = GLctx.getExtension('EXT_texture_filter_anisotropic') ||
                            GLctx.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
                            GLctx.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  
        GL.floatExt = GLctx.getExtension('OES_texture_float');
  
        // Extension available from Firefox 26 and Google Chrome 30
        GL.instancedArraysExt = GLctx.getExtension('ANGLE_instanced_arrays');
        
        // Extension available from Firefox 25 and WebKit
        GL.vaoExt = Module.ctx.getExtension('OES_vertex_array_object');
  
        // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
        // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
        // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
        // here, as long as they don't produce a performance impact for users that might not be using those extensions.
        // E.g. debugging-related extensions should probably be off by default.
        var automaticallyEnabledExtensions = [ "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                               "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                               "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays",
                                               "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc",
                                               "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float",
                                               "EXT_frag_depth", "EXT_sRGB", "WEBGL_draw_buffers", "WEBGL_shared_resources",
                                               "EXT_shader_texture_lod" ];
  
        function shouldEnableAutomatically(extension) {
          for(var i in automaticallyEnabledExtensions) {
            var include = automaticallyEnabledExtensions[i];
            if (ext.indexOf(include) != -1) {
              return true;
            }
          }
          return false;
        }
  
        var extensions = GLctx.getSupportedExtensions();
        for(var e in extensions) {
          var ext = extensions[e].replace('MOZ_', '').replace('WEBKIT_', '');
          if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
            GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
          }
        }
      },populateUniformTable:function (program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
          maxAttributeLength: -1 // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
        };
  
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
        // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i);
  
          var name = u.name;
          ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
  
          // Strip off any trailing array specifier we might have got, e.g. "[0]".
          if (name.indexOf(']', name.length-1) !== -1) {
            var ls = name.lastIndexOf('[');
            name = name.slice(0, ls);
          }
  
          // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then 
          // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
          // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
          var loc = GLctx.getUniformLocation(p, name);
          var id = GL.getNewId(GL.uniforms);
          utable[name] = [u.size, id];
          GL.uniforms[id] = loc;
  
          for (var j = 1; j < u.size; ++j) {
            var n = name + '['+j+']';
            loc = GLctx.getUniformLocation(p, n);
            id = GL.getNewId(GL.uniforms);
  
            GL.uniforms[id] = loc;
          }
        }
      }};
  
  
  
  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = Math.floor(idx / this.chunkSize);
          return this.getter(chunkNum)[chunkOffset];
        }
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        }
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var chunkSize = 1024*1024; // Chunk size in bytes
  
            if (!hasByteServing) chunkSize = datalength;
  
            // Function to get a range from the remote URL.
            var doXHR = (function(from, to) {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
              // Some hints to the browser that we want binary data.
              if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
  
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || []);
              } else {
                return intArrayFromString(xhr.responseText || '', true);
              }
            });
            var lazyArray = this;
            lazyArray.setDataGetter(function(chunkNum) {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
              return lazyArray.chunks[chunkNum];
            });
  
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
        }
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        
        // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
        // Module['forcedAspectRatio'] = 4 / 3;
        
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'] ||
                                    canvas['msRequestPointerLock'] ||
                                    function(){};
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 document['msExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas ||
                                document['msPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement'] ||
               document['msFullScreenElement'] || document['msFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'] ||
                                      document['msExitFullscreen'] ||
                                      document['exitFullscreen'] ||
                                      function() {};
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
          document.addEventListener('MSFullscreenChange', fullScreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullScreen = canvasContainer['requestFullScreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvasContainer.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
            
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              Browser.lastTouches[touch.identifier] = Browser.touches[touch.identifier];
              Browser.touches[touch.identifier] = { x: adjustedX, y: adjustedY };
            } 
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
             document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
             document['fullScreenElement'] || document['fullscreenElement'] ||
             document['msFullScreenElement'] || document['msFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      }};
  
  
  function _glEnable(x0) { GLctx.enable(x0) }
  
  function _glDisable(x0) { GLctx.disable(x0) }
  
  function _glIsEnabled(x0) { return GLctx.isEnabled(x0) }
  
  function _glGetBooleanv(name_, p) {
      return GL.get(name_, p, 'Boolean');
    }
  
  function _glGetIntegerv(name_, p) {
      return GL.get(name_, p, 'Integer');
    }
  
  function _glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret; 
      switch(name_) {
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x1F02 /* GL_VERSION */:
          ret = allocate(intArrayFromString(GLctx.getParameter(name_)), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions();
          var gl_exts = [];
          for (i in exts) {
            gl_exts.push(exts[i]);
            gl_exts.push("GL_" + exts[i]);
          }
          ret = allocate(intArrayFromString(gl_exts.join(' ')), 'i8', ALLOC_NORMAL);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          ret = allocate(intArrayFromString('OpenGL ES GLSL 1.00 (WebGL)'), 'i8', ALLOC_NORMAL);
          break;
        default:
          GL.recordError(0x0500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }
  
  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }
  
  function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    }
  
  function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }
  
  function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }
  
  function _glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }
  
  function _glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }
  
  function _glDeleteProgram(program) {
      var program = GL.programs[program];
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[program] = null;
      GL.programInfos[program] = null;
    }
  
  function _glBindAttribLocation(program, index, name) {
      name = Pointer_stringify(name);
      GLctx.bindAttribLocation(GL.programs[program], index, name);
    }
  
  function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.programInfos[program] = null; // uniforms no longer keep the same names after linking
      GL.populateUniformTable(program);
    }
  
  function _glBindBuffer(target, buffer) {
      var bufferObj = buffer ? GL.buffers[buffer] : null;
  
      if (target == GLctx.ARRAY_BUFFER) {
        GLImmediate.lastArrayBuffer = GL.currArrayBuffer = buffer;
      } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
        GL.currElementArrayBuffer = buffer;
      }
  
      GLctx.bindBuffer(target, bufferObj);
    }
  
  function _glGetFloatv(name_, p) {
      return GL.get(name_, p, 'Float');
    }
  
  function _glHint(x0, x1) { GLctx.hint(x0, x1) }
  
  function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }
  
  function _glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }
  
  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    }
  
  function _glActiveTexture(x0) { GLctx.activeTexture(x0) }var GLEmulation={fogStart:0,fogEnd:1,fogDensity:1,fogColor:null,fogMode:2048,fogEnabled:false,vaos:[],currentVao:null,enabledVertexAttribArrays:{},hasRunInit:false,init:function () {
        // Do not activate immediate/emulation code (e.g. replace glDrawElements) when in FULL_ES2 mode.
        // We do not need full emulation, we instead emulate client-side arrays etc. in FULL_ES2 code in
        // a straightforward manner, and avoid not having a bound buffer be ambiguous between es2 emulation
        // code and legacy gl emulation code.
  
        if (GLEmulation.hasRunInit) {
          return;
        }
        GLEmulation.hasRunInit = true;
  
        GLEmulation.fogColor = new Float32Array(4);
  
        // Add some emulation workarounds
        Module.printErr('WARNING: using emscripten GL emulation. This is a collection of limited workarounds, do not expect it to work.');
        Module.printErr('WARNING: using emscripten GL emulation unsafe opts. If weirdness happens, try -s GL_UNSAFE_OPTS=0');
  
        // XXX some of the capabilities we don't support may lead to incorrect rendering, if we do not emulate them in shaders
        var validCapabilities = {
          0x0B44: 1, // GL_CULL_FACE
          0x0BE2: 1, // GL_BLEND
          0x0BD0: 1, // GL_DITHER,
          0x0B90: 1, // GL_STENCIL_TEST
          0x0B71: 1, // GL_DEPTH_TEST
          0x0C11: 1, // GL_SCISSOR_TEST
          0x8037: 1, // GL_POLYGON_OFFSET_FILL
          0x809E: 1, // GL_SAMPLE_ALPHA_TO_COVERAGE
          0x80A0: 1  // GL_SAMPLE_COVERAGE
        };
  
        var glEnable = _glEnable;
        _glEnable = _emscripten_glEnable = function _glEnable(cap) {
          // Clean up the renderer on any change to the rendering state. The optimization of
          // skipping renderer setup is aimed at the case of multiple glDraw* right after each other
          if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
          if (cap == 0x0B60 /* GL_FOG */) {
            if (GLEmulation.fogEnabled != true) {
              GLImmediate.currentRenderer = null; // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
              GLEmulation.fogEnabled = true;
            }
            return;
          } else if (cap == 0x0de1 /* GL_TEXTURE_2D */) {
            // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
            // it by forwarding to glEnableClientState
            /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glEnableClientState(cap);
            */
            return;
          } else if (!(cap in validCapabilities)) {
            return;
          }
          glEnable(cap);
        };
  
        var glDisable = _glDisable;
        _glDisable = _emscripten_glDisable = function _glDisable(cap) {
          if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
          if (cap == 0x0B60 /* GL_FOG */) {
            if (GLEmulation.fogEnabled != false) {
              GLImmediate.currentRenderer = null; // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
              GLEmulation.fogEnabled = false;
            }
            return;
          } else if (cap == 0x0de1 /* GL_TEXTURE_2D */) {
            // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
            // it by forwarding to glDisableClientState
            /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glDisableClientState(cap);
            */
            return;
          } else if (!(cap in validCapabilities)) {
            return;
          }
          glDisable(cap);
        };
        _glIsEnabled = _emscripten_glIsEnabled = function _glIsEnabled(cap) {
          if (cap == 0x0B60 /* GL_FOG */) {
            return GLEmulation.fogEnabled ? 1 : 0;
          } else if (!(cap in validCapabilities)) {
            return 0;
          }
          return GLctx.isEnabled(cap);
        };
  
        var glGetBooleanv = _glGetBooleanv;
        _glGetBooleanv = _emscripten_glGetBooleanv = function _glGetBooleanv(pname, p) {
          var attrib = GLEmulation.getAttributeFromCapability(pname);
          if (attrib !== null) {
            var result = GLImmediate.enabledClientAttributes[attrib];
            HEAP8[(p)]=result === true ? 1 : 0;
            return;
          }
          glGetBooleanv(pname, p);
        };
  
        var glGetIntegerv = _glGetIntegerv;
        _glGetIntegerv = _emscripten_glGetIntegerv = function _glGetIntegerv(pname, params) {
          switch (pname) {
            case 0x84E2: pname = GLctx.MAX_TEXTURE_IMAGE_UNITS /* fake it */; break; // GL_MAX_TEXTURE_UNITS
            case 0x8B4A: { // GL_MAX_VERTEX_UNIFORM_COMPONENTS_ARB
              var result = GLctx.getParameter(GLctx.MAX_VERTEX_UNIFORM_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8B49: { // GL_MAX_FRAGMENT_UNIFORM_COMPONENTS_ARB
              var result = GLctx.getParameter(GLctx.MAX_FRAGMENT_UNIFORM_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8B4B: { // GL_MAX_VARYING_FLOATS_ARB
              var result = GLctx.getParameter(GLctx.MAX_VARYING_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8871: pname = GLctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS /* close enough */; break; // GL_MAX_TEXTURE_COORDS
            case 0x807A: { // GL_VERTEX_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x807B: { // GL_VERTEX_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x807C: { // GL_VERTEX_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
            case 0x8081: { // GL_COLOR_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x8082: { // GL_COLOR_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x8083: { // GL_COLOR_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
            case 0x8088: { // GL_TEXTURE_COORD_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x8089: { // GL_TEXTURE_COORD_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x808A: { // GL_TEXTURE_COORD_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
          }
          glGetIntegerv(pname, params);
        };
  
        var glGetString = _glGetString;
        _glGetString = _emscripten_glGetString = function _glGetString(name_) {
          if (GL.stringCache[name_]) return GL.stringCache[name_];
          switch(name_) {
            case 0x1F03 /* GL_EXTENSIONS */: // Add various extensions that we can support
              var ret = allocate(intArrayFromString(GLctx.getSupportedExtensions().join(' ') +
                     ' GL_EXT_texture_env_combine GL_ARB_texture_env_crossbar GL_ATI_texture_env_combine3 GL_NV_texture_env_combine4 GL_EXT_texture_env_dot3 GL_ARB_multitexture GL_ARB_vertex_buffer_object GL_EXT_framebuffer_object GL_ARB_vertex_program GL_ARB_fragment_program GL_ARB_shading_language_100 GL_ARB_shader_objects GL_ARB_vertex_shader GL_ARB_fragment_shader GL_ARB_texture_cube_map GL_EXT_draw_range_elements' +
                     (GL.compressionExt ? ' GL_ARB_texture_compression GL_EXT_texture_compression_s3tc' : '') +
                     (GL.anisotropicExt ? ' GL_EXT_texture_filter_anisotropic' : '')
              ), 'i8', ALLOC_NORMAL);
              GL.stringCache[name_] = ret;
              return ret;
          }
          return glGetString(name_);
        };
  
        // Do some automatic rewriting to work around GLSL differences. Note that this must be done in
        // tandem with the rest of the program, by itself it cannot suffice.
        // Note that we need to remember shader types for this rewriting, saving sources makes it easier to debug.
        GL.shaderInfos = {};
        var glCreateShader = _glCreateShader;
        _glCreateShader = _emscripten_glCreateShader = function _glCreateShader(shaderType) {
          var id = glCreateShader(shaderType);
          GL.shaderInfos[id] = {
            type: shaderType,
            ftransform: false
          };
          return id;
        };
  
        function ensurePrecision(source) {
          if (!/precision +(low|medium|high)p +float *;/.test(source)) {
            source = 'precision mediump float;\n' + source;
          }
          return source;
        }
  
        var glShaderSource = _glShaderSource;
        _glShaderSource = _emscripten_glShaderSource = function _glShaderSource(shader, count, string, length) {
          var source = GL.getSource(shader, count, string, length);
          // XXX We add attributes and uniforms to shaders. The program can ask for the # of them, and see the
          // ones we generated, potentially confusing it? Perhaps we should hide them.
          if (GL.shaderInfos[shader].type == GLctx.VERTEX_SHADER) {
            // Replace ftransform() with explicit project/modelview transforms, and add position and matrix info.
            var has_pm = source.search(/u_projection/) >= 0;
            var has_mm = source.search(/u_modelView/) >= 0;
            var has_pv = source.search(/a_position/) >= 0;
            var need_pm = 0, need_mm = 0, need_pv = 0;
            var old = source;
            source = source.replace(/ftransform\(\)/g, '(u_projection * u_modelView * a_position)');
            if (old != source) need_pm = need_mm = need_pv = 1;
            old = source;
            source = source.replace(/gl_ProjectionMatrix/g, 'u_projection');
            if (old != source) need_pm = 1;
            old = source;
            source = source.replace(/gl_ModelViewMatrixTranspose\[2\]/g, 'vec4(u_modelView[0][2], u_modelView[1][2], u_modelView[2][2], u_modelView[3][2])'); // XXX extremely inefficient
            if (old != source) need_mm = 1;
            old = source;
            source = source.replace(/gl_ModelViewMatrix/g, 'u_modelView');
            if (old != source) need_mm = 1;
            old = source;
            source = source.replace(/gl_Vertex/g, 'a_position');
            if (old != source) need_pv = 1;
            old = source;
            source = source.replace(/gl_ModelViewProjectionMatrix/g, '(u_projection * u_modelView)');
            if (old != source) need_pm = need_mm = 1;
            if (need_pv && !has_pv) source = 'attribute vec4 a_position; \n' + source;
            if (need_mm && !has_mm) source = 'uniform mat4 u_modelView; \n' + source;
            if (need_pm && !has_pm) source = 'uniform mat4 u_projection; \n' + source;
            GL.shaderInfos[shader].ftransform = need_pm || need_mm || need_pv; // we will need to provide the fixed function stuff as attributes and uniforms
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              // XXX To handle both regular texture mapping and cube mapping, we use vec4 for tex coordinates.
              var old = source;
              var need_vtc = source.search('v_texCoord' + i) == -1;
              source = source.replace(new RegExp('gl_TexCoord\\[' + i + '\\]', 'g'), 'v_texCoord' + i)
                             .replace(new RegExp('gl_MultiTexCoord' + i, 'g'), 'a_texCoord' + i);
              if (source != old) {
                source = 'attribute vec4 a_texCoord' + i + '; \n' + source;
                if (need_vtc) {
                  source = 'varying vec4 v_texCoord' + i + ';   \n' + source;
                }
              }
  
              old = source;
              source = source.replace(new RegExp('gl_TextureMatrix\\[' + i + '\\]', 'g'), 'u_textureMatrix' + i);
              if (source != old) {
                source = 'uniform mat4 u_textureMatrix' + i + '; \n' + source;
              }
            }
            if (source.indexOf('gl_FrontColor') >= 0) {
              source = 'varying vec4 v_color; \n' +
                       source.replace(/gl_FrontColor/g, 'v_color');
            }
            if (source.indexOf('gl_Color') >= 0) {
              source = 'attribute vec4 a_color; \n' +
                       source.replace(/gl_Color/g, 'a_color');
            }
            if (source.indexOf('gl_Normal') >= 0) {
              source = 'attribute vec3 a_normal; \n' +
                       source.replace(/gl_Normal/g, 'a_normal');
            }
            // fog
            if (source.indexOf('gl_FogFragCoord') >= 0) {
              source = 'varying float v_fogFragCoord;   \n' +
                       source.replace(/gl_FogFragCoord/g, 'v_fogFragCoord');
            }
            source = ensurePrecision(source);
          } else { // Fragment shader
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              var old = source;
              source = source.replace(new RegExp('gl_TexCoord\\[' + i + '\\]', 'g'), 'v_texCoord' + i);
              if (source != old) {
                source = 'varying vec4 v_texCoord' + i + ';   \n' + source;
              }
            }
            if (source.indexOf('gl_Color') >= 0) {
              source = 'varying vec4 v_color; \n' + source.replace(/gl_Color/g, 'v_color');
            }
            if (source.indexOf('gl_Fog.color') >= 0) {
              source = 'uniform vec4 u_fogColor;   \n' +
                       source.replace(/gl_Fog.color/g, 'u_fogColor');
            }
            if (source.indexOf('gl_Fog.end') >= 0) {
              source = 'uniform float u_fogEnd;   \n' +
                       source.replace(/gl_Fog.end/g, 'u_fogEnd');
            }
            if (source.indexOf('gl_Fog.scale') >= 0) {
              source = 'uniform float u_fogScale;   \n' +
                       source.replace(/gl_Fog.scale/g, 'u_fogScale');
            }
            if (source.indexOf('gl_Fog.density') >= 0) {
              source = 'uniform float u_fogDensity;   \n' +
                       source.replace(/gl_Fog.density/g, 'u_fogDensity');
            }
            if (source.indexOf('gl_FogFragCoord') >= 0) {
              source = 'varying float v_fogFragCoord;   \n' +
                       source.replace(/gl_FogFragCoord/g, 'v_fogFragCoord');
            }
            source = ensurePrecision(source);
          }
          GLctx.shaderSource(GL.shaders[shader], source);
        };
  
        var glCompileShader = _glCompileShader;
        _glCompileShader = _emscripten_glCompileShader = function _glCompileShader(shader) {
          GLctx.compileShader(GL.shaders[shader]);
        };
  
        GL.programShaders = {};
        var glAttachShader = _glAttachShader;
        _glAttachShader = _emscripten_glAttachShader = function _glAttachShader(program, shader) {
          if (!GL.programShaders[program]) GL.programShaders[program] = [];
          GL.programShaders[program].push(shader);
          glAttachShader(program, shader);
        };
  
        var glDetachShader = _glDetachShader;
        _glDetachShader = _emscripten_glDetachShader = function _glDetachShader(program, shader) {
          var programShader = GL.programShaders[program];
          if (!programShader) {
            Module.printErr('WARNING: _glDetachShader received invalid program: ' + program);
            return;
          }
          var index = programShader.indexOf(shader);
          programShader.splice(index, 1);
          glDetachShader(program, shader);
        };
  
        var glUseProgram = _glUseProgram;
        _glUseProgram = _emscripten_glUseProgram = function _glUseProgram(program) {
          if (GL.currProgram != program) {
            GLImmediate.currentRenderer = null; // This changes the FFP emulation shader program, need to recompute that.
            GL.currProgram = program;
            GLImmediate.fixedFunctionProgram = 0;
            glUseProgram(program);
          }
        }
  
        var glDeleteProgram = _glDeleteProgram;
        _glDeleteProgram = _emscripten_glDeleteProgram = function _glDeleteProgram(program) {
          glDeleteProgram(program);
          if (program == GL.currProgram) {
            GLImmediate.currentRenderer = null; // This changes the FFP emulation shader program, need to recompute that.
            GL.currProgram = 0;
          }
        };
  
        // If attribute 0 was not bound, bind it to 0 for WebGL performance reasons. Track if 0 is free for that.
        var zeroUsedPrograms = {};
        var glBindAttribLocation = _glBindAttribLocation;
        _glBindAttribLocation = _emscripten_glBindAttribLocation = function _glBindAttribLocation(program, index, name) {
          if (index == 0) zeroUsedPrograms[program] = true;
          glBindAttribLocation(program, index, name);
        };
        var glLinkProgram = _glLinkProgram;
        _glLinkProgram = _emscripten_glLinkProgram = function _glLinkProgram(program) {
          if (!(program in zeroUsedPrograms)) {
            GLctx.bindAttribLocation(GL.programs[program], 0, 'a_position');
          }
          glLinkProgram(program);
        };
  
        var glBindBuffer = _glBindBuffer;
        _glBindBuffer = _emscripten_glBindBuffer = function _glBindBuffer(target, buffer) {
          glBindBuffer(target, buffer);
          if (target == GLctx.ARRAY_BUFFER) {
            if (GLEmulation.currentVao) {
              GLEmulation.currentVao.arrayBuffer = buffer;
            }
          } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
            if (GLEmulation.currentVao) GLEmulation.currentVao.elementArrayBuffer = buffer;
          }
        };
  
        var glGetFloatv = _glGetFloatv;
        _glGetFloatv = _emscripten_glGetFloatv = function _glGetFloatv(pname, params) {
          if (pname == 0x0BA6) { // GL_MODELVIEW_MATRIX
            HEAPF32.set(GLImmediate.matrix[0/*m*/], params >> 2);
          } else if (pname == 0x0BA7) { // GL_PROJECTION_MATRIX
            HEAPF32.set(GLImmediate.matrix[1/*p*/], params >> 2);
          } else if (pname == 0x0BA8) { // GL_TEXTURE_MATRIX
            HEAPF32.set(GLImmediate.matrix[2/*t*/ + GLImmediate.clientActiveTexture], params >> 2);
          } else if (pname == 0x0B66) { // GL_FOG_COLOR
            HEAPF32.set(GLEmulation.fogColor, params >> 2);
          } else if (pname == 0x0B63) { // GL_FOG_START
            HEAPF32[((params)>>2)]=GLEmulation.fogStart;
          } else if (pname == 0x0B64) { // GL_FOG_END
            HEAPF32[((params)>>2)]=GLEmulation.fogEnd;
          } else if (pname == 0x0B62) { // GL_FOG_DENSITY
            HEAPF32[((params)>>2)]=GLEmulation.fogDensity;
          } else if (pname == 0x0B65) { // GL_FOG_MODE
            HEAPF32[((params)>>2)]=GLEmulation.fogMode;
          } else {
            glGetFloatv(pname, params);
          }
        };
  
        var glHint = _glHint;
        _glHint = _emscripten_glHint = function _glHint(target, mode) {
          if (target == 0x84EF) { // GL_TEXTURE_COMPRESSION_HINT
            return;
          }
          glHint(target, mode);
        };
  
        var glEnableVertexAttribArray = _glEnableVertexAttribArray;
        _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray = function _glEnableVertexAttribArray(index) {
          glEnableVertexAttribArray(index);
          GLEmulation.enabledVertexAttribArrays[index] = 1;
          if (GLEmulation.currentVao) GLEmulation.currentVao.enabledVertexAttribArrays[index] = 1;
        };
  
        var glDisableVertexAttribArray = _glDisableVertexAttribArray;
        _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray = function _glDisableVertexAttribArray(index) {
          glDisableVertexAttribArray(index);
          delete GLEmulation.enabledVertexAttribArrays[index];
          if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledVertexAttribArrays[index];
        };
  
        var glVertexAttribPointer = _glVertexAttribPointer;
        _glVertexAttribPointer = _emscripten_glVertexAttribPointer = function _glVertexAttribPointer(index, size, type, normalized, stride, pointer) {
          glVertexAttribPointer(index, size, type, normalized, stride, pointer);
          if (GLEmulation.currentVao) { // TODO: avoid object creation here? likely not hot though
            GLEmulation.currentVao.vertexAttribPointers[index] = [index, size, type, normalized, stride, pointer];
          }
        };
      },getAttributeFromCapability:function (cap) {
        var attrib = null;
        switch (cap) {
          case 0x0de1: // GL_TEXTURE_2D - XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support it
            // Fall through:
          case 0x8078: // GL_TEXTURE_COORD_ARRAY
            attrib = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture; break;
          case 0x8074: // GL_VERTEX_ARRAY
            attrib = GLImmediate.VERTEX; break;
          case 0x8075: // GL_NORMAL_ARRAY
            attrib = GLImmediate.NORMAL; break;
          case 0x8076: // GL_COLOR_ARRAY
            attrib = GLImmediate.COLOR; break;
        }
        return attrib;
      }};var GLImmediate={MapTreeLib:null,spawnMapTreeLib:function () {
        /* A naive implementation of a map backed by an array, and accessed by
         * naive iteration along the array. (hashmap with only one bucket)
         */
        function CNaiveListMap() {
          var list = [];
  
          this.insert = function CNaiveListMap_insert(key, val) {
            if (this.contains(key|0)) return false;
            list.push([key, val]);
            return true;
          };
  
          var __contains_i;
          this.contains = function CNaiveListMap_contains(key) {
            for (__contains_i = 0; __contains_i < list.length; ++__contains_i) {
              if (list[__contains_i][0] === key) return true;
            }
            return false;
          };
  
          var __get_i;
          this.get = function CNaiveListMap_get(key) {
            for (__get_i = 0; __get_i < list.length; ++__get_i) {
              if (list[__get_i][0] === key) return list[__get_i][1];
            }
            return undefined;
          };
        };
  
        /* A tree of map nodes.
          Uses `KeyView`s to allow descending the tree without garbage.
          Example: {
            // Create our map object.
            var map = new ObjTreeMap();
  
            // Grab the static keyView for the map.
            var keyView = map.GetStaticKeyView();
  
            // Let's make a map for:
            // root: <undefined>
            //   1: <undefined>
            //     2: <undefined>
            //       5: "Three, sir!"
            //       3: "Three!"
  
            // Note how we can chain together `Reset` and `Next` to
            // easily descend based on multiple key fragments.
            keyView.Reset().Next(1).Next(2).Next(5).Set("Three, sir!");
            keyView.Reset().Next(1).Next(2).Next(3).Set("Three!");
          }
        */
        function CMapTree() {
          function CNLNode() {
            var map = new CNaiveListMap();
  
            this.child = function CNLNode_child(keyFrag) {
              if (!map.contains(keyFrag|0)) {
                map.insert(keyFrag|0, new CNLNode());
              }
              return map.get(keyFrag|0);
            };
  
            this.value = undefined;
            this.get = function CNLNode_get() {
              return this.value;
            };
  
            this.set = function CNLNode_set(val) {
              this.value = val;
            };
          }
  
          function CKeyView(root) {
            var cur;
  
            this.reset = function CKeyView_reset() {
              cur = root;
              return this;
            };
            this.reset();
  
            this.next = function CKeyView_next(keyFrag) {
              cur = cur.child(keyFrag);
              return this;
            };
  
            this.get = function CKeyView_get() {
              return cur.get();
            };
  
            this.set = function CKeyView_set(val) {
              cur.set(val);
            };
          };
  
          var root;
          var staticKeyView;
  
          this.createKeyView = function CNLNode_createKeyView() {
            return new CKeyView(root);
          }
  
          this.clear = function CNLNode_clear() {
            root = new CNLNode();
            staticKeyView = this.createKeyView();
          };
          this.clear();
  
          this.getStaticKeyView = function CNLNode_getStaticKeyView() {
            staticKeyView.reset();
            return staticKeyView;
          };
        };
  
        // Exports:
        return {
          create: function() {
            return new CMapTree();
          },
        };
      },TexEnvJIT:null,spawnTexEnvJIT:function () {
        // GL defs:
        var GL_TEXTURE0 = 0x84C0;
        var GL_TEXTURE_1D = 0x0DE0;
        var GL_TEXTURE_2D = 0x0DE1;
        var GL_TEXTURE_3D = 0x806f;
        var GL_TEXTURE_CUBE_MAP = 0x8513;
        var GL_TEXTURE_ENV = 0x2300;
        var GL_TEXTURE_ENV_MODE = 0x2200;
        var GL_TEXTURE_ENV_COLOR = 0x2201;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;
  
        var GL_SRC0_RGB = 0x8580;
        var GL_SRC1_RGB = 0x8581;
        var GL_SRC2_RGB = 0x8582;
  
        var GL_SRC0_ALPHA = 0x8588;
        var GL_SRC1_ALPHA = 0x8589;
        var GL_SRC2_ALPHA = 0x858A;
  
        var GL_OPERAND0_RGB = 0x8590;
        var GL_OPERAND1_RGB = 0x8591;
        var GL_OPERAND2_RGB = 0x8592;
  
        var GL_OPERAND0_ALPHA = 0x8598;
        var GL_OPERAND1_ALPHA = 0x8599;
        var GL_OPERAND2_ALPHA = 0x859A;
  
        var GL_COMBINE_RGB = 0x8571;
        var GL_COMBINE_ALPHA = 0x8572;
  
        var GL_RGB_SCALE = 0x8573;
        var GL_ALPHA_SCALE = 0x0D1C;
  
        // env.mode
        var GL_ADD      = 0x0104;
        var GL_BLEND    = 0x0BE2;
        var GL_REPLACE  = 0x1E01;
        var GL_MODULATE = 0x2100;
        var GL_DECAL    = 0x2101;
        var GL_COMBINE  = 0x8570;
  
        // env.color/alphaCombiner
        //var GL_ADD         = 0x0104;
        //var GL_REPLACE     = 0x1E01;
        //var GL_MODULATE    = 0x2100;
        var GL_SUBTRACT    = 0x84E7;
        var GL_INTERPOLATE = 0x8575;
  
        // env.color/alphaSrc
        var GL_TEXTURE       = 0x1702;
        var GL_CONSTANT      = 0x8576;
        var GL_PRIMARY_COLOR = 0x8577;
        var GL_PREVIOUS      = 0x8578;
  
        // env.color/alphaOp
        var GL_SRC_COLOR           = 0x0300;
        var GL_ONE_MINUS_SRC_COLOR = 0x0301;
        var GL_SRC_ALPHA           = 0x0302;
        var GL_ONE_MINUS_SRC_ALPHA = 0x0303;
  
        var GL_RGB  = 0x1907;
        var GL_RGBA = 0x1908;
  
        // Our defs:
        var TEXENVJIT_NAMESPACE_PREFIX = "tej_";
        // Not actually constant, as they can be changed between JIT passes:
        var TEX_UNIT_UNIFORM_PREFIX = "uTexUnit";
        var TEX_COORD_VARYING_PREFIX = "vTexCoord";
        var PRIM_COLOR_VARYING = "vPrimColor";
        var TEX_MATRIX_UNIFORM_PREFIX = "uTexMatrix";
  
        // Static vars:
        var s_texUnits = null; //[];
        var s_activeTexture = 0;
  
        var s_requiredTexUnitsForPass = [];
  
        // Static funcs:
        function abort(info) {
          assert(false, "[TexEnvJIT] ABORT: " + info);
        }
  
        function abort_noSupport(info) {
          abort("No support: " + info);
        }
  
        function abort_sanity(info) {
          abort("Sanity failure: " + info);
        }
  
        function genTexUnitSampleExpr(texUnitID) {
          var texUnit = s_texUnits[texUnitID];
          var texType = texUnit.getTexType();
  
          var func = null;
          switch (texType) {
            case GL_TEXTURE_1D:
              func = "texture2D";
              break;
            case GL_TEXTURE_2D:
              func = "texture2D";
              break;
            case GL_TEXTURE_3D:
              return abort_noSupport("No support for 3D textures.");
            case GL_TEXTURE_CUBE_MAP:
              func = "textureCube";
              break;
            default:
              return abort_sanity("Unknown texType: 0x" + texType.toString(16));
          }
  
          var texCoordExpr = TEX_COORD_VARYING_PREFIX + texUnitID;
          if (TEX_MATRIX_UNIFORM_PREFIX != null) {
            texCoordExpr = "(" + TEX_MATRIX_UNIFORM_PREFIX + texUnitID + " * " + texCoordExpr + ")";
          }
          return func + "(" + TEX_UNIT_UNIFORM_PREFIX + texUnitID + ", " + texCoordExpr + ".xy)";
        }
  
        function getTypeFromCombineOp(op) {
          switch (op) {
            case GL_SRC_COLOR:
            case GL_ONE_MINUS_SRC_COLOR:
              return "vec3";
            case GL_SRC_ALPHA:
            case GL_ONE_MINUS_SRC_ALPHA:
              return "float";
          }
  
          return abort_noSupport("Unsupported combiner op: 0x" + op.toString(16));
        }
  
        function getCurTexUnit() {
          return s_texUnits[s_activeTexture];
        }
  
        function genCombinerSourceExpr(texUnitID, constantExpr, previousVar,
                                       src, op)
        {
          var srcExpr = null;
          switch (src) {
            case GL_TEXTURE:
              srcExpr = genTexUnitSampleExpr(texUnitID);
              break;
            case GL_CONSTANT:
              srcExpr = constantExpr;
              break;
            case GL_PRIMARY_COLOR:
              srcExpr = PRIM_COLOR_VARYING;
              break;
            case GL_PREVIOUS:
              srcExpr = previousVar;
              break;
            default:
                return abort_noSupport("Unsupported combiner src: 0x" + src.toString(16));
          }
  
          var expr = null;
          switch (op) {
            case GL_SRC_COLOR:
              expr = srcExpr + ".rgb";
              break;
            case GL_ONE_MINUS_SRC_COLOR:
              expr = "(vec3(1.0) - " + srcExpr + ".rgb)";
              break;
            case GL_SRC_ALPHA:
              expr = srcExpr + ".a";
              break;
            case GL_ONE_MINUS_SRC_ALPHA:
              expr = "(1.0 - " + srcExpr + ".a)";
              break;
            default:
              return abort_noSupport("Unsupported combiner op: 0x" + op.toString(16));
          }
  
          return expr;
        }
  
        function valToFloatLiteral(val) {
          if (val == Math.round(val)) return val + '.0';
          return val;
        }
  
  
        // Classes:
        function CTexEnv() {
          this.mode = GL_MODULATE;
          this.colorCombiner = GL_MODULATE;
          this.alphaCombiner = GL_MODULATE;
          this.colorScale = 1;
          this.alphaScale = 1;
          this.envColor = [0, 0, 0, 0];
  
          this.colorSrc = [
            GL_TEXTURE,
            GL_PREVIOUS,
            GL_CONSTANT
          ];
          this.alphaSrc = [
            GL_TEXTURE,
            GL_PREVIOUS,
            GL_CONSTANT
          ];
          this.colorOp = [
            GL_SRC_COLOR,
            GL_SRC_COLOR,
            GL_SRC_ALPHA
          ];
          this.alphaOp = [
            GL_SRC_ALPHA,
            GL_SRC_ALPHA,
            GL_SRC_ALPHA
          ];
  
          // Map GLenums to small values to efficiently pack the enums to bits for tighter access.
          this.traverseKey = {
            // mode
            0x1E01 /* GL_REPLACE */: 0,
            0x2100 /* GL_MODULATE */: 1,
            0x0104 /* GL_ADD */: 2,
            0x0BE2 /* GL_BLEND */: 3,
            0x2101 /* GL_DECAL */: 4,
            0x8570 /* GL_COMBINE */: 5,
  
            // additional color and alpha combiners
            0x84E7 /* GL_SUBTRACT */: 3,
            0x8575 /* GL_INTERPOLATE */: 4,
  
            // color and alpha src
            0x1702 /* GL_TEXTURE */: 0,
            0x8576 /* GL_CONSTANT */: 1,
            0x8577 /* GL_PRIMARY_COLOR */: 2,
            0x8578 /* GL_PREVIOUS */: 3,
  
            // color and alpha op
            0x0300 /* GL_SRC_COLOR */: 0,
            0x0301 /* GL_ONE_MINUS_SRC_COLOR */: 1,
            0x0302 /* GL_SRC_ALPHA */: 2,
            0x0300 /* GL_ONE_MINUS_SRC_ALPHA */: 3
          };
  
          // The tuple (key0,key1,key2) uniquely identifies the state of the variables in CTexEnv.
          // -1 on key0 denotes 'the whole cached key is dirty'
          this.key0 = -1;
          this.key1 = 0;
          this.key2 = 0;
  
          this.computeKey0 = function() {
            var k = this.traverseKey;
            var key = k[this.mode] * 1638400; // 6 distinct values.
            key += k[this.colorCombiner] * 327680; // 5 distinct values.
            key += k[this.alphaCombiner] * 65536; // 5 distinct values.
            // The above three fields have 6*5*5=150 distinct values -> 8 bits.
            key += (this.colorScale-1) * 16384; // 10 bits used.
            key += (this.alphaScale-1) * 4096; // 12 bits used.
            key += k[this.colorSrc[0]] * 1024; // 14
            key += k[this.colorSrc[1]] * 256; // 16
            key += k[this.colorSrc[2]] * 64; // 18
            key += k[this.alphaSrc[0]] * 16; // 20
            key += k[this.alphaSrc[1]] * 4; // 22
            key += k[this.alphaSrc[2]]; // 24 bits used total.
            return key;
          }
          this.computeKey1 = function() {
            var k = this.traverseKey;
            key = k[this.colorOp[0]] * 4096;
            key += k[this.colorOp[1]] * 1024;             
            key += k[this.colorOp[2]] * 256;
            key += k[this.alphaOp[0]] * 16;
            key += k[this.alphaOp[1]] * 4;
            key += k[this.alphaOp[2]];
            return key;            
          }
          // TODO: remove this. The color should not be part of the key!
          this.computeKey2 = function() {
            return this.envColor[0] * 16777216 + this.envColor[1] * 65536 + this.envColor[2] * 256 + 1 + this.envColor[3];
          }
          this.recomputeKey = function() {
            this.key0 = this.computeKey0();
            this.key1 = this.computeKey1();
            this.key2 = this.computeKey2();
          }
          this.invalidateKey = function() {
            this.key0 = -1; // The key of this texture unit must be recomputed when rendering the next time.
            GLImmediate.currentRenderer = null; // The currently used renderer must be re-evaluated at next render.
          }
        }
  
        function CTexUnit() {
          this.env = new CTexEnv();
          this.enabled_tex1D   = false;
          this.enabled_tex2D   = false;
          this.enabled_tex3D   = false;
          this.enabled_texCube = false;
          this.texTypesEnabled = 0; // A bitfield combination of the four flags above, used for fast access to operations.
  
          this.traverseState = function CTexUnit_traverseState(keyView) {
            if (this.texTypesEnabled) {
              if (this.env.key0 == -1) {
                this.env.recomputeKey();
              }
              keyView.next(this.texTypesEnabled | (this.env.key0 << 4));
              keyView.next(this.env.key1);
              keyView.next(this.env.key2);
            } else {
              // For correctness, must traverse a zero value, theoretically a subsequent integer key could collide with this value otherwise.
              keyView.next(0);
            }
          };
        };
  
        // Class impls:
        CTexUnit.prototype.enabled = function CTexUnit_enabled() {
          return this.texTypesEnabled;
        }
  
        CTexUnit.prototype.genPassLines = function CTexUnit_genPassLines(passOutputVar, passInputVar, texUnitID) {
          if (!this.enabled()) {
            return ["vec4 " + passOutputVar + " = " + passInputVar + ";"];
          }
          var lines = this.env.genPassLines(passOutputVar, passInputVar, texUnitID).join('\n');
  
          var texLoadLines = '';
          var texLoadRegex = /(texture.*?\(.*?\))/g;
          var loadCounter = 0;
          var load;
  
          // As an optimization, merge duplicate identical texture loads to one var.
          while(load = texLoadRegex.exec(lines)) {
            var texLoadExpr = load[1];
            var secondOccurrence = lines.slice(load.index+1).indexOf(texLoadExpr);
            if (secondOccurrence != -1) { // And also has a second occurrence of same load expression..
              // Create new var to store the common load.
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texLoadVar = prefix + 'texload' + loadCounter++;
              var texLoadLine = 'vec4 ' + texLoadVar + ' = ' + texLoadExpr + ';\n';
              texLoadLines += texLoadLine + '\n'; // Store the generated texture load statements in a temp string to not confuse regex search in progress.
              lines = lines.split(texLoadExpr).join(texLoadVar);
              // Reset regex search, since we modified the string.
              texLoadRegex = /(texture.*\(.*\))/g;
            }
          }
          return [texLoadLines + lines];
        }
  
        CTexUnit.prototype.getTexType = function CTexUnit_getTexType() {
          if (this.enabled_texCube) {
            return GL_TEXTURE_CUBE_MAP;
          } else if (this.enabled_tex3D) {
            return GL_TEXTURE_3D;
          } else if (this.enabled_tex2D) {
            return GL_TEXTURE_2D;
          } else if (this.enabled_tex1D) {
            return GL_TEXTURE_1D;
          }
          return 0;
        }
  
        CTexEnv.prototype.genPassLines = function CTexEnv_genPassLines(passOutputVar, passInputVar, texUnitID) {
          switch (this.mode) {
            case GL_REPLACE: {
              /* RGB:
               * Cv = Cs
               * Av = Ap // Note how this is different, and that we'll
               *            need to track the bound texture internalFormat
               *            to get this right.
               *
               * RGBA:
               * Cv = Cs
               * Av = As
               */
              return [
                "vec4 " + passOutputVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
              ];
            }
            case GL_ADD: {
              /* RGBA:
               * Cv = Cp + Cs
               * Av = ApAs
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                "vec3 " + colorVar + " = " + passInputVar + ".rgb + " + texVar + ".rgb;",
                "float " + alphaVar + " = " + passInputVar + ".a * " + texVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_MODULATE: {
              /* RGBA:
               * Cv = CpCs
               * Av = ApAs
               */
              var line = [
                "vec4 " + passOutputVar,
                " = ",
                  passInputVar,
                  " * ",
                  genTexUnitSampleExpr(texUnitID),
                ";",
              ];
              return [line.join("")];
            }
            case GL_DECAL: {
              /* RGBA:
               * Cv = Cp(1 - As) + CsAs
               * Av = Ap
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                [
                  "vec3 " + colorVar + " = ",
                    passInputVar + ".rgb * (1.0 - " + texVar + ".a)",
                      " + ",
                    texVar + ".rgb * " + texVar + ".a",
                  ";"
                ].join(""),
                "float " + alphaVar + " = " + passInputVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_BLEND: {
              /* RGBA:
               * Cv = Cp(1 - Cs) + CcCs
               * Av = As
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                [
                  "vec3 " + colorVar + " = ",
                    passInputVar + ".rgb * (1.0 - " + texVar + ".rgb)",
                      " + ",
                    PRIM_COLOR_VARYING + ".rgb * " + texVar + ".rgb",
                  ";"
                ].join(""),
                "float " + alphaVar + " = " + texVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_COMBINE: {
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
              var colorLines = this.genCombinerLines(true, colorVar,
                                                     passInputVar, texUnitID,
                                                     this.colorCombiner, this.colorSrc, this.colorOp);
              var alphaLines = this.genCombinerLines(false, alphaVar,
                                                     passInputVar, texUnitID,
                                                     this.alphaCombiner, this.alphaSrc, this.alphaOp);
  
              // Generate scale, but avoid generating an identity op that multiplies by one.
              var scaledColor = (this.colorScale == 1) ? colorVar : (colorVar + " * " + valToFloatLiteral(this.colorScale));
              var scaledAlpha = (this.alphaScale == 1) ? alphaVar : (alphaVar + " * " + valToFloatLiteral(this.alphaScale));
  
              var line = [
                "vec4 " + passOutputVar,
                " = ",
                  "vec4(",
                      scaledColor,
                      ", ",
                      scaledAlpha,
                  ")",
                ";",
              ].join("");
              return [].concat(colorLines, alphaLines, [line]);
            }
          }
  
          return abort_noSupport("Unsupported TexEnv mode: 0x" + this.mode.toString(16));
        }
  
        CTexEnv.prototype.genCombinerLines = function CTexEnv_getCombinerLines(isColor, outputVar,
                                                                               passInputVar, texUnitID,
                                                                               combiner, srcArr, opArr)
        {
          var argsNeeded = null;
          switch (combiner) {
            case GL_REPLACE:
              argsNeeded = 1;
              break;
  
            case GL_MODULATE:
            case GL_ADD:
            case GL_SUBTRACT:
              argsNeeded = 2;
              break;
  
            case GL_INTERPOLATE:
              argsNeeded = 3;
              break;
  
            default:
              return abort_noSupport("Unsupported combiner: 0x" + combiner.toString(16));
          }
  
          var constantExpr = [
            "vec4(",
              valToFloatLiteral(this.envColor[0]),
              ", ",
              valToFloatLiteral(this.envColor[1]),
              ", ",
              valToFloatLiteral(this.envColor[2]),
              ", ",
              valToFloatLiteral(this.envColor[3]),
            ")",
          ].join("");
          var src0Expr = (argsNeeded >= 1) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[0], opArr[0])
                                           : null;
          var src1Expr = (argsNeeded >= 2) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[1], opArr[1])
                                           : null;
          var src2Expr = (argsNeeded >= 3) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[2], opArr[2])
                                           : null;
  
          var outputType = isColor ? "vec3" : "float";
          var lines = null;
          switch (combiner) {
            case GL_REPLACE: {
              var line = [
                outputType + " " + outputVar,
                " = ",
                  src0Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_MODULATE: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " * " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_ADD: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " + " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_SUBTRACT: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " - " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_INTERPOLATE: {
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var arg2Var = prefix + "colorSrc2";
              var arg2Line = getTypeFromCombineOp(this.colorOp[2]) + " " + arg2Var + " = " + src2Expr + ";";
  
              var line = [
                outputType + " " + outputVar,
                " = ",
                  src0Expr + " * " + arg2Var,
                  " + ",
                  src1Expr + " * (1.0 - " + arg2Var + ")",
                ";",
              ];
              lines = [
                arg2Line,
                line.join(""),
              ];
              break;
            }
  
            default:
              return abort_sanity("Unmatched TexEnv.colorCombiner?");
          }
  
          return lines;
        }
  
        return {
          // Exports:
          init: function(gl, specifiedMaxTextureImageUnits) {
            var maxTexUnits = 0;
            if (specifiedMaxTextureImageUnits) {
              maxTexUnits = specifiedMaxTextureImageUnits;
            } else if (gl) {
              maxTexUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            }
            s_texUnits = [];
            for (var i = 0; i < maxTexUnits; i++) {
              s_texUnits.push(new CTexUnit());
            }
          },
  
          setGLSLVars: function(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix) {
            TEX_UNIT_UNIFORM_PREFIX   = uTexUnitPrefix;
            TEX_COORD_VARYING_PREFIX  = vTexCoordPrefix;
            PRIM_COLOR_VARYING        = vPrimColor;
            TEX_MATRIX_UNIFORM_PREFIX = uTexMatrixPrefix;
          },
  
          genAllPassLines: function(resultDest, indentSize) {
            indentSize = indentSize || 0;
  
            s_requiredTexUnitsForPass.length = 0; // Clear the list.
            var lines = [];
            var lastPassVar = PRIM_COLOR_VARYING;
            for (var i = 0; i < s_texUnits.length; i++) {
              if (!s_texUnits[i].enabled()) continue;
  
              s_requiredTexUnitsForPass.push(i);
  
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + i + "_";
              var passOutputVar = prefix + "result";
  
              var newLines = s_texUnits[i].genPassLines(passOutputVar, lastPassVar, i);
              lines = lines.concat(newLines, [""]);
  
              lastPassVar = passOutputVar;
            }
            lines.push(resultDest + " = " + lastPassVar + ";");
  
            var indent = "";
            for (var i = 0; i < indentSize; i++) indent += " ";
  
            var output = indent + lines.join("\n" + indent);
  
            return output;
          },
  
          getUsedTexUnitList: function() {
            return s_requiredTexUnitsForPass;
          },
  
          traverseState: function(keyView) {
            for (var i = 0; i < s_texUnits.length; i++) {
              s_texUnits[i].traverseState(keyView);
            }
          },
  
          getTexUnitType: function(texUnitID) {
            return s_texUnits[texUnitID].getTexType();
          },
  
          // Hooks:
          hook_activeTexture: function(texture) {
            s_activeTexture = texture - GL_TEXTURE0;
          },
  
          hook_enable: function(cap) {
            var cur = getCurTexUnit();
            switch (cap) {
              case GL_TEXTURE_1D:
                if (!cur.enabled_tex1D) {
                  GLImmediate.currentRenderer = null; // Renderer state changed, and must be recreated or looked up again.
                  cur.enabled_tex1D = true;
                  cur.texTypesEnabled |= 1;
                }
                break;
              case GL_TEXTURE_2D:
                if (!cur.enabled_tex2D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex2D = true;
                  cur.texTypesEnabled |= 2;
                }
                break;
              case GL_TEXTURE_3D:
                if (!cur.enabled_tex3D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex3D = true;
                  cur.texTypesEnabled |= 4;
                }
                break;
              case GL_TEXTURE_CUBE_MAP:
                if (!cur.enabled_texCube) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_texCube = true;
                  cur.texTypesEnabled |= 8;
                }
                break;
            }
          },
  
          hook_disable: function(cap) {
            var cur = getCurTexUnit();
            switch (cap) {
              case GL_TEXTURE_1D:
                if (cur.enabled_tex1D) {
                  GLImmediate.currentRenderer = null; // Renderer state changed, and must be recreated or looked up again.
                  cur.enabled_tex1D = false;
                  cur.texTypesEnabled &= ~1;
                }
                break;
              case GL_TEXTURE_2D:
                if (cur.enabled_tex2D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex2D = false;
                  cur.texTypesEnabled &= ~2;
                }
                break;
              case GL_TEXTURE_3D:
                if (cur.enabled_tex3D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex3D = false;
                  cur.texTypesEnabled &= ~4;
                }
                break;
              case GL_TEXTURE_CUBE_MAP:
                if (cur.enabled_texCube) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_texCube = false;
                  cur.texTypesEnabled &= ~8;
                }
                break;
            }
          },
  
          hook_texEnvf: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_RGB_SCALE:
                if (env.colorScale != param) {
                  env.invalidateKey(); // We changed FFP emulation renderer state.
                  env.colorScale = param;
                }
                break;
              case GL_ALPHA_SCALE:
                if (env.alphaScale != param) {
                  env.invalidateKey();
                  env.alphaScale = param;
                }
                break;
  
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glTexEnvf`.');
            }
          },
  
          hook_texEnvi: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_MODE:
                if (env.mode != param) {
                  env.invalidateKey(); // We changed FFP emulation renderer state.
                  env.mode = param;
                }
                break;
  
              case GL_COMBINE_RGB:
                if (env.colorCombiner != param) {
                  env.invalidateKey();
                  env.colorCombiner = param;
                }
                break;
              case GL_COMBINE_ALPHA:
                if (env.alphaCombiner != param) {
                  env.invalidateKey();
                  env.alphaCombiner = param;
                }
                break;
  
              case GL_SRC0_RGB:
                if (env.colorSrc[0] != param) {
                  env.invalidateKey();
                  env.colorSrc[0] = param;
                }
                break;
              case GL_SRC1_RGB:
                if (env.colorSrc[1] != param) {
                  env.invalidateKey();
                  env.colorSrc[1] = param;
                }
                break;
              case GL_SRC2_RGB:
                if (env.colorSrc[2] != param) {
                  env.invalidateKey();
                  env.colorSrc[2] = param;
                }
                break;
  
              case GL_SRC0_ALPHA:
                if (env.alphaSrc[0] != param) {
                  env.invalidateKey();
                  env.alphaSrc[0] = param;
                }
                break;
              case GL_SRC1_ALPHA:
                if (env.alphaSrc[1] != param) {
                  env.invalidateKey();
                  env.alphaSrc[1] = param;
                }
                break;
              case GL_SRC2_ALPHA:
                if (env.alphaSrc[2] != param) {
                  env.invalidateKey();
                  env.alphaSrc[2] = param;
                }
                break;
  
              case GL_OPERAND0_RGB:
                if (env.colorOp[0] != param) {
                  env.invalidateKey();
                  env.colorOp[0] = param;
                }
                break;
              case GL_OPERAND1_RGB:
                if (env.colorOp[1] != param) {
                  env.invalidateKey();
                  env.colorOp[1] = param;
                }
                break;
              case GL_OPERAND2_RGB:
                if (env.colorOp[2] != param) {
                  env.invalidateKey();
                  env.colorOp[2] = param;
                }
                break;
  
              case GL_OPERAND0_ALPHA:
                if (env.alphaOp[0] != param) {
                  env.invalidateKey();
                  env.alphaOp[0] = param;
                }
                break;
              case GL_OPERAND1_ALPHA:
                if (env.alphaOp[1] != param) {
                  env.invalidateKey();
                  env.alphaOp[1] = param;
                }
                break;
              case GL_OPERAND2_ALPHA:
                if (env.alphaOp[2] != param) {
                  env.invalidateKey();
                  env.alphaOp[2] = param;
                }
                break;
  
              case GL_RGB_SCALE:
                if (env.colorScale != param) {
                  env.invalidateKey();
                  env.colorScale = param;
                }
                break;
              case GL_ALPHA_SCALE:
                if (env.alphaScale != param) {
                  env.invalidateKey();
                  env.alphaScale = param;
                }
                break;
  
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glTexEnvi`.');
            }
          },
  
          hook_texEnvfv: function(target, pname, params) {
            if (target != GL_TEXTURE_ENV) return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_COLOR: {
                for (var i = 0; i < 4; i++) {
                  var param = HEAPF32[(((params)+(i*4))>>2)];
                  if (env.envColor[i] != param) {
                    env.invalidateKey(); // We changed FFP emulation renderer state.
                    env.envColor[i] = param;
                  }
                }
                break
              }
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glTexEnvfv`.');
            }
          },
  
          hook_getTexEnviv: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_MODE:
                HEAP32[((param)>>2)]=env.mode;
                return;
  
              case GL_TEXTURE_ENV_COLOR:
                HEAP32[((param)>>2)]=Math.max(Math.min(env.envColor[0]*255, 255, -255));
                HEAP32[(((param)+(1))>>2)]=Math.max(Math.min(env.envColor[1]*255, 255, -255));
                HEAP32[(((param)+(2))>>2)]=Math.max(Math.min(env.envColor[2]*255, 255, -255));
                HEAP32[(((param)+(3))>>2)]=Math.max(Math.min(env.envColor[3]*255, 255, -255));
                return;
  
              case GL_COMBINE_RGB:
                HEAP32[((param)>>2)]=env.colorCombiner;
                return;
  
              case GL_COMBINE_ALPHA:
                HEAP32[((param)>>2)]=env.alphaCombiner;
                return;
  
              case GL_SRC0_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[0];
                return;
  
              case GL_SRC1_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[1];
                return;
  
              case GL_SRC2_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[2];
                return;
  
              case GL_SRC0_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[0];
                return;
  
              case GL_SRC1_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[1];
                return;
  
              case GL_SRC2_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[2];
                return;
  
              case GL_OPERAND0_RGB:
                HEAP32[((param)>>2)]=env.colorOp[0];
                return;
  
              case GL_OPERAND1_RGB:
                HEAP32[((param)>>2)]=env.colorOp[1];
                return;
  
              case GL_OPERAND2_RGB:
                HEAP32[((param)>>2)]=env.colorOp[2];
                return;
  
              case GL_OPERAND0_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[0];
                return;
  
              case GL_OPERAND1_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[1];
                return;
  
              case GL_OPERAND2_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[2];
                return;
  
              case GL_RGB_SCALE:
                HEAP32[((param)>>2)]=env.colorScale;
                return;
  
              case GL_ALPHA_SCALE:
                HEAP32[((param)>>2)]=env.alphaScale;
                return;
  
              default:
                Module.printErr('WARNING: Unhandled `pname` in call to `glGetTexEnvi`.');
            }
          },
  
          hook_getTexEnvfv: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_COLOR:
                HEAPF32[((param)>>2)]=env.envColor[0];
                HEAPF32[(((param)+(4))>>2)]=env.envColor[1];
                HEAPF32[(((param)+(8))>>2)]=env.envColor[2];
                HEAPF32[(((param)+(12))>>2)]=env.envColor[3];
                return;
            }
          }
        };
      },vertexData:null,vertexDataU8:null,tempData:null,indexData:null,vertexCounter:0,mode:-1,rendererCache:null,rendererComponents:[],rendererComponentPointer:0,lastRenderer:null,lastArrayBuffer:null,lastProgram:null,lastStride:-1,matrix:[],matrixStack:[],currentMatrix:0,tempMatrix:null,matricesModified:false,useTextureMatrix:false,VERTEX:0,NORMAL:1,COLOR:2,TEXTURE0:3,NUM_ATTRIBUTES:-1,MAX_TEXTURES:-1,totalEnabledClientAttributes:0,enabledClientAttributes:[0,0],clientAttributes:[],liveClientAttributes:[],currentRenderer:null,modifiedClientAttributes:false,clientActiveTexture:0,clientColor:null,usedTexUnitList:[],fixedFunctionProgram:null,setClientAttribute:function setClientAttribute(name, size, type, stride, pointer) {
        var attrib = GLImmediate.clientAttributes[name];
        if (!attrib) {
          for (var i = 0; i <= name; i++) { // keep flat
            if (!GLImmediate.clientAttributes[i]) {
              GLImmediate.clientAttributes[i] = {
                name: name,
                size: size,
                type: type,
                stride: stride,
                pointer: pointer,
                offset: 0
              };
            }
          }
        } else {
          attrib.name = name;
          attrib.size = size;
          attrib.type = type;
          attrib.stride = stride;
          attrib.pointer = pointer;
          attrib.offset = 0;
        }
        GLImmediate.modifiedClientAttributes = true;
      },addRendererComponent:function addRendererComponent(name, size, type) {
        if (!GLImmediate.rendererComponents[name]) {
          GLImmediate.rendererComponents[name] = 1;
          GLImmediate.enabledClientAttributes[name] = true;
          GLImmediate.setClientAttribute(name, size, type, 0, GLImmediate.rendererComponentPointer);
          GLImmediate.rendererComponentPointer += size * GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
        } else {
          GLImmediate.rendererComponents[name]++;
        }
      },disableBeginEndClientAttributes:function disableBeginEndClientAttributes() {
        for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
          if (GLImmediate.rendererComponents[i]) GLImmediate.enabledClientAttributes[i] = false;
        }
      },getRenderer:function getRenderer() {
        // If no FFP state has changed that would have forced to re-evaluate which FFP emulation shader to use,
        // we have the currently used renderer in cache, and can immediately return that.
        if (GLImmediate.currentRenderer) {
          return GLImmediate.currentRenderer;
        }
        // return a renderer object given the liveClientAttributes
        // we maintain a cache of renderers, optimized to not generate garbage
        var attributes = GLImmediate.liveClientAttributes;
        var cacheMap = GLImmediate.rendererCache;
        var keyView = cacheMap.getStaticKeyView().reset();
  
        // By attrib state:
        var enabledAttributesKey = 0;
        for (var i = 0; i < attributes.length; i++) {
          enabledAttributesKey |= 1 << attributes[i].name;
        }
  
        // By fog state:
        var fogParam = 0;
        if (GLEmulation.fogEnabled) {
          switch (GLEmulation.fogMode) {
            case 0x0801: // GL_EXP2
              fogParam = 1;
              break;
            case 0x2601: // GL_LINEAR
              fogParam = 2;
              break;
            default: // default to GL_EXP
              fogParam = 3;
              break;
          }
        }
        keyView.next((enabledAttributesKey << 2) | fogParam);
  
        // By cur program:
        keyView.next(GL.currProgram);
        if (!GL.currProgram) {
          GLImmediate.TexEnvJIT.traverseState(keyView);
        }
  
        // If we don't already have it, create it.
        var renderer = keyView.get();
        if (!renderer) {
          renderer = GLImmediate.createRenderer();
          GLImmediate.currentRenderer = renderer;
          keyView.set(renderer);
          return renderer;
        }
        GLImmediate.currentRenderer = renderer; // Cache the currently used renderer, so later lookups without state changes can get this fast.
        return renderer;
      },createRenderer:function createRenderer(renderer) {
        var useCurrProgram = !!GL.currProgram;
        var hasTextures = false;
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          var texAttribName = GLImmediate.TEXTURE0 + i;
          if (!GLImmediate.enabledClientAttributes[texAttribName])
            continue;
  
  
          hasTextures = true;
        }
  
        var ret = {
          init: function init() {
            // For fixed-function shader generation.
            var uTexUnitPrefix = 'u_texUnit';
            var aTexCoordPrefix = 'a_texCoord';
            var vTexCoordPrefix = 'v_texCoord';
            var vPrimColor = 'v_color';
            var uTexMatrixPrefix = GLImmediate.useTextureMatrix ? 'u_textureMatrix' : null;
  
            if (useCurrProgram) {
              if (GL.shaderInfos[GL.programShaders[GL.currProgram][0]].type == GLctx.VERTEX_SHADER) {
                this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
                this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
              } else {
                this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
                this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
              }
              this.program = GL.programs[GL.currProgram];
              this.usedTexUnitList = [];
            } else {
              // IMPORTANT NOTE: If you parameterize the shader source based on any runtime values
              // in order to create the least expensive shader possible based on the features being
              // used, you should also update the code in the beginning of getRenderer to make sure
              // that you cache the renderer based on the said parameters.
              if (GLEmulation.fogEnabled) {
                switch (GLEmulation.fogMode) {
                  case 0x0801: // GL_EXP2
                    // fog = exp(-(gl_Fog.density * gl_FogFragCoord)^2)
                    var fogFormula = '  float fog = exp(-u_fogDensity * u_fogDensity * ecDistance * ecDistance); \n';
                    break;
                  case 0x2601: // GL_LINEAR
                    // fog = (gl_Fog.end - gl_FogFragCoord) * gl_fog.scale
                    var fogFormula = '  float fog = (u_fogEnd - ecDistance) * u_fogScale; \n';
                    break;
                  default: // default to GL_EXP
                    // fog = exp(-gl_Fog.density * gl_FogFragCoord)
                    var fogFormula = '  float fog = exp(-u_fogDensity * ecDistance); \n';
                    break;
                }
              }
  
              GLImmediate.TexEnvJIT.setGLSLVars(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix);
              var fsTexEnvPass = GLImmediate.TexEnvJIT.genAllPassLines('gl_FragColor', 2);
  
              var texUnitAttribList = '';
              var texUnitVaryingList = '';
              var texUnitUniformList = '';
              var vsTexCoordInits = '';
              this.usedTexUnitList = GLImmediate.TexEnvJIT.getUsedTexUnitList();
              for (var i = 0; i < this.usedTexUnitList.length; i++) {
                var texUnit = this.usedTexUnitList[i];
                texUnitAttribList += 'attribute vec4 ' + aTexCoordPrefix + texUnit + ';\n';
                texUnitVaryingList += 'varying vec4 ' + vTexCoordPrefix + texUnit + ';\n';
                texUnitUniformList += 'uniform sampler2D ' + uTexUnitPrefix + texUnit + ';\n';
                vsTexCoordInits += '  ' + vTexCoordPrefix + texUnit + ' = ' + aTexCoordPrefix + texUnit + ';\n';
  
                if (GLImmediate.useTextureMatrix) {
                  texUnitUniformList += 'uniform mat4 ' + uTexMatrixPrefix + texUnit + ';\n';
                }
              }
  
              var vsFogVaryingInit = null;
              if (GLEmulation.fogEnabled) {
                vsFogVaryingInit = '  v_fogFragCoord = abs(ecPosition.z);\n';
              }
  
              var vsSource = [
                'attribute vec4 a_position;',
                'attribute vec4 a_color;',
                'varying vec4 v_color;',
                texUnitAttribList,
                texUnitVaryingList,
                (GLEmulation.fogEnabled ? 'varying float v_fogFragCoord;' : null),
                'uniform mat4 u_modelView;',
                'uniform mat4 u_projection;',
                'void main()',
                '{',
                '  vec4 ecPosition = u_modelView * a_position;', // eye-coordinate position
                '  gl_Position = u_projection * ecPosition;',
                '  v_color = a_color;',
                vsTexCoordInits,
                vsFogVaryingInit,
                '}',
                ''
              ].join('\n').replace(/\n\n+/g, '\n');
  
              this.vertexShader = GLctx.createShader(GLctx.VERTEX_SHADER);
              GLctx.shaderSource(this.vertexShader, vsSource);
              GLctx.compileShader(this.vertexShader);
  
              var fogHeaderIfNeeded = null;
              if (GLEmulation.fogEnabled) {
                fogHeaderIfNeeded = [
                  '',
                  'varying float v_fogFragCoord; ',
                  'uniform vec4 u_fogColor;      ',
                  'uniform float u_fogEnd;       ',
                  'uniform float u_fogScale;     ',
                  'uniform float u_fogDensity;   ',
                  'float ffog(in float ecDistance) { ',
                  fogFormula,
                  '  fog = clamp(fog, 0.0, 1.0); ',
                  '  return fog;                 ',
                  '}',
                  '',
                ].join("\n");
              }
  
              var fogPass = null;
              if (GLEmulation.fogEnabled) {
                fogPass = 'gl_FragColor = vec4(mix(u_fogColor.rgb, gl_FragColor.rgb, ffog(v_fogFragCoord)), gl_FragColor.a);\n';
              }
  
              var fsSource = [
                'precision mediump float;',
                texUnitVaryingList,
                texUnitUniformList,
                'varying vec4 v_color;',
                fogHeaderIfNeeded,
                'void main()',
                '{',
                fsTexEnvPass,
                fogPass,
                '}',
                ''
              ].join("\n").replace(/\n\n+/g, '\n');
  
              this.fragmentShader = GLctx.createShader(GLctx.FRAGMENT_SHADER);
              GLctx.shaderSource(this.fragmentShader, fsSource);
              GLctx.compileShader(this.fragmentShader);
  
              this.program = GLctx.createProgram();
              GLctx.attachShader(this.program, this.vertexShader);
              GLctx.attachShader(this.program, this.fragmentShader);
  
              // As optimization, bind all attributes to prespecified locations, so that the FFP emulation
              // code can submit attributes to any generated FFP shader without having to examine each shader in turn.
              // These prespecified locations are only assumed if GL_FFP_ONLY is specified, since user could also create their
              // own shaders that didn't have attributes in the same locations.
              GLctx.bindAttribLocation(this.program, GLImmediate.VERTEX, 'a_position');
              GLctx.bindAttribLocation(this.program, GLImmediate.COLOR, 'a_color');
              GLctx.bindAttribLocation(this.program, GLImmediate.NORMAL, 'a_normal');
              var maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
              for (var i = 0; i < GLImmediate.MAX_TEXTURES && GLImmediate.TEXTURE0 + i < maxVertexAttribs; i++) {
                GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, 'a_texCoord'+i);
                GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, aTexCoordPrefix+i);
              }
              GLctx.linkProgram(this.program);
            }
  
            // Stores an array that remembers which matrix uniforms are up-to-date in this FFP renderer, so they don't need to be resubmitted
            // each time we render with this program.
            this.textureMatrixVersion = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  
            this.positionLocation = GLctx.getAttribLocation(this.program, 'a_position');
  
            this.texCoordLocations = [];
  
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              if (!GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i]) {
                this.texCoordLocations[i] = -1;
                continue;
              }
  
              if (useCurrProgram) {
                this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, 'a_texCoord' + i);
              } else {
                this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, aTexCoordPrefix + i);
              }
            }
            this.colorLocation = GLctx.getAttribLocation(this.program, 'a_color');
            if (!useCurrProgram) {
              // Temporarily switch to the program so we can set our sampler uniforms early.
              var prevBoundProg = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
              GLctx.useProgram(this.program);
              {
                for (var i = 0; i < this.usedTexUnitList.length; i++) {
                  var texUnitID = this.usedTexUnitList[i];
                  var texSamplerLoc = GLctx.getUniformLocation(this.program, uTexUnitPrefix + texUnitID);
                  GLctx.uniform1i(texSamplerLoc, texUnitID);
                }
              }
              // The default color attribute value is not the same as the default for all other attribute streams (0,0,0,1) but (1,1,1,1),
              // so explicitly set it right at start.
              GLctx.vertexAttrib4fv(this.colorLocation, [1,1,1,1]);
              GLctx.useProgram(prevBoundProg);
            }
  
            this.textureMatrixLocations = [];
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              this.textureMatrixLocations[i] = GLctx.getUniformLocation(this.program, 'u_textureMatrix' + i);
            }
            this.normalLocation = GLctx.getAttribLocation(this.program, 'a_normal');
  
            this.modelViewLocation = GLctx.getUniformLocation(this.program, 'u_modelView');
            this.projectionLocation = GLctx.getUniformLocation(this.program, 'u_projection');
  
            this.hasTextures = hasTextures;
            this.hasNormal = GLImmediate.enabledClientAttributes[GLImmediate.NORMAL] &&
                             GLImmediate.clientAttributes[GLImmediate.NORMAL].size > 0 &&
                             this.normalLocation >= 0;
            this.hasColor = (this.colorLocation === 0) || this.colorLocation > 0;
  
            this.floatType = GLctx.FLOAT; // minor optimization
  
            this.fogColorLocation = GLctx.getUniformLocation(this.program, 'u_fogColor');
            this.fogEndLocation = GLctx.getUniformLocation(this.program, 'u_fogEnd');
            this.fogScaleLocation = GLctx.getUniformLocation(this.program, 'u_fogScale');
            this.fogDensityLocation = GLctx.getUniformLocation(this.program, 'u_fogDensity');
            this.hasFog = !!(this.fogColorLocation || this.fogEndLocation ||
                             this.fogScaleLocation || this.fogDensityLocation);
          },
  
          prepare: function prepare() {
            // Calculate the array buffer
            var arrayBuffer;
            if (!GL.currArrayBuffer) {
              var start = GLImmediate.firstVertex*GLImmediate.stride;
              var end = GLImmediate.lastVertex*GLImmediate.stride;
              arrayBuffer = GL.getTempVertexBuffer(end);
              // TODO: consider using the last buffer we bound, if it was larger. downside is larger buffer, but we might avoid rebinding and preparing
            } else {
              arrayBuffer = GL.currArrayBuffer;
            }
  
            // If the array buffer is unchanged and the renderer as well, then we can avoid all the work here
            // XXX We use some heuristics here, and this may not work in all cases. Try disabling GL_UNSAFE_OPTS if you
            // have odd glitches
            var lastRenderer = GLImmediate.lastRenderer;
            var canSkip = this == lastRenderer &&
                          arrayBuffer == GLImmediate.lastArrayBuffer &&
                          (GL.currProgram || this.program) == GLImmediate.lastProgram &&
                          GLImmediate.stride == GLImmediate.lastStride &&
                          !GLImmediate.matricesModified;
            if (!canSkip && lastRenderer) lastRenderer.cleanup();
            if (!GL.currArrayBuffer) {
              // Bind the array buffer and upload data after cleaning up the previous renderer
  
              if (arrayBuffer != GLImmediate.lastArrayBuffer) {
                GLctx.bindBuffer(GLctx.ARRAY_BUFFER, arrayBuffer);
                GLImmediate.lastArrayBuffer = arrayBuffer;
              }
  
              GLctx.bufferSubData(GLctx.ARRAY_BUFFER, start, GLImmediate.vertexData.subarray(start >> 2, end >> 2));
            }
            if (canSkip) return;
            GLImmediate.lastRenderer = this;
            GLImmediate.lastProgram = GL.currProgram || this.program;
            GLImmediate.lastStride == GLImmediate.stride;
            GLImmediate.matricesModified = false;
  
            if (!GL.currProgram) {
              if (GLImmediate.fixedFunctionProgram != this.program) {
                GLctx.useProgram(this.program);
                GLImmediate.fixedFunctionProgram = this.program;
              }
            }
  
            if (this.modelViewLocation && this.modelViewMatrixVersion != GLImmediate.matrixVersion[0/*m*/]) {
              this.modelViewMatrixVersion = GLImmediate.matrixVersion[0/*m*/];
              GLctx.uniformMatrix4fv(this.modelViewLocation, false, GLImmediate.matrix[0/*m*/]);
            }
            if (this.projectionLocation && this.projectionMatrixVersion != GLImmediate.matrixVersion[1/*p*/]) {
              this.projectionMatrixVersion = GLImmediate.matrixVersion[1/*p*/];
              GLctx.uniformMatrix4fv(this.projectionLocation, false, GLImmediate.matrix[1/*p*/]);
            }
  
            var clientAttributes = GLImmediate.clientAttributes;
            var posAttr = clientAttributes[GLImmediate.VERTEX];
  
  
            GLctx.vertexAttribPointer(this.positionLocation, posAttr.size, posAttr.type, false, GLImmediate.stride, posAttr.offset);
            GLctx.enableVertexAttribArray(this.positionLocation);
            if (this.hasNormal) {
              var normalAttr = clientAttributes[GLImmediate.NORMAL];
              GLctx.vertexAttribPointer(this.normalLocation, normalAttr.size, normalAttr.type, true, GLImmediate.stride, normalAttr.offset);
              GLctx.enableVertexAttribArray(this.normalLocation);
            }
            if (this.hasTextures) {
              for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                var attribLoc = this.texCoordLocations[i];
                if (attribLoc === undefined || attribLoc < 0) continue;
                var texAttr = clientAttributes[GLImmediate.TEXTURE0+i];
  
                if (texAttr.size) {
                  GLctx.vertexAttribPointer(attribLoc, texAttr.size, texAttr.type, false, GLImmediate.stride, texAttr.offset);
                  GLctx.enableVertexAttribArray(attribLoc);
                } else {
                  // These two might be dangerous, but let's try them.
                  GLctx.vertexAttrib4f(attribLoc, 0, 0, 0, 1);
                  GLctx.disableVertexAttribArray(attribLoc);
                }
                var t = 2/*t*/+i;
                if (this.textureMatrixLocations[i] && this.textureMatrixVersion[t] != GLImmediate.matrixVersion[t]) { // XXX might we need this even without the condition we are currently in?
                  this.textureMatrixVersion[t] = GLImmediate.matrixVersion[t];
                  GLctx.uniformMatrix4fv(this.textureMatrixLocations[i], false, GLImmediate.matrix[t]);
                }
              }
            }
            if (GLImmediate.enabledClientAttributes[GLImmediate.COLOR]) {
              var colorAttr = clientAttributes[GLImmediate.COLOR];
              GLctx.vertexAttribPointer(this.colorLocation, colorAttr.size, colorAttr.type, true, GLImmediate.stride, colorAttr.offset);
              GLctx.enableVertexAttribArray(this.colorLocation);
            }
            else if (this.hasColor) {
              GLctx.disableVertexAttribArray(this.colorLocation);
              GLctx.vertexAttrib4fv(this.colorLocation, GLImmediate.clientColor);
            }
            if (this.hasFog) {
              if (this.fogColorLocation) GLctx.uniform4fv(this.fogColorLocation, GLEmulation.fogColor);
              if (this.fogEndLocation) GLctx.uniform1f(this.fogEndLocation, GLEmulation.fogEnd);
              if (this.fogScaleLocation) GLctx.uniform1f(this.fogScaleLocation, 1/(GLEmulation.fogEnd - GLEmulation.fogStart));
              if (this.fogDensityLocation) GLctx.uniform1f(this.fogDensityLocation, GLEmulation.fogDensity);
            }
          },
  
          cleanup: function cleanup() {
            GLctx.disableVertexAttribArray(this.positionLocation);
            if (this.hasTextures) {
              for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                if (GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0+i] && this.texCoordLocations[i] >= 0) {
                  GLctx.disableVertexAttribArray(this.texCoordLocations[i]);
                }
              }
            }
            if (this.hasColor) {
              GLctx.disableVertexAttribArray(this.colorLocation);
            }
            if (this.hasNormal) {
              GLctx.disableVertexAttribArray(this.normalLocation);
            }
            if (!GL.currProgram) {
              GLctx.useProgram(null);
              GLImmediate.fixedFunctionProgram = 0;
            }
            if (!GL.currArrayBuffer) {
              GLctx.bindBuffer(GLctx.ARRAY_BUFFER, null);
              GLImmediate.lastArrayBuffer = null;
            }
  
            GLImmediate.lastRenderer = null;
            GLImmediate.lastProgram = null;
            GLImmediate.matricesModified = true;
          }
        };
        ret.init();
        return ret;
      },setupFuncs:function () {
        // Replace some functions with immediate-mode aware versions. If there are no client
        // attributes enabled, and we use webgl-friendly modes (no GL_QUADS), then no need
        // for emulation
        _glDrawArrays = _emscripten_glDrawArrays = function _glDrawArrays(mode, first, count) {
          if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6) {
            GLctx.drawArrays(mode, first, count);
            return;
          }
          GLImmediate.prepareClientAttributes(count, false);
          GLImmediate.mode = mode;
          if (!GL.currArrayBuffer) {
            GLImmediate.vertexData = HEAPF32.subarray((GLImmediate.vertexPointer)>>2,(GLImmediate.vertexPointer + (first+count)*GLImmediate.stride)>>2); // XXX assuming float
            GLImmediate.firstVertex = first;
            GLImmediate.lastVertex = first + count;
          }
          GLImmediate.flush(null, first);
          GLImmediate.mode = -1;
        };
  
        _glDrawElements = _emscripten_glDrawElements = function _glDrawElements(mode, count, type, indices, start, end) { // start, end are given if we come from glDrawRangeElements
          if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6 && GL.currElementArrayBuffer) {
            GLctx.drawElements(mode, count, type, indices);
            return;
          }
          GLImmediate.prepareClientAttributes(count, false);
          GLImmediate.mode = mode;
          if (!GL.currArrayBuffer) {
            GLImmediate.firstVertex = end ? start : TOTAL_MEMORY; // if we don't know the start, set an invalid value and we will calculate it later from the indices
            GLImmediate.lastVertex = end ? end+1 : 0;
            GLImmediate.vertexData = HEAPF32.subarray((GLImmediate.vertexPointer)>>2,((end ? GLImmediate.vertexPointer + (end+1)*GLImmediate.stride : TOTAL_MEMORY))>>2); // XXX assuming float
          }
          GLImmediate.flush(count, 0, indices);
          GLImmediate.mode = -1;
        };
  
        // TexEnv stuff needs to be prepared early, so do it here.
        // init() is too late for -O2, since it freezes the GL functions
        // by that point.
        GLImmediate.MapTreeLib = GLImmediate.spawnMapTreeLib();
        GLImmediate.spawnMapTreeLib = null;
  
        GLImmediate.TexEnvJIT = GLImmediate.spawnTexEnvJIT();
        GLImmediate.spawnTexEnvJIT = null;
  
        GLImmediate.setupHooks();
      },setupHooks:function () {
        if (!GLEmulation.hasRunInit) {
          GLEmulation.init();
        }
  
        var glActiveTexture = _glActiveTexture;
        _glActiveTexture = _emscripten_glActiveTexture = function _glActiveTexture(texture) {
          GLImmediate.TexEnvJIT.hook_activeTexture(texture);
          glActiveTexture(texture);
        };
  
        var glEnable = _glEnable;
        _glEnable = _emscripten_glEnable = function _glEnable(cap) {
          GLImmediate.TexEnvJIT.hook_enable(cap);
          glEnable(cap);
        };
        var glDisable = _glDisable;
        _glDisable = _emscripten_glDisable = function _glDisable(cap) {
          GLImmediate.TexEnvJIT.hook_disable(cap);
          glDisable(cap);
        };
  
        var glTexEnvf = (typeof(_glTexEnvf) != 'undefined') ? _glTexEnvf : function(){};
        _glTexEnvf = _emscripten_glTexEnvf = function _glTexEnvf(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvf(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvf(target, pname, param);
        };
        var glTexEnvi = (typeof(_glTexEnvi) != 'undefined') ? _glTexEnvi : function(){};
        _glTexEnvi = _emscripten_glTexEnvi = function _glTexEnvi(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvi(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvi(target, pname, param);
        };
        var glTexEnvfv = (typeof(_glTexEnvfv) != 'undefined') ? _glTexEnvfv : function(){};
        _glTexEnvfv = _emscripten_glTexEnvfv = function _glTexEnvfv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvfv(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvfv(target, pname, param);
        };
  
        _glGetTexEnviv = function _glGetTexEnviv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_getTexEnviv(target, pname, param);
        };
  
        _glGetTexEnvfv = function _glGetTexEnvfv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_getTexEnvfv(target, pname, param);
        };
  
        var glGetIntegerv = _glGetIntegerv;
        _glGetIntegerv = _emscripten_glGetIntegerv = function _glGetIntegerv(pname, params) {
          switch (pname) {
            case 0x8B8D: { // GL_CURRENT_PROGRAM
              // Just query directly so we're working with WebGL objects.
              var cur = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
              if (cur == GLImmediate.fixedFunctionProgram) {
                // Pretend we're not using a program.
                HEAP32[((params)>>2)]=0;
                return;
              }
              break;
            }
          }
          glGetIntegerv(pname, params);
        };
      },initted:false,init:function () {
        Module.printErr('WARNING: using emscripten GL immediate mode emulation. This is very limited in what it supports');
        GLImmediate.initted = true;
  
        if (!Module.useWebGL) return; // a 2D canvas may be currently used TODO: make sure we are actually called in that case
  
        // User can override the maximum number of texture units that we emulate. Using fewer texture units increases runtime performance
        // slightly, so it is advantageous to choose as small value as needed.
        GLImmediate.MAX_TEXTURES = Module['GL_MAX_TEXTURE_IMAGE_UNITS'] || GLctx.getParameter(GLctx.MAX_TEXTURE_IMAGE_UNITS);
  
        GLImmediate.TexEnvJIT.init(GLctx, GLImmediate.MAX_TEXTURES);
  
        GLImmediate.NUM_ATTRIBUTES = 3 /*pos+normal+color attributes*/ + GLImmediate.MAX_TEXTURES;
        GLImmediate.clientAttributes = [];
        GLEmulation.enabledClientAttribIndices = [];
        for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
          GLImmediate.clientAttributes.push({});
          GLEmulation.enabledClientAttribIndices.push(false);
        }
  
        // Initialize matrix library
        // When user sets a matrix, increment a 'version number' on the new data, and when rendering, submit
        // the matrices to the shader program only if they have an old version of the data.
        GLImmediate.matrix = [];
        GLImmediate.matrixStack = [];
        GLImmediate.matrixVersion = [];
        for (var i = 0; i < 2 + GLImmediate.MAX_TEXTURES; i++) { // Modelview, Projection, plus one matrix for each texture coordinate.
          GLImmediate.matrixStack.push([]);
          GLImmediate.matrixVersion.push(0);
          GLImmediate.matrix.push(GLImmediate.matrixLib.mat4.create());
          GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[i]);
        }
  
        // Renderer cache
        GLImmediate.rendererCache = GLImmediate.MapTreeLib.create();
  
        // Buffers for data
        GLImmediate.tempData = new Float32Array(GL.MAX_TEMP_BUFFER_SIZE >> 2);
        GLImmediate.indexData = new Uint16Array(GL.MAX_TEMP_BUFFER_SIZE >> 1);
  
        GLImmediate.vertexDataU8 = new Uint8Array(GLImmediate.tempData.buffer);
  
        GL.generateTempBuffers(true);
  
        GLImmediate.clientColor = new Float32Array([1, 1, 1, 1]);
      },prepareClientAttributes:function prepareClientAttributes(count, beginEnd) {
        // If no client attributes were modified since we were last called, do nothing. Note that this
        // does not work for glBegin/End, where we generate renderer components dynamically and then
        // disable them ourselves, but it does help with glDrawElements/Arrays.
        if (!GLImmediate.modifiedClientAttributes) {
          GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4; // XXX assuming float
          return;
        }
        GLImmediate.modifiedClientAttributes = false;
  
        // The role of prepareClientAttributes is to examine the set of client-side vertex attribute buffers
        // that user code has submitted, and to prepare them to be uploaded to a VBO in GPU memory
        // (since WebGL does not support client-side rendering, i.e. rendering from vertex data in CPU memory)
        // User can submit vertex data generally in three different configurations:
        // 1. Fully planar: all attributes are in their own separate tightly-packed arrays in CPU memory.
        // 2. Fully interleaved: all attributes share a single array where data is interleaved something like (pos,uv,normal), (pos,uv,normal), ...
        // 3. Complex hybrid: Multiple separate arrays that either are sparsely strided, and/or partially interleave vertex attributes.
  
        // For simplicity, we support the case (2) as the fast case. For (1) and (3), we do a memory copy of the
        // vertex data here to prepare a relayouted buffer that is of the structure in case (2). The reason
        // for this is that it allows the emulation code to get away with using just one VBO buffer for rendering,
        // and not have to maintain multiple ones. Therefore cases (1) and (3) will be very slow, and case (2) is fast.
  
        // Detect which case we are in by using a quick heuristic by examining the strides of the buffers. If all the buffers have identical 
        // stride, we assume we have case (2), otherwise we have something more complex.
        var clientStartPointer = 0x7FFFFFFF;
        var bytes = 0; // Total number of bytes taken up by a single vertex.
        var minStride = 0x7FFFFFFF;
        var maxStride = 0;
        var attributes = GLImmediate.liveClientAttributes;
        attributes.length = 0;
        for (var i = 0; i < 3+GLImmediate.MAX_TEXTURES; i++) {
          if (GLImmediate.enabledClientAttributes[i]) {
            var attr = GLImmediate.clientAttributes[i];
            attributes.push(attr);
            clientStartPointer = Math.min(clientStartPointer, attr.pointer);
            attr.sizeBytes = attr.size * GL.byteSizeByType[attr.type - GL.byteSizeByTypeRoot];
            bytes += attr.sizeBytes;
            minStride = Math.min(minStride, attr.stride);
            maxStride = Math.max(maxStride, attr.stride);
          }
        }
  
        if ((minStride != maxStride || maxStride < bytes) && !beginEnd) {
          // We are in cases (1) or (3): slow path, shuffle the data around into a single interleaved vertex buffer.
          // The immediate-mode glBegin()/glEnd() vertex submission gets automatically generated in appropriate layout,
          // so never need to come down this path if that was used.
          if (!GLImmediate.restrideBuffer) GLImmediate.restrideBuffer = _malloc(GL.MAX_TEMP_BUFFER_SIZE);
          var start = GLImmediate.restrideBuffer;
          bytes = 0;
          // calculate restrided offsets and total size
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var size = attr.sizeBytes;
            if (size % 4 != 0) size += 4 - (size % 4); // align everything
            attr.offset = bytes;
            bytes += size;
          }
          // copy out the data (we need to know the stride for that, and define attr.pointer)
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var srcStride = Math.max(attr.sizeBytes, attr.stride);
            if ((srcStride & 3) == 0 && (attr.sizeBytes & 3) == 0) {
              var size4 = attr.sizeBytes>>2;
              var srcStride4 = Math.max(attr.sizeBytes, attr.stride)>>2;
              for (var j = 0; j < count; j++) {
                for (var k = 0; k < size4; k++) { // copy in chunks of 4 bytes, our alignment makes this possible
                  HEAP32[((start + attr.offset + bytes*j)>>2) + k] = HEAP32[(attr.pointer>>2) + j*srcStride4 + k];
                }
              }
            } else {
              for (var j = 0; j < count; j++) {
                for (var k = 0; k < attr.sizeBytes; k++) { // source data was not aligned to multiples of 4, must copy byte by byte.
                  HEAP8[start + attr.offset + bytes*j + k] = HEAP8[attr.pointer + j*srcStride + k];
                }
              }
            }
            attr.pointer = start + attr.offset;
          }
          GLImmediate.stride = bytes;
          GLImmediate.vertexPointer = start;
        } else {
          // case (2): fast path, all data is interleaved to a single vertex array so we can get away with a single VBO upload.
          if (GL.currArrayBuffer) {
            GLImmediate.vertexPointer = 0;
          } else {
            GLImmediate.vertexPointer = clientStartPointer;
          }
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            attr.offset = attr.pointer - GLImmediate.vertexPointer; // Compute what will be the offset of this attribute in the VBO after we upload.
          }
          GLImmediate.stride = Math.max(maxStride, bytes);
        }
        if (!beginEnd) {
          GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4; // XXX assuming float
        }
      },flush:function flush(numProvidedIndexes, startIndex, ptr) {
        startIndex = startIndex || 0;
        ptr = ptr || 0;
  
        var renderer = GLImmediate.getRenderer();
  
        // Generate index data in a format suitable for GLES 2.0/WebGL
        var numVertexes = 4 * GLImmediate.vertexCounter / GLImmediate.stride;
        var emulatedElementArrayBuffer = false;
        var numIndexes = 0;
        if (numProvidedIndexes) {
          numIndexes = numProvidedIndexes;
          if (!GL.currArrayBuffer && GLImmediate.firstVertex > GLImmediate.lastVertex) {
            // Figure out the first and last vertex from the index data
            for (var i = 0; i < numProvidedIndexes; i++) {
              var currIndex = HEAPU16[(((ptr)+(i*2))>>1)];
              GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, currIndex);
              GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, currIndex+1);
            }
          }
          if (!GL.currElementArrayBuffer) {
            // If no element array buffer is bound, then indices is a literal pointer to clientside data
            var indexBuffer = GL.getTempIndexBuffer(numProvidedIndexes << 1);
            GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
            GLctx.bufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, HEAPU16.subarray((ptr)>>1,(ptr + (numProvidedIndexes << 1))>>1));
            ptr = 0;
            emulatedElementArrayBuffer = true;
          }
        } else if (GLImmediate.mode > 6) { // above GL_TRIANGLE_FAN are the non-GL ES modes
          if (GLImmediate.mode != 7) throw 'unsupported immediate mode ' + GLImmediate.mode; // GL_QUADS
          // GLImmediate.firstVertex is the first vertex we want. Quad indexes are in the pattern
          // 0 1 2, 0 2 3, 4 5 6, 4 6 7, so we need to look at index firstVertex * 1.5 to see it.
          // Then since indexes are 2 bytes each, that means 3
          ptr = GLImmediate.firstVertex*3;
          var numQuads = numVertexes / 4;
          numIndexes = numQuads * 6; // 0 1 2, 0 2 3 pattern
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.tempQuadIndexBuffer);
          emulatedElementArrayBuffer = true;
        }
  
        renderer.prepare();
  
        if (numIndexes) {
          GLctx.drawElements(GLctx.TRIANGLES, numIndexes, GLctx.UNSIGNED_SHORT, ptr);
        } else {
          GLctx.drawArrays(GLImmediate.mode, startIndex, numVertexes);
        }
  
        if (emulatedElementArrayBuffer) {
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.buffers[GL.currElementArrayBuffer] || null);
        }
  
      }};
  GLImmediate.matrixLib = (function() {
  
  /**
   * @fileoverview gl-matrix - High performance matrix and vector operations for WebGL
   * @author Brandon Jones
   * @version 1.2.4
   */
  
  // Modifed for emscripten: Global scoping etc.
  
  /*
   * Copyright (c) 2011 Brandon Jones
   *
   * This software is provided 'as-is', without any express or implied
   * warranty. In no event will the authors be held liable for any damages
   * arising from the use of this software.
   *
   * Permission is granted to anyone to use this software for any purpose,
   * including commercial applications, and to alter it and redistribute it
   * freely, subject to the following restrictions:
   *
   *    1. The origin of this software must not be misrepresented; you must not
   *    claim that you wrote the original software. If you use this software
   *    in a product, an acknowledgment in the product documentation would be
   *    appreciated but is not required.
   *
   *    2. Altered source versions must be plainly marked as such, and must not
   *    be misrepresented as being the original software.
   *
   *    3. This notice may not be removed or altered from any source
   *    distribution.
   */
  
  
  /**
   * @class 3 Dimensional Vector
   * @name vec3
   */
  var vec3 = {};
  
  /**
   * @class 3x3 Matrix
   * @name mat3
   */
  var mat3 = {};
  
  /**
   * @class 4x4 Matrix
   * @name mat4
   */
  var mat4 = {};
  
  /**
   * @class Quaternion
   * @name quat4
   */
  var quat4 = {};
  
  var MatrixArray = Float32Array;
  
  /*
   * vec3
   */
   
  /**
   * Creates a new instance of a vec3 using the default array type
   * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
   *
   * @param {vec3} [vec] vec3 containing values to initialize with
   *
   * @returns {vec3} New vec3
   */
  vec3.create = function (vec) {
      var dest = new MatrixArray(3);
  
      if (vec) {
          dest[0] = vec[0];
          dest[1] = vec[1];
          dest[2] = vec[2];
      } else {
          dest[0] = dest[1] = dest[2] = 0;
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one vec3 to another
   *
   * @param {vec3} vec vec3 containing values to copy
   * @param {vec3} dest vec3 receiving copied values
   *
   * @returns {vec3} dest
   */
  vec3.set = function (vec, dest) {
      dest[0] = vec[0];
      dest[1] = vec[1];
      dest[2] = vec[2];
  
      return dest;
  };
  
  /**
   * Performs a vector addition
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.add = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] += vec2[0];
          vec[1] += vec2[1];
          vec[2] += vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] + vec2[0];
      dest[1] = vec[1] + vec2[1];
      dest[2] = vec[2] + vec2[2];
      return dest;
  };
  
  /**
   * Performs a vector subtraction
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.subtract = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] -= vec2[0];
          vec[1] -= vec2[1];
          vec[2] -= vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] - vec2[0];
      dest[1] = vec[1] - vec2[1];
      dest[2] = vec[2] - vec2[2];
      return dest;
  };
  
  /**
   * Performs a vector multiplication
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.multiply = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] *= vec2[0];
          vec[1] *= vec2[1];
          vec[2] *= vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] * vec2[0];
      dest[1] = vec[1] * vec2[1];
      dest[2] = vec[2] * vec2[2];
      return dest;
  };
  
  /**
   * Negates the components of a vec3
   *
   * @param {vec3} vec vec3 to negate
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.negate = function (vec, dest) {
      if (!dest) { dest = vec; }
  
      dest[0] = -vec[0];
      dest[1] = -vec[1];
      dest[2] = -vec[2];
      return dest;
  };
  
  /**
   * Multiplies the components of a vec3 by a scalar value
   *
   * @param {vec3} vec vec3 to scale
   * @param {number} val Value to scale by
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.scale = function (vec, val, dest) {
      if (!dest || vec === dest) {
          vec[0] *= val;
          vec[1] *= val;
          vec[2] *= val;
          return vec;
      }
  
      dest[0] = vec[0] * val;
      dest[1] = vec[1] * val;
      dest[2] = vec[2] * val;
      return dest;
  };
  
  /**
   * Generates a unit vector of the same direction as the provided vec3
   * If vector length is 0, returns [0, 0, 0]
   *
   * @param {vec3} vec vec3 to normalize
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.normalize = function (vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          len = Math.sqrt(x * x + y * y + z * z);
  
      if (!len) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          return dest;
      } else if (len === 1) {
          dest[0] = x;
          dest[1] = y;
          dest[2] = z;
          return dest;
      }
  
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      return dest;
  };
  
  /**
   * Generates the cross product of two vec3s
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.cross = function (vec, vec2, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
  
      dest[0] = y * z2 - z * y2;
      dest[1] = z * x2 - x * z2;
      dest[2] = x * y2 - y * x2;
      return dest;
  };
  
  /**
   * Caclulates the length of a vec3
   *
   * @param {vec3} vec vec3 to calculate length of
   *
   * @returns {number} Length of vec
   */
  vec3.length = function (vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      return Math.sqrt(x * x + y * y + z * z);
  };
  
  /**
   * Caclulates the dot product of two vec3s
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   *
   * @returns {number} Dot product of vec and vec2
   */
  vec3.dot = function (vec, vec2) {
      return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
  };
  
  /**
   * Generates a unit vector pointing from one vector to another
   *
   * @param {vec3} vec Origin vec3
   * @param {vec3} vec2 vec3 to point to
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.direction = function (vec, vec2, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0] - vec2[0],
          y = vec[1] - vec2[1],
          z = vec[2] - vec2[2],
          len = Math.sqrt(x * x + y * y + z * z);
  
      if (!len) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          return dest;
      }
  
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      return dest;
  };
  
  /**
   * Performs a linear interpolation between two vec3
   *
   * @param {vec3} vec First vector
   * @param {vec3} vec2 Second vector
   * @param {number} lerp Interpolation amount between the two inputs
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.lerp = function (vec, vec2, lerp, dest) {
      if (!dest) { dest = vec; }
  
      dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
      dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
      dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
  
      return dest;
  };
  
  /**
   * Calculates the euclidian distance between two vec3
   *
   * Params:
   * @param {vec3} vec First vector
   * @param {vec3} vec2 Second vector
   *
   * @returns {number} Distance between vec and vec2
   */
  vec3.dist = function (vec, vec2) {
      var x = vec2[0] - vec[0],
          y = vec2[1] - vec[1],
          z = vec2[2] - vec[2];
          
      return Math.sqrt(x*x + y*y + z*z);
  };
  
  /**
   * Projects the specified vec3 from screen space into object space
   * Based on the <a href="http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup">Mesa gluUnProject implementation</a>
   *
   * @param {vec3} vec Screen-space vector to project
   * @param {mat4} view View matrix
   * @param {mat4} proj Projection matrix
   * @param {vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
   * @param {vec3} [dest] vec3 receiving unprojected result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.unproject = function (vec, view, proj, viewport, dest) {
      if (!dest) { dest = vec; }
  
      var m = mat4.create();
      var v = new MatrixArray(4);
      
      v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
      v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
      v[2] = 2.0 * vec[2] - 1.0;
      v[3] = 1.0;
      
      mat4.multiply(proj, view, m);
      if(!mat4.inverse(m)) { return null; }
      
      mat4.multiplyVec4(m, v);
      if(v[3] === 0.0) { return null; }
  
      dest[0] = v[0] / v[3];
      dest[1] = v[1] / v[3];
      dest[2] = v[2] / v[3];
      
      return dest;
  };
  
  /**
   * Returns a string representation of a vector
   *
   * @param {vec3} vec Vector to represent as a string
   *
   * @returns {string} String representation of vec
   */
  vec3.str = function (vec) {
      return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
  };
  
  /*
   * mat3
   */
  
  /**
   * Creates a new instance of a mat3 using the default array type
   * Any javascript array-like object containing at least 9 numeric elements can serve as a mat3
   *
   * @param {mat3} [mat] mat3 containing values to initialize with
   *
   * @returns {mat3} New mat3
   */
  mat3.create = function (mat) {
      var dest = new MatrixArray(9);
  
      if (mat) {
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
          dest[8] = mat[8];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one mat3 to another
   *
   * @param {mat3} mat mat3 containing values to copy
   * @param {mat3} dest mat3 receiving copied values
   *
   * @returns {mat3} dest
   */
  mat3.set = function (mat, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      return dest;
  };
  
  /**
   * Sets a mat3 to an identity matrix
   *
   * @param {mat3} dest mat3 to set
   *
   * @returns dest if specified, otherwise a new mat3
   */
  mat3.identity = function (dest) {
      if (!dest) { dest = mat3.create(); }
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 1;
      dest[5] = 0;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 1;
      return dest;
  };
  
  /**
   * Transposes a mat3 (flips the values over the diagonal)
   *
   * Params:
   * @param {mat3} mat mat3 to transpose
   * @param {mat3} [dest] mat3 receiving transposed values. If not specified result is written to mat
   *
   * @returns {mat3} dest is specified, mat otherwise
   */
  mat3.transpose = function (mat, dest) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (!dest || mat === dest) {
          var a01 = mat[1], a02 = mat[2],
              a12 = mat[5];
  
          mat[1] = mat[3];
          mat[2] = mat[6];
          mat[3] = a01;
          mat[5] = mat[7];
          mat[6] = a02;
          mat[7] = a12;
          return mat;
      }
  
      dest[0] = mat[0];
      dest[1] = mat[3];
      dest[2] = mat[6];
      dest[3] = mat[1];
      dest[4] = mat[4];
      dest[5] = mat[7];
      dest[6] = mat[2];
      dest[7] = mat[5];
      dest[8] = mat[8];
      return dest;
  };
  
  /**
   * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
   *
   * @param {mat3} mat mat3 containing values to copy
   * @param {mat4} [dest] mat4 receiving copied values
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat3.toMat4 = function (mat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      dest[15] = 1;
      dest[14] = 0;
      dest[13] = 0;
      dest[12] = 0;
  
      dest[11] = 0;
      dest[10] = mat[8];
      dest[9] = mat[7];
      dest[8] = mat[6];
  
      dest[7] = 0;
      dest[6] = mat[5];
      dest[5] = mat[4];
      dest[4] = mat[3];
  
      dest[3] = 0;
      dest[2] = mat[2];
      dest[1] = mat[1];
      dest[0] = mat[0];
  
      return dest;
  };
  
  /**
   * Returns a string representation of a mat3
   *
   * @param {mat3} mat mat3 to represent as a string
   *
   * @param {string} String representation of mat
   */
  mat3.str = function (mat) {
      return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
          ', ' + mat[3] + ', ' + mat[4] + ', ' + mat[5] +
          ', ' + mat[6] + ', ' + mat[7] + ', ' + mat[8] + ']';
  };
  
  /*
   * mat4
   */
  
  /**
   * Creates a new instance of a mat4 using the default array type
   * Any javascript array-like object containing at least 16 numeric elements can serve as a mat4
   *
   * @param {mat4} [mat] mat4 containing values to initialize with
   *
   * @returns {mat4} New mat4
   */
  mat4.create = function (mat) {
      var dest = new MatrixArray(16);
  
      if (mat) {
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
          dest[8] = mat[8];
          dest[9] = mat[9];
          dest[10] = mat[10];
          dest[11] = mat[11];
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one mat4 to another
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat4} dest mat4 receiving copied values
   *
   * @returns {mat4} dest
   */
  mat4.set = function (mat, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Sets a mat4 to an identity matrix
   *
   * @param {mat4} dest mat4 to set
   *
   * @returns {mat4} dest
   */
  mat4.identity = function (dest) {
      if (!dest) { dest = mat4.create(); }
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 1;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = 1;
      dest[11] = 0;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
      return dest;
  };
  
  /**
   * Transposes a mat4 (flips the values over the diagonal)
   *
   * @param {mat4} mat mat4 to transpose
   * @param {mat4} [dest] mat4 receiving transposed values. If not specified result is written to mat
   *
   * @param {mat4} dest is specified, mat otherwise
   */
  mat4.transpose = function (mat, dest) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (!dest || mat === dest) {
          var a01 = mat[1], a02 = mat[2], a03 = mat[3],
              a12 = mat[6], a13 = mat[7],
              a23 = mat[11];
  
          mat[1] = mat[4];
          mat[2] = mat[8];
          mat[3] = mat[12];
          mat[4] = a01;
          mat[6] = mat[9];
          mat[7] = mat[13];
          mat[8] = a02;
          mat[9] = a12;
          mat[11] = mat[14];
          mat[12] = a03;
          mat[13] = a13;
          mat[14] = a23;
          return mat;
      }
  
      dest[0] = mat[0];
      dest[1] = mat[4];
      dest[2] = mat[8];
      dest[3] = mat[12];
      dest[4] = mat[1];
      dest[5] = mat[5];
      dest[6] = mat[9];
      dest[7] = mat[13];
      dest[8] = mat[2];
      dest[9] = mat[6];
      dest[10] = mat[10];
      dest[11] = mat[14];
      dest[12] = mat[3];
      dest[13] = mat[7];
      dest[14] = mat[11];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Calculates the determinant of a mat4
   *
   * @param {mat4} mat mat4 to calculate determinant of
   *
   * @returns {number} determinant of mat
   */
  mat4.determinant = function (mat) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
  
      return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
              a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
              a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
              a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
              a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
              a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
  };
  
  /**
   * Calculates the inverse matrix of a mat4
   *
   * @param {mat4} mat mat4 to calculate inverse of
   * @param {mat4} [dest] mat4 receiving inverse matrix. If not specified result is written to mat
   *
   * @param {mat4} dest is specified, mat otherwise, null if matrix cannot be inverted
   */
  mat4.inverse = function (mat, dest) {
      if (!dest) { dest = mat; }
  
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
  
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
  
          d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
          invDet;
  
          // Calculate the determinant
          if (!d) { return null; }
          invDet = 1 / d;
  
      dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
      dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
      dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
      dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
      dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
      dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
      dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
      dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
      dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
      dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
      dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
      dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
      dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
      dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
      dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
      dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
  
      return dest;
  };
  
  /**
   * Copies the upper 3x3 elements of a mat4 into another mat4
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat4} [dest] mat4 receiving copied values
   *
   * @returns {mat4} dest is specified, a new mat4 otherwise
   */
  mat4.toRotationMat = function (mat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Copies the upper 3x3 elements of a mat4 into a mat3
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat3} [dest] mat3 receiving copied values
   *
   * @returns {mat3} dest is specified, a new mat3 otherwise
   */
  mat4.toMat3 = function (mat, dest) {
      if (!dest) { dest = mat3.create(); }
  
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[4];
      dest[4] = mat[5];
      dest[5] = mat[6];
      dest[6] = mat[8];
      dest[7] = mat[9];
      dest[8] = mat[10];
  
      return dest;
  };
  
  /**
   * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
   * The resulting matrix is useful for calculating transformed normals
   *
   * Params:
   * @param {mat4} mat mat4 containing values to invert and copy
   * @param {mat3} [dest] mat3 receiving values
   *
   * @returns {mat3} dest is specified, a new mat3 otherwise, null if the matrix cannot be inverted
   */
  mat4.toInverseMat3 = function (mat, dest) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2],
          a10 = mat[4], a11 = mat[5], a12 = mat[6],
          a20 = mat[8], a21 = mat[9], a22 = mat[10],
  
          b01 = a22 * a11 - a12 * a21,
          b11 = -a22 * a10 + a12 * a20,
          b21 = a21 * a10 - a11 * a20,
  
          d = a00 * b01 + a01 * b11 + a02 * b21,
          id;
  
      if (!d) { return null; }
      id = 1 / d;
  
      if (!dest) { dest = mat3.create(); }
  
      dest[0] = b01 * id;
      dest[1] = (-a22 * a01 + a02 * a21) * id;
      dest[2] = (a12 * a01 - a02 * a11) * id;
      dest[3] = b11 * id;
      dest[4] = (a22 * a00 - a02 * a20) * id;
      dest[5] = (-a12 * a00 + a02 * a10) * id;
      dest[6] = b21 * id;
      dest[7] = (-a21 * a00 + a01 * a20) * id;
      dest[8] = (a11 * a00 - a01 * a10) * id;
  
      return dest;
  };
  
  /**
   * Performs a matrix multiplication
   *
   * @param {mat4} mat First operand
   * @param {mat4} mat2 Second operand
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.multiply = function (mat, mat2, dest) {
      if (!dest) { dest = mat; }
  
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
  
          b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3],
          b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7],
          b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11],
          b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
  
      dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
      dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
      dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
      dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
      dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
      dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
      dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
      dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
      dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
      dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
      dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
      dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
      dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
      dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
      dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
      dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  
      return dest;
  };
  
  /**
   * Transforms a vec3 with the given matrix
   * 4th vector component is implicitly '1'
   *
   * @param {mat4} mat mat4 to transform the vector with
   * @param {vec3} vec vec3 to transform
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  mat4.multiplyVec3 = function (mat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2];
  
      dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
      dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
      dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
  
      return dest;
  };
  
  /**
   * Transforms a vec4 with the given matrix
   *
   * @param {mat4} mat mat4 to transform the vector with
   * @param {vec4} vec vec4 to transform
   * @param {vec4} [dest] vec4 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec4} dest if specified, vec otherwise
   */
  mat4.multiplyVec4 = function (mat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
  
      dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
      dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
      dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
      dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
  
      return dest;
  };
  
  /**
   * Translates a matrix by the given vector
   *
   * @param {mat4} mat mat4 to translate
   * @param {vec3} vec vec3 specifying the translation
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.translate = function (mat, vec, dest) {
      var x = vec[0], y = vec[1], z = vec[2],
          a00, a01, a02, a03,
          a10, a11, a12, a13,
          a20, a21, a22, a23;
  
      if (!dest || mat === dest) {
          mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
          mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
          mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
          mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
          return mat;
      }
  
      a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
      a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
      a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
  
      dest[0] = a00; dest[1] = a01; dest[2] = a02; dest[3] = a03;
      dest[4] = a10; dest[5] = a11; dest[6] = a12; dest[7] = a13;
      dest[8] = a20; dest[9] = a21; dest[10] = a22; dest[11] = a23;
  
      dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
      dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
      dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
      dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
      return dest;
  };
  
  /**
   * Scales a matrix by the given vector
   *
   * @param {mat4} mat mat4 to scale
   * @param {vec3} vec vec3 specifying the scale for each axis
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @param {mat4} dest if specified, mat otherwise
   */
  mat4.scale = function (mat, vec, dest) {
      var x = vec[0], y = vec[1], z = vec[2];
  
      if (!dest || mat === dest) {
          mat[0] *= x;
          mat[1] *= x;
          mat[2] *= x;
          mat[3] *= x;
          mat[4] *= y;
          mat[5] *= y;
          mat[6] *= y;
          mat[7] *= y;
          mat[8] *= z;
          mat[9] *= z;
          mat[10] *= z;
          mat[11] *= z;
          return mat;
      }
  
      dest[0] = mat[0] * x;
      dest[1] = mat[1] * x;
      dest[2] = mat[2] * x;
      dest[3] = mat[3] * x;
      dest[4] = mat[4] * y;
      dest[5] = mat[5] * y;
      dest[6] = mat[6] * y;
      dest[7] = mat[7] * y;
      dest[8] = mat[8] * z;
      dest[9] = mat[9] * z;
      dest[10] = mat[10] * z;
      dest[11] = mat[11] * z;
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the specified axis
   * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {vec3} axis vec3 representing the axis to rotate around 
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotate = function (mat, angle, axis, dest) {
      var x = axis[0], y = axis[1], z = axis[2],
          len = Math.sqrt(x * x + y * y + z * z),
          s, c, t,
          a00, a01, a02, a03,
          a10, a11, a12, a13,
          a20, a21, a22, a23,
          b00, b01, b02,
          b10, b11, b12,
          b20, b21, b22;
  
      if (!len) { return null; }
      if (len !== 1) {
          len = 1 / len;
          x *= len;
          y *= len;
          z *= len;
      }
  
      s = Math.sin(angle);
      c = Math.cos(angle);
      t = 1 - c;
  
      a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
      a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
      a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
  
      // Construct the elements of the rotation matrix
      b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
      b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
      b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform rotation-specific matrix multiplication
      dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
      dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
      dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
      dest[3] = a03 * b00 + a13 * b01 + a23 * b02;
  
      dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
      dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
      dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
      dest[7] = a03 * b10 + a13 * b11 + a23 * b12;
  
      dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
      dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
      dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
      dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotateX = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a10 = mat[4],
          a11 = mat[5],
          a12 = mat[6],
          a13 = mat[7],
          a20 = mat[8],
          a21 = mat[9],
          a22 = mat[10],
          a23 = mat[11];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[4] = a10 * c + a20 * s;
      dest[5] = a11 * c + a21 * s;
      dest[6] = a12 * c + a22 * s;
      dest[7] = a13 * c + a23 * s;
  
      dest[8] = a10 * -s + a20 * c;
      dest[9] = a11 * -s + a21 * c;
      dest[10] = a12 * -s + a22 * c;
      dest[11] = a13 * -s + a23 * c;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotateY = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a00 = mat[0],
          a01 = mat[1],
          a02 = mat[2],
          a03 = mat[3],
          a20 = mat[8],
          a21 = mat[9],
          a22 = mat[10],
          a23 = mat[11];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[0] = a00 * c + a20 * -s;
      dest[1] = a01 * c + a21 * -s;
      dest[2] = a02 * c + a22 * -s;
      dest[3] = a03 * c + a23 * -s;
  
      dest[8] = a00 * s + a20 * c;
      dest[9] = a01 * s + a21 * c;
      dest[10] = a02 * s + a22 * c;
      dest[11] = a03 * s + a23 * c;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   *
   * @returns {mat4} dest if specified, mat otherwise
   */
  mat4.rotateZ = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a00 = mat[0],
          a01 = mat[1],
          a02 = mat[2],
          a03 = mat[3],
          a10 = mat[4],
          a11 = mat[5],
          a12 = mat[6],
          a13 = mat[7];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
          dest[8] = mat[8];
          dest[9] = mat[9];
          dest[10] = mat[10];
          dest[11] = mat[11];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[0] = a00 * c + a10 * s;
      dest[1] = a01 * c + a11 * s;
      dest[2] = a02 * c + a12 * s;
      dest[3] = a03 * c + a13 * s;
  
      dest[4] = a00 * -s + a10 * c;
      dest[5] = a01 * -s + a11 * c;
      dest[6] = a02 * -s + a12 * c;
      dest[7] = a03 * -s + a13 * c;
  
      return dest;
  };
  
  /**
   * Generates a frustum matrix with the given bounds
   *
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.frustum = function (left, right, bottom, top, near, far, dest) {
      if (!dest) { dest = mat4.create(); }
      var rl = (right - left),
          tb = (top - bottom),
          fn = (far - near);
      dest[0] = (near * 2) / rl;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = (near * 2) / tb;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = (right + left) / rl;
      dest[9] = (top + bottom) / tb;
      dest[10] = -(far + near) / fn;
      dest[11] = -1;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = -(far * near * 2) / fn;
      dest[15] = 0;
      return dest;
  };
  
  /**
   * Generates a perspective projection matrix with the given bounds
   *
   * @param {number} fovy Vertical field of view
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.perspective = function (fovy, aspect, near, far, dest) {
      var top = near * Math.tan(fovy * Math.PI / 360.0),
          right = top * aspect;
      return mat4.frustum(-right, right, -top, top, near, far, dest);
  };
  
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.ortho = function (left, right, bottom, top, near, far, dest) {
      if (!dest) { dest = mat4.create(); }
      var rl = (right - left),
          tb = (top - bottom),
          fn = (far - near);
      dest[0] = 2 / rl;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 2 / tb;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = -2 / fn;
      dest[11] = 0;
      dest[12] = -(left + right) / rl;
      dest[13] = -(top + bottom) / tb;
      dest[14] = -(far + near) / fn;
      dest[15] = 1;
      return dest;
  };
  
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis
   *
   * @param {vec3} eye Position of the viewer
   * @param {vec3} center Point the viewer is looking at
   * @param {vec3} up vec3 pointing "up"
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.lookAt = function (eye, center, up, dest) {
      if (!dest) { dest = mat4.create(); }
  
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
          eyex = eye[0],
          eyey = eye[1],
          eyez = eye[2],
          upx = up[0],
          upy = up[1],
          upz = up[2],
          centerx = center[0],
          centery = center[1],
          centerz = center[2];
  
      if (eyex === centerx && eyey === centery && eyez === centerz) {
          return mat4.identity(dest);
      }
  
      //vec3.direction(eye, center, z);
      z0 = eyex - centerx;
      z1 = eyey - centery;
      z2 = eyez - centerz;
  
      // normalize (no check needed for 0 because of early return)
      len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;
  
      //vec3.normalize(vec3.cross(up, z, x));
      x0 = upy * z2 - upz * z1;
      x1 = upz * z0 - upx * z2;
      x2 = upx * z1 - upy * z0;
      len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
      if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
      } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
      }
  
      //vec3.normalize(vec3.cross(z, x, y));
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
  
      len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
      if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
      } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
      }
  
      dest[0] = x0;
      dest[1] = y0;
      dest[2] = z0;
      dest[3] = 0;
      dest[4] = x1;
      dest[5] = y1;
      dest[6] = z1;
      dest[7] = 0;
      dest[8] = x2;
      dest[9] = y2;
      dest[10] = z2;
      dest[11] = 0;
      dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
      dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
      dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     var quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * @param {quat4} quat Rotation quaternion
   * @param {vec3} vec Translation vector
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to a new mat4
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.fromRotationTranslation = function (quat, vec, dest) {
      if (!dest) { dest = mat4.create(); }
  
      // Quaternion math
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
      dest[12] = vec[0];
      dest[13] = vec[1];
      dest[14] = vec[2];
      dest[15] = 1;
      
      return dest;
  };
  
  /**
   * Returns a string representation of a mat4
   *
   * @param {mat4} mat mat4 to represent as a string
   *
   * @returns {string} String representation of mat
   */
  mat4.str = function (mat) {
      return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] +
          ', ' + mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] +
          ', ' + mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] +
          ', ' + mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
  };
  
  /*
   * quat4
   */
  
  /**
   * Creates a new instance of a quat4 using the default array type
   * Any javascript array containing at least 4 numeric elements can serve as a quat4
   *
   * @param {quat4} [quat] quat4 containing values to initialize with
   *
   * @returns {quat4} New quat4
   */
  quat4.create = function (quat) {
      var dest = new MatrixArray(4);
  
      if (quat) {
          dest[0] = quat[0];
          dest[1] = quat[1];
          dest[2] = quat[2];
          dest[3] = quat[3];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one quat4 to another
   *
   * @param {quat4} quat quat4 containing values to copy
   * @param {quat4} dest quat4 receiving copied values
   *
   * @returns {quat4} dest
   */
  quat4.set = function (quat, dest) {
      dest[0] = quat[0];
      dest[1] = quat[1];
      dest[2] = quat[2];
      dest[3] = quat[3];
  
      return dest;
  };
  
  /**
   * Calculates the W component of a quat4 from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length. 
   * Any existing W component will be ignored. 
   *
   * @param {quat4} quat quat4 to calculate W component of
   * @param {quat4} [dest] quat4 receiving calculated values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.calculateW = function (quat, dest) {
      var x = quat[0], y = quat[1], z = quat[2];
  
      if (!dest || quat === dest) {
          quat[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
          return quat;
      }
      dest[0] = x;
      dest[1] = y;
      dest[2] = z;
      dest[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
      return dest;
  };
  
  /**
   * Calculates the dot product of two quaternions
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   *
   * @return {number} Dot product of quat and quat2
   */
  quat4.dot = function(quat, quat2){
      return quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];
  };
  
  /**
   * Calculates the inverse of a quat4
   *
   * @param {quat4} quat quat4 to calculate inverse of
   * @param {quat4} [dest] quat4 receiving inverse values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.inverse = function(quat, dest) {
      var q0 = quat[0], q1 = quat[1], q2 = quat[2], q3 = quat[3],
          dot = q0*q0 + q1*q1 + q2*q2 + q3*q3,
          invDot = dot ? 1.0/dot : 0;
      
      // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
      
      if(!dest || quat === dest) {
          quat[0] *= -invDot;
          quat[1] *= -invDot;
          quat[2] *= -invDot;
          quat[3] *= invDot;
          return quat;
      }
      dest[0] = -quat[0]*invDot;
      dest[1] = -quat[1]*invDot;
      dest[2] = -quat[2]*invDot;
      dest[3] = quat[3]*invDot;
      return dest;
  };
  
  
  /**
   * Calculates the conjugate of a quat4
   * If the quaternion is normalized, this function is faster than quat4.inverse and produces the same result.
   *
   * @param {quat4} quat quat4 to calculate conjugate of
   * @param {quat4} [dest] quat4 receiving conjugate values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.conjugate = function (quat, dest) {
      if (!dest || quat === dest) {
          quat[0] *= -1;
          quat[1] *= -1;
          quat[2] *= -1;
          return quat;
      }
      dest[0] = -quat[0];
      dest[1] = -quat[1];
      dest[2] = -quat[2];
      dest[3] = quat[3];
      return dest;
  };
  
  /**
   * Calculates the length of a quat4
   *
   * Params:
   * @param {quat4} quat quat4 to calculate length of
   *
   * @returns Length of quat
   */
  quat4.length = function (quat) {
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
      return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  
  /**
   * Generates a unit quaternion of the same direction as the provided quat4
   * If quaternion length is 0, returns [0, 0, 0, 0]
   *
   * @param {quat4} quat quat4 to normalize
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.normalize = function (quat, dest) {
      if (!dest) { dest = quat; }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          len = Math.sqrt(x * x + y * y + z * z + w * w);
      if (len === 0) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          dest[3] = 0;
          return dest;
      }
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      dest[3] = w * len;
  
      return dest;
  };
  
  /**
   * Performs quaternion addition
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.add = function (quat, quat2, dest) {
      if(!dest || quat === dest) {
          quat[0] += quat2[0];
          quat[1] += quat2[1];
          quat[2] += quat2[2];
          quat[3] += quat2[3];
          return quat;
      }
      dest[0] = quat[0]+quat2[0];
      dest[1] = quat[1]+quat2[1];
      dest[2] = quat[2]+quat2[2];
      dest[3] = quat[3]+quat2[3];
      return dest;
  };
  
  /**
   * Performs a quaternion multiplication
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.multiply = function (quat, quat2, dest) {
      if (!dest) { dest = quat; }
  
      var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3],
          qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
  
      dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
  
      return dest;
  };
  
  /**
   * Transforms a vec3 with the given quaternion
   *
   * @param {quat4} quat quat4 to transform the vector with
   * @param {vec3} vec vec3 to transform
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns dest if specified, vec otherwise
   */
  quat4.multiplyVec3 = function (quat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],
  
          // calculate quat * vec
          ix = qw * x + qy * z - qz * y,
          iy = qw * y + qz * x - qx * z,
          iz = qw * z + qx * y - qy * x,
          iw = -qx * x - qy * y - qz * z;
  
      // calculate result * inverse quat
      dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  
      return dest;
  };
  
  /**
   * Multiplies the components of a quaternion by a scalar value
   *
   * @param {quat4} quat to scale
   * @param {number} val Value to scale by
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.scale = function (quat, val, dest) {
      if(!dest || quat === dest) {
          quat[0] *= val;
          quat[1] *= val;
          quat[2] *= val;
          quat[3] *= val;
          return quat;
      }
      dest[0] = quat[0]*val;
      dest[1] = quat[1]*val;
      dest[2] = quat[2]*val;
      dest[3] = quat[3]*val;
      return dest;
  };
  
  /**
   * Calculates a 3x3 matrix from the given quat4
   *
   * @param {quat4} quat quat4 to create matrix from
   * @param {mat3} [dest] mat3 receiving operation result
   *
   * @returns {mat3} dest if specified, a new mat3 otherwise
   */
  quat4.toMat3 = function (quat, dest) {
      if (!dest) { dest = mat3.create(); }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
  
      dest[3] = xy - wz;
      dest[4] = 1 - (xx + zz);
      dest[5] = yz + wx;
  
      dest[6] = xz + wy;
      dest[7] = yz - wx;
      dest[8] = 1 - (xx + yy);
  
      return dest;
  };
  
  /**
   * Calculates a 4x4 matrix from the given quat4
   *
   * @param {quat4} quat quat4 to create matrix from
   * @param {mat4} [dest] mat4 receiving operation result
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  quat4.toMat4 = function (quat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
  
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
  
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
  
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Performs a spherical linear interpolation between two quat4
   *
   * @param {quat4} quat First quaternion
   * @param {quat4} quat2 Second quaternion
   * @param {number} slerp Interpolation amount between the two inputs
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.slerp = function (quat, quat2, slerp, dest) {
      if (!dest) { dest = quat; }
  
      var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3],
          halfTheta,
          sinHalfTheta,
          ratioA,
          ratioB;
  
      if (Math.abs(cosHalfTheta) >= 1.0) {
          if (dest !== quat) {
              dest[0] = quat[0];
              dest[1] = quat[1];
              dest[2] = quat[2];
              dest[3] = quat[3];
          }
          return dest;
      }
  
      halfTheta = Math.acos(cosHalfTheta);
      sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
  
      if (Math.abs(sinHalfTheta) < 0.001) {
          dest[0] = (quat[0] * 0.5 + quat2[0] * 0.5);
          dest[1] = (quat[1] * 0.5 + quat2[1] * 0.5);
          dest[2] = (quat[2] * 0.5 + quat2[2] * 0.5);
          dest[3] = (quat[3] * 0.5 + quat2[3] * 0.5);
          return dest;
      }
  
      ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
      ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
  
      dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
      dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
      dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
      dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);
  
      return dest;
  };
  
  /**
   * Returns a string representation of a quaternion
   *
   * @param {quat4} quat quat4 to represent as a string
   *
   * @returns {string} String representation of quat
   */
  quat4.str = function (quat) {
      return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
  };
  
  
  return {
    vec3: vec3,
    mat3: mat3,
    mat4: mat4,
    quat4: quat4
  };
  
  })();
  
  ;
  var GLImmediateSetup={};function _glMatrixMode(mode) {
      if (mode == 0x1700 /* GL_MODELVIEW */) {
        GLImmediate.currentMatrix = 0/*m*/;
      } else if (mode == 0x1701 /* GL_PROJECTION */) {
        GLImmediate.currentMatrix = 1/*p*/;
      } else if (mode == 0x1702) { // GL_TEXTURE
        GLImmediate.useTextureMatrix = true;
        GLImmediate.currentMatrix = 2/*t*/ + GLImmediate.clientActiveTexture;
      } else {
        throw "Wrong mode " + mode + " passed to glMatrixMode";
      }
    }

  function _glClearColor(x0, x1, x2, x3) { GLctx.clearColor(x0, x1, x2, x3) }

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  
  
  
  function ___cxa_is_number_type(type) {
      var isNumber = false;
      try { if (type == __ZTIi) isNumber = true } catch(e){}
      try { if (type == __ZTIj) isNumber = true } catch(e){}
      try { if (type == __ZTIl) isNumber = true } catch(e){}
      try { if (type == __ZTIm) isNumber = true } catch(e){}
      try { if (type == __ZTIx) isNumber = true } catch(e){}
      try { if (type == __ZTIy) isNumber = true } catch(e){}
      try { if (type == __ZTIf) isNumber = true } catch(e){}
      try { if (type == __ZTId) isNumber = true } catch(e){}
      try { if (type == __ZTIe) isNumber = true } catch(e){}
      try { if (type == __ZTIc) isNumber = true } catch(e){}
      try { if (type == __ZTIa) isNumber = true } catch(e){}
      try { if (type == __ZTIh) isNumber = true } catch(e){}
      try { if (type == __ZTIs) isNumber = true } catch(e){}
      try { if (type == __ZTIt) isNumber = true } catch(e){}
      return isNumber;
    }function ___cxa_does_inherit(definiteType, possibilityType, possibility) {
      if (possibility == 0) return false;
      if (possibilityType == 0 || possibilityType == definiteType)
        return true;
      var possibility_type_info;
      if (___cxa_is_number_type(possibilityType)) {
        possibility_type_info = possibilityType;
      } else {
        var possibility_type_infoAddr = HEAP32[((possibilityType)>>2)] - 8;
        possibility_type_info = HEAP32[((possibility_type_infoAddr)>>2)];
      }
      switch (possibility_type_info) {
      case 0: // possibility is a pointer
        // See if definite type is a pointer
        var definite_type_infoAddr = HEAP32[((definiteType)>>2)] - 8;
        var definite_type_info = HEAP32[((definite_type_infoAddr)>>2)];
        if (definite_type_info == 0) {
          // Also a pointer; compare base types of pointers
          var defPointerBaseAddr = definiteType+8;
          var defPointerBaseType = HEAP32[((defPointerBaseAddr)>>2)];
          var possPointerBaseAddr = possibilityType+8;
          var possPointerBaseType = HEAP32[((possPointerBaseAddr)>>2)];
          return ___cxa_does_inherit(defPointerBaseType, possPointerBaseType, possibility);
        } else
          return false; // one pointer and one non-pointer
      case 1: // class with no base class
        return false;
      case 2: // class with base class
        var parentTypeAddr = possibilityType + 8;
        var parentType = HEAP32[((parentTypeAddr)>>2)];
        return ___cxa_does_inherit(definiteType, parentType, possibility);
      default:
        return false; // some unencountered type
      }
    }
  
  
  
  var ___cxa_last_thrown_exception=0;function ___resumeException(ptr) {
      if (!___cxa_last_thrown_exception) { ___cxa_last_thrown_exception = ptr; }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }
  
  var ___cxa_exception_header_size=8;function ___cxa_find_matching_catch(thrown, throwntype) {
      if (thrown == -1) thrown = ___cxa_last_thrown_exception;
      header = thrown - ___cxa_exception_header_size;
      if (throwntype == -1) throwntype = HEAP32[((header)>>2)];
      var typeArray = Array.prototype.slice.call(arguments, 2);
  
      // If throwntype is a pointer, this means a pointer has been
      // thrown. When a pointer is thrown, actually what's thrown
      // is a pointer to the pointer. We'll dereference it.
      if (throwntype != 0 && !___cxa_is_number_type(throwntype)) {
        var throwntypeInfoAddr= HEAP32[((throwntype)>>2)] - 8;
        var throwntypeInfo= HEAP32[((throwntypeInfoAddr)>>2)];
        if (throwntypeInfo == 0)
          thrown = HEAP32[((thrown)>>2)];
      }
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (___cxa_does_inherit(typeArray[i], throwntype, thrown))
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      if (!___cxa_throw.initialized) {
        try {
          HEAP32[((__ZTVN10__cxxabiv119__pointer_type_infoE)>>2)]=0; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv117__class_type_infoE)>>2)]=1; // Workaround for libcxxabi integration bug
        } catch(e){}
        try {
          HEAP32[((__ZTVN10__cxxabiv120__si_class_type_infoE)>>2)]=2; // Workaround for libcxxabi integration bug
        } catch(e){}
        ___cxa_throw.initialized = true;
      }
      var header = ptr - ___cxa_exception_header_size;
      HEAP32[((header)>>2)]=type;
      HEAP32[(((header)+(4))>>2)]=destructor;
      ___cxa_last_thrown_exception = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }

   
  Module["_memset"] = _memset;

  
  function _close(fildes) {
      // int close(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/close.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        FS.close(stream);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fsync(fildes) {
      // int fsync(int fildes);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fsync.html
      var stream = FS.getStream(fildes);
      if (stream) {
        // We write directly to the file system, so there's nothing to do here.
        return 0;
      } else {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) return -1;
      return stream.fd;
    }function _fclose(stream) {
      // int fclose(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fclose.html
      var fd = _fileno(stream);
      _fsync(fd);
      return _close(fd);
    }

  function _glFlush() { GLctx.flush() }

  
  var GLUT={initTime:null,idleFunc:null,displayFunc:null,keyboardFunc:null,keyboardUpFunc:null,specialFunc:null,specialUpFunc:null,reshapeFunc:null,motionFunc:null,passiveMotionFunc:null,mouseFunc:null,buttons:0,modifiers:0,initWindowWidth:256,initWindowHeight:256,initDisplayMode:18,windowX:0,windowY:0,windowWidth:0,windowHeight:0,requestedAnimationFrame:false,saveModifiers:function (event) {
        GLUT.modifiers = 0;
        if (event['shiftKey'])
          GLUT.modifiers += 1; /* GLUT_ACTIVE_SHIFT */
        if (event['ctrlKey'])
          GLUT.modifiers += 2; /* GLUT_ACTIVE_CTRL */
        if (event['altKey'])
          GLUT.modifiers += 4; /* GLUT_ACTIVE_ALT */
      },onMousemove:function (event) {
        /* Send motion event only if the motion changed, prevents
         * spamming our app with uncessary callback call. It does happen in
         * Chrome on Windows.
         */
        var lastX = Browser.mouseX;
        var lastY = Browser.mouseY;
        Browser.calculateMouseEvent(event);
        var newX = Browser.mouseX;
        var newY = Browser.mouseY;
        if (newX == lastX && newY == lastY) return;
  
        if (GLUT.buttons == 0 && event.target == Module["canvas"] && GLUT.passiveMotionFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          Runtime.dynCall('vii', GLUT.passiveMotionFunc, [lastX, lastY]);
        } else if (GLUT.buttons != 0 && GLUT.motionFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          Runtime.dynCall('vii', GLUT.motionFunc, [lastX, lastY]);
        }
      },getSpecialKey:function (keycode) {
          var key = null;
          switch (keycode) {
            case 8:  key = 120 /* backspace */; break;
            case 46: key = 111 /* delete */; break;
  
            case 0x70 /*DOM_VK_F1*/: key = 1 /* GLUT_KEY_F1 */; break;
            case 0x71 /*DOM_VK_F2*/: key = 2 /* GLUT_KEY_F2 */; break;
            case 0x72 /*DOM_VK_F3*/: key = 3 /* GLUT_KEY_F3 */; break;
            case 0x73 /*DOM_VK_F4*/: key = 4 /* GLUT_KEY_F4 */; break;
            case 0x74 /*DOM_VK_F5*/: key = 5 /* GLUT_KEY_F5 */; break;
            case 0x75 /*DOM_VK_F6*/: key = 6 /* GLUT_KEY_F6 */; break;
            case 0x76 /*DOM_VK_F7*/: key = 7 /* GLUT_KEY_F7 */; break;
            case 0x77 /*DOM_VK_F8*/: key = 8 /* GLUT_KEY_F8 */; break;
            case 0x78 /*DOM_VK_F9*/: key = 9 /* GLUT_KEY_F9 */; break;
            case 0x79 /*DOM_VK_F10*/: key = 10 /* GLUT_KEY_F10 */; break;
            case 0x7a /*DOM_VK_F11*/: key = 11 /* GLUT_KEY_F11 */; break;
            case 0x7b /*DOM_VK_F12*/: key = 12 /* GLUT_KEY_F12 */; break;
            case 0x25 /*DOM_VK_LEFT*/: key = 100 /* GLUT_KEY_LEFT */; break;
            case 0x26 /*DOM_VK_UP*/: key = 101 /* GLUT_KEY_UP */; break;
            case 0x27 /*DOM_VK_RIGHT*/: key = 102 /* GLUT_KEY_RIGHT */; break;
            case 0x28 /*DOM_VK_DOWN*/: key = 103 /* GLUT_KEY_DOWN */; break;
            case 0x21 /*DOM_VK_PAGE_UP*/: key = 104 /* GLUT_KEY_PAGE_UP */; break;
            case 0x22 /*DOM_VK_PAGE_DOWN*/: key = 105 /* GLUT_KEY_PAGE_DOWN */; break;
            case 0x24 /*DOM_VK_HOME*/: key = 106 /* GLUT_KEY_HOME */; break;
            case 0x23 /*DOM_VK_END*/: key = 107 /* GLUT_KEY_END */; break;
            case 0x2d /*DOM_VK_INSERT*/: key = 108 /* GLUT_KEY_INSERT */; break;
  
            case 16   /*DOM_VK_SHIFT*/:
            case 0x05 /*DOM_VK_LEFT_SHIFT*/:
              key = 112 /* GLUT_KEY_SHIFT_L */;
              break;
            case 0x06 /*DOM_VK_RIGHT_SHIFT*/:
              key = 113 /* GLUT_KEY_SHIFT_R */;
              break;
  
            case 17   /*DOM_VK_CONTROL*/:
            case 0x03 /*DOM_VK_LEFT_CONTROL*/:
              key = 114 /* GLUT_KEY_CONTROL_L */;
              break;
            case 0x04 /*DOM_VK_RIGHT_CONTROL*/:
              key = 115 /* GLUT_KEY_CONTROL_R */;
              break;
  
            case 18   /*DOM_VK_ALT*/:
            case 0x02 /*DOM_VK_LEFT_ALT*/:
              key = 116 /* GLUT_KEY_ALT_L */;
              break;
            case 0x01 /*DOM_VK_RIGHT_ALT*/:
              key = 117 /* GLUT_KEY_ALT_R */;
              break;
          };
          return key;
      },getASCIIKey:function (event) {
        if (event['ctrlKey'] || event['altKey'] || event['metaKey']) return null;
  
        var keycode = event['keyCode'];
  
        /* The exact list is soooo hard to find in a canonical place! */
  
        if (48 <= keycode && keycode <= 57)
          return keycode; // numeric  TODO handle shift?
        if (65 <= keycode && keycode <= 90)
          return event['shiftKey'] ? keycode : keycode + 32;
        if (96 <= keycode && keycode <= 105)
          return keycode - 48; // numpad numbers    
        if (106 <= keycode && keycode <= 111)
          return keycode - 106 + 42; // *,+-./  TODO handle shift?
  
        switch (keycode) {
          case 9:  // tab key
          case 13: // return key
          case 27: // escape
          case 32: // space
          case 61: // equal
            return keycode;
        }
  
        var s = event['shiftKey'];
        switch (keycode) {
          case 186: return s ? 58 : 59; // colon / semi-colon
          case 187: return s ? 43 : 61; // add / equal (these two may be wrong)
          case 188: return s ? 60 : 44; // less-than / comma
          case 189: return s ? 95 : 45; // dash
          case 190: return s ? 62 : 46; // greater-than / period
          case 191: return s ? 63 : 47; // forward slash
          case 219: return s ? 123 : 91; // open bracket
          case 220: return s ? 124 : 47; // back slash
          case 221: return s ? 125 : 93; // close braket
          case 222: return s ? 34 : 39; // single quote
        }
  
        return null;
      },onKeydown:function (event) {
        if (GLUT.specialFunc || GLUT.keyboardFunc) {
          var key = GLUT.getSpecialKey(event['keyCode']);
          if (key !== null) {
            if( GLUT.specialFunc ) {
              event.preventDefault();
              GLUT.saveModifiers(event);
              Runtime.dynCall('viii', GLUT.specialFunc, [key, Browser.mouseX, Browser.mouseY]);
            }
          }
          else
          {
            key = GLUT.getASCIIKey(event);
            if( key !== null && GLUT.keyboardFunc ) {
              event.preventDefault();
              GLUT.saveModifiers(event);
              Runtime.dynCall('viii', GLUT.keyboardFunc, [key, Browser.mouseX, Browser.mouseY]);
            }
          }
        }
      },onKeyup:function (event) {
        if (GLUT.specialUpFunc || GLUT.keyboardUpFunc) {
          var key = GLUT.getSpecialKey(event['keyCode']);
          if (key !== null) {
            if(GLUT.specialUpFunc) {
              event.preventDefault ();
              GLUT.saveModifiers(event);
              Runtime.dynCall('viii', GLUT.specialUpFunc, [key, Browser.mouseX, Browser.mouseY]);
            }
          }
          else
          {
            key = GLUT.getASCIIKey(event);
            if( key !== null && GLUT.keyboardUpFunc ) {
              event.preventDefault ();
              GLUT.saveModifiers(event);
              Runtime.dynCall('viii', GLUT.keyboardUpFunc, [key, Browser.mouseX, Browser.mouseY]);
            }
          }
        }
      },onMouseButtonDown:function (event) {
        Browser.calculateMouseEvent(event);
  
        GLUT.buttons |= (1 << event['button']);
  
        if (event.target == Module["canvas"] && GLUT.mouseFunc) {
          try {
            event.target.setCapture();
          } catch (e) {}
          event.preventDefault();
          GLUT.saveModifiers(event);
          Runtime.dynCall('viiii', GLUT.mouseFunc, [event['button'], 0/*GLUT_DOWN*/, Browser.mouseX, Browser.mouseY]);
        }
      },onMouseButtonUp:function (event) {
        Browser.calculateMouseEvent(event);
  
        GLUT.buttons &= ~(1 << event['button']);
  
        if (GLUT.mouseFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          Runtime.dynCall('viiii', GLUT.mouseFunc, [event['button'], 1/*GLUT_UP*/, Browser.mouseX, Browser.mouseY]);
        }
      },onMouseWheel:function (event) {
        Browser.calculateMouseEvent(event);
  
        // cross-browser wheel delta
        var e = window.event || event; // old IE support
        var delta = -Browser.getMouseWheelDelta(event);
  
        var button = 3; // wheel up
        if (delta < 0) {
          button = 4; // wheel down
        }
  
        if (GLUT.mouseFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          Runtime.dynCall('viiii', GLUT.mouseFunc, [button, 0/*GLUT_DOWN*/, Browser.mouseX, Browser.mouseY]);
        }
      },onFullScreenEventChange:function (event) {
        var width;
        var height;
        if (document["fullScreen"] || document["mozFullScreen"] || document["webkitIsFullScreen"]) {
          width = screen["width"];
          height = screen["height"];
        } else {
          width = GLUT.windowWidth;
          height = GLUT.windowHeight;
          // TODO set position
          document.removeEventListener('fullscreenchange', GLUT.onFullScreenEventChange, true);
          document.removeEventListener('mozfullscreenchange', GLUT.onFullScreenEventChange, true);
          document.removeEventListener('webkitfullscreenchange', GLUT.onFullScreenEventChange, true);
        }
        Browser.setCanvasSize(width, height);
        /* Can't call _glutReshapeWindow as that requests cancelling fullscreen. */
        if (GLUT.reshapeFunc) {
          // console.log("GLUT.reshapeFunc (from FS): " + width + ", " + height);
          Runtime.dynCall('vii', GLUT.reshapeFunc, [width, height]);
        }
        _glutPostRedisplay();
      },requestFullScreen:function () {
        var RFS = Module["canvas"]['requestFullscreen'] ||
                  Module["canvas"]['requestFullScreen'] ||
                  Module["canvas"]['mozRequestFullScreen'] ||
                  Module["canvas"]['webkitRequestFullScreen'] ||
                  (function() {});
        RFS.apply(Module["canvas"], []);
      },cancelFullScreen:function () {
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['webkitCancelFullScreen'] ||
                  (function() {});
        CFS.apply(document, []);
      }};function _glutSwapBuffers() {}


  function _glBegin(mode) {
      // Push the old state:
      GLImmediate.enabledClientAttributes_preBegin = GLImmediate.enabledClientAttributes;
      GLImmediate.enabledClientAttributes = [];
  
      GLImmediate.clientAttributes_preBegin = GLImmediate.clientAttributes;
      GLImmediate.clientAttributes = []
      for (var i = 0; i < GLImmediate.clientAttributes_preBegin.length; i++) {
        GLImmediate.clientAttributes.push({});
      }
  
      GLImmediate.mode = mode;
      GLImmediate.vertexCounter = 0;
      var components = GLImmediate.rendererComponents = [];
      for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
        components[i] = 0;
      }
      GLImmediate.rendererComponentPointer = 0;
      GLImmediate.vertexData = GLImmediate.tempData;
    }

  
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              // runtimeConfig gets set to true if WebSocket runtime configuration is available.
              var runtimeConfig = (Module['websocket'] && ('object' === typeof Module['websocket']));
  
              // The default value is 'ws://' the replace is needed because the compiler replaces "//" comments with '#'
              // comments without checking context, so we'd end up with ws:#, the replace swaps the "#" for "//" again.
              var url = 'ws:#'.replace('#', '//');
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['url']) {
                  url = Module['websocket']['url']; // Fetch runtime WebSocket URL config.
                }
              }
  
              if (url === 'ws://' || url === 'wss://') { // Is the supplied URL config just a prefix, if so complete it.
                url = url + addr + ':' + port;
              }
  
              // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
              var subProtocols = 'binary'; // The default value is 'binary'
  
              if (runtimeConfig) {
                if ('string' === typeof Module['websocket']['subprotocol']) {
                  subProtocols = Module['websocket']['subprotocol']; // Fetch runtime WebSocket subprotocol config.
                }
              }
  
              // The regex trims the string (removes spaces at the beginning and end, then splits the string by
              // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
              subProtocols = subProtocols.replace(/^ +| +$/g,"").split(/ *, */);
  
              // The node ws library API for specifying optional subprotocol is slightly different than the browser's.
              var opts = ENVIRONMENT_IS_NODE ? {'protocol': subProtocols.toString()} : subProtocols;
  
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }

  function _glutPostRedisplay() {
      if (GLUT.displayFunc && !GLUT.requestedAnimationFrame) {
        GLUT.requestedAnimationFrame = true;
        Browser.requestAnimationFrame(function() {
          GLUT.requestedAnimationFrame = false;
          if (ABORT) return;
          Runtime.dynCall('v', GLUT.displayFunc);
        });
      }
    }

  function _glDepthFunc(x0) { GLctx.depthFunc(x0) }

  
  function _emscripten_glVertex3f(x, y, z) {
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = z || 0;
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 3, GLctx.FLOAT);
    }function _glVertex3fv(p) {
      _emscripten_glVertex3f(HEAPF32[((p)>>2)], HEAPF32[(((p)+(4))>>2)], HEAPF32[(((p)+(8))>>2)]);
    }

  
  function _open(path, oflag, varargs) {
      // int open(const char *path, int oflag, ...);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/open.html
      var mode = HEAP32[((varargs)>>2)];
      path = Pointer_stringify(path);
      try {
        var stream = FS.open(path, oflag, mode);
        return stream.fd;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fopen(filename, mode) {
      // FILE *fopen(const char *restrict filename, const char *restrict mode);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fopen.html
      var flags;
      mode = Pointer_stringify(mode);
      if (mode[0] == 'r') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 0;
        }
      } else if (mode[0] == 'w') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 512;
      } else if (mode[0] == 'a') {
        if (mode.indexOf('+') != -1) {
          flags = 2;
        } else {
          flags = 1;
        }
        flags |= 64;
        flags |= 1024;
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return 0;
      }
      var fd = _open(filename, flags, allocate([0x1FF, 0, 0, 0], 'i32', ALLOC_STACK));  // All creation permissions.
      return fd === -1 ? 0 : FS.getPtrForStream(FS.getStream(fd));
    }


  function _glCullFace(x0) { GLctx.cullFace(x0) }

  function _glutIdleFunc(func) {
      function callback() {
        if (GLUT.idleFunc) {
          Runtime.dynCall('v', GLUT.idleFunc);
          Browser.safeSetTimeout(callback, 0);
        }
      }
      if (!GLUT.idleFunc) {
        Browser.safeSetTimeout(callback, 0);
      }
      GLUT.idleFunc = func;
    }


  
  function _emscripten_glColor4f(r, g, b, a) {
      r = Math.max(Math.min(r, 1), 0);
      g = Math.max(Math.min(g, 1), 0);
      b = Math.max(Math.min(b, 1), 0);
      a = Math.max(Math.min(a, 1), 0);
  
      // TODO: make ub the default, not f, save a few mathops
      if (GLImmediate.mode >= 0) {
        var start = GLImmediate.vertexCounter << 2;
        GLImmediate.vertexDataU8[start + 0] = r * 255;
        GLImmediate.vertexDataU8[start + 1] = g * 255;
        GLImmediate.vertexDataU8[start + 2] = b * 255;
        GLImmediate.vertexDataU8[start + 3] = a * 255;
        GLImmediate.vertexCounter++;
        GLImmediate.addRendererComponent(GLImmediate.COLOR, 4, GLctx.UNSIGNED_BYTE);
      } else {
        GLImmediate.clientColor[0] = r;
        GLImmediate.clientColor[1] = g;
        GLImmediate.clientColor[2] = b;
        GLImmediate.clientColor[3] = a;
      }
    }function _glColor3d(r, g, b) {
      _emscripten_glColor4f(r, g, b, 1);
    }

  
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      var fd = _fileno(stream);
      return _write(fd, s, _strlen(s));
    }
  
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }


  function _glPopMatrix() {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrix[GLImmediate.currentMatrix] = GLImmediate.matrixStack[GLImmediate.currentMatrix].pop();
    }

  function _glClear(x0) { GLctx.clear(x0) }

  function _glutDisplayFunc(func) {
      GLUT.displayFunc = func;
    }

  var _sqrt=Math_sqrt;

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }

  function _glRotated(angle, x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.rotate(GLImmediate.matrix[GLImmediate.currentMatrix], angle*Math.PI/180, [x, y, z]);
    }


  function _glutMouseFunc(func) {
      GLUT.mouseFunc = func;
    }

  var _sin=Math_sin;

  function _glutInitWindowSize(width, height) {
      Browser.setCanvasSize( GLUT.initWindowWidth = width,
                             GLUT.initWindowHeight = height );
    }

  function _glTranslatef(x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.translate(GLImmediate.matrix[GLImmediate.currentMatrix], [x, y, z]);
    }

  function _glutCreateWindow(name) {
      var contextAttributes = {
        antialias: ((GLUT.initDisplayMode & 0x0080 /*GLUT_MULTISAMPLE*/) != 0),
        depth: ((GLUT.initDisplayMode & 0x0010 /*GLUT_DEPTH*/) != 0),
        stencil: ((GLUT.initDisplayMode & 0x0020 /*GLUT_STENCIL*/) != 0)
      };
      Module.ctx = Browser.createContext(Module['canvas'], true, true, contextAttributes);
      return Module.ctx ? 1 /* a new GLUT window ID for the created context */ : 0 /* failure */;
    }

  function _glutInit(argcp, argv) {
      // Ignore arguments
      GLUT.initTime = Date.now();
  
      var isTouchDevice = 'ontouchstart' in document.documentElement;
  
      window.addEventListener("keydown", GLUT.onKeydown, true);
      window.addEventListener("keyup", GLUT.onKeyup, true);
      if (isTouchDevice) {
        window.addEventListener("touchmove", GLUT.onMousemove, true);
        window.addEventListener("touchstart", GLUT.onMouseButtonDown, true);
        window.addEventListener("touchend", GLUT.onMouseButtonUp, true);
      } else {
        window.addEventListener("mousemove", GLUT.onMousemove, true);
        window.addEventListener("mousedown", GLUT.onMouseButtonDown, true);
        window.addEventListener("mouseup", GLUT.onMouseButtonUp, true);
        // IE9, Chrome, Safari, Opera
        window.addEventListener("mousewheel", GLUT.onMouseWheel, true);
        // Firefox
        window.addEventListener("DOMMouseScroll", GLUT.onMouseWheel, true);
      }
  
      Browser.resizeListeners.push(function(width, height) {
        if (GLUT.reshapeFunc) {
        	Runtime.dynCall('vii', GLUT.reshapeFunc, [width, height]);
        }
      });
  
      __ATEXIT__.push({ func: function() {
        window.removeEventListener("keydown", GLUT.onKeydown, true);
        window.removeEventListener("keyup", GLUT.onKeyup, true);
        if (isTouchDevice) {
          window.removeEventListener("touchmove", GLUT.onMousemove, true);
          window.removeEventListener("touchstart", GLUT.onMouseButtonDown, true);
          window.removeEventListener("touchend", GLUT.onMouseButtonUp, true);
        } else {
          window.removeEventListener("mousemove", GLUT.onMousemove, true);
          window.removeEventListener("mousedown", GLUT.onMouseButtonDown, true);
          window.removeEventListener("mouseup", GLUT.onMouseButtonUp, true);
          // IE9, Chrome, Safari, Opera
          window.removeEventListener("mousewheel", GLUT.onMouseWheel, true);
          // Firefox
          window.removeEventListener("DOMMouseScroll", GLUT.onMouseWheel, true);
        }
        Module["canvas"].width = Module["canvas"].height = 1;
      } });
    }

  var _BDtoILow=true;

  var _BDtoIHigh=true;

  function _glMultMatrixd(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix],
          HEAPF64.subarray((matrix)>>3,(matrix+128)>>3));
    }

  function __ZSt9terminatev() {
      _exit(-1234);
    }

  function _gettimeofday(ptr) {
      var now = Date.now();
      HEAP32[((ptr)>>2)]=Math.floor(now/1000); // seconds
      HEAP32[(((ptr)+(4))>>2)]=Math.floor((now-1000*Math.floor(now/1000))*1000); // microseconds
      return 0;
    }

  function _glLoadIdentity() {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;

  function _glFrustum(left, right, bottom, top_, nearVal, farVal) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix],
          GLImmediate.matrixLib.mat4.frustum(left, right, bottom, top_, nearVal, farVal));
    }

  var _cos=Math_cos;

  var _fabs=Math_abs;

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }

  
  
  function __getFloat(text) {
      return /^[+-]?[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/.exec(text);
    }function __scanString(format, get, unget, varargs) {
      if (!__scanString.whiteSpace) {
        __scanString.whiteSpace = {};
        __scanString.whiteSpace[32] = 1;
        __scanString.whiteSpace[9] = 1;
        __scanString.whiteSpace[10] = 1;
        __scanString.whiteSpace[11] = 1;
        __scanString.whiteSpace[12] = 1;
        __scanString.whiteSpace[13] = 1;
      }
      // Supports %x, %4x, %d.%d, %lld, %s, %f, %lf.
      // TODO: Support all format specifiers.
      format = Pointer_stringify(format);
      var soFar = 0;
      if (format.indexOf('%n') >= 0) {
        // need to track soFar
        var _get = get;
        get = function get() {
          soFar++;
          return _get();
        }
        var _unget = unget;
        unget = function unget() {
          soFar--;
          return _unget();
        }
      }
      var formatIndex = 0;
      var argsi = 0;
      var fields = 0;
      var argIndex = 0;
      var next;
  
      mainLoop:
      for (var formatIndex = 0; formatIndex < format.length;) {
        if (format[formatIndex] === '%' && format[formatIndex+1] == 'n') {
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          HEAP32[((argPtr)>>2)]=soFar;
          formatIndex += 2;
          continue;
        }
  
        if (format[formatIndex] === '%') {
          var nextC = format.indexOf('c', formatIndex+1);
          if (nextC > 0) {
            var maxx = 1;
            if (nextC > formatIndex+1) {
              var sub = format.substring(formatIndex+1, nextC);
              maxx = parseInt(sub);
              if (maxx != sub) maxx = 0;
            }
            if (maxx) {
              var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
              argIndex += Runtime.getAlignSize('void*', null, true);
              fields++;
              for (var i = 0; i < maxx; i++) {
                next = get();
                HEAP8[((argPtr++)|0)]=next;
                if (next === 0) return i > 0 ? fields : fields-1; // we failed to read the full length of this field
              }
              formatIndex += nextC - formatIndex + 1;
              continue;
            }
          }
        }
  
        // handle %[...]
        if (format[formatIndex] === '%' && format.indexOf('[', formatIndex+1) > 0) {
          var match = /\%([0-9]*)\[(\^)?(\]?[^\]]*)\]/.exec(format.substring(formatIndex));
          if (match) {
            var maxNumCharacters = parseInt(match[1]) || Infinity;
            var negateScanList = (match[2] === '^');
            var scanList = match[3];
  
            // expand "middle" dashs into character sets
            var middleDashMatch;
            while ((middleDashMatch = /([^\-])\-([^\-])/.exec(scanList))) {
              var rangeStartCharCode = middleDashMatch[1].charCodeAt(0);
              var rangeEndCharCode = middleDashMatch[2].charCodeAt(0);
              for (var expanded = ''; rangeStartCharCode <= rangeEndCharCode; expanded += String.fromCharCode(rangeStartCharCode++));
              scanList = scanList.replace(middleDashMatch[1] + '-' + middleDashMatch[2], expanded);
            }
  
            var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
            argIndex += Runtime.getAlignSize('void*', null, true);
            fields++;
  
            for (var i = 0; i < maxNumCharacters; i++) {
              next = get();
              if (negateScanList) {
                if (scanList.indexOf(String.fromCharCode(next)) < 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              } else {
                if (scanList.indexOf(String.fromCharCode(next)) >= 0) {
                  HEAP8[((argPtr++)|0)]=next;
                } else {
                  unget();
                  break;
                }
              }
            }
  
            // write out null-terminating character
            HEAP8[((argPtr++)|0)]=0;
            formatIndex += match[0].length;
            
            continue;
          }
        }      
        // remove whitespace
        while (1) {
          next = get();
          if (next == 0) return fields;
          if (!(next in __scanString.whiteSpace)) break;
        }
        unget();
  
        if (format[formatIndex] === '%') {
          formatIndex++;
          var suppressAssignment = false;
          if (format[formatIndex] == '*') {
            suppressAssignment = true;
            formatIndex++;
          }
          var maxSpecifierStart = formatIndex;
          while (format[formatIndex].charCodeAt(0) >= 48 &&
                 format[formatIndex].charCodeAt(0) <= 57) {
            formatIndex++;
          }
          var max_;
          if (formatIndex != maxSpecifierStart) {
            max_ = parseInt(format.slice(maxSpecifierStart, formatIndex), 10);
          }
          var long_ = false;
          var half = false;
          var longLong = false;
          if (format[formatIndex] == 'l') {
            long_ = true;
            formatIndex++;
            if (format[formatIndex] == 'l') {
              longLong = true;
              formatIndex++;
            }
          } else if (format[formatIndex] == 'h') {
            half = true;
            formatIndex++;
          }
          var type = format[formatIndex];
          formatIndex++;
          var curr = 0;
          var buffer = [];
          // Read characters according to the format. floats are trickier, they may be in an unfloat state in the middle, then be a valid float later
          if (type == 'f' || type == 'e' || type == 'g' ||
              type == 'F' || type == 'E' || type == 'G') {
            next = get();
            while (next > 0 && (!(next in __scanString.whiteSpace)))  {
              buffer.push(String.fromCharCode(next));
              next = get();
            }
            var m = __getFloat(buffer.join(''));
            var last = m ? m[0].length : 0;
            for (var i = 0; i < buffer.length - last + 1; i++) {
              unget();
            }
            buffer.length = last;
          } else {
            next = get();
            var first = true;
            
            // Strip the optional 0x prefix for %x.
            if ((type == 'x' || type == 'X') && (next == 48)) {
              var peek = get();
              if (peek == 120 || peek == 88) {
                next = get();
              } else {
                unget();
              }
            }
            
            while ((curr < max_ || isNaN(max_)) && next > 0) {
              if (!(next in __scanString.whiteSpace) && // stop on whitespace
                  (type == 's' ||
                   ((type === 'd' || type == 'u' || type == 'i') && ((next >= 48 && next <= 57) ||
                                                                     (first && next == 45))) ||
                   ((type === 'x' || type === 'X') && (next >= 48 && next <= 57 ||
                                     next >= 97 && next <= 102 ||
                                     next >= 65 && next <= 70))) &&
                  (formatIndex >= format.length || next !== format[formatIndex].charCodeAt(0))) { // Stop when we read something that is coming up
                buffer.push(String.fromCharCode(next));
                next = get();
                curr++;
                first = false;
              } else {
                break;
              }
            }
            unget();
          }
          if (buffer.length === 0) return 0;  // Failure.
          if (suppressAssignment) continue;
  
          var text = buffer.join('');
          var argPtr = HEAP32[(((varargs)+(argIndex))>>2)];
          argIndex += Runtime.getAlignSize('void*', null, true);
          switch (type) {
            case 'd': case 'u': case 'i':
              if (half) {
                HEAP16[((argPtr)>>1)]=parseInt(text, 10);
              } else if (longLong) {
                (tempI64 = [parseInt(text, 10)>>>0,(tempDouble=parseInt(text, 10),(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((argPtr)>>2)]=tempI64[0],HEAP32[(((argPtr)+(4))>>2)]=tempI64[1]);
              } else {
                HEAP32[((argPtr)>>2)]=parseInt(text, 10);
              }
              break;
            case 'X':
            case 'x':
              HEAP32[((argPtr)>>2)]=parseInt(text, 16);
              break;
            case 'F':
            case 'f':
            case 'E':
            case 'e':
            case 'G':
            case 'g':
            case 'E':
              // fallthrough intended
              if (long_) {
                HEAPF64[((argPtr)>>3)]=parseFloat(text);
              } else {
                HEAPF32[((argPtr)>>2)]=parseFloat(text);
              }
              break;
            case 's':
              var array = intArrayFromString(text);
              for (var j = 0; j < array.length; j++) {
                HEAP8[(((argPtr)+(j))|0)]=array[j];
              }
              break;
          }
          fields++;
        } else if (format[formatIndex].charCodeAt(0) in __scanString.whiteSpace) {
          next = get();
          while (next in __scanString.whiteSpace) {
            if (next <= 0) break mainLoop;  // End of input.
            next = get();
          }
          unget(next);
          formatIndex++;
        } else {
          // Not a specifier.
          next = get();
          if (format[formatIndex].charCodeAt(0) !== next) {
            unget(next);
            break mainLoop;
          }
          formatIndex++;
        }
      }
      return fields;
    }
  
  
  
  
  function _recv(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _read(fd, buf, len);
    }
  
  function _pread(fildes, buf, nbyte, offset) {
      // ssize_t pread(int fildes, void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _read(fildes, buf, nbyte) {
      // ssize_t read(int fildes, void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/read.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.read(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fread(ptr, size, nitems, stream) {
      // size_t fread(void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fread.html
      var bytesToRead = nitems * size;
      if (bytesToRead == 0) {
        return 0;
      }
      var bytesRead = 0;
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return 0;
      }
      while (streamObj.ungotten.length && bytesToRead > 0) {
        HEAP8[((ptr++)|0)]=streamObj.ungotten.pop();
        bytesToRead--;
        bytesRead++;
      }
      var err = _read(streamObj.fd, ptr, bytesToRead);
      if (err == -1) {
        if (streamObj) streamObj.error = true;
        return 0;
      }
      bytesRead += err;
      if (bytesRead < bytesToRead) streamObj.eof = true;
      return Math.floor(bytesRead / size);
    }function _fgetc(stream) {
      // int fgetc(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fgetc.html
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) return -1;
      if (streamObj.eof || streamObj.error) return -1;
      var ret = _fread(_fgetc.ret, 1, 1, stream);
      if (ret == 0) {
        return -1;
      } else if (ret == -1) {
        streamObj.error = true;
        return -1;
      } else {
        return HEAPU8[((_fgetc.ret)|0)];
      }
    }
  
  function _ungetc(c, stream) {
      // int ungetc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/ungetc.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) {
        return -1;
      }
      if (c === -1) {
        // do nothing for EOF character
        return c;
      }
      c = unSign(c & 0xFF);
      stream.ungotten.push(c);
      stream.eof = false;
      return c;
    }function _fscanf(stream, format, varargs) {
      // int fscanf(FILE *restrict stream, const char *restrict format, ... );
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/scanf.html
      var streamObj = FS.getStreamFromPtr(stream);
      if (!streamObj) {
        return -1;
      }
      var buffer = [];
      function get() {
        var c = _fgetc(stream);
        buffer.push(c);
        return c;
      };
      function unget() {
        _ungetc(buffer.pop(), stream);
      };
      return __scanString(format, get, unget, varargs);
    }

  
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;function ___cxa_allocate_exception(size) {
      var ptr = _malloc(size + ___cxa_exception_header_size);
      return ptr + ___cxa_exception_header_size;
    }

  function _glPushMatrix() {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixStack[GLImmediate.currentMatrix].push(
          Array.prototype.slice.call(GLImmediate.matrix[GLImmediate.currentMatrix]));
    }

  
  var ___cxa_caught_exceptions=[];function ___cxa_begin_catch(ptr) {
      __ZSt18uncaught_exceptionv.uncaught_exception--;
      ___cxa_caught_exceptions.push(___cxa_last_thrown_exception);
      return ptr;
    }

  function ___errno_location() {
      return ___errno_state;
    }

  function _glEnd() {
      GLImmediate.prepareClientAttributes(GLImmediate.rendererComponents[GLImmediate.VERTEX], true);
      GLImmediate.firstVertex = 0;
      GLImmediate.lastVertex = GLImmediate.vertexCounter / (GLImmediate.stride >> 2);
      GLImmediate.flush();
      GLImmediate.disableBeginEndClientAttributes();
      GLImmediate.mode = -1;
  
      // Pop the old state:
      GLImmediate.enabledClientAttributes = GLImmediate.enabledClientAttributes_preBegin;
      GLImmediate.clientAttributes = GLImmediate.clientAttributes_preBegin;
      GLImmediate.currentRenderer = null; // The set of active client attributes changed, we must re-lookup the renderer to use.
      GLImmediate.modifiedClientAttributes = true;
    }

  function _glutMotionFunc(func) {
      GLUT.motionFunc = func;
    }

  function __ZNSt9exceptionD2Ev() {}

  function _abort() {
      Module['abort']();
    }

  function _glutInitDisplayMode(mode) {
      GLUT.initDisplayMode = mode;
    }

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  
  function _glutReshapeWindow(width, height) {
      GLUT.cancelFullScreen();
      Browser.setCanvasSize(width, height);
      if (GLUT.reshapeFunc) {
        Runtime.dynCall('vii', GLUT.reshapeFunc, [width, height]);
      }
      _glutPostRedisplay();
    }function _glutMainLoop() {
      _glutReshapeWindow(Module['canvas'].width, Module['canvas'].height);
      _glutPostRedisplay();
      throw 'SimulateInfiniteLoop';
    }

  function _glutKeyboardFunc(func) {
      GLUT.keyboardFunc = func;
    }

  var __ZTISt9exception=allocate([allocate([1,0,0,0,0,0,0], "i8", ALLOC_STATIC)+8, 0], "i32", ALLOC_STATIC);

  function __ZTVN10__cxxabiv120__si_class_type_infoE() {
  Module['printErr']('missing function: _ZTVN10__cxxabiv120__si_class_type_infoE'); abort(-1);
  }

  var ___dso_handle=allocate(1, "i32*", ALLOC_STATIC);


var GLctx; GL.init()
GLImmediate.setupFuncs(); Browser.moduleContextCreatedCallbacks.push(function() { GLImmediate.init() });
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
GLEmulation.init();
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
_fgetc.ret = allocate([0], "i8", ALLOC_STATIC);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");


var Math_min = Math.min;
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);

  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var __ZTISt9exception=env.__ZTISt9exception|0;
  var __ZTVN10__cxxabiv120__si_class_type_infoE=env.__ZTVN10__cxxabiv120__si_class_type_infoE|0;
  var ___dso_handle=env.___dso_handle|0;
  var _stderr=env._stderr|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = +env.NaN, inf = +env.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;

  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var asmPrintInt=env.asmPrintInt;
  var asmPrintFloat=env.asmPrintFloat;
  var Math_min=env.min;
  var invoke_vi=env.invoke_vi;
  var invoke_vii=env.invoke_vii;
  var invoke_ii=env.invoke_ii;
  var invoke_viii=env.invoke_viii;
  var invoke_v=env.invoke_v;
  var invoke_viiii=env.invoke_viiii;
  var _glUseProgram=env._glUseProgram;
  var _fabs=env._fabs;
  var _fread=env._fread;
  var __ZSt9terminatev=env.__ZSt9terminatev;
  var _glDeleteProgram=env._glDeleteProgram;
  var __ZSt18uncaught_exceptionv=env.__ZSt18uncaught_exceptionv;
  var _glBindBuffer=env._glBindBuffer;
  var _glTranslatef=env._glTranslatef;
  var _sbrk=env._sbrk;
  var _glutReshapeWindow=env._glutReshapeWindow;
  var _glDisableVertexAttribArray=env._glDisableVertexAttribArray;
  var ___cxa_begin_catch=env.___cxa_begin_catch;
  var _glCreateShader=env._glCreateShader;
  var _glutSwapBuffers=env._glutSwapBuffers;
  var _sysconf=env._sysconf;
  var _close=env._close;
  var _cos=env._cos;
  var _puts=env._puts;
  var _glLoadIdentity=env._glLoadIdentity;
  var _write=env._write;
  var _fsync=env._fsync;
  var _glShaderSource=env._glShaderSource;
  var __ZNSt9exceptionD2Ev=env.__ZNSt9exceptionD2Ev;
  var ___cxa_does_inherit=env.___cxa_does_inherit;
  var _glutMotionFunc=env._glutMotionFunc;
  var _glGetBooleanv=env._glGetBooleanv;
  var _glVertex3fv=env._glVertex3fv;
  var _glutPostRedisplay=env._glutPostRedisplay;
  var _glEnableVertexAttribArray=env._glEnableVertexAttribArray;
  var _glVertexAttribPointer=env._glVertexAttribPointer;
  var _glHint=env._glHint;
  var _send=env._send;
  var _glutDisplayFunc=env._glutDisplayFunc;
  var _glBegin=env._glBegin;
  var ___cxa_is_number_type=env.___cxa_is_number_type;
  var ___cxa_find_matching_catch=env.___cxa_find_matching_catch;
  var _glutInitDisplayMode=env._glutInitDisplayMode;
  var _fscanf=env._fscanf;
  var ___setErrNo=env.___setErrNo;
  var _glDepthFunc=env._glDepthFunc;
  var ___resumeException=env.___resumeException;
  var _glFrustum=env._glFrustum;
  var _glEnable=env._glEnable;
  var _glGetIntegerv=env._glGetIntegerv;
  var _glGetString=env._glGetString;
  var _glutMainLoop=env._glutMainLoop;
  var _glPushMatrix=env._glPushMatrix;
  var _glAttachShader=env._glAttachShader;
  var _read=env._read;
  var _fwrite=env._fwrite;
  var _glColor3d=env._glColor3d;
  var _time=env._time;
  var _fprintf=env._fprintf;
  var _glDetachShader=env._glDetachShader;
  var _gettimeofday=env._gettimeofday;
  var _exit=env._exit;
  var _glCullFace=env._glCullFace;
  var ___cxa_allocate_exception=env.___cxa_allocate_exception;
  var _pwrite=env._pwrite;
  var _open=env._open;
  var _glClearColor=env._glClearColor;
  var _glIsEnabled=env._glIsEnabled;
  var __scanString=env.__scanString;
  var _glGetFloatv=env._glGetFloatv;
  var _glutMouseFunc=env._glutMouseFunc;
  var _glutIdleFunc=env._glutIdleFunc;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var _glutInit=env._glutInit;
  var _glActiveTexture=env._glActiveTexture;
  var _recv=env._recv;
  var _glCompileShader=env._glCompileShader;
  var __getFloat=env.__getFloat;
  var _glRotated=env._glRotated;
  var _abort=env._abort;
  var _fopen=env._fopen;
  var _glFlush=env._glFlush;
  var _sin=env._sin;
  var _emscripten_glVertex3f=env._emscripten_glVertex3f;
  var _glutKeyboardFunc=env._glutKeyboardFunc;
  var _ungetc=env._ungetc;
  var _glLinkProgram=env._glLinkProgram;
  var __reallyNegative=env.__reallyNegative;
  var _glutInitWindowSize=env._glutInitWindowSize;
  var _glClear=env._glClear;
  var _fileno=env._fileno;
  var _glPopMatrix=env._glPopMatrix;
  var _glMatrixMode=env._glMatrixMode;
  var __exit=env.__exit;
  var _glBindAttribLocation=env._glBindAttribLocation;
  var _emscripten_glColor4f=env._emscripten_glColor4f;
  var _fputs=env._fputs;
  var _pread=env._pread;
  var _mkport=env._mkport;
  var _glEnd=env._glEnd;
  var _fflush=env._fflush;
  var ___errno_location=env.___errno_location;
  var _fgetc=env._fgetc;
  var _fputc=env._fputc;
  var ___cxa_throw=env.___cxa_throw;
  var _glutCreateWindow=env._glutCreateWindow;
  var _fclose=env._fclose;
  var _glMultMatrixd=env._glMultMatrixd;
  var _glDisable=env._glDisable;
  var __formatString=env.__formatString;
  var _atexit=env._atexit;
  var _sqrt=env._sqrt;
  var tempFloat = 0.0;

// EMSCRIPTEN_START_FUNCS
function __Z8RectDistPA3_dPdS1_S1_($Rab, $Tab, $a, $b) {
 $Rab = $Rab | 0;
 $Tab = $Tab | 0;
 $a = $a | 0;
 $b = $b | 0;
 var $$ = 0.0, $$0 = 0.0, $$1 = 0.0, $$11 = 0.0, $$12 = 0.0, $$13 = 0.0, $$14 = 0.0, $$17 = 0.0, $$18 = 0.0, $$19 = 0.0, $$2 = 0.0, $$20 = 0.0, $$3 = 0.0, $$5 = 0.0, $$6 = 0.0, $$7 = 0.0, $$8 = 0.0, $$pn = 0.0, $$pre$phi243Z2D = 0.0, $$pre$phi245Z2D = 0.0, $$pre$phi247Z2D = 0.0, $$pre$phi249Z2D = 0.0, $$pre$phi251Z2D = 0.0, $$pre$phi253Z2D = 0.0, $$pre$phi255Z2D = 0.0, $$pre$phi257Z2D = 0.0, $$pre$phi259Z2D = 0.0, $$pre$phi261Z2D = 0.0, $$pre$phi263Z2D = 0.0, $$pre$phiZ2D = 0.0, $0 = 0.0, $1005 = 0.0, $1009 = 0.0, $1013 = 0.0, $1014 = 0.0, $1018 = 0.0, $1019 = 0.0, $102 = 0.0, $1026 = 0.0, $103 = 0.0, $1030 = 0.0, $1034 = 0.0, $1035 = 0.0, $1039 = 0.0, $1040 = 0.0, $1047 = 0.0, $1051 = 0.0, $1055 = 0.0, $1056 = 0.0, $1064 = 0.0, $1066 = 0.0, $1067 = 0.0, $1069 = 0.0, $107 = 0.0, $1071 = 0.0, $1078 = 0, $108 = 0.0, $1085 = 0.0, $1089 = 0.0, $1091 = 0.0, $1095 = 0.0, $1096 = 0.0, $11 = 0.0, $1100 = 0.0, $1101 = 0.0, $1110 = 0.0, $1114 = 0.0, $1116 = 0.0, $1120 = 0.0, $1121 = 0.0, $1125 = 0.0, $1126 = 0.0, $1133 = 0.0, $1137 = 0.0, $1141 = 0.0, $1142 = 0.0, $115 = 0.0, $1150 = 0.0, $1152 = 0.0, $1153 = 0.0, $1156 = 0.0, $1160 = 0.0, $1170 = 0.0, $1176 = 0.0, $1180 = 0.0, $1181 = 0.0, $1185 = 0.0, $1186 = 0.0, $119 = 0.0, $1194 = 0.0, $1198 = 0.0, $12 = 0.0, $1200 = 0.0, $1204 = 0.0, $1205 = 0.0, $1209 = 0.0, $1210 = 0.0, $1217 = 0.0, $1221 = 0.0, $1225 = 0.0, $1226 = 0.0, $123 = 0.0, $1234 = 0.0, $1236 = 0.0, $1237 = 0.0, $124 = 0.0, $1240 = 0.0, $1242 = 0.0, $1254 = 0.0, $1258 = 0.0, $1260 = 0.0, $1264 = 0.0, $1265 = 0.0, $1269 = 0.0, $1270 = 0.0, $1277 = 0.0, $1284 = 0.0, $1288 = 0.0, $1289 = 0.0, $129 = 0.0, $1293 = 0.0, $1294 = 0.0, $13 = 0.0, $1301 = 0.0, $1305 = 0.0, $1309 = 0.0, $1310 = 0.0, $1318 = 0.0, $1320 = 0.0, $1321 = 0.0, $1323 = 0.0, $1327 = 0.0, $133 = 0.0, $1337 = 0.0, $1341 = 0.0, $1345 = 0.0, $1346 = 0.0, $135 = 0.0, $1350 = 0.0, $1351 = 0.0, $1358 = 0.0, $1362 = 0.0, $1366 = 0.0, $1367 = 0.0, $1371 = 0.0, $1372 = 0.0, $1379 = 0.0, $138 = 0.0, $1383 = 0.0, $1387 = 0.0, $1388 = 0.0, $139 = 0.0, $1396 = 0.0, $1398 = 0.0, $1399 = 0.0, $14 = 0.0, $1401 = 0.0, $1403 = 0.0, $1417 = 0.0, $143 = 0.0, $1437 = 0.0, $15 = 0.0, $153 = 0.0, $154 = 0.0, $16 = 0.0, $160 = 0.0, $164 = 0.0, $165 = 0.0, $169 = 0.0, $170 = 0.0, $178 = 0.0, $18 = 0.0, $182 = 0.0, $184 = 0.0, $188 = 0.0, $189 = 0.0, $19 = 0.0, $193 = 0.0, $194 = 0.0, $2 = 0.0, $20 = 0.0, $201 = 0.0, $205 = 0.0, $209 = 0.0, $21 = 0.0, $210 = 0.0, $215 = 0.0, $219 = 0.0, $221 = 0.0, $224 = 0.0, $225 = 0.0, $227 = 0.0, $239 = 0.0, $24 = 0.0, $243 = 0.0, $245 = 0.0, $249 = 0.0, $250 = 0.0, $254 = 0.0, $255 = 0.0, $262 = 0.0, $263 = 0.0, $270 = 0.0, $274 = 0.0, $275 = 0.0, $279 = 0.0, $28 = 0.0, $280 = 0.0, $287 = 0.0, $291 = 0.0, $295 = 0.0, $296 = 0.0, $30 = 0.0, $301 = 0.0, $305 = 0.0, $306 = 0.0, $309 = 0.0, $310 = 0.0, $314 = 0.0, $32 = 0.0, $324 = 0.0, $328 = 0.0, $332 = 0.0, $333 = 0.0, $337 = 0.0, $338 = 0.0, $345 = 0.0, $349 = 0.0, $353 = 0.0, $354 = 0.0, $358 = 0.0, $359 = 0.0, $366 = 0.0, $37 = 0.0, $370 = 0.0, $374 = 0.0, $375 = 0.0, $380 = 0.0, $384 = 0.0, $385 = 0.0, $388 = 0.0, $389 = 0.0, $39 = 0.0, $391 = 0.0, $398 = 0.0, $399 = 0.0, $4 = 0.0, $400 = 0.0, $401 = 0.0, $402 = 0, $409 = 0.0, $41 = 0.0, $413 = 0.0, $415 = 0.0, $419 = 0.0, $420 = 0.0, $424 = 0.0, $425 = 0.0, $434 = 0.0, $435 = 0.0, $439 = 0.0, $44 = 0.0, $441 = 0.0, $445 = 0.0, $446 = 0.0, $450 = 0.0, $451 = 0.0, $458 = 0.0, $462 = 0.0, $466 = 0.0, $467 = 0.0, $472 = 0.0, $476 = 0.0, $478 = 0.0, $481 = 0.0, $482 = 0.0, $486 = 0.0, $496 = 0.0, $50 = 0.0, $502 = 0.0, $506 = 0.0, $507 = 0.0, $51 = 0.0, $511 = 0.0, $512 = 0.0, $52 = 0.0, $520 = 0.0, $524 = 0.0, $526 = 0.0, $53 = 0.0, $530 = 0.0, $531 = 0.0, $535 = 0.0, $536 = 0.0, $54 = 0.0, $543 = 0.0, $547 = 0.0, $55 = 0, $551 = 0.0, $552 = 0.0, $557 = 0.0, $56 = 0.0, $561 = 0.0, $563 = 0.0, $566 = 0.0, $567 = 0.0, $569 = 0.0, $57 = 0.0, $58 = 0.0, $581 = 0.0, $585 = 0.0, $587 = 0.0, $591 = 0.0, $592 = 0.0, $596 = 0.0, $597 = 0.0, $6 = 0.0, $604 = 0.0, $605 = 0.0, $612 = 0.0, $616 = 0.0, $617 = 0.0, $621 = 0.0, $622 = 0.0, $629 = 0.0, $633 = 0.0, $637 = 0.0, $638 = 0.0, $643 = 0.0, $647 = 0.0, $648 = 0.0, $65 = 0.0, $651 = 0.0, $652 = 0.0, $656 = 0.0, $666 = 0.0, $67 = 0.0, $670 = 0.0, $674 = 0.0, $675 = 0.0, $679 = 0.0, $680 = 0.0, $687 = 0.0, $691 = 0.0, $695 = 0.0, $696 = 0.0, $7 = 0.0, $700 = 0.0, $701 = 0.0, $708 = 0.0, $71 = 0.0, $712 = 0.0, $716 = 0.0, $717 = 0.0, $722 = 0.0, $726 = 0.0, $727 = 0.0, $73 = 0.0, $730 = 0.0, $731 = 0.0, $733 = 0.0, $740 = 0.0, $741 = 0.0, $742 = 0.0, $743 = 0, $750 = 0.0, $754 = 0.0, $756 = 0.0, $760 = 0.0, $761 = 0.0, $765 = 0.0, $766 = 0.0, $77 = 0.0, $775 = 0.0, $779 = 0.0, $78 = 0.0, $781 = 0.0, $785 = 0.0, $786 = 0.0, $790 = 0.0, $791 = 0.0, $798 = 0.0, $8 = 0.0, $802 = 0.0, $806 = 0.0, $807 = 0.0, $812 = 0.0, $816 = 0.0, $818 = 0.0, $819 = 0.0, $82 = 0.0, $822 = 0.0, $826 = 0.0, $83 = 0.0, $836 = 0.0, $842 = 0.0, $846 = 0.0, $847 = 0.0, $851 = 0.0, $852 = 0.0, $860 = 0.0, $864 = 0.0, $866 = 0.0, $870 = 0.0, $871 = 0.0, $875 = 0.0, $876 = 0.0, $883 = 0.0, $887 = 0.0, $891 = 0.0, $892 = 0.0, $9 = 0.0, $900 = 0.0, $902 = 0.0, $903 = 0.0, $906 = 0.0, $908 = 0.0, $91 = 0.0, $92 = 0.0, $921 = 0.0, $925 = 0.0, $927 = 0.0, $931 = 0.0, $932 = 0.0, $936 = 0.0, $937 = 0.0, $944 = 0.0, $951 = 0.0, $955 = 0.0, $956 = 0.0, $96 = 0.0, $960 = 0.0, $961 = 0.0, $968 = 0.0, $972 = 0.0, $976 = 0.0, $977 = 0.0, $98 = 0.0, $982 = 0.0, $986 = 0.0, $988 = 0.0, $989 = 0.0, $991 = 0.0, $995 = 0.0, $LB0_lx$0 = 0.0, $LB0_ly$0 = 0.0, $LB0_ux$0 = 0.0, $LB0_uy$0 = 0.0, $LB1_lx$0 = 0.0, $LB1_ly$0 = 0.0, $LB1_ux$0 = 0.0, $LB1_uy$0 = 0.0, $UB0_lx$0 = 0.0, $UB0_ly$0 = 0.0, $UB0_ux$0 = 0.0, $UB0_uy$0 = 0.0, $UB1_lx$0 = 0.0, $UB1_ly$0 = 0.0, $UB1_ux$0 = 0.0, $UB1_uy$0 = 0.0, $sep1$0 = 0.0, $sep1$1 = 0.0, $sep1$2 = 0.0, $sep2$0 = 0.0, $sep2$1 = 0.0, $sep2$2 = 0.0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF64[$Rab >> 3];
 $2 = +HEAPF64[$Rab + 8 >> 3];
 $4 = +HEAPF64[$Rab + 24 >> 3];
 $6 = +HEAPF64[$Rab + 32 >> 3];
 $7 = +HEAPF64[$a >> 3];
 $8 = $0 * $7;
 $9 = $2 * $7;
 $11 = +HEAPF64[$a + 8 >> 3];
 $12 = $4 * $11;
 $13 = $6 * $11;
 $14 = +HEAPF64[$b >> 3];
 $15 = $0 * $14;
 $16 = $4 * $14;
 $18 = +HEAPF64[$b + 8 >> 3];
 $19 = $2 * $18;
 $20 = $6 * $18;
 $21 = +HEAPF64[$Tab >> 3];
 $24 = +HEAPF64[$Tab + 8 >> 3];
 $28 = +HEAPF64[$Rab + 48 >> 3];
 $30 = +HEAPF64[$Tab + 16 >> 3];
 $32 = $0 * $21 + $4 * $24 + $28 * $30;
 $37 = +HEAPF64[$Rab + 56 >> 3];
 $39 = $2 * $21 + $6 * $24 + $30 * $37;
 $41 = +HEAPF64[$Rab + 16 >> 3];
 $44 = +HEAPF64[$Rab + 40 >> 3];
 $50 = $21 * $41 + $24 * $44 + $30 * +HEAPF64[$Rab + 64 >> 3];
 $51 = -$32;
 $52 = $12 - $32;
 $53 = $8 - $32;
 $54 = $8 + $52;
 $55 = $52 > $51;
 $$ = $55 ? $54 : $53;
 $$1 = $55 ? $53 : $54;
 $$2 = $55 ? $52 : $51;
 $$3 = $55 ? $51 : $52;
 $56 = $21 + $19;
 $57 = $15 + $21;
 $58 = $15 + $56;
 if ($21 < $56) {
  $LB1_lx$0 = $21;
  $LB1_ux$0 = $56;
  $UB1_lx$0 = $57;
  $UB1_ux$0 = $58;
 } else {
  $LB1_lx$0 = $56;
  $LB1_ux$0 = $21;
  $UB1_lx$0 = $58;
  $UB1_ux$0 = $57;
 }
 L4 : do {
  if ($$ > $14 & $UB1_ux$0 > $7) {
   do {
    if (!($$1 > $14)) {
     $65 = $9 - $39;
     $67 = -$24 - $16;
     if ($4 < 0.0) {
      $71 = -$4;
     } else {
      $71 = $4;
     }
     if ($71 < 1.0e-7) {
      break L4;
     }
     $73 = -($8 - $14 - $32) / $4;
     if ($73 < 0.0) {
      $77 = 0.0;
     } else {
      if ($73 > $11) {
       $77 = $11;
      } else {
       $77 = $73;
      }
     }
     $78 = $65 + $6 * $77;
     if ($78 < 0.0) {
      $82 = 0.0;
     } else {
      if ($78 > $18) {
       $82 = $18;
      } else {
       $82 = $78;
      }
     }
     $83 = $6 * $82 - $67;
     if ($4 > 0.0) {
      if ($83 > $77 + 1.0e-7) {
       break;
      } else {
       break L4;
      }
     } else {
      if ($83 < $77 + -1.0e-7) {
       break;
      } else {
       break L4;
      }
     }
    }
   } while (0);
   do {
    if ($UB1_lx$0 > $7) {
     $$pre$phi243Z2D = $39 - $9;
     $$pre$phiZ2D = $16 + $24;
    } else {
     $91 = $16 + $24;
     $92 = $39 - $9;
     if ($2 < 0.0) {
      $96 = -$2;
     } else {
      $96 = $2;
     }
     if ($96 < 1.0e-7) {
      break L4;
     }
     $98 = -($57 - $7) / $2;
     if ($98 < 0.0) {
      $102 = 0.0;
     } else {
      if ($98 > $18) {
       $102 = $18;
      } else {
       $102 = $98;
      }
     }
     $103 = $91 + $6 * $102;
     if ($103 < 0.0) {
      $107 = 0.0;
     } else {
      if ($103 > $11) {
       $107 = $11;
      } else {
       $107 = $103;
      }
     }
     $108 = $6 * $107 - $92;
     if ($2 > 0.0) {
      if ($108 > $102 + 1.0e-7) {
       $$pre$phi243Z2D = $92;
       $$pre$phiZ2D = $91;
       break;
      } else {
       break L4;
      }
     } else {
      if ($108 < $102 + -1.0e-7) {
       $$pre$phi243Z2D = $92;
       $$pre$phiZ2D = $91;
       break;
      } else {
       break L4;
      }
     }
    }
   } while (0);
   $115 = 1.0 - $6 * $6;
   if ($115 == 0.0) {
    $123 = 0.0;
   } else {
    $119 = ($$pre$phiZ2D - $6 * $$pre$phi243Z2D) / $115;
    if ($119 < 0.0) {
     $123 = 0.0;
    } else {
     if ($119 > $11) {
      $123 = $11;
     } else {
      $123 = $119;
     }
    }
   }
   $124 = $6 * $123 - $$pre$phi243Z2D;
   if ($124 < 0.0) {
    if ($$pre$phiZ2D < 0.0) {
     $133 = 0.0;
     $139 = 0.0;
    } else {
     if ($$pre$phiZ2D > $11) {
      $133 = 0.0;
      $139 = $11;
     } else {
      $133 = 0.0;
      $139 = $$pre$phiZ2D;
     }
    }
   } else {
    if ($124 > $18) {
     $129 = $$pre$phiZ2D + $20;
     if ($129 < 0.0) {
      $133 = $18;
      $139 = 0.0;
     } else {
      if ($129 > $11) {
       $133 = $18;
       $139 = $11;
      } else {
       $133 = $18;
       $139 = $129;
      }
     }
    } else {
     $133 = $124;
     $139 = $123;
    }
   }
   $135 = $57 + $133 * $2 - $7;
   $138 = $$pre$phiZ2D + $133 * $6 - $139;
   $143 = $30 + $14 * $28 + $133 * $37;
   $$0 = +Math_sqrt(+($135 * $135 + $138 * $138 + $143 * $143));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L59 : do {
  if ($$1 < 0.0 & $LB1_ux$0 > $7) {
   do {
    if (!($$ < 0.0)) {
     $153 = -$4;
     $154 = $9 - $39;
     if (($4 > -0.0 ? $4 : $153) < 1.0e-7) {
      break L59;
     }
     $160 = -($32 - $8) / $153;
     if ($160 < 0.0) {
      $164 = 0.0;
     } else {
      if ($160 > $11) {
       $164 = $11;
      } else {
       $164 = $160;
      }
     }
     $165 = $154 + $6 * $164;
     if ($165 < 0.0) {
      $169 = 0.0;
     } else {
      if ($165 > $18) {
       $169 = $18;
      } else {
       $169 = $165;
      }
     }
     $170 = $24 + $6 * $169;
     if ($4 < -0.0) {
      if ($170 > $164 + 1.0e-7) {
       break;
      } else {
       break L59;
      }
     } else {
      if ($170 < $164 + -1.0e-7) {
       break;
      } else {
       break L59;
      }
     }
    }
   } while (0);
   do {
    if ($LB1_lx$0 > $7) {
     $$pre$phi245Z2D = $39 - $9;
    } else {
     $178 = $39 - $9;
     if ($2 < 0.0) {
      $182 = -$2;
     } else {
      $182 = $2;
     }
     if ($182 < 1.0e-7) {
      break L59;
     }
     $184 = -($21 - $7) / $2;
     if ($184 < 0.0) {
      $188 = 0.0;
     } else {
      if ($184 > $18) {
       $188 = $18;
      } else {
       $188 = $184;
      }
     }
     $189 = $6 * $188 + $24;
     if ($189 < 0.0) {
      $193 = 0.0;
     } else {
      if ($189 > $11) {
       $193 = $11;
      } else {
       $193 = $189;
      }
     }
     $194 = $6 * $193 - $178;
     if ($2 > 0.0) {
      if ($194 > $188 + 1.0e-7) {
       $$pre$phi245Z2D = $178;
       break;
      } else {
       break L59;
      }
     } else {
      if ($194 < $188 + -1.0e-7) {
       $$pre$phi245Z2D = $178;
       break;
      } else {
       break L59;
      }
     }
    }
   } while (0);
   $201 = 1.0 - $6 * $6;
   if ($201 == 0.0) {
    $209 = 0.0;
   } else {
    $205 = ($24 - $6 * $$pre$phi245Z2D) / $201;
    if ($205 < 0.0) {
     $209 = 0.0;
    } else {
     if ($205 > $11) {
      $209 = $11;
     } else {
      $209 = $205;
     }
    }
   }
   $210 = $6 * $209 - $$pre$phi245Z2D;
   if ($210 < 0.0) {
    if ($24 < 0.0) {
     $219 = 0.0;
     $225 = 0.0;
    } else {
     if ($24 > $11) {
      $219 = 0.0;
      $225 = $11;
     } else {
      $219 = 0.0;
      $225 = $24;
     }
    }
   } else {
    if ($210 > $18) {
     $215 = $20 + $24;
     if ($215 < 0.0) {
      $219 = $18;
      $225 = 0.0;
     } else {
      if ($215 > $11) {
       $219 = $18;
       $225 = $11;
      } else {
       $219 = $18;
       $225 = $215;
      }
     }
    } else {
     $219 = $210;
     $225 = $209;
    }
   }
   $221 = $21 + $219 * $2 - $7;
   $224 = $24 + $219 * $6 - $225;
   $227 = $30 + $219 * $37;
   $$0 = +Math_sqrt(+($221 * $221 + $224 * $224 + $227 * $227));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L111 : do {
  if ($$2 > $14 & $UB1_lx$0 < 0.0) {
   do {
    if (!($$3 > $14)) {
     $239 = -$24 - $16;
     if ($4 < 0.0) {
      $243 = -$4;
     } else {
      $243 = $4;
     }
     if ($243 < 1.0e-7) {
      break L111;
     }
     $245 = -($51 - $14) / $4;
     if ($245 < 0.0) {
      $249 = 0.0;
     } else {
      if ($245 > $11) {
       $249 = $11;
      } else {
       $249 = $245;
      }
     }
     $250 = $6 * $249 - $39;
     if ($250 < 0.0) {
      $254 = 0.0;
     } else {
      if ($250 > $18) {
       $254 = $18;
      } else {
       $254 = $250;
      }
     }
     $255 = $6 * $254 - $239;
     if ($4 > 0.0) {
      if ($255 > $249 + 1.0e-7) {
       break;
      } else {
       break L111;
      }
     } else {
      if ($255 < $249 + -1.0e-7) {
       break;
      } else {
       break L111;
      }
     }
    }
   } while (0);
   do {
    if ($UB1_ux$0 < 0.0) {
     $$pre$phi247Z2D = $16 + $24;
    } else {
     $262 = -$2;
     $263 = $16 + $24;
     if (($2 > -0.0 ? $2 : $262) < 1.0e-7) {
      break L111;
     }
     $270 = -(-$21 - $15) / $262;
     if ($270 < 0.0) {
      $274 = 0.0;
     } else {
      if ($270 > $18) {
       $274 = $18;
      } else {
       $274 = $270;
      }
     }
     $275 = $263 + $6 * $274;
     if ($275 < 0.0) {
      $279 = 0.0;
     } else {
      if ($275 > $11) {
       $279 = $11;
      } else {
       $279 = $275;
      }
     }
     $280 = $6 * $279 - $39;
     if ($2 < -0.0) {
      if ($280 > $274 + 1.0e-7) {
       $$pre$phi247Z2D = $263;
       break;
      } else {
       break L111;
      }
     } else {
      if ($280 < $274 + -1.0e-7) {
       $$pre$phi247Z2D = $263;
       break;
      } else {
       break L111;
      }
     }
    }
   } while (0);
   $287 = 1.0 - $6 * $6;
   if ($287 == 0.0) {
    $295 = 0.0;
   } else {
    $291 = ($$pre$phi247Z2D - $6 * $39) / $287;
    if ($291 < 0.0) {
     $295 = 0.0;
    } else {
     if ($291 > $11) {
      $295 = $11;
     } else {
      $295 = $291;
     }
    }
   }
   $296 = $6 * $295 - $39;
   if ($296 < 0.0) {
    if ($$pre$phi247Z2D < 0.0) {
     $305 = 0.0;
     $310 = 0.0;
    } else {
     if ($$pre$phi247Z2D > $11) {
      $305 = 0.0;
      $310 = $11;
     } else {
      $305 = 0.0;
      $310 = $$pre$phi247Z2D;
     }
    }
   } else {
    if ($296 > $18) {
     $301 = $$pre$phi247Z2D + $20;
     if ($301 < 0.0) {
      $305 = $18;
      $310 = 0.0;
     } else {
      if ($301 > $11) {
       $305 = $18;
       $310 = $11;
      } else {
       $305 = $18;
       $310 = $301;
      }
     }
    } else {
     $305 = $296;
     $310 = $295;
    }
   }
   $306 = $57 + $305 * $2;
   $309 = $$pre$phi247Z2D + $305 * $6 - $310;
   $314 = $30 + $14 * $28 + $305 * $37;
   $$0 = +Math_sqrt(+($306 * $306 + $309 * $309 + $314 * $314));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L163 : do {
  if ($$3 < 0.0 & $LB1_lx$0 < 0.0) {
   do {
    if (!($$2 < 0.0)) {
     $324 = -$4;
     if (($4 > -0.0 ? $4 : $324) < 1.0e-7) {
      break L163;
     }
     $328 = $51 / $324;
     if ($328 < 0.0) {
      $332 = 0.0;
     } else {
      if ($328 > $11) {
       $332 = $11;
      } else {
       $332 = $328;
      }
     }
     $333 = $6 * $332 - $39;
     if ($333 < 0.0) {
      $337 = 0.0;
     } else {
      if ($333 > $18) {
       $337 = $18;
      } else {
       $337 = $333;
      }
     }
     $338 = $24 + $6 * $337;
     if ($4 < -0.0) {
      if ($338 > $332 + 1.0e-7) {
       break;
      } else {
       break L163;
      }
     } else {
      if ($338 < $332 + -1.0e-7) {
       break;
      } else {
       break L163;
      }
     }
    }
   } while (0);
   do {
    if (!($LB1_ux$0 < 0.0)) {
     $345 = -$2;
     if (($2 > -0.0 ? $2 : $345) < 1.0e-7) {
      break L163;
     }
     $349 = $21 / $345;
     if ($349 < 0.0) {
      $353 = 0.0;
     } else {
      if ($349 > $18) {
       $353 = $18;
      } else {
       $353 = $349;
      }
     }
     $354 = $6 * $353 + $24;
     if ($354 < 0.0) {
      $358 = 0.0;
     } else {
      if ($354 > $11) {
       $358 = $11;
      } else {
       $358 = $354;
      }
     }
     $359 = $6 * $358 - $39;
     if ($2 < -0.0) {
      if ($359 > $353 + 1.0e-7) {
       break;
      } else {
       break L163;
      }
     } else {
      if ($359 < $353 + -1.0e-7) {
       break;
      } else {
       break L163;
      }
     }
    }
   } while (0);
   $366 = 1.0 - $6 * $6;
   if ($366 == 0.0) {
    $374 = 0.0;
   } else {
    $370 = ($24 - $6 * $39) / $366;
    if ($370 < 0.0) {
     $374 = 0.0;
    } else {
     if ($370 > $11) {
      $374 = $11;
     } else {
      $374 = $370;
     }
    }
   }
   $375 = $6 * $374 - $39;
   if ($375 < 0.0) {
    if ($24 < 0.0) {
     $384 = 0.0;
     $389 = 0.0;
    } else {
     if ($24 > $11) {
      $384 = 0.0;
      $389 = $11;
     } else {
      $384 = 0.0;
      $389 = $24;
     }
    }
   } else {
    if ($375 > $18) {
     $380 = $20 + $24;
     if ($380 < 0.0) {
      $384 = $18;
      $389 = 0.0;
     } else {
      if ($380 > $11) {
       $384 = $18;
       $389 = $11;
      } else {
       $384 = $18;
       $389 = $380;
      }
     }
    } else {
     $384 = $375;
     $389 = $374;
    }
   }
   $385 = $21 + $384 * $2;
   $388 = $24 + $384 * $6 - $389;
   $391 = $30 + $384 * $37;
   $$0 = +Math_sqrt(+($385 * $385 + $388 * $388 + $391 * $391));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 $398 = -$39;
 $399 = $13 - $39;
 $400 = $9 - $39;
 $401 = $9 + $399;
 $402 = $399 > $398;
 $$5 = $402 ? $398 : $399;
 $$6 = $402 ? $399 : $398;
 $$7 = $402 ? $400 : $401;
 $$8 = $402 ? $401 : $400;
 if ($21 < $57) {
  $LB0_lx$0 = $21;
  $LB0_ux$0 = $57;
  $UB0_lx$0 = $56;
  $UB0_ux$0 = $58;
 } else {
  $LB0_lx$0 = $57;
  $LB0_ux$0 = $21;
  $UB0_lx$0 = $58;
  $UB0_ux$0 = $56;
 }
 L214 : do {
  if ($$8 > $18 & $UB0_ux$0 > $7) {
   do {
    if (!($$7 > $18)) {
     $409 = -$24 - $20;
     if ($6 < 0.0) {
      $413 = -$6;
     } else {
      $413 = $6;
     }
     if ($413 < 1.0e-7) {
      break L214;
     }
     $415 = -($400 - $18) / $6;
     if ($415 < 0.0) {
      $419 = 0.0;
     } else {
      if ($415 > $11) {
       $419 = $11;
      } else {
       $419 = $415;
      }
     }
     $420 = $53 + $4 * $419;
     if ($420 < 0.0) {
      $424 = 0.0;
     } else {
      if ($420 > $14) {
       $424 = $14;
      } else {
       $424 = $420;
      }
     }
     $425 = $4 * $424 - $409;
     if ($6 > 0.0) {
      if ($425 > $419 + 1.0e-7) {
       break;
      } else {
       break L214;
      }
     } else {
      if ($425 < $419 + -1.0e-7) {
       break;
      } else {
       break L214;
      }
     }
    }
   } while (0);
   do {
    if ($UB0_lx$0 > $7) {
     $$pre$phi249Z2D = $20 + $24;
     $$pre$phi251Z2D = $32 - $8;
    } else {
     $434 = $20 + $24;
     $435 = $32 - $8;
     if ($0 < 0.0) {
      $439 = -$0;
     } else {
      $439 = $0;
     }
     if ($439 < 1.0e-7) {
      break L214;
     }
     $441 = -($19 + ($21 - $7)) / $0;
     if ($441 < 0.0) {
      $445 = 0.0;
     } else {
      if ($441 > $14) {
       $445 = $14;
      } else {
       $445 = $441;
      }
     }
     $446 = $434 + $4 * $445;
     if ($446 < 0.0) {
      $450 = 0.0;
     } else {
      if ($446 > $11) {
       $450 = $11;
      } else {
       $450 = $446;
      }
     }
     $451 = $4 * $450 - $435;
     if ($0 > 0.0) {
      if ($451 > $445 + 1.0e-7) {
       $$pre$phi249Z2D = $434;
       $$pre$phi251Z2D = $435;
       break;
      } else {
       break L214;
      }
     } else {
      if ($451 < $445 + -1.0e-7) {
       $$pre$phi249Z2D = $434;
       $$pre$phi251Z2D = $435;
       break;
      } else {
       break L214;
      }
     }
    }
   } while (0);
   $458 = 1.0 - $4 * $4;
   if ($458 == 0.0) {
    $466 = 0.0;
   } else {
    $462 = ($$pre$phi249Z2D - $4 * $$pre$phi251Z2D) / $458;
    if ($462 < 0.0) {
     $466 = 0.0;
    } else {
     if ($462 > $11) {
      $466 = $11;
     } else {
      $466 = $462;
     }
    }
   }
   $467 = $4 * $466 - $$pre$phi251Z2D;
   if ($467 < 0.0) {
    if ($$pre$phi249Z2D < 0.0) {
     $476 = 0.0;
     $482 = 0.0;
    } else {
     if ($$pre$phi249Z2D > $11) {
      $476 = 0.0;
      $482 = $11;
     } else {
      $476 = 0.0;
      $482 = $$pre$phi249Z2D;
     }
    }
   } else {
    if ($467 > $14) {
     $472 = $$pre$phi249Z2D + $16;
     if ($472 < 0.0) {
      $476 = $14;
      $482 = 0.0;
     } else {
      if ($472 > $11) {
       $476 = $14;
       $482 = $11;
      } else {
       $476 = $14;
       $482 = $472;
      }
     }
    } else {
     $476 = $467;
     $482 = $466;
    }
   }
   $478 = $56 + $476 * $0 - $7;
   $481 = $$pre$phi249Z2D + $476 * $4 - $482;
   $486 = $30 + $18 * $37 + $476 * $28;
   $$0 = +Math_sqrt(+($478 * $478 + $481 * $481 + $486 * $486));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L269 : do {
  if ($$7 < 0.0 & $LB0_ux$0 > $7) {
   do {
    if (!($$8 < 0.0)) {
     $496 = -$6;
     if (($6 > -0.0 ? $6 : $496) < 1.0e-7) {
      break L269;
     }
     $502 = -($39 - $9) / $496;
     if ($502 < 0.0) {
      $506 = 0.0;
     } else {
      if ($502 > $11) {
       $506 = $11;
      } else {
       $506 = $502;
      }
     }
     $507 = $53 + $4 * $506;
     if ($507 < 0.0) {
      $511 = 0.0;
     } else {
      if ($507 > $14) {
       $511 = $14;
      } else {
       $511 = $507;
      }
     }
     $512 = $24 + $4 * $511;
     if ($6 < -0.0) {
      if ($512 > $506 + 1.0e-7) {
       break;
      } else {
       break L269;
      }
     } else {
      if ($512 < $506 + -1.0e-7) {
       break;
      } else {
       break L269;
      }
     }
    }
   } while (0);
   do {
    if ($LB0_lx$0 > $7) {
     $$pre$phi253Z2D = $32 - $8;
    } else {
     $520 = $32 - $8;
     if ($0 < 0.0) {
      $524 = -$0;
     } else {
      $524 = $0;
     }
     if ($524 < 1.0e-7) {
      break L269;
     }
     $526 = -($21 - $7) / $0;
     if ($526 < 0.0) {
      $530 = 0.0;
     } else {
      if ($526 > $14) {
       $530 = $14;
      } else {
       $530 = $526;
      }
     }
     $531 = $4 * $530 + $24;
     if ($531 < 0.0) {
      $535 = 0.0;
     } else {
      if ($531 > $11) {
       $535 = $11;
      } else {
       $535 = $531;
      }
     }
     $536 = $4 * $535 - $520;
     if ($0 > 0.0) {
      if ($536 > $530 + 1.0e-7) {
       $$pre$phi253Z2D = $520;
       break;
      } else {
       break L269;
      }
     } else {
      if ($536 < $530 + -1.0e-7) {
       $$pre$phi253Z2D = $520;
       break;
      } else {
       break L269;
      }
     }
    }
   } while (0);
   $543 = 1.0 - $4 * $4;
   if ($543 == 0.0) {
    $551 = 0.0;
   } else {
    $547 = ($24 - $4 * $$pre$phi253Z2D) / $543;
    if ($547 < 0.0) {
     $551 = 0.0;
    } else {
     if ($547 > $11) {
      $551 = $11;
     } else {
      $551 = $547;
     }
    }
   }
   $552 = $4 * $551 - $$pre$phi253Z2D;
   if ($552 < 0.0) {
    if ($24 < 0.0) {
     $561 = 0.0;
     $567 = 0.0;
    } else {
     if ($24 > $11) {
      $561 = 0.0;
      $567 = $11;
     } else {
      $561 = 0.0;
      $567 = $24;
     }
    }
   } else {
    if ($552 > $14) {
     $557 = $16 + $24;
     if ($557 < 0.0) {
      $561 = $14;
      $567 = 0.0;
     } else {
      if ($557 > $11) {
       $561 = $14;
       $567 = $11;
      } else {
       $561 = $14;
       $567 = $557;
      }
     }
    } else {
     $561 = $552;
     $567 = $551;
    }
   }
   $563 = $21 + $561 * $0 - $7;
   $566 = $24 + $561 * $4 - $567;
   $569 = $30 + $561 * $28;
   $$0 = +Math_sqrt(+($563 * $563 + $566 * $566 + $569 * $569));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L321 : do {
  if ($$6 > $18 & $UB0_lx$0 < 0.0) {
   do {
    if (!($$5 > $18)) {
     $581 = -$24 - $20;
     if ($6 < 0.0) {
      $585 = -$6;
     } else {
      $585 = $6;
     }
     if ($585 < 1.0e-7) {
      break L321;
     }
     $587 = -($398 - $18) / $6;
     if ($587 < 0.0) {
      $591 = 0.0;
     } else {
      if ($587 > $11) {
       $591 = $11;
      } else {
       $591 = $587;
      }
     }
     $592 = $4 * $591 - $32;
     if ($592 < 0.0) {
      $596 = 0.0;
     } else {
      if ($592 > $14) {
       $596 = $14;
      } else {
       $596 = $592;
      }
     }
     $597 = $4 * $596 - $581;
     if ($6 > 0.0) {
      if ($597 > $591 + 1.0e-7) {
       break;
      } else {
       break L321;
      }
     } else {
      if ($597 < $591 + -1.0e-7) {
       break;
      } else {
       break L321;
      }
     }
    }
   } while (0);
   do {
    if ($UB0_ux$0 < 0.0) {
     $$pre$phi255Z2D = $20 + $24;
    } else {
     $604 = -$0;
     $605 = $20 + $24;
     if (($0 > -0.0 ? $0 : $604) < 1.0e-7) {
      break L321;
     }
     $612 = -(-$21 - $19) / $604;
     if ($612 < 0.0) {
      $616 = 0.0;
     } else {
      if ($612 > $14) {
       $616 = $14;
      } else {
       $616 = $612;
      }
     }
     $617 = $605 + $4 * $616;
     if ($617 < 0.0) {
      $621 = 0.0;
     } else {
      if ($617 > $11) {
       $621 = $11;
      } else {
       $621 = $617;
      }
     }
     $622 = $4 * $621 - $32;
     if ($0 < -0.0) {
      if ($622 > $616 + 1.0e-7) {
       $$pre$phi255Z2D = $605;
       break;
      } else {
       break L321;
      }
     } else {
      if ($622 < $616 + -1.0e-7) {
       $$pre$phi255Z2D = $605;
       break;
      } else {
       break L321;
      }
     }
    }
   } while (0);
   $629 = 1.0 - $4 * $4;
   if ($629 == 0.0) {
    $637 = 0.0;
   } else {
    $633 = ($$pre$phi255Z2D - $4 * $32) / $629;
    if ($633 < 0.0) {
     $637 = 0.0;
    } else {
     if ($633 > $11) {
      $637 = $11;
     } else {
      $637 = $633;
     }
    }
   }
   $638 = $4 * $637 - $32;
   if ($638 < 0.0) {
    if ($$pre$phi255Z2D < 0.0) {
     $647 = 0.0;
     $652 = 0.0;
    } else {
     if ($$pre$phi255Z2D > $11) {
      $647 = 0.0;
      $652 = $11;
     } else {
      $647 = 0.0;
      $652 = $$pre$phi255Z2D;
     }
    }
   } else {
    if ($638 > $14) {
     $643 = $$pre$phi255Z2D + $16;
     if ($643 < 0.0) {
      $647 = $14;
      $652 = 0.0;
     } else {
      if ($643 > $11) {
       $647 = $14;
       $652 = $11;
      } else {
       $647 = $14;
       $652 = $643;
      }
     }
    } else {
     $647 = $638;
     $652 = $637;
    }
   }
   $648 = $56 + $647 * $0;
   $651 = $$pre$phi255Z2D + $647 * $4 - $652;
   $656 = $30 + $18 * $37 + $647 * $28;
   $$0 = +Math_sqrt(+($648 * $648 + $651 * $651 + $656 * $656));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L373 : do {
  if ($$5 < 0.0 & $LB0_lx$0 < 0.0) {
   do {
    if (!($$6 < 0.0)) {
     $666 = -$6;
     if (($6 > -0.0 ? $6 : $666) < 1.0e-7) {
      break L373;
     }
     $670 = $398 / $666;
     if ($670 < 0.0) {
      $674 = 0.0;
     } else {
      if ($670 > $11) {
       $674 = $11;
      } else {
       $674 = $670;
      }
     }
     $675 = $4 * $674 - $32;
     if ($675 < 0.0) {
      $679 = 0.0;
     } else {
      if ($675 > $14) {
       $679 = $14;
      } else {
       $679 = $675;
      }
     }
     $680 = $24 + $4 * $679;
     if ($6 < -0.0) {
      if ($680 > $674 + 1.0e-7) {
       break;
      } else {
       break L373;
      }
     } else {
      if ($680 < $674 + -1.0e-7) {
       break;
      } else {
       break L373;
      }
     }
    }
   } while (0);
   do {
    if (!($LB0_ux$0 < 0.0)) {
     $687 = -$0;
     if (($0 > -0.0 ? $0 : $687) < 1.0e-7) {
      break L373;
     }
     $691 = $21 / $687;
     if ($691 < 0.0) {
      $695 = 0.0;
     } else {
      if ($691 > $14) {
       $695 = $14;
      } else {
       $695 = $691;
      }
     }
     $696 = $4 * $695 + $24;
     if ($696 < 0.0) {
      $700 = 0.0;
     } else {
      if ($696 > $11) {
       $700 = $11;
      } else {
       $700 = $696;
      }
     }
     $701 = $4 * $700 - $32;
     if ($0 < -0.0) {
      if ($701 > $695 + 1.0e-7) {
       break;
      } else {
       break L373;
      }
     } else {
      if ($701 < $695 + -1.0e-7) {
       break;
      } else {
       break L373;
      }
     }
    }
   } while (0);
   $708 = 1.0 - $4 * $4;
   if ($708 == 0.0) {
    $716 = 0.0;
   } else {
    $712 = ($24 - $4 * $32) / $708;
    if ($712 < 0.0) {
     $716 = 0.0;
    } else {
     if ($712 > $11) {
      $716 = $11;
     } else {
      $716 = $712;
     }
    }
   }
   $717 = $4 * $716 - $32;
   if ($717 < 0.0) {
    if ($24 < 0.0) {
     $726 = 0.0;
     $731 = 0.0;
    } else {
     if ($24 > $11) {
      $726 = 0.0;
      $731 = $11;
     } else {
      $726 = 0.0;
      $731 = $24;
     }
    }
   } else {
    if ($717 > $14) {
     $722 = $16 + $24;
     if ($722 < 0.0) {
      $726 = $14;
      $731 = 0.0;
     } else {
      if ($722 > $11) {
       $726 = $14;
       $731 = $11;
      } else {
       $726 = $14;
       $731 = $722;
      }
     }
    } else {
     $726 = $717;
     $731 = $716;
    }
   }
   $727 = $21 + $726 * $0;
   $730 = $24 + $726 * $4 - $731;
   $733 = $30 + $726 * $28;
   $$0 = +Math_sqrt(+($727 * $727 + $730 * $730 + $733 * $733));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 $740 = $20 + $24;
 $741 = $16 + $24;
 $742 = $16 + $740;
 $743 = $53 > $51;
 $$11 = $743 ? $51 : $53;
 $$12 = $743 ? $53 : $51;
 $$13 = $743 ? $52 : $54;
 $$14 = $743 ? $54 : $52;
 if ($24 < $740) {
  $LB1_ly$0 = $24;
  $LB1_uy$0 = $740;
  $UB1_ly$0 = $741;
  $UB1_uy$0 = $742;
 } else {
  $LB1_ly$0 = $740;
  $LB1_uy$0 = $24;
  $UB1_ly$0 = $742;
  $UB1_uy$0 = $741;
 }
 L424 : do {
  if ($$14 > $14 & $UB1_uy$0 > $11) {
   do {
    if (!($$13 > $14)) {
     $750 = -$21 - $15;
     if ($0 < 0.0) {
      $754 = -$0;
     } else {
      $754 = $0;
     }
     if ($754 < 1.0e-7) {
      break L424;
     }
     $756 = -($52 - $14) / $0;
     if ($756 < 0.0) {
      $760 = 0.0;
     } else {
      if ($756 > $7) {
       $760 = $7;
      } else {
       $760 = $756;
      }
     }
     $761 = $399 + $2 * $760;
     if ($761 < 0.0) {
      $765 = 0.0;
     } else {
      if ($761 > $18) {
       $765 = $18;
      } else {
       $765 = $761;
      }
     }
     $766 = $2 * $765 - $750;
     if ($0 > 0.0) {
      if ($766 > $760 + 1.0e-7) {
       break;
      } else {
       break L424;
      }
     } else {
      if ($766 < $760 + -1.0e-7) {
       break;
      } else {
       break L424;
      }
     }
    }
   } while (0);
   do {
    if ($UB1_ly$0 > $11) {
     $$pre$phi257Z2D = $39 - $13;
    } else {
     $775 = $39 - $13;
     if ($6 < 0.0) {
      $779 = -$6;
     } else {
      $779 = $6;
     }
     if ($779 < 1.0e-7) {
      break L424;
     }
     $781 = -($16 + ($24 - $11)) / $6;
     if ($781 < 0.0) {
      $785 = 0.0;
     } else {
      if ($781 > $18) {
       $785 = $18;
      } else {
       $785 = $781;
      }
     }
     $786 = $57 + $2 * $785;
     if ($786 < 0.0) {
      $790 = 0.0;
     } else {
      if ($786 > $7) {
       $790 = $7;
      } else {
       $790 = $786;
      }
     }
     $791 = $2 * $790 - $775;
     if ($6 > 0.0) {
      if ($791 > $785 + 1.0e-7) {
       $$pre$phi257Z2D = $775;
       break;
      } else {
       break L424;
      }
     } else {
      if ($791 < $785 + -1.0e-7) {
       $$pre$phi257Z2D = $775;
       break;
      } else {
       break L424;
      }
     }
    }
   } while (0);
   $798 = 1.0 - $2 * $2;
   if ($798 == 0.0) {
    $806 = 0.0;
   } else {
    $802 = ($57 - $2 * $$pre$phi257Z2D) / $798;
    if ($802 < 0.0) {
     $806 = 0.0;
    } else {
     if ($802 > $7) {
      $806 = $7;
     } else {
      $806 = $802;
     }
    }
   }
   $807 = $2 * $806 - $$pre$phi257Z2D;
   if ($807 < 0.0) {
    if ($57 < 0.0) {
     $816 = 0.0;
     $819 = 0.0;
    } else {
     if ($57 > $7) {
      $816 = 0.0;
      $819 = $7;
     } else {
      $816 = 0.0;
      $819 = $57;
     }
    }
   } else {
    if ($807 > $18) {
     $812 = $57 + $19;
     if ($812 < 0.0) {
      $816 = $18;
      $819 = 0.0;
     } else {
      if ($812 > $7) {
       $816 = $18;
       $819 = $7;
      } else {
       $816 = $18;
       $819 = $812;
      }
     }
    } else {
     $816 = $807;
     $819 = $806;
    }
   }
   $818 = $57 + $816 * $2 - $819;
   $822 = $741 + $816 * $6 - $11;
   $826 = $30 + $14 * $28 + $816 * $37;
   $$0 = +Math_sqrt(+($818 * $818 + $822 * $822 + $826 * $826));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L479 : do {
  if ($$13 < 0.0 & $LB1_uy$0 > $11) {
   do {
    if (!($$14 < 0.0)) {
     $836 = -$0;
     if (($0 > -0.0 ? $0 : $836) < 1.0e-7) {
      break L479;
     }
     $842 = -($32 - $12) / $836;
     if ($842 < 0.0) {
      $846 = 0.0;
     } else {
      if ($842 > $7) {
       $846 = $7;
      } else {
       $846 = $842;
      }
     }
     $847 = $399 + $2 * $846;
     if ($847 < 0.0) {
      $851 = 0.0;
     } else {
      if ($847 > $18) {
       $851 = $18;
      } else {
       $851 = $847;
      }
     }
     $852 = $21 + $2 * $851;
     if ($0 < -0.0) {
      if ($852 > $846 + 1.0e-7) {
       break;
      } else {
       break L479;
      }
     } else {
      if ($852 < $846 + -1.0e-7) {
       break;
      } else {
       break L479;
      }
     }
    }
   } while (0);
   do {
    if ($LB1_ly$0 > $11) {
     $$pre$phi259Z2D = $39 - $13;
    } else {
     $860 = $39 - $13;
     if ($6 < 0.0) {
      $864 = -$6;
     } else {
      $864 = $6;
     }
     if ($864 < 1.0e-7) {
      break L479;
     }
     $866 = -($24 - $11) / $6;
     if ($866 < 0.0) {
      $870 = 0.0;
     } else {
      if ($866 > $18) {
       $870 = $18;
      } else {
       $870 = $866;
      }
     }
     $871 = $2 * $870 + $21;
     if ($871 < 0.0) {
      $875 = 0.0;
     } else {
      if ($871 > $7) {
       $875 = $7;
      } else {
       $875 = $871;
      }
     }
     $876 = $2 * $875 - $860;
     if ($6 > 0.0) {
      if ($876 > $870 + 1.0e-7) {
       $$pre$phi259Z2D = $860;
       break;
      } else {
       break L479;
      }
     } else {
      if ($876 < $870 + -1.0e-7) {
       $$pre$phi259Z2D = $860;
       break;
      } else {
       break L479;
      }
     }
    }
   } while (0);
   $883 = 1.0 - $2 * $2;
   if ($883 == 0.0) {
    $891 = 0.0;
   } else {
    $887 = ($21 - $2 * $$pre$phi259Z2D) / $883;
    if ($887 < 0.0) {
     $891 = 0.0;
    } else {
     if ($887 > $7) {
      $891 = $7;
     } else {
      $891 = $887;
     }
    }
   }
   $892 = $2 * $891 - $$pre$phi259Z2D;
   if ($892 < 0.0) {
    if ($21 < 0.0) {
     $900 = 0.0;
     $903 = 0.0;
    } else {
     if ($21 > $7) {
      $900 = 0.0;
      $903 = $7;
     } else {
      $900 = 0.0;
      $903 = $21;
     }
    }
   } else {
    if ($892 > $18) {
     if ($56 < 0.0) {
      $900 = $18;
      $903 = 0.0;
     } else {
      if ($56 > $7) {
       $900 = $18;
       $903 = $7;
      } else {
       $900 = $18;
       $903 = $56;
      }
     }
    } else {
     $900 = $892;
     $903 = $891;
    }
   }
   $902 = $21 + $900 * $2 - $903;
   $906 = $24 + $900 * $6 - $11;
   $908 = $30 + $900 * $37;
   $$0 = +Math_sqrt(+($902 * $902 + $906 * $906 + $908 * $908));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L531 : do {
  if ($$12 > $14 & $UB1_ly$0 < 0.0) {
   do {
    if (!($$11 > $14)) {
     $921 = -$15 - $21;
     if ($0 < 0.0) {
      $925 = -$0;
     } else {
      $925 = $0;
     }
     if ($925 < 1.0e-7) {
      break L531;
     }
     $927 = -(-$14 - $32) / $0;
     if ($927 < 0.0) {
      $931 = 0.0;
     } else {
      if ($927 > $7) {
       $931 = $7;
      } else {
       $931 = $927;
      }
     }
     $932 = $2 * $931 - $39;
     if ($932 < 0.0) {
      $936 = 0.0;
     } else {
      if ($932 > $18) {
       $936 = $18;
      } else {
       $936 = $932;
      }
     }
     $937 = $2 * $936 - $921;
     if ($0 > 0.0) {
      if ($937 > $931 + 1.0e-7) {
       break;
      } else {
       break L531;
      }
     } else {
      if ($937 < $931 + -1.0e-7) {
       break;
      } else {
       break L531;
      }
     }
    }
   } while (0);
   do {
    if (!($UB1_uy$0 < 0.0)) {
     $944 = -$6;
     if (($6 > -0.0 ? $6 : $944) < 1.0e-7) {
      break L531;
     }
     $951 = -(-$24 - $16) / $944;
     if ($951 < 0.0) {
      $955 = 0.0;
     } else {
      if ($951 > $18) {
       $955 = $18;
      } else {
       $955 = $951;
      }
     }
     $956 = $57 + $2 * $955;
     if ($956 < 0.0) {
      $960 = 0.0;
     } else {
      if ($956 > $7) {
       $960 = $7;
      } else {
       $960 = $956;
      }
     }
     $961 = $2 * $960 - $39;
     if ($6 < -0.0) {
      if ($961 > $955 + 1.0e-7) {
       break;
      } else {
       break L531;
      }
     } else {
      if ($961 < $955 + -1.0e-7) {
       break;
      } else {
       break L531;
      }
     }
    }
   } while (0);
   $968 = 1.0 - $2 * $2;
   if ($968 == 0.0) {
    $976 = 0.0;
   } else {
    $972 = ($57 - $2 * $39) / $968;
    if ($972 < 0.0) {
     $976 = 0.0;
    } else {
     if ($972 > $7) {
      $976 = $7;
     } else {
      $976 = $972;
     }
    }
   }
   $977 = $2 * $976 - $39;
   if ($977 < 0.0) {
    if ($57 < 0.0) {
     $986 = 0.0;
     $989 = 0.0;
    } else {
     if ($57 > $7) {
      $986 = 0.0;
      $989 = $7;
     } else {
      $986 = 0.0;
      $989 = $57;
     }
    }
   } else {
    if ($977 > $18) {
     $982 = $57 + $19;
     if ($982 < 0.0) {
      $986 = $18;
      $989 = 0.0;
     } else {
      if ($982 > $7) {
       $986 = $18;
       $989 = $7;
      } else {
       $986 = $18;
       $989 = $982;
      }
     }
    } else {
     $986 = $977;
     $989 = $976;
    }
   }
   $988 = $57 + $986 * $2 - $989;
   $991 = $741 + $986 * $6;
   $995 = $30 + $14 * $28 + $986 * $37;
   $$0 = +Math_sqrt(+($988 * $988 + $991 * $991 + $995 * $995));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L582 : do {
  if ($$11 < 0.0 & $LB1_ly$0 < 0.0) {
   do {
    if (!($$12 < 0.0)) {
     $1005 = -$0;
     if (($0 > -0.0 ? $0 : $1005) < 1.0e-7) {
      break L582;
     }
     $1009 = $51 / $1005;
     if ($1009 < 0.0) {
      $1013 = 0.0;
     } else {
      if ($1009 > $7) {
       $1013 = $7;
      } else {
       $1013 = $1009;
      }
     }
     $1014 = $2 * $1013 - $39;
     if ($1014 < 0.0) {
      $1018 = 0.0;
     } else {
      if ($1014 > $18) {
       $1018 = $18;
      } else {
       $1018 = $1014;
      }
     }
     $1019 = $21 + $2 * $1018;
     if ($0 < -0.0) {
      if ($1019 > $1013 + 1.0e-7) {
       break;
      } else {
       break L582;
      }
     } else {
      if ($1019 < $1013 + -1.0e-7) {
       break;
      } else {
       break L582;
      }
     }
    }
   } while (0);
   do {
    if (!($LB1_uy$0 < 0.0)) {
     $1026 = -$6;
     if (($6 > -0.0 ? $6 : $1026) < 1.0e-7) {
      break L582;
     }
     $1030 = $24 / $1026;
     if ($1030 < 0.0) {
      $1034 = 0.0;
     } else {
      if ($1030 > $18) {
       $1034 = $18;
      } else {
       $1034 = $1030;
      }
     }
     $1035 = $2 * $1034 + $21;
     if ($1035 < 0.0) {
      $1039 = 0.0;
     } else {
      if ($1035 > $7) {
       $1039 = $7;
      } else {
       $1039 = $1035;
      }
     }
     $1040 = $2 * $1039 - $39;
     if ($6 < -0.0) {
      if ($1040 > $1034 + 1.0e-7) {
       break;
      } else {
       break L582;
      }
     } else {
      if ($1040 < $1034 + -1.0e-7) {
       break;
      } else {
       break L582;
      }
     }
    }
   } while (0);
   $1047 = 1.0 - $2 * $2;
   if ($1047 == 0.0) {
    $1055 = 0.0;
   } else {
    $1051 = ($21 - $2 * $39) / $1047;
    if ($1051 < 0.0) {
     $1055 = 0.0;
    } else {
     if ($1051 > $7) {
      $1055 = $7;
     } else {
      $1055 = $1051;
     }
    }
   }
   $1056 = $2 * $1055 - $39;
   if ($1056 < 0.0) {
    if ($21 < 0.0) {
     $1064 = 0.0;
     $1067 = 0.0;
    } else {
     if ($21 > $7) {
      $1064 = 0.0;
      $1067 = $7;
     } else {
      $1064 = 0.0;
      $1067 = $21;
     }
    }
   } else {
    if ($1056 > $18) {
     if ($56 < 0.0) {
      $1064 = $18;
      $1067 = 0.0;
     } else {
      if ($56 > $7) {
       $1064 = $18;
       $1067 = $7;
      } else {
       $1064 = $18;
       $1067 = $56;
      }
     }
    } else {
     $1064 = $1056;
     $1067 = $1055;
    }
   }
   $1066 = $21 + $1064 * $2 - $1067;
   $1069 = $24 + $1064 * $6;
   $1071 = $30 + $1064 * $37;
   $$0 = +Math_sqrt(+($1066 * $1066 + $1069 * $1069 + $1071 * $1071));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 $1078 = $400 > $398;
 $$17 = $1078 ? $398 : $400;
 $$18 = $1078 ? $400 : $398;
 $$19 = $1078 ? $399 : $401;
 $$20 = $1078 ? $401 : $399;
 if ($24 < $741) {
  $LB0_ly$0 = $24;
  $LB0_uy$0 = $741;
  $UB0_ly$0 = $740;
  $UB0_uy$0 = $742;
 } else {
  $LB0_ly$0 = $741;
  $LB0_uy$0 = $24;
  $UB0_ly$0 = $742;
  $UB0_uy$0 = $740;
 }
 L633 : do {
  if ($$20 > $18 & $UB0_uy$0 > $11) {
   do {
    if (!($$19 > $18)) {
     $1085 = -$21 - $19;
     if ($2 < 0.0) {
      $1089 = -$2;
     } else {
      $1089 = $2;
     }
     if ($1089 < 1.0e-7) {
      break L633;
     }
     $1091 = -($399 - $18) / $2;
     if ($1091 < 0.0) {
      $1095 = 0.0;
     } else {
      if ($1091 > $7) {
       $1095 = $7;
      } else {
       $1095 = $1091;
      }
     }
     $1096 = $52 + $0 * $1095;
     if ($1096 < 0.0) {
      $1100 = 0.0;
     } else {
      if ($1096 > $14) {
       $1100 = $14;
      } else {
       $1100 = $1096;
      }
     }
     $1101 = $0 * $1100 - $1085;
     if ($2 > 0.0) {
      if ($1101 > $1095 + 1.0e-7) {
       break;
      } else {
       break L633;
      }
     } else {
      if ($1101 < $1095 + -1.0e-7) {
       break;
      } else {
       break L633;
      }
     }
    }
   } while (0);
   do {
    if ($UB0_ly$0 > $11) {
     $$pre$phi261Z2D = $32 - $12;
    } else {
     $1110 = $32 - $12;
     if ($4 < 0.0) {
      $1114 = -$4;
     } else {
      $1114 = $4;
     }
     if ($1114 < 1.0e-7) {
      break L633;
     }
     $1116 = -($20 + ($24 - $11)) / $4;
     if ($1116 < 0.0) {
      $1120 = 0.0;
     } else {
      if ($1116 > $14) {
       $1120 = $14;
      } else {
       $1120 = $1116;
      }
     }
     $1121 = $56 + $0 * $1120;
     if ($1121 < 0.0) {
      $1125 = 0.0;
     } else {
      if ($1121 > $7) {
       $1125 = $7;
      } else {
       $1125 = $1121;
      }
     }
     $1126 = $0 * $1125 - $1110;
     if ($4 > 0.0) {
      if ($1126 > $1120 + 1.0e-7) {
       $$pre$phi261Z2D = $1110;
       break;
      } else {
       break L633;
      }
     } else {
      if ($1126 < $1120 + -1.0e-7) {
       $$pre$phi261Z2D = $1110;
       break;
      } else {
       break L633;
      }
     }
    }
   } while (0);
   $1133 = 1.0 - $0 * $0;
   if ($1133 == 0.0) {
    $1141 = 0.0;
   } else {
    $1137 = ($56 - $0 * $$pre$phi261Z2D) / $1133;
    if ($1137 < 0.0) {
     $1141 = 0.0;
    } else {
     if ($1137 > $7) {
      $1141 = $7;
     } else {
      $1141 = $1137;
     }
    }
   }
   $1142 = $0 * $1141 - $$pre$phi261Z2D;
   if ($1142 < 0.0) {
    if ($56 < 0.0) {
     $1150 = 0.0;
     $1153 = 0.0;
    } else {
     if ($56 > $7) {
      $1150 = 0.0;
      $1153 = $7;
     } else {
      $1150 = 0.0;
      $1153 = $56;
     }
    }
   } else {
    if ($1142 > $14) {
     if ($58 < 0.0) {
      $1150 = $14;
      $1153 = 0.0;
     } else {
      if ($58 > $7) {
       $1150 = $14;
       $1153 = $7;
      } else {
       $1150 = $14;
       $1153 = $58;
      }
     }
    } else {
     $1150 = $1142;
     $1153 = $1141;
    }
   }
   $1152 = $56 + $1150 * $0 - $1153;
   $1156 = $740 + $1150 * $4 - $11;
   $1160 = $30 + $18 * $37 + $1150 * $28;
   $$0 = +Math_sqrt(+($1152 * $1152 + $1156 * $1156 + $1160 * $1160));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L688 : do {
  if ($$19 < 0.0 & $LB0_uy$0 > $11) {
   do {
    if (!($$20 < 0.0)) {
     $1170 = -$2;
     if (($2 > -0.0 ? $2 : $1170) < 1.0e-7) {
      break L688;
     }
     $1176 = -($39 - $13) / $1170;
     if ($1176 < 0.0) {
      $1180 = 0.0;
     } else {
      if ($1176 > $7) {
       $1180 = $7;
      } else {
       $1180 = $1176;
      }
     }
     $1181 = $52 + $0 * $1180;
     if ($1181 < 0.0) {
      $1185 = 0.0;
     } else {
      if ($1181 > $14) {
       $1185 = $14;
      } else {
       $1185 = $1181;
      }
     }
     $1186 = $21 + $0 * $1185;
     if ($2 < -0.0) {
      if ($1186 > $1180 + 1.0e-7) {
       break;
      } else {
       break L688;
      }
     } else {
      if ($1186 < $1180 + -1.0e-7) {
       break;
      } else {
       break L688;
      }
     }
    }
   } while (0);
   do {
    if ($LB0_ly$0 > $11) {
     $$pre$phi263Z2D = $32 - $12;
    } else {
     $1194 = $32 - $12;
     if ($4 < 0.0) {
      $1198 = -$4;
     } else {
      $1198 = $4;
     }
     if ($1198 < 1.0e-7) {
      break L688;
     }
     $1200 = -($24 - $11) / $4;
     if ($1200 < 0.0) {
      $1204 = 0.0;
     } else {
      if ($1200 > $14) {
       $1204 = $14;
      } else {
       $1204 = $1200;
      }
     }
     $1205 = $0 * $1204 + $21;
     if ($1205 < 0.0) {
      $1209 = 0.0;
     } else {
      if ($1205 > $7) {
       $1209 = $7;
      } else {
       $1209 = $1205;
      }
     }
     $1210 = $0 * $1209 - $1194;
     if ($4 > 0.0) {
      if ($1210 > $1204 + 1.0e-7) {
       $$pre$phi263Z2D = $1194;
       break;
      } else {
       break L688;
      }
     } else {
      if ($1210 < $1204 + -1.0e-7) {
       $$pre$phi263Z2D = $1194;
       break;
      } else {
       break L688;
      }
     }
    }
   } while (0);
   $1217 = 1.0 - $0 * $0;
   if ($1217 == 0.0) {
    $1225 = 0.0;
   } else {
    $1221 = ($21 - $0 * $$pre$phi263Z2D) / $1217;
    if ($1221 < 0.0) {
     $1225 = 0.0;
    } else {
     if ($1221 > $7) {
      $1225 = $7;
     } else {
      $1225 = $1221;
     }
    }
   }
   $1226 = $0 * $1225 - $$pre$phi263Z2D;
   if ($1226 < 0.0) {
    if ($21 < 0.0) {
     $1234 = 0.0;
     $1237 = 0.0;
    } else {
     if ($21 > $7) {
      $1234 = 0.0;
      $1237 = $7;
     } else {
      $1234 = 0.0;
      $1237 = $21;
     }
    }
   } else {
    if ($1226 > $14) {
     if ($57 < 0.0) {
      $1234 = $14;
      $1237 = 0.0;
     } else {
      if ($57 > $7) {
       $1234 = $14;
       $1237 = $7;
      } else {
       $1234 = $14;
       $1237 = $57;
      }
     }
    } else {
     $1234 = $1226;
     $1237 = $1225;
    }
   }
   $1236 = $21 + $1234 * $0 - $1237;
   $1240 = $24 + $1234 * $4 - $11;
   $1242 = $30 + $1234 * $28;
   $$0 = +Math_sqrt(+($1236 * $1236 + $1240 * $1240 + $1242 * $1242));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L740 : do {
  if ($$18 > $18 & $UB0_ly$0 < 0.0) {
   do {
    if (!($$17 > $18)) {
     $1254 = -$21 - $19;
     if ($2 < 0.0) {
      $1258 = -$2;
     } else {
      $1258 = $2;
     }
     if ($1258 < 1.0e-7) {
      break L740;
     }
     $1260 = -($398 - $18) / $2;
     if ($1260 < 0.0) {
      $1264 = 0.0;
     } else {
      if ($1260 > $7) {
       $1264 = $7;
      } else {
       $1264 = $1260;
      }
     }
     $1265 = $0 * $1264 - $32;
     if ($1265 < 0.0) {
      $1269 = 0.0;
     } else {
      if ($1265 > $14) {
       $1269 = $14;
      } else {
       $1269 = $1265;
      }
     }
     $1270 = $0 * $1269 - $1254;
     if ($2 > 0.0) {
      if ($1270 > $1264 + 1.0e-7) {
       break;
      } else {
       break L740;
      }
     } else {
      if ($1270 < $1264 + -1.0e-7) {
       break;
      } else {
       break L740;
      }
     }
    }
   } while (0);
   do {
    if (!($UB0_uy$0 < 0.0)) {
     $1277 = -$4;
     if (($4 > -0.0 ? $4 : $1277) < 1.0e-7) {
      break L740;
     }
     $1284 = -(-$24 - $20) / $1277;
     if ($1284 < 0.0) {
      $1288 = 0.0;
     } else {
      if ($1284 > $14) {
       $1288 = $14;
      } else {
       $1288 = $1284;
      }
     }
     $1289 = $56 + $0 * $1288;
     if ($1289 < 0.0) {
      $1293 = 0.0;
     } else {
      if ($1289 > $7) {
       $1293 = $7;
      } else {
       $1293 = $1289;
      }
     }
     $1294 = $0 * $1293 - $32;
     if ($4 < -0.0) {
      if ($1294 > $1288 + 1.0e-7) {
       break;
      } else {
       break L740;
      }
     } else {
      if ($1294 < $1288 + -1.0e-7) {
       break;
      } else {
       break L740;
      }
     }
    }
   } while (0);
   $1301 = 1.0 - $0 * $0;
   if ($1301 == 0.0) {
    $1309 = 0.0;
   } else {
    $1305 = ($56 - $0 * $32) / $1301;
    if ($1305 < 0.0) {
     $1309 = 0.0;
    } else {
     if ($1305 > $7) {
      $1309 = $7;
     } else {
      $1309 = $1305;
     }
    }
   }
   $1310 = $0 * $1309 - $32;
   if ($1310 < 0.0) {
    if ($56 < 0.0) {
     $1318 = 0.0;
     $1321 = 0.0;
    } else {
     if ($56 > $7) {
      $1318 = 0.0;
      $1321 = $7;
     } else {
      $1318 = 0.0;
      $1321 = $56;
     }
    }
   } else {
    if ($1310 > $14) {
     if ($58 < 0.0) {
      $1318 = $14;
      $1321 = 0.0;
     } else {
      if ($58 > $7) {
       $1318 = $14;
       $1321 = $7;
      } else {
       $1318 = $14;
       $1321 = $58;
      }
     }
    } else {
     $1318 = $1310;
     $1321 = $1309;
    }
   }
   $1320 = $56 + $1318 * $0 - $1321;
   $1323 = $740 + $1318 * $4;
   $1327 = $30 + $18 * $37 + $1318 * $28;
   $$0 = +Math_sqrt(+($1320 * $1320 + $1323 * $1323 + $1327 * $1327));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 L791 : do {
  if ($$17 < 0.0 & $LB0_ly$0 < 0.0) {
   do {
    if (!($$18 < 0.0)) {
     $1337 = -$2;
     if (($2 > -0.0 ? $2 : $1337) < 1.0e-7) {
      break L791;
     }
     $1341 = $398 / $1337;
     if ($1341 < 0.0) {
      $1345 = 0.0;
     } else {
      if ($1341 > $7) {
       $1345 = $7;
      } else {
       $1345 = $1341;
      }
     }
     $1346 = $0 * $1345 - $32;
     if ($1346 < 0.0) {
      $1350 = 0.0;
     } else {
      if ($1346 > $14) {
       $1350 = $14;
      } else {
       $1350 = $1346;
      }
     }
     $1351 = $21 + $0 * $1350;
     if ($2 < -0.0) {
      if ($1351 > $1345 + 1.0e-7) {
       break;
      } else {
       break L791;
      }
     } else {
      if ($1351 < $1345 + -1.0e-7) {
       break;
      } else {
       break L791;
      }
     }
    }
   } while (0);
   do {
    if (!($LB0_uy$0 < 0.0)) {
     $1358 = -$4;
     if (($4 > -0.0 ? $4 : $1358) < 1.0e-7) {
      break L791;
     }
     $1362 = $24 / $1358;
     if ($1362 < 0.0) {
      $1366 = 0.0;
     } else {
      if ($1362 > $14) {
       $1366 = $14;
      } else {
       $1366 = $1362;
      }
     }
     $1367 = $0 * $1366 + $21;
     if ($1367 < 0.0) {
      $1371 = 0.0;
     } else {
      if ($1367 > $7) {
       $1371 = $7;
      } else {
       $1371 = $1367;
      }
     }
     $1372 = $0 * $1371 - $32;
     if ($4 < -0.0) {
      if ($1372 > $1366 + 1.0e-7) {
       break;
      } else {
       break L791;
      }
     } else {
      if ($1372 < $1366 + -1.0e-7) {
       break;
      } else {
       break L791;
      }
     }
    }
   } while (0);
   $1379 = 1.0 - $0 * $0;
   if ($1379 == 0.0) {
    $1387 = 0.0;
   } else {
    $1383 = ($21 - $0 * $32) / $1379;
    if ($1383 < 0.0) {
     $1387 = 0.0;
    } else {
     if ($1383 > $7) {
      $1387 = $7;
     } else {
      $1387 = $1383;
     }
    }
   }
   $1388 = $0 * $1387 - $32;
   if ($1388 < 0.0) {
    if ($21 < 0.0) {
     $1396 = 0.0;
     $1399 = 0.0;
    } else {
     if ($21 > $7) {
      $1396 = 0.0;
      $1399 = $7;
     } else {
      $1396 = 0.0;
      $1399 = $21;
     }
    }
   } else {
    if ($1388 > $14) {
     if ($57 < 0.0) {
      $1396 = $14;
      $1399 = 0.0;
     } else {
      if ($57 > $7) {
       $1396 = $14;
       $1399 = $7;
      } else {
       $1396 = $14;
       $1399 = $57;
      }
     }
    } else {
     $1396 = $1388;
     $1399 = $1387;
    }
   }
   $1398 = $21 + $1396 * $0 - $1399;
   $1401 = $24 + $1396 * $4;
   $1403 = $30 + $1396 * $28;
   $$0 = +Math_sqrt(+($1398 * $1398 + $1401 * $1401 + $1403 * $1403));
   STACKTOP = sp;
   return +$$0;
  }
 } while (0);
 if ($30 > 0.0) {
  if ($28 < 0.0) {
   $sep1$0 = $30 + $28 * $14;
  } else {
   $sep1$0 = $30;
  }
  if ($37 < 0.0) {
   $sep1$2 = $sep1$0 + $37 * $18;
  } else {
   $sep1$2 = $sep1$0;
  }
 } else {
  $1417 = -$30;
  if ($28 > 0.0) {
   $sep1$1 = $1417 - $28 * $14;
  } else {
   $sep1$1 = $1417;
  }
  if ($37 > 0.0) {
   $sep1$2 = $sep1$1 - $37 * $18;
  } else {
   $sep1$2 = $sep1$1;
  }
 }
 if ($50 < 0.0) {
  if ($41 < 0.0) {
   $$pn = $41 * $7;
  } else {
   $$pn = -0.0;
  }
  $sep2$0 = $$pn - $50;
  if ($44 < 0.0) {
   $sep2$2 = $sep2$0 + $44 * $11;
  } else {
   $sep2$2 = $sep2$0;
  }
 } else {
  if ($41 > 0.0) {
   $sep2$1 = $50 - $41 * $7;
  } else {
   $sep2$1 = $50;
  }
  if ($44 > 0.0) {
   $sep2$2 = $sep2$1 - $44 * $11;
  } else {
   $sep2$2 = $sep2$1;
  }
 }
 $1437 = $sep1$2 > $sep2$2 ? $sep1$2 : $sep2$2;
 $$0 = $1437 > 0.0 ? $1437 : 0.0;
 STACKTOP = sp;
 return +$$0;
}
function _malloc($bytes) {
 $bytes = $bytes | 0;
 var $$pre$phi$i$iZ2D = 0, $$pre$phi$i26$iZ2D = 0, $$pre$phi$i26Z2D = 0, $$pre$phi$iZ2D = 0, $$pre$phi58$i$iZ2D = 0, $$pre$phiZ2D = 0, $$rsize$3$i = 0, $$sum$i21$i = 0, $$sum2$i23$i = 0, $$sum3132$i$i = 0, $$sum67$i$i = 0, $100 = 0, $1004 = 0, $1005 = 0, $1008 = 0, $1010 = 0, $1013 = 0, $1018 = 0, $1024 = 0, $1028 = 0, $1029 = 0, $1036 = 0, $1045 = 0, $1048 = 0, $1053 = 0, $106 = 0, $1060 = 0, $1061 = 0, $1062 = 0, $1069 = 0, $1071 = 0, $1072 = 0, $110 = 0, $112 = 0, $113 = 0, $115 = 0, $117 = 0, $119 = 0, $12 = 0, $121 = 0, $123 = 0, $125 = 0, $127 = 0, $13 = 0, $132 = 0, $138 = 0, $14 = 0, $141 = 0, $144 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $151 = 0, $154 = 0, $156 = 0, $159 = 0, $16 = 0, $161 = 0, $164 = 0, $167 = 0, $168 = 0, $17 = 0, $170 = 0, $171 = 0, $173 = 0, $174 = 0, $176 = 0, $177 = 0, $18 = 0, $182 = 0, $183 = 0, $192 = 0, $201 = 0, $208 = 0, $215 = 0, $218 = 0, $226 = 0, $228 = 0, $229 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $237 = 0, $238 = 0, $246 = 0, $247 = 0, $248 = 0, $25 = 0, $250 = 0, $251 = 0, $256 = 0, $257 = 0, $260 = 0, $262 = 0, $265 = 0, $270 = 0, $277 = 0, $28 = 0, $283 = 0, $286 = 0, $287 = 0, $291 = 0, $294 = 0, $301 = 0, $304 = 0, $308 = 0, $31 = 0, $310 = 0, $311 = 0, $313 = 0, $315 = 0, $317 = 0, $319 = 0, $321 = 0, $323 = 0, $325 = 0, $335 = 0, $336 = 0, $338 = 0, $341 = 0, $347 = 0, $349 = 0, $352 = 0, $354 = 0, $357 = 0, $359 = 0, $362 = 0, $365 = 0, $366 = 0, $368 = 0, $369 = 0, $371 = 0, $372 = 0, $374 = 0, $375 = 0, $38 = 0, $380 = 0, $381 = 0, $390 = 0, $399 = 0, $4 = 0, $406 = 0, $41 = 0, $413 = 0, $416 = 0, $424 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $433 = 0, $434 = 0, $44 = 0, $440 = 0, $445 = 0, $446 = 0, $449 = 0, $451 = 0, $454 = 0, $459 = 0, $46 = 0, $465 = 0, $469 = 0, $47 = 0, $470 = 0, $477 = 0, $486 = 0, $489 = 0, $49 = 0, $494 = 0, $5 = 0, $501 = 0, $502 = 0, $503 = 0, $51 = 0, $511 = 0, $513 = 0, $514 = 0, $524 = 0, $528 = 0, $53 = 0, $530 = 0, $531 = 0, $540 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0, $550 = 0, $551 = 0, $552 = 0, $554 = 0, $556 = 0, $557 = 0, $563 = 0, $565 = 0, $567 = 0, $57 = 0, $572 = 0, $575 = 0, $577 = 0, $578 = 0, $579 = 0, $587 = 0, $588 = 0, $59 = 0, $591 = 0, $595 = 0, $596 = 0, $599 = 0, $6 = 0, $601 = 0, $605 = 0, $606 = 0, $61 = 0, $611 = 0, $615 = 0, $624 = 0, $625 = 0, $629 = 0, $631 = 0, $633 = 0, $636 = 0, $638 = 0, $64 = 0, $642 = 0, $643 = 0, $649 = 0, $65 = 0, $655 = 0, $656 = 0, $66 = 0, $661 = 0, $662 = 0, $663 = 0, $667 = 0, $67 = 0, $677 = 0, $679 = 0, $68 = 0, $685 = 0, $686 = 0, $69 = 0, $693 = 0, $697 = 0, $7 = 0, $70 = 0, $703 = 0, $707 = 0, $713 = 0, $715 = 0, $720 = 0, $721 = 0, $725 = 0, $726 = 0, $732 = 0, $738 = 0, $743 = 0, $746 = 0, $747 = 0, $750 = 0, $752 = 0, $754 = 0, $769 = 0, $77 = 0, $774 = 0, $776 = 0, $779 = 0, $782 = 0, $785 = 0, $788 = 0, $789 = 0, $791 = 0, $792 = 0, $794 = 0, $795 = 0, $797 = 0, $798 = 0, $80 = 0, $804 = 0, $805 = 0, $81 = 0, $814 = 0, $823 = 0, $830 = 0, $838 = 0, $84 = 0, $844 = 0, $846 = 0, $847 = 0, $848 = 0, $849 = 0, $853 = 0, $854 = 0, $860 = 0, $865 = 0, $866 = 0, $869 = 0, $871 = 0, $874 = 0, $879 = 0, $88 = 0, $885 = 0, $889 = 0, $890 = 0, $897 = 0, $90 = 0, $906 = 0, $909 = 0, $91 = 0, $914 = 0, $92 = 0, $921 = 0, $922 = 0, $923 = 0, $93 = 0, $931 = 0, $934 = 0, $935 = 0, $94 = 0, $940 = 0, $945 = 0, $946 = 0, $949 = 0, $95 = 0, $950 = 0, $953 = 0, $959 = 0, $960 = 0, $966 = 0, $969 = 0, $970 = 0, $976 = 0, $978 = 0, $983 = 0, $985 = 0, $986 = 0, $987 = 0, $988 = 0, $99 = 0, $992 = 0, $993 = 0, $999 = 0, $F$0$i$i = 0, $F1$0$i = 0, $F4$0 = 0, $F4$0$i$i = 0, $F5$0$i = 0, $I1$0$i$i = 0, $I7$0$i = 0, $I7$0$i$i = 0, $K12$025$i = 0, $K2$014$i$i = 0, $K8$052$i$i = 0, $R$0$i = 0, $R$0$i$i = 0, $R$0$i18 = 0, $R$1$i = 0, $R$1$i$i = 0, $R$1$i20 = 0, $RP$0$i = 0, $RP$0$i$i = 0, $RP$0$i17 = 0, $T$0$lcssa$i = 0, $T$0$lcssa$i$i = 0, $T$0$lcssa$i28$i = 0, $T$013$i$i = 0, $T$024$i = 0, $T$051$i$i = 0, $br$0$i = 0, $i$02$i$i = 0, $idx$0$i = 0, $mem$0 = 0, $nb$0 = 0, $oldfirst$0$i$i = 0, $qsize$0$i$i = 0, $rsize$0$i = 0, $rsize$0$i15 = 0, $rsize$1$i = 0, $rsize$2$i = 0, $rsize$3$lcssa$i = 0, $rsize$329$i = 0, $rst$0$i = 0, $rst$1$i = 0, $sizebits$0$i = 0, $sp$0$i$i = 0, $sp$0$i$i$i = 0, $sp$075$i = 0, $sp$168$i = 0, $ssize$0$i = 0, $ssize$1$i = 0, $ssize$2$i = 0, $t$0$i = 0, $t$0$i14 = 0, $t$1$i = 0, $t$2$ph$i = 0, $t$2$v$3$i = 0, $t$228$i = 0, $tbase$0$i = 0, $tbase$247$i = 0, $tsize$0$i = 0, $tsize$0323841$i = 0, $tsize$1$i = 0, $tsize$246$i = 0, $v$0$i = 0, $v$0$i16 = 0, $v$1$i = 0, $v$2$i = 0, $v$3$lcssa$i = 0, $v$330$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 do {
  if ($bytes >>> 0 < 245) {
   if ($bytes >>> 0 < 11) {
    $5 = 16;
   } else {
    $5 = $bytes + 11 & -8;
   }
   $4 = $5 >>> 3;
   $6 = HEAP32[372] | 0;
   $7 = $6 >>> $4;
   if (($7 & 3 | 0) != 0) {
    $12 = ($7 & 1 ^ 1) + $4 | 0;
    $13 = $12 << 1;
    $14 = 1528 + ($13 << 2) | 0;
    $15 = 1528 + ($13 + 2 << 2) | 0;
    $16 = HEAP32[$15 >> 2] | 0;
    $17 = $16 + 8 | 0;
    $18 = HEAP32[$17 >> 2] | 0;
    do {
     if (($14 | 0) == ($18 | 0)) {
      HEAP32[372] = $6 & ~(1 << $12);
     } else {
      if ($18 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
       _abort();
      }
      $25 = $18 + 12 | 0;
      if ((HEAP32[$25 >> 2] | 0) == ($16 | 0)) {
       HEAP32[$25 >> 2] = $14;
       HEAP32[$15 >> 2] = $18;
       break;
      } else {
       _abort();
      }
     }
    } while (0);
    $28 = $12 << 3;
    HEAP32[$16 + 4 >> 2] = $28 | 3;
    $31 = $16 + ($28 | 4) | 0;
    HEAP32[$31 >> 2] = HEAP32[$31 >> 2] | 1;
    $mem$0 = $17;
    STACKTOP = sp;
    return $mem$0 | 0;
   }
   if ($5 >>> 0 > (HEAP32[1496 >> 2] | 0) >>> 0) {
    if (($7 | 0) != 0) {
     $38 = 2 << $4;
     $41 = $7 << $4 & ($38 | 0 - $38);
     $44 = ($41 & 0 - $41) + -1 | 0;
     $46 = $44 >>> 12 & 16;
     $47 = $44 >>> $46;
     $49 = $47 >>> 5 & 8;
     $51 = $47 >>> $49;
     $53 = $51 >>> 2 & 4;
     $55 = $51 >>> $53;
     $57 = $55 >>> 1 & 2;
     $59 = $55 >>> $57;
     $61 = $59 >>> 1 & 1;
     $64 = ($49 | $46 | $53 | $57 | $61) + ($59 >>> $61) | 0;
     $65 = $64 << 1;
     $66 = 1528 + ($65 << 2) | 0;
     $67 = 1528 + ($65 + 2 << 2) | 0;
     $68 = HEAP32[$67 >> 2] | 0;
     $69 = $68 + 8 | 0;
     $70 = HEAP32[$69 >> 2] | 0;
     do {
      if (($66 | 0) == ($70 | 0)) {
       HEAP32[372] = $6 & ~(1 << $64);
      } else {
       if ($70 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
        _abort();
       }
       $77 = $70 + 12 | 0;
       if ((HEAP32[$77 >> 2] | 0) == ($68 | 0)) {
        HEAP32[$77 >> 2] = $66;
        HEAP32[$67 >> 2] = $70;
        break;
       } else {
        _abort();
       }
      }
     } while (0);
     $80 = $64 << 3;
     $81 = $80 - $5 | 0;
     HEAP32[$68 + 4 >> 2] = $5 | 3;
     $84 = $68 + $5 | 0;
     HEAP32[$68 + ($5 | 4) >> 2] = $81 | 1;
     HEAP32[$68 + $80 >> 2] = $81;
     $88 = HEAP32[1496 >> 2] | 0;
     if (($88 | 0) != 0) {
      $90 = HEAP32[1508 >> 2] | 0;
      $91 = $88 >>> 3;
      $92 = $91 << 1;
      $93 = 1528 + ($92 << 2) | 0;
      $94 = HEAP32[372] | 0;
      $95 = 1 << $91;
      if (($94 & $95 | 0) == 0) {
       HEAP32[372] = $94 | $95;
       $$pre$phiZ2D = 1528 + ($92 + 2 << 2) | 0;
       $F4$0 = $93;
      } else {
       $99 = 1528 + ($92 + 2 << 2) | 0;
       $100 = HEAP32[$99 >> 2] | 0;
       if ($100 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
        _abort();
       } else {
        $$pre$phiZ2D = $99;
        $F4$0 = $100;
       }
      }
      HEAP32[$$pre$phiZ2D >> 2] = $90;
      HEAP32[$F4$0 + 12 >> 2] = $90;
      HEAP32[$90 + 8 >> 2] = $F4$0;
      HEAP32[$90 + 12 >> 2] = $93;
     }
     HEAP32[1496 >> 2] = $81;
     HEAP32[1508 >> 2] = $84;
     $mem$0 = $69;
     STACKTOP = sp;
     return $mem$0 | 0;
    }
    $106 = HEAP32[1492 >> 2] | 0;
    if (($106 | 0) == 0) {
     $nb$0 = $5;
    } else {
     $110 = ($106 & 0 - $106) + -1 | 0;
     $112 = $110 >>> 12 & 16;
     $113 = $110 >>> $112;
     $115 = $113 >>> 5 & 8;
     $117 = $113 >>> $115;
     $119 = $117 >>> 2 & 4;
     $121 = $117 >>> $119;
     $123 = $121 >>> 1 & 2;
     $125 = $121 >>> $123;
     $127 = $125 >>> 1 & 1;
     $132 = HEAP32[1792 + (($115 | $112 | $119 | $123 | $127) + ($125 >>> $127) << 2) >> 2] | 0;
     $rsize$0$i = (HEAP32[$132 + 4 >> 2] & -8) - $5 | 0;
     $t$0$i = $132;
     $v$0$i = $132;
     while (1) {
      $138 = HEAP32[$t$0$i + 16 >> 2] | 0;
      if (($138 | 0) == 0) {
       $141 = HEAP32[$t$0$i + 20 >> 2] | 0;
       if (($141 | 0) == 0) {
        break;
       } else {
        $144 = $141;
       }
      } else {
       $144 = $138;
      }
      $147 = (HEAP32[$144 + 4 >> 2] & -8) - $5 | 0;
      $148 = $147 >>> 0 < $rsize$0$i >>> 0;
      $rsize$0$i = $148 ? $147 : $rsize$0$i;
      $t$0$i = $144;
      $v$0$i = $148 ? $144 : $v$0$i;
     }
     $149 = HEAP32[1504 >> 2] | 0;
     if ($v$0$i >>> 0 < $149 >>> 0) {
      _abort();
     }
     $151 = $v$0$i + $5 | 0;
     if (!($v$0$i >>> 0 < $151 >>> 0)) {
      _abort();
     }
     $154 = HEAP32[$v$0$i + 24 >> 2] | 0;
     $156 = HEAP32[$v$0$i + 12 >> 2] | 0;
     do {
      if (($156 | 0) == ($v$0$i | 0)) {
       $167 = $v$0$i + 20 | 0;
       $168 = HEAP32[$167 >> 2] | 0;
       if (($168 | 0) == 0) {
        $170 = $v$0$i + 16 | 0;
        $171 = HEAP32[$170 >> 2] | 0;
        if (($171 | 0) == 0) {
         $R$1$i = 0;
         break;
        } else {
         $R$0$i = $171;
         $RP$0$i = $170;
        }
       } else {
        $R$0$i = $168;
        $RP$0$i = $167;
       }
       while (1) {
        $173 = $R$0$i + 20 | 0;
        $174 = HEAP32[$173 >> 2] | 0;
        if (($174 | 0) != 0) {
         $R$0$i = $174;
         $RP$0$i = $173;
         continue;
        }
        $176 = $R$0$i + 16 | 0;
        $177 = HEAP32[$176 >> 2] | 0;
        if (($177 | 0) == 0) {
         break;
        } else {
         $R$0$i = $177;
         $RP$0$i = $176;
        }
       }
       if ($RP$0$i >>> 0 < $149 >>> 0) {
        _abort();
       } else {
        HEAP32[$RP$0$i >> 2] = 0;
        $R$1$i = $R$0$i;
        break;
       }
      } else {
       $159 = HEAP32[$v$0$i + 8 >> 2] | 0;
       if ($159 >>> 0 < $149 >>> 0) {
        _abort();
       }
       $161 = $159 + 12 | 0;
       if ((HEAP32[$161 >> 2] | 0) != ($v$0$i | 0)) {
        _abort();
       }
       $164 = $156 + 8 | 0;
       if ((HEAP32[$164 >> 2] | 0) == ($v$0$i | 0)) {
        HEAP32[$161 >> 2] = $156;
        HEAP32[$164 >> 2] = $159;
        $R$1$i = $156;
        break;
       } else {
        _abort();
       }
      }
     } while (0);
     do {
      if (($154 | 0) != 0) {
       $182 = HEAP32[$v$0$i + 28 >> 2] | 0;
       $183 = 1792 + ($182 << 2) | 0;
       if (($v$0$i | 0) == (HEAP32[$183 >> 2] | 0)) {
        HEAP32[$183 >> 2] = $R$1$i;
        if (($R$1$i | 0) == 0) {
         HEAP32[1492 >> 2] = HEAP32[1492 >> 2] & ~(1 << $182);
         break;
        }
       } else {
        if ($154 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
         _abort();
        }
        $192 = $154 + 16 | 0;
        if ((HEAP32[$192 >> 2] | 0) == ($v$0$i | 0)) {
         HEAP32[$192 >> 2] = $R$1$i;
        } else {
         HEAP32[$154 + 20 >> 2] = $R$1$i;
        }
        if (($R$1$i | 0) == 0) {
         break;
        }
       }
       if ($R$1$i >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
        _abort();
       }
       HEAP32[$R$1$i + 24 >> 2] = $154;
       $201 = HEAP32[$v$0$i + 16 >> 2] | 0;
       do {
        if (($201 | 0) != 0) {
         if ($201 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
          _abort();
         } else {
          HEAP32[$R$1$i + 16 >> 2] = $201;
          HEAP32[$201 + 24 >> 2] = $R$1$i;
          break;
         }
        }
       } while (0);
       $208 = HEAP32[$v$0$i + 20 >> 2] | 0;
       if (($208 | 0) != 0) {
        if ($208 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
         _abort();
        } else {
         HEAP32[$R$1$i + 20 >> 2] = $208;
         HEAP32[$208 + 24 >> 2] = $R$1$i;
         break;
        }
       }
      }
     } while (0);
     if ($rsize$0$i >>> 0 < 16) {
      $215 = $rsize$0$i + $5 | 0;
      HEAP32[$v$0$i + 4 >> 2] = $215 | 3;
      $218 = $v$0$i + ($215 + 4) | 0;
      HEAP32[$218 >> 2] = HEAP32[$218 >> 2] | 1;
     } else {
      HEAP32[$v$0$i + 4 >> 2] = $5 | 3;
      HEAP32[$v$0$i + ($5 | 4) >> 2] = $rsize$0$i | 1;
      HEAP32[$v$0$i + ($rsize$0$i + $5) >> 2] = $rsize$0$i;
      $226 = HEAP32[1496 >> 2] | 0;
      if (($226 | 0) != 0) {
       $228 = HEAP32[1508 >> 2] | 0;
       $229 = $226 >>> 3;
       $230 = $229 << 1;
       $231 = 1528 + ($230 << 2) | 0;
       $232 = HEAP32[372] | 0;
       $233 = 1 << $229;
       if (($232 & $233 | 0) == 0) {
        HEAP32[372] = $232 | $233;
        $$pre$phi$iZ2D = 1528 + ($230 + 2 << 2) | 0;
        $F1$0$i = $231;
       } else {
        $237 = 1528 + ($230 + 2 << 2) | 0;
        $238 = HEAP32[$237 >> 2] | 0;
        if ($238 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
         _abort();
        } else {
         $$pre$phi$iZ2D = $237;
         $F1$0$i = $238;
        }
       }
       HEAP32[$$pre$phi$iZ2D >> 2] = $228;
       HEAP32[$F1$0$i + 12 >> 2] = $228;
       HEAP32[$228 + 8 >> 2] = $F1$0$i;
       HEAP32[$228 + 12 >> 2] = $231;
      }
      HEAP32[1496 >> 2] = $rsize$0$i;
      HEAP32[1508 >> 2] = $151;
     }
     $mem$0 = $v$0$i + 8 | 0;
     STACKTOP = sp;
     return $mem$0 | 0;
    }
   } else {
    $nb$0 = $5;
   }
  } else {
   if ($bytes >>> 0 > 4294967231) {
    $nb$0 = -1;
   } else {
    $246 = $bytes + 11 | 0;
    $247 = $246 & -8;
    $248 = HEAP32[1492 >> 2] | 0;
    if (($248 | 0) == 0) {
     $nb$0 = $247;
    } else {
     $250 = 0 - $247 | 0;
     $251 = $246 >>> 8;
     if (($251 | 0) == 0) {
      $idx$0$i = 0;
     } else {
      if ($247 >>> 0 > 16777215) {
       $idx$0$i = 31;
      } else {
       $256 = ($251 + 1048320 | 0) >>> 16 & 8;
       $257 = $251 << $256;
       $260 = ($257 + 520192 | 0) >>> 16 & 4;
       $262 = $257 << $260;
       $265 = ($262 + 245760 | 0) >>> 16 & 2;
       $270 = 14 - ($260 | $256 | $265) + ($262 << $265 >>> 15) | 0;
       $idx$0$i = $247 >>> ($270 + 7 | 0) & 1 | $270 << 1;
      }
     }
     $277 = HEAP32[1792 + ($idx$0$i << 2) >> 2] | 0;
     L126 : do {
      if (($277 | 0) == 0) {
       $rsize$2$i = $250;
       $t$1$i = 0;
       $v$2$i = 0;
      } else {
       if (($idx$0$i | 0) == 31) {
        $283 = 0;
       } else {
        $283 = 25 - ($idx$0$i >>> 1) | 0;
       }
       $rsize$0$i15 = $250;
       $rst$0$i = 0;
       $sizebits$0$i = $247 << $283;
       $t$0$i14 = $277;
       $v$0$i16 = 0;
       while (1) {
        $286 = HEAP32[$t$0$i14 + 4 >> 2] & -8;
        $287 = $286 - $247 | 0;
        if ($287 >>> 0 < $rsize$0$i15 >>> 0) {
         if (($286 | 0) == ($247 | 0)) {
          $rsize$2$i = $287;
          $t$1$i = $t$0$i14;
          $v$2$i = $t$0$i14;
          break L126;
         } else {
          $rsize$1$i = $287;
          $v$1$i = $t$0$i14;
         }
        } else {
         $rsize$1$i = $rsize$0$i15;
         $v$1$i = $v$0$i16;
        }
        $291 = HEAP32[$t$0$i14 + 20 >> 2] | 0;
        $294 = HEAP32[$t$0$i14 + ($sizebits$0$i >>> 31 << 2) + 16 >> 2] | 0;
        $rst$1$i = ($291 | 0) == 0 | ($291 | 0) == ($294 | 0) ? $rst$0$i : $291;
        if (($294 | 0) == 0) {
         $rsize$2$i = $rsize$1$i;
         $t$1$i = $rst$1$i;
         $v$2$i = $v$1$i;
         break;
        } else {
         $rsize$0$i15 = $rsize$1$i;
         $rst$0$i = $rst$1$i;
         $sizebits$0$i = $sizebits$0$i << 1;
         $t$0$i14 = $294;
         $v$0$i16 = $v$1$i;
        }
       }
      }
     } while (0);
     if (($t$1$i | 0) == 0 & ($v$2$i | 0) == 0) {
      $301 = 2 << $idx$0$i;
      $304 = $248 & ($301 | 0 - $301);
      if (($304 | 0) == 0) {
       $nb$0 = $247;
       break;
      }
      $308 = ($304 & 0 - $304) + -1 | 0;
      $310 = $308 >>> 12 & 16;
      $311 = $308 >>> $310;
      $313 = $311 >>> 5 & 8;
      $315 = $311 >>> $313;
      $317 = $315 >>> 2 & 4;
      $319 = $315 >>> $317;
      $321 = $319 >>> 1 & 2;
      $323 = $319 >>> $321;
      $325 = $323 >>> 1 & 1;
      $t$2$ph$i = HEAP32[1792 + (($313 | $310 | $317 | $321 | $325) + ($323 >>> $325) << 2) >> 2] | 0;
     } else {
      $t$2$ph$i = $t$1$i;
     }
     if (($t$2$ph$i | 0) == 0) {
      $rsize$3$lcssa$i = $rsize$2$i;
      $v$3$lcssa$i = $v$2$i;
     } else {
      $rsize$329$i = $rsize$2$i;
      $t$228$i = $t$2$ph$i;
      $v$330$i = $v$2$i;
      while (1) {
       $335 = (HEAP32[$t$228$i + 4 >> 2] & -8) - $247 | 0;
       $336 = $335 >>> 0 < $rsize$329$i >>> 0;
       $$rsize$3$i = $336 ? $335 : $rsize$329$i;
       $t$2$v$3$i = $336 ? $t$228$i : $v$330$i;
       $338 = HEAP32[$t$228$i + 16 >> 2] | 0;
       if (($338 | 0) != 0) {
        $rsize$329$i = $$rsize$3$i;
        $t$228$i = $338;
        $v$330$i = $t$2$v$3$i;
        continue;
       }
       $341 = HEAP32[$t$228$i + 20 >> 2] | 0;
       if (($341 | 0) == 0) {
        $rsize$3$lcssa$i = $$rsize$3$i;
        $v$3$lcssa$i = $t$2$v$3$i;
        break;
       } else {
        $rsize$329$i = $$rsize$3$i;
        $t$228$i = $341;
        $v$330$i = $t$2$v$3$i;
       }
      }
     }
     if (($v$3$lcssa$i | 0) == 0) {
      $nb$0 = $247;
     } else {
      if ($rsize$3$lcssa$i >>> 0 < ((HEAP32[1496 >> 2] | 0) - $247 | 0) >>> 0) {
       $347 = HEAP32[1504 >> 2] | 0;
       if ($v$3$lcssa$i >>> 0 < $347 >>> 0) {
        _abort();
       }
       $349 = $v$3$lcssa$i + $247 | 0;
       if (!($v$3$lcssa$i >>> 0 < $349 >>> 0)) {
        _abort();
       }
       $352 = HEAP32[$v$3$lcssa$i + 24 >> 2] | 0;
       $354 = HEAP32[$v$3$lcssa$i + 12 >> 2] | 0;
       do {
        if (($354 | 0) == ($v$3$lcssa$i | 0)) {
         $365 = $v$3$lcssa$i + 20 | 0;
         $366 = HEAP32[$365 >> 2] | 0;
         if (($366 | 0) == 0) {
          $368 = $v$3$lcssa$i + 16 | 0;
          $369 = HEAP32[$368 >> 2] | 0;
          if (($369 | 0) == 0) {
           $R$1$i20 = 0;
           break;
          } else {
           $R$0$i18 = $369;
           $RP$0$i17 = $368;
          }
         } else {
          $R$0$i18 = $366;
          $RP$0$i17 = $365;
         }
         while (1) {
          $371 = $R$0$i18 + 20 | 0;
          $372 = HEAP32[$371 >> 2] | 0;
          if (($372 | 0) != 0) {
           $R$0$i18 = $372;
           $RP$0$i17 = $371;
           continue;
          }
          $374 = $R$0$i18 + 16 | 0;
          $375 = HEAP32[$374 >> 2] | 0;
          if (($375 | 0) == 0) {
           break;
          } else {
           $R$0$i18 = $375;
           $RP$0$i17 = $374;
          }
         }
         if ($RP$0$i17 >>> 0 < $347 >>> 0) {
          _abort();
         } else {
          HEAP32[$RP$0$i17 >> 2] = 0;
          $R$1$i20 = $R$0$i18;
          break;
         }
        } else {
         $357 = HEAP32[$v$3$lcssa$i + 8 >> 2] | 0;
         if ($357 >>> 0 < $347 >>> 0) {
          _abort();
         }
         $359 = $357 + 12 | 0;
         if ((HEAP32[$359 >> 2] | 0) != ($v$3$lcssa$i | 0)) {
          _abort();
         }
         $362 = $354 + 8 | 0;
         if ((HEAP32[$362 >> 2] | 0) == ($v$3$lcssa$i | 0)) {
          HEAP32[$359 >> 2] = $354;
          HEAP32[$362 >> 2] = $357;
          $R$1$i20 = $354;
          break;
         } else {
          _abort();
         }
        }
       } while (0);
       do {
        if (($352 | 0) != 0) {
         $380 = HEAP32[$v$3$lcssa$i + 28 >> 2] | 0;
         $381 = 1792 + ($380 << 2) | 0;
         if (($v$3$lcssa$i | 0) == (HEAP32[$381 >> 2] | 0)) {
          HEAP32[$381 >> 2] = $R$1$i20;
          if (($R$1$i20 | 0) == 0) {
           HEAP32[1492 >> 2] = HEAP32[1492 >> 2] & ~(1 << $380);
           break;
          }
         } else {
          if ($352 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
           _abort();
          }
          $390 = $352 + 16 | 0;
          if ((HEAP32[$390 >> 2] | 0) == ($v$3$lcssa$i | 0)) {
           HEAP32[$390 >> 2] = $R$1$i20;
          } else {
           HEAP32[$352 + 20 >> 2] = $R$1$i20;
          }
          if (($R$1$i20 | 0) == 0) {
           break;
          }
         }
         if ($R$1$i20 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
          _abort();
         }
         HEAP32[$R$1$i20 + 24 >> 2] = $352;
         $399 = HEAP32[$v$3$lcssa$i + 16 >> 2] | 0;
         do {
          if (($399 | 0) != 0) {
           if ($399 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
            _abort();
           } else {
            HEAP32[$R$1$i20 + 16 >> 2] = $399;
            HEAP32[$399 + 24 >> 2] = $R$1$i20;
            break;
           }
          }
         } while (0);
         $406 = HEAP32[$v$3$lcssa$i + 20 >> 2] | 0;
         if (($406 | 0) != 0) {
          if ($406 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
           _abort();
          } else {
           HEAP32[$R$1$i20 + 20 >> 2] = $406;
           HEAP32[$406 + 24 >> 2] = $R$1$i20;
           break;
          }
         }
        }
       } while (0);
       L204 : do {
        if ($rsize$3$lcssa$i >>> 0 < 16) {
         $413 = $rsize$3$lcssa$i + $247 | 0;
         HEAP32[$v$3$lcssa$i + 4 >> 2] = $413 | 3;
         $416 = $v$3$lcssa$i + ($413 + 4) | 0;
         HEAP32[$416 >> 2] = HEAP32[$416 >> 2] | 1;
        } else {
         HEAP32[$v$3$lcssa$i + 4 >> 2] = $247 | 3;
         HEAP32[$v$3$lcssa$i + ($247 | 4) >> 2] = $rsize$3$lcssa$i | 1;
         HEAP32[$v$3$lcssa$i + ($rsize$3$lcssa$i + $247) >> 2] = $rsize$3$lcssa$i;
         $424 = $rsize$3$lcssa$i >>> 3;
         if ($rsize$3$lcssa$i >>> 0 < 256) {
          $426 = $424 << 1;
          $427 = 1528 + ($426 << 2) | 0;
          $428 = HEAP32[372] | 0;
          $429 = 1 << $424;
          if (($428 & $429 | 0) == 0) {
           HEAP32[372] = $428 | $429;
           $$pre$phi$i26Z2D = 1528 + ($426 + 2 << 2) | 0;
           $F5$0$i = $427;
          } else {
           $433 = 1528 + ($426 + 2 << 2) | 0;
           $434 = HEAP32[$433 >> 2] | 0;
           if ($434 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
            _abort();
           } else {
            $$pre$phi$i26Z2D = $433;
            $F5$0$i = $434;
           }
          }
          HEAP32[$$pre$phi$i26Z2D >> 2] = $349;
          HEAP32[$F5$0$i + 12 >> 2] = $349;
          HEAP32[$v$3$lcssa$i + ($247 + 8) >> 2] = $F5$0$i;
          HEAP32[$v$3$lcssa$i + ($247 + 12) >> 2] = $427;
          break;
         }
         $440 = $rsize$3$lcssa$i >>> 8;
         if (($440 | 0) == 0) {
          $I7$0$i = 0;
         } else {
          if ($rsize$3$lcssa$i >>> 0 > 16777215) {
           $I7$0$i = 31;
          } else {
           $445 = ($440 + 1048320 | 0) >>> 16 & 8;
           $446 = $440 << $445;
           $449 = ($446 + 520192 | 0) >>> 16 & 4;
           $451 = $446 << $449;
           $454 = ($451 + 245760 | 0) >>> 16 & 2;
           $459 = 14 - ($449 | $445 | $454) + ($451 << $454 >>> 15) | 0;
           $I7$0$i = $rsize$3$lcssa$i >>> ($459 + 7 | 0) & 1 | $459 << 1;
          }
         }
         $465 = 1792 + ($I7$0$i << 2) | 0;
         HEAP32[$v$3$lcssa$i + ($247 + 28) >> 2] = $I7$0$i;
         HEAP32[$v$3$lcssa$i + ($247 + 20) >> 2] = 0;
         HEAP32[$v$3$lcssa$i + ($247 + 16) >> 2] = 0;
         $469 = HEAP32[1492 >> 2] | 0;
         $470 = 1 << $I7$0$i;
         if (($469 & $470 | 0) == 0) {
          HEAP32[1492 >> 2] = $469 | $470;
          HEAP32[$465 >> 2] = $349;
          HEAP32[$v$3$lcssa$i + ($247 + 24) >> 2] = $465;
          HEAP32[$v$3$lcssa$i + ($247 + 12) >> 2] = $349;
          HEAP32[$v$3$lcssa$i + ($247 + 8) >> 2] = $349;
          break;
         }
         $477 = HEAP32[$465 >> 2] | 0;
         if (($I7$0$i | 0) == 31) {
          $486 = 0;
         } else {
          $486 = 25 - ($I7$0$i >>> 1) | 0;
         }
         L225 : do {
          if ((HEAP32[$477 + 4 >> 2] & -8 | 0) == ($rsize$3$lcssa$i | 0)) {
           $T$0$lcssa$i = $477;
          } else {
           $K12$025$i = $rsize$3$lcssa$i << $486;
           $T$024$i = $477;
           while (1) {
            $494 = $T$024$i + ($K12$025$i >>> 31 << 2) + 16 | 0;
            $489 = HEAP32[$494 >> 2] | 0;
            if (($489 | 0) == 0) {
             break;
            }
            if ((HEAP32[$489 + 4 >> 2] & -8 | 0) == ($rsize$3$lcssa$i | 0)) {
             $T$0$lcssa$i = $489;
             break L225;
            } else {
             $K12$025$i = $K12$025$i << 1;
             $T$024$i = $489;
            }
           }
           if ($494 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
            _abort();
           } else {
            HEAP32[$494 >> 2] = $349;
            HEAP32[$v$3$lcssa$i + ($247 + 24) >> 2] = $T$024$i;
            HEAP32[$v$3$lcssa$i + ($247 + 12) >> 2] = $349;
            HEAP32[$v$3$lcssa$i + ($247 + 8) >> 2] = $349;
            break L204;
           }
          }
         } while (0);
         $501 = $T$0$lcssa$i + 8 | 0;
         $502 = HEAP32[$501 >> 2] | 0;
         $503 = HEAP32[1504 >> 2] | 0;
         if ($T$0$lcssa$i >>> 0 < $503 >>> 0) {
          _abort();
         }
         if ($502 >>> 0 < $503 >>> 0) {
          _abort();
         } else {
          HEAP32[$502 + 12 >> 2] = $349;
          HEAP32[$501 >> 2] = $349;
          HEAP32[$v$3$lcssa$i + ($247 + 8) >> 2] = $502;
          HEAP32[$v$3$lcssa$i + ($247 + 12) >> 2] = $T$0$lcssa$i;
          HEAP32[$v$3$lcssa$i + ($247 + 24) >> 2] = 0;
          break;
         }
        }
       } while (0);
       $mem$0 = $v$3$lcssa$i + 8 | 0;
       STACKTOP = sp;
       return $mem$0 | 0;
      } else {
       $nb$0 = $247;
      }
     }
    }
   }
  }
 } while (0);
 $511 = HEAP32[1496 >> 2] | 0;
 if (!($nb$0 >>> 0 > $511 >>> 0)) {
  $513 = $511 - $nb$0 | 0;
  $514 = HEAP32[1508 >> 2] | 0;
  if ($513 >>> 0 > 15) {
   HEAP32[1508 >> 2] = $514 + $nb$0;
   HEAP32[1496 >> 2] = $513;
   HEAP32[$514 + ($nb$0 + 4) >> 2] = $513 | 1;
   HEAP32[$514 + $511 >> 2] = $513;
   HEAP32[$514 + 4 >> 2] = $nb$0 | 3;
  } else {
   HEAP32[1496 >> 2] = 0;
   HEAP32[1508 >> 2] = 0;
   HEAP32[$514 + 4 >> 2] = $511 | 3;
   $524 = $514 + ($511 + 4) | 0;
   HEAP32[$524 >> 2] = HEAP32[$524 >> 2] | 1;
  }
  $mem$0 = $514 + 8 | 0;
  STACKTOP = sp;
  return $mem$0 | 0;
 }
 $528 = HEAP32[1500 >> 2] | 0;
 if ($nb$0 >>> 0 < $528 >>> 0) {
  $530 = $528 - $nb$0 | 0;
  HEAP32[1500 >> 2] = $530;
  $531 = HEAP32[1512 >> 2] | 0;
  HEAP32[1512 >> 2] = $531 + $nb$0;
  HEAP32[$531 + ($nb$0 + 4) >> 2] = $530 | 1;
  HEAP32[$531 + 4 >> 2] = $nb$0 | 3;
  $mem$0 = $531 + 8 | 0;
  STACKTOP = sp;
  return $mem$0 | 0;
 }
 do {
  if ((HEAP32[490] | 0) == 0) {
   $540 = _sysconf(30) | 0;
   if (($540 + -1 & $540 | 0) == 0) {
    HEAP32[1968 >> 2] = $540;
    HEAP32[1964 >> 2] = $540;
    HEAP32[1972 >> 2] = -1;
    HEAP32[1976 >> 2] = -1;
    HEAP32[1980 >> 2] = 0;
    HEAP32[1932 >> 2] = 0;
    HEAP32[490] = (_time(0) | 0) & -16 ^ 1431655768;
    break;
   } else {
    _abort();
   }
  }
 } while (0);
 $547 = $nb$0 + 48 | 0;
 $548 = HEAP32[1968 >> 2] | 0;
 $549 = $nb$0 + 47 | 0;
 $550 = $548 + $549 | 0;
 $551 = 0 - $548 | 0;
 $552 = $550 & $551;
 if (!($552 >>> 0 > $nb$0 >>> 0)) {
  $mem$0 = 0;
  STACKTOP = sp;
  return $mem$0 | 0;
 }
 $554 = HEAP32[1928 >> 2] | 0;
 if (($554 | 0) != 0) {
  $556 = HEAP32[1920 >> 2] | 0;
  $557 = $556 + $552 | 0;
  if ($557 >>> 0 <= $556 >>> 0 | $557 >>> 0 > $554 >>> 0) {
   $mem$0 = 0;
   STACKTOP = sp;
   return $mem$0 | 0;
  }
 }
 L269 : do {
  if ((HEAP32[1932 >> 2] & 4 | 0) == 0) {
   $563 = HEAP32[1512 >> 2] | 0;
   L271 : do {
    if (($563 | 0) == 0) {
     label = 182;
    } else {
     $sp$0$i$i = 1936 | 0;
     while (1) {
      $565 = HEAP32[$sp$0$i$i >> 2] | 0;
      if (!($565 >>> 0 > $563 >>> 0)) {
       $567 = $sp$0$i$i + 4 | 0;
       if (($565 + (HEAP32[$567 >> 2] | 0) | 0) >>> 0 > $563 >>> 0) {
        break;
       }
      }
      $572 = HEAP32[$sp$0$i$i + 8 >> 2] | 0;
      if (($572 | 0) == 0) {
       label = 182;
       break L271;
      } else {
       $sp$0$i$i = $572;
      }
     }
     if (($sp$0$i$i | 0) == 0) {
      label = 182;
     } else {
      $599 = $550 - (HEAP32[1500 >> 2] | 0) & $551;
      if ($599 >>> 0 < 2147483647) {
       $601 = _sbrk($599 | 0) | 0;
       $605 = ($601 | 0) == ((HEAP32[$sp$0$i$i >> 2] | 0) + (HEAP32[$567 >> 2] | 0) | 0);
       $br$0$i = $601;
       $ssize$1$i = $599;
       $tbase$0$i = $605 ? $601 : -1;
       $tsize$0$i = $605 ? $599 : 0;
       label = 191;
      } else {
       $tsize$0323841$i = 0;
      }
     }
    }
   } while (0);
   do {
    if ((label | 0) == 182) {
     $575 = _sbrk(0) | 0;
     if (($575 | 0) == (-1 | 0)) {
      $tsize$0323841$i = 0;
     } else {
      $577 = $575;
      $578 = HEAP32[1964 >> 2] | 0;
      $579 = $578 + -1 | 0;
      if (($579 & $577 | 0) == 0) {
       $ssize$0$i = $552;
      } else {
       $ssize$0$i = $552 - $577 + ($579 + $577 & 0 - $578) | 0;
      }
      $587 = HEAP32[1920 >> 2] | 0;
      $588 = $587 + $ssize$0$i | 0;
      if ($ssize$0$i >>> 0 > $nb$0 >>> 0 & $ssize$0$i >>> 0 < 2147483647) {
       $591 = HEAP32[1928 >> 2] | 0;
       if (($591 | 0) != 0) {
        if ($588 >>> 0 <= $587 >>> 0 | $588 >>> 0 > $591 >>> 0) {
         $tsize$0323841$i = 0;
         break;
        }
       }
       $595 = _sbrk($ssize$0$i | 0) | 0;
       $596 = ($595 | 0) == ($575 | 0);
       $br$0$i = $595;
       $ssize$1$i = $ssize$0$i;
       $tbase$0$i = $596 ? $575 : -1;
       $tsize$0$i = $596 ? $ssize$0$i : 0;
       label = 191;
      } else {
       $tsize$0323841$i = 0;
      }
     }
    }
   } while (0);
   L291 : do {
    if ((label | 0) == 191) {
     $606 = 0 - $ssize$1$i | 0;
     if (($tbase$0$i | 0) != (-1 | 0)) {
      $tbase$247$i = $tbase$0$i;
      $tsize$246$i = $tsize$0$i;
      label = 202;
      break L269;
     }
     do {
      if (($br$0$i | 0) != (-1 | 0) & $ssize$1$i >>> 0 < 2147483647 & $ssize$1$i >>> 0 < $547 >>> 0) {
       $611 = HEAP32[1968 >> 2] | 0;
       $615 = $549 - $ssize$1$i + $611 & 0 - $611;
       if ($615 >>> 0 < 2147483647) {
        if ((_sbrk($615 | 0) | 0) == (-1 | 0)) {
         _sbrk($606 | 0) | 0;
         $tsize$0323841$i = $tsize$0$i;
         break L291;
        } else {
         $ssize$2$i = $615 + $ssize$1$i | 0;
         break;
        }
       } else {
        $ssize$2$i = $ssize$1$i;
       }
      } else {
       $ssize$2$i = $ssize$1$i;
      }
     } while (0);
     if (($br$0$i | 0) == (-1 | 0)) {
      $tsize$0323841$i = $tsize$0$i;
     } else {
      $tbase$247$i = $br$0$i;
      $tsize$246$i = $ssize$2$i;
      label = 202;
      break L269;
     }
    }
   } while (0);
   HEAP32[1932 >> 2] = HEAP32[1932 >> 2] | 4;
   $tsize$1$i = $tsize$0323841$i;
   label = 199;
  } else {
   $tsize$1$i = 0;
   label = 199;
  }
 } while (0);
 if ((label | 0) == 199) {
  if ($552 >>> 0 < 2147483647) {
   $624 = _sbrk($552 | 0) | 0;
   $625 = _sbrk(0) | 0;
   if (($625 | 0) != (-1 | 0) & ($624 | 0) != (-1 | 0) & $624 >>> 0 < $625 >>> 0) {
    $629 = $625 - $624 | 0;
    $631 = $629 >>> 0 > ($nb$0 + 40 | 0) >>> 0;
    if ($631) {
     $tbase$247$i = $624;
     $tsize$246$i = $631 ? $629 : $tsize$1$i;
     label = 202;
    }
   }
  }
 }
 if ((label | 0) == 202) {
  $633 = (HEAP32[1920 >> 2] | 0) + $tsize$246$i | 0;
  HEAP32[1920 >> 2] = $633;
  if ($633 >>> 0 > (HEAP32[1924 >> 2] | 0) >>> 0) {
   HEAP32[1924 >> 2] = $633;
  }
  $636 = HEAP32[1512 >> 2] | 0;
  L311 : do {
   if (($636 | 0) == 0) {
    $638 = HEAP32[1504 >> 2] | 0;
    if (($638 | 0) == 0 | $tbase$247$i >>> 0 < $638 >>> 0) {
     HEAP32[1504 >> 2] = $tbase$247$i;
    }
    HEAP32[1936 >> 2] = $tbase$247$i;
    HEAP32[1940 >> 2] = $tsize$246$i;
    HEAP32[1948 >> 2] = 0;
    HEAP32[1524 >> 2] = HEAP32[490];
    HEAP32[1520 >> 2] = -1;
    $i$02$i$i = 0;
    do {
     $642 = $i$02$i$i << 1;
     $643 = 1528 + ($642 << 2) | 0;
     HEAP32[1528 + ($642 + 3 << 2) >> 2] = $643;
     HEAP32[1528 + ($642 + 2 << 2) >> 2] = $643;
     $i$02$i$i = $i$02$i$i + 1 | 0;
    } while (($i$02$i$i | 0) != 32);
    $649 = $tbase$247$i + 8 | 0;
    if (($649 & 7 | 0) == 0) {
     $655 = 0;
    } else {
     $655 = 0 - $649 & 7;
    }
    $656 = $tsize$246$i + -40 - $655 | 0;
    HEAP32[1512 >> 2] = $tbase$247$i + $655;
    HEAP32[1500 >> 2] = $656;
    HEAP32[$tbase$247$i + ($655 + 4) >> 2] = $656 | 1;
    HEAP32[$tbase$247$i + ($tsize$246$i + -36) >> 2] = 40;
    HEAP32[1516 >> 2] = HEAP32[1976 >> 2];
   } else {
    $sp$075$i = 1936 | 0;
    while (1) {
     $661 = HEAP32[$sp$075$i >> 2] | 0;
     $662 = $sp$075$i + 4 | 0;
     $663 = HEAP32[$662 >> 2] | 0;
     if (($tbase$247$i | 0) == ($661 + $663 | 0)) {
      label = 214;
      break;
     }
     $667 = HEAP32[$sp$075$i + 8 >> 2] | 0;
     if (($667 | 0) == 0) {
      break;
     } else {
      $sp$075$i = $667;
     }
    }
    if ((label | 0) == 214) {
     if ((HEAP32[$sp$075$i + 12 >> 2] & 8 | 0) == 0) {
      if ($636 >>> 0 >= $661 >>> 0 & $636 >>> 0 < $tbase$247$i >>> 0) {
       HEAP32[$662 >> 2] = $663 + $tsize$246$i;
       $677 = (HEAP32[1500 >> 2] | 0) + $tsize$246$i | 0;
       $679 = $636 + 8 | 0;
       if (($679 & 7 | 0) == 0) {
        $685 = 0;
       } else {
        $685 = 0 - $679 & 7;
       }
       $686 = $677 - $685 | 0;
       HEAP32[1512 >> 2] = $636 + $685;
       HEAP32[1500 >> 2] = $686;
       HEAP32[$636 + ($685 + 4) >> 2] = $686 | 1;
       HEAP32[$636 + ($677 + 4) >> 2] = 40;
       HEAP32[1516 >> 2] = HEAP32[1976 >> 2];
       break;
      }
     }
    }
    if ($tbase$247$i >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
     HEAP32[1504 >> 2] = $tbase$247$i;
    }
    $693 = $tbase$247$i + $tsize$246$i | 0;
    $sp$168$i = 1936 | 0;
    while (1) {
     if ((HEAP32[$sp$168$i >> 2] | 0) == ($693 | 0)) {
      label = 224;
      break;
     }
     $697 = HEAP32[$sp$168$i + 8 >> 2] | 0;
     if (($697 | 0) == 0) {
      break;
     } else {
      $sp$168$i = $697;
     }
    }
    if ((label | 0) == 224) {
     if ((HEAP32[$sp$168$i + 12 >> 2] & 8 | 0) == 0) {
      HEAP32[$sp$168$i >> 2] = $tbase$247$i;
      $703 = $sp$168$i + 4 | 0;
      HEAP32[$703 >> 2] = (HEAP32[$703 >> 2] | 0) + $tsize$246$i;
      $707 = $tbase$247$i + 8 | 0;
      if (($707 & 7 | 0) == 0) {
       $713 = 0;
      } else {
       $713 = 0 - $707 & 7;
      }
      $715 = $tbase$247$i + ($tsize$246$i + 8) | 0;
      if (($715 & 7 | 0) == 0) {
       $720 = 0;
      } else {
       $720 = 0 - $715 & 7;
      }
      $721 = $tbase$247$i + ($720 + $tsize$246$i) | 0;
      $$sum$i21$i = $713 + $nb$0 | 0;
      $725 = $tbase$247$i + $$sum$i21$i | 0;
      $726 = $721 - ($tbase$247$i + $713) - $nb$0 | 0;
      HEAP32[$tbase$247$i + ($713 + 4) >> 2] = $nb$0 | 3;
      L348 : do {
       if (($721 | 0) == (HEAP32[1512 >> 2] | 0)) {
        $732 = (HEAP32[1500 >> 2] | 0) + $726 | 0;
        HEAP32[1500 >> 2] = $732;
        HEAP32[1512 >> 2] = $725;
        HEAP32[$tbase$247$i + ($$sum$i21$i + 4) >> 2] = $732 | 1;
       } else {
        if (($721 | 0) == (HEAP32[1508 >> 2] | 0)) {
         $738 = (HEAP32[1496 >> 2] | 0) + $726 | 0;
         HEAP32[1496 >> 2] = $738;
         HEAP32[1508 >> 2] = $725;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 4) >> 2] = $738 | 1;
         HEAP32[$tbase$247$i + ($738 + $$sum$i21$i) >> 2] = $738;
         break;
        }
        $$sum2$i23$i = $tsize$246$i + 4 | 0;
        $743 = HEAP32[$tbase$247$i + ($$sum2$i23$i + $720) >> 2] | 0;
        if (($743 & 3 | 0) == 1) {
         $746 = $743 & -8;
         $747 = $743 >>> 3;
         do {
          if ($743 >>> 0 < 256) {
           $750 = HEAP32[$tbase$247$i + (($720 | 8) + $tsize$246$i) >> 2] | 0;
           $752 = HEAP32[$tbase$247$i + ($tsize$246$i + 12 + $720) >> 2] | 0;
           $754 = 1528 + ($747 << 1 << 2) | 0;
           if (($750 | 0) != ($754 | 0)) {
            if ($750 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
             _abort();
            }
            if ((HEAP32[$750 + 12 >> 2] | 0) != ($721 | 0)) {
             _abort();
            }
           }
           if (($752 | 0) == ($750 | 0)) {
            HEAP32[372] = HEAP32[372] & ~(1 << $747);
            break;
           }
           if (($752 | 0) == ($754 | 0)) {
            $$pre$phi58$i$iZ2D = $752 + 8 | 0;
           } else {
            if ($752 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
             _abort();
            }
            $769 = $752 + 8 | 0;
            if ((HEAP32[$769 >> 2] | 0) == ($721 | 0)) {
             $$pre$phi58$i$iZ2D = $769;
            } else {
             _abort();
            }
           }
           HEAP32[$750 + 12 >> 2] = $752;
           HEAP32[$$pre$phi58$i$iZ2D >> 2] = $750;
          } else {
           $774 = HEAP32[$tbase$247$i + (($720 | 24) + $tsize$246$i) >> 2] | 0;
           $776 = HEAP32[$tbase$247$i + ($tsize$246$i + 12 + $720) >> 2] | 0;
           do {
            if (($776 | 0) == ($721 | 0)) {
             $$sum67$i$i = $720 | 16;
             $788 = $tbase$247$i + ($$sum2$i23$i + $$sum67$i$i) | 0;
             $789 = HEAP32[$788 >> 2] | 0;
             if (($789 | 0) == 0) {
              $791 = $tbase$247$i + ($$sum67$i$i + $tsize$246$i) | 0;
              $792 = HEAP32[$791 >> 2] | 0;
              if (($792 | 0) == 0) {
               $R$1$i$i = 0;
               break;
              } else {
               $R$0$i$i = $792;
               $RP$0$i$i = $791;
              }
             } else {
              $R$0$i$i = $789;
              $RP$0$i$i = $788;
             }
             while (1) {
              $794 = $R$0$i$i + 20 | 0;
              $795 = HEAP32[$794 >> 2] | 0;
              if (($795 | 0) != 0) {
               $R$0$i$i = $795;
               $RP$0$i$i = $794;
               continue;
              }
              $797 = $R$0$i$i + 16 | 0;
              $798 = HEAP32[$797 >> 2] | 0;
              if (($798 | 0) == 0) {
               break;
              } else {
               $R$0$i$i = $798;
               $RP$0$i$i = $797;
              }
             }
             if ($RP$0$i$i >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
              _abort();
             } else {
              HEAP32[$RP$0$i$i >> 2] = 0;
              $R$1$i$i = $R$0$i$i;
              break;
             }
            } else {
             $779 = HEAP32[$tbase$247$i + (($720 | 8) + $tsize$246$i) >> 2] | 0;
             if ($779 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
              _abort();
             }
             $782 = $779 + 12 | 0;
             if ((HEAP32[$782 >> 2] | 0) != ($721 | 0)) {
              _abort();
             }
             $785 = $776 + 8 | 0;
             if ((HEAP32[$785 >> 2] | 0) == ($721 | 0)) {
              HEAP32[$782 >> 2] = $776;
              HEAP32[$785 >> 2] = $779;
              $R$1$i$i = $776;
              break;
             } else {
              _abort();
             }
            }
           } while (0);
           if (($774 | 0) != 0) {
            $804 = HEAP32[$tbase$247$i + ($tsize$246$i + 28 + $720) >> 2] | 0;
            $805 = 1792 + ($804 << 2) | 0;
            if (($721 | 0) == (HEAP32[$805 >> 2] | 0)) {
             HEAP32[$805 >> 2] = $R$1$i$i;
             if (($R$1$i$i | 0) == 0) {
              HEAP32[1492 >> 2] = HEAP32[1492 >> 2] & ~(1 << $804);
              break;
             }
            } else {
             if ($774 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
              _abort();
             }
             $814 = $774 + 16 | 0;
             if ((HEAP32[$814 >> 2] | 0) == ($721 | 0)) {
              HEAP32[$814 >> 2] = $R$1$i$i;
             } else {
              HEAP32[$774 + 20 >> 2] = $R$1$i$i;
             }
             if (($R$1$i$i | 0) == 0) {
              break;
             }
            }
            if ($R$1$i$i >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
             _abort();
            }
            HEAP32[$R$1$i$i + 24 >> 2] = $774;
            $$sum3132$i$i = $720 | 16;
            $823 = HEAP32[$tbase$247$i + ($$sum3132$i$i + $tsize$246$i) >> 2] | 0;
            do {
             if (($823 | 0) != 0) {
              if ($823 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
               _abort();
              } else {
               HEAP32[$R$1$i$i + 16 >> 2] = $823;
               HEAP32[$823 + 24 >> 2] = $R$1$i$i;
               break;
              }
             }
            } while (0);
            $830 = HEAP32[$tbase$247$i + ($$sum2$i23$i + $$sum3132$i$i) >> 2] | 0;
            if (($830 | 0) != 0) {
             if ($830 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
              _abort();
             } else {
              HEAP32[$R$1$i$i + 20 >> 2] = $830;
              HEAP32[$830 + 24 >> 2] = $R$1$i$i;
              break;
             }
            }
           }
          }
         } while (0);
         $oldfirst$0$i$i = $tbase$247$i + (($746 | $720) + $tsize$246$i) | 0;
         $qsize$0$i$i = $746 + $726 | 0;
        } else {
         $oldfirst$0$i$i = $721;
         $qsize$0$i$i = $726;
        }
        $838 = $oldfirst$0$i$i + 4 | 0;
        HEAP32[$838 >> 2] = HEAP32[$838 >> 2] & -2;
        HEAP32[$tbase$247$i + ($$sum$i21$i + 4) >> 2] = $qsize$0$i$i | 1;
        HEAP32[$tbase$247$i + ($qsize$0$i$i + $$sum$i21$i) >> 2] = $qsize$0$i$i;
        $844 = $qsize$0$i$i >>> 3;
        if ($qsize$0$i$i >>> 0 < 256) {
         $846 = $844 << 1;
         $847 = 1528 + ($846 << 2) | 0;
         $848 = HEAP32[372] | 0;
         $849 = 1 << $844;
         if (($848 & $849 | 0) == 0) {
          HEAP32[372] = $848 | $849;
          $$pre$phi$i26$iZ2D = 1528 + ($846 + 2 << 2) | 0;
          $F4$0$i$i = $847;
         } else {
          $853 = 1528 + ($846 + 2 << 2) | 0;
          $854 = HEAP32[$853 >> 2] | 0;
          if ($854 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
           _abort();
          } else {
           $$pre$phi$i26$iZ2D = $853;
           $F4$0$i$i = $854;
          }
         }
         HEAP32[$$pre$phi$i26$iZ2D >> 2] = $725;
         HEAP32[$F4$0$i$i + 12 >> 2] = $725;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 8) >> 2] = $F4$0$i$i;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 12) >> 2] = $847;
         break;
        }
        $860 = $qsize$0$i$i >>> 8;
        if (($860 | 0) == 0) {
         $I7$0$i$i = 0;
        } else {
         if ($qsize$0$i$i >>> 0 > 16777215) {
          $I7$0$i$i = 31;
         } else {
          $865 = ($860 + 1048320 | 0) >>> 16 & 8;
          $866 = $860 << $865;
          $869 = ($866 + 520192 | 0) >>> 16 & 4;
          $871 = $866 << $869;
          $874 = ($871 + 245760 | 0) >>> 16 & 2;
          $879 = 14 - ($869 | $865 | $874) + ($871 << $874 >>> 15) | 0;
          $I7$0$i$i = $qsize$0$i$i >>> ($879 + 7 | 0) & 1 | $879 << 1;
         }
        }
        $885 = 1792 + ($I7$0$i$i << 2) | 0;
        HEAP32[$tbase$247$i + ($$sum$i21$i + 28) >> 2] = $I7$0$i$i;
        HEAP32[$tbase$247$i + ($$sum$i21$i + 20) >> 2] = 0;
        HEAP32[$tbase$247$i + ($$sum$i21$i + 16) >> 2] = 0;
        $889 = HEAP32[1492 >> 2] | 0;
        $890 = 1 << $I7$0$i$i;
        if (($889 & $890 | 0) == 0) {
         HEAP32[1492 >> 2] = $889 | $890;
         HEAP32[$885 >> 2] = $725;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 24) >> 2] = $885;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 12) >> 2] = $725;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 8) >> 2] = $725;
         break;
        }
        $897 = HEAP32[$885 >> 2] | 0;
        if (($I7$0$i$i | 0) == 31) {
         $906 = 0;
        } else {
         $906 = 25 - ($I7$0$i$i >>> 1) | 0;
        }
        L445 : do {
         if ((HEAP32[$897 + 4 >> 2] & -8 | 0) == ($qsize$0$i$i | 0)) {
          $T$0$lcssa$i28$i = $897;
         } else {
          $K8$052$i$i = $qsize$0$i$i << $906;
          $T$051$i$i = $897;
          while (1) {
           $914 = $T$051$i$i + ($K8$052$i$i >>> 31 << 2) + 16 | 0;
           $909 = HEAP32[$914 >> 2] | 0;
           if (($909 | 0) == 0) {
            break;
           }
           if ((HEAP32[$909 + 4 >> 2] & -8 | 0) == ($qsize$0$i$i | 0)) {
            $T$0$lcssa$i28$i = $909;
            break L445;
           } else {
            $K8$052$i$i = $K8$052$i$i << 1;
            $T$051$i$i = $909;
           }
          }
          if ($914 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
           _abort();
          } else {
           HEAP32[$914 >> 2] = $725;
           HEAP32[$tbase$247$i + ($$sum$i21$i + 24) >> 2] = $T$051$i$i;
           HEAP32[$tbase$247$i + ($$sum$i21$i + 12) >> 2] = $725;
           HEAP32[$tbase$247$i + ($$sum$i21$i + 8) >> 2] = $725;
           break L348;
          }
         }
        } while (0);
        $921 = $T$0$lcssa$i28$i + 8 | 0;
        $922 = HEAP32[$921 >> 2] | 0;
        $923 = HEAP32[1504 >> 2] | 0;
        if ($T$0$lcssa$i28$i >>> 0 < $923 >>> 0) {
         _abort();
        }
        if ($922 >>> 0 < $923 >>> 0) {
         _abort();
        } else {
         HEAP32[$922 + 12 >> 2] = $725;
         HEAP32[$921 >> 2] = $725;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 8) >> 2] = $922;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 12) >> 2] = $T$0$lcssa$i28$i;
         HEAP32[$tbase$247$i + ($$sum$i21$i + 24) >> 2] = 0;
         break;
        }
       }
      } while (0);
      $mem$0 = $tbase$247$i + ($713 | 8) | 0;
      STACKTOP = sp;
      return $mem$0 | 0;
     }
    }
    $sp$0$i$i$i = 1936 | 0;
    while (1) {
     $931 = HEAP32[$sp$0$i$i$i >> 2] | 0;
     if (!($931 >>> 0 > $636 >>> 0)) {
      $934 = HEAP32[$sp$0$i$i$i + 4 >> 2] | 0;
      $935 = $931 + $934 | 0;
      if ($935 >>> 0 > $636 >>> 0) {
       break;
      }
     }
     $sp$0$i$i$i = HEAP32[$sp$0$i$i$i + 8 >> 2] | 0;
    }
    $940 = $931 + ($934 + -39) | 0;
    if (($940 & 7 | 0) == 0) {
     $945 = 0;
    } else {
     $945 = 0 - $940 & 7;
    }
    $946 = $931 + ($934 + -47 + $945) | 0;
    $949 = $946 >>> 0 < ($636 + 16 | 0) >>> 0 ? $636 : $946;
    $950 = $949 + 8 | 0;
    $953 = $tbase$247$i + 8 | 0;
    if (($953 & 7 | 0) == 0) {
     $959 = 0;
    } else {
     $959 = 0 - $953 & 7;
    }
    $960 = $tsize$246$i + -40 - $959 | 0;
    HEAP32[1512 >> 2] = $tbase$247$i + $959;
    HEAP32[1500 >> 2] = $960;
    HEAP32[$tbase$247$i + ($959 + 4) >> 2] = $960 | 1;
    HEAP32[$tbase$247$i + ($tsize$246$i + -36) >> 2] = 40;
    HEAP32[1516 >> 2] = HEAP32[1976 >> 2];
    HEAP32[$949 + 4 >> 2] = 27;
    HEAP32[$950 + 0 >> 2] = HEAP32[1936 >> 2];
    HEAP32[$950 + 4 >> 2] = HEAP32[1940 >> 2];
    HEAP32[$950 + 8 >> 2] = HEAP32[1944 >> 2];
    HEAP32[$950 + 12 >> 2] = HEAP32[1948 >> 2];
    HEAP32[1936 >> 2] = $tbase$247$i;
    HEAP32[1940 >> 2] = $tsize$246$i;
    HEAP32[1948 >> 2] = 0;
    HEAP32[1944 >> 2] = $950;
    $966 = $949 + 28 | 0;
    HEAP32[$966 >> 2] = 7;
    if (($949 + 32 | 0) >>> 0 < $935 >>> 0) {
     $970 = $966;
     while (1) {
      $969 = $970 + 4 | 0;
      HEAP32[$969 >> 2] = 7;
      if (($970 + 8 | 0) >>> 0 < $935 >>> 0) {
       $970 = $969;
      } else {
       break;
      }
     }
    }
    if (($949 | 0) != ($636 | 0)) {
     $976 = $949 - $636 | 0;
     $978 = $636 + ($976 + 4) | 0;
     HEAP32[$978 >> 2] = HEAP32[$978 >> 2] & -2;
     HEAP32[$636 + 4 >> 2] = $976 | 1;
     HEAP32[$636 + $976 >> 2] = $976;
     $983 = $976 >>> 3;
     if ($976 >>> 0 < 256) {
      $985 = $983 << 1;
      $986 = 1528 + ($985 << 2) | 0;
      $987 = HEAP32[372] | 0;
      $988 = 1 << $983;
      if (($987 & $988 | 0) == 0) {
       HEAP32[372] = $987 | $988;
       $$pre$phi$i$iZ2D = 1528 + ($985 + 2 << 2) | 0;
       $F$0$i$i = $986;
      } else {
       $992 = 1528 + ($985 + 2 << 2) | 0;
       $993 = HEAP32[$992 >> 2] | 0;
       if ($993 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
        _abort();
       } else {
        $$pre$phi$i$iZ2D = $992;
        $F$0$i$i = $993;
       }
      }
      HEAP32[$$pre$phi$i$iZ2D >> 2] = $636;
      HEAP32[$F$0$i$i + 12 >> 2] = $636;
      HEAP32[$636 + 8 >> 2] = $F$0$i$i;
      HEAP32[$636 + 12 >> 2] = $986;
      break;
     }
     $999 = $976 >>> 8;
     if (($999 | 0) == 0) {
      $I1$0$i$i = 0;
     } else {
      if ($976 >>> 0 > 16777215) {
       $I1$0$i$i = 31;
      } else {
       $1004 = ($999 + 1048320 | 0) >>> 16 & 8;
       $1005 = $999 << $1004;
       $1008 = ($1005 + 520192 | 0) >>> 16 & 4;
       $1010 = $1005 << $1008;
       $1013 = ($1010 + 245760 | 0) >>> 16 & 2;
       $1018 = 14 - ($1008 | $1004 | $1013) + ($1010 << $1013 >>> 15) | 0;
       $I1$0$i$i = $976 >>> ($1018 + 7 | 0) & 1 | $1018 << 1;
      }
     }
     $1024 = 1792 + ($I1$0$i$i << 2) | 0;
     HEAP32[$636 + 28 >> 2] = $I1$0$i$i;
     HEAP32[$636 + 20 >> 2] = 0;
     HEAP32[$636 + 16 >> 2] = 0;
     $1028 = HEAP32[1492 >> 2] | 0;
     $1029 = 1 << $I1$0$i$i;
     if (($1028 & $1029 | 0) == 0) {
      HEAP32[1492 >> 2] = $1028 | $1029;
      HEAP32[$1024 >> 2] = $636;
      HEAP32[$636 + 24 >> 2] = $1024;
      HEAP32[$636 + 12 >> 2] = $636;
      HEAP32[$636 + 8 >> 2] = $636;
      break;
     }
     $1036 = HEAP32[$1024 >> 2] | 0;
     if (($I1$0$i$i | 0) == 31) {
      $1045 = 0;
     } else {
      $1045 = 25 - ($I1$0$i$i >>> 1) | 0;
     }
     L499 : do {
      if ((HEAP32[$1036 + 4 >> 2] & -8 | 0) == ($976 | 0)) {
       $T$0$lcssa$i$i = $1036;
      } else {
       $K2$014$i$i = $976 << $1045;
       $T$013$i$i = $1036;
       while (1) {
        $1053 = $T$013$i$i + ($K2$014$i$i >>> 31 << 2) + 16 | 0;
        $1048 = HEAP32[$1053 >> 2] | 0;
        if (($1048 | 0) == 0) {
         break;
        }
        if ((HEAP32[$1048 + 4 >> 2] & -8 | 0) == ($976 | 0)) {
         $T$0$lcssa$i$i = $1048;
         break L499;
        } else {
         $K2$014$i$i = $K2$014$i$i << 1;
         $T$013$i$i = $1048;
        }
       }
       if ($1053 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
        _abort();
       } else {
        HEAP32[$1053 >> 2] = $636;
        HEAP32[$636 + 24 >> 2] = $T$013$i$i;
        HEAP32[$636 + 12 >> 2] = $636;
        HEAP32[$636 + 8 >> 2] = $636;
        break L311;
       }
      }
     } while (0);
     $1060 = $T$0$lcssa$i$i + 8 | 0;
     $1061 = HEAP32[$1060 >> 2] | 0;
     $1062 = HEAP32[1504 >> 2] | 0;
     if ($T$0$lcssa$i$i >>> 0 < $1062 >>> 0) {
      _abort();
     }
     if ($1061 >>> 0 < $1062 >>> 0) {
      _abort();
     } else {
      HEAP32[$1061 + 12 >> 2] = $636;
      HEAP32[$1060 >> 2] = $636;
      HEAP32[$636 + 8 >> 2] = $1061;
      HEAP32[$636 + 12 >> 2] = $T$0$lcssa$i$i;
      HEAP32[$636 + 24 >> 2] = 0;
      break;
     }
    }
   }
  } while (0);
  $1069 = HEAP32[1500 >> 2] | 0;
  if ($1069 >>> 0 > $nb$0 >>> 0) {
   $1071 = $1069 - $nb$0 | 0;
   HEAP32[1500 >> 2] = $1071;
   $1072 = HEAP32[1512 >> 2] | 0;
   HEAP32[1512 >> 2] = $1072 + $nb$0;
   HEAP32[$1072 + ($nb$0 + 4) >> 2] = $1071 | 1;
   HEAP32[$1072 + 4 >> 2] = $nb$0 | 3;
   $mem$0 = $1072 + 8 | 0;
   STACKTOP = sp;
   return $mem$0 | 0;
  }
 }
 HEAP32[(___errno_location() | 0) >> 2] = 12;
 $mem$0 = 0;
 STACKTOP = sp;
 return $mem$0 | 0;
}
function __Z20DistanceQueueRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R, $T, $o1, $b1, $o2, $b2) {
 $res = $res | 0;
 $R = $R | 0;
 $T = $T | 0;
 $o1 = $o1 | 0;
 $b1 = $b1 | 0;
 $o2 = $o2 | 0;
 $b2 = $b2 | 0;
 var $$$i = 0, $$not = 0, $0 = 0, $100 = 0, $101 = 0, $102 = 0, $110 = 0, $114 = 0, $115 = 0.0, $125 = 0, $127 = 0.0, $129 = 0.0, $13 = 0, $131 = 0.0, $133 = 0.0, $135 = 0.0, $137 = 0.0, $153 = 0, $154 = 0, $155 = 0, $157 = 0.0, $159 = 0, $16 = 0, $161 = 0.0, $164 = 0, $166 = 0.0, $169 = 0, $172 = 0, $176 = 0, $180 = 0, $183 = 0, $187 = 0, $19 = 0, $192 = 0.0, $195 = 0.0, $199 = 0.0, $2 = 0, $219 = 0.0, $22 = 0, $222 = 0.0, $226 = 0.0, $245 = 0, $249 = 0.0, $25 = 0, $253 = 0.0, $257 = 0.0, $28 = 0, $298 = 0, $299 = 0, $301 = 0.0, $303 = 0, $305 = 0.0, $308 = 0, $31 = 0, $310 = 0.0, $313 = 0, $316 = 0, $320 = 0, $324 = 0, $327 = 0, $331 = 0, $336 = 0.0, $339 = 0.0, $34 = 0, $343 = 0.0, $35 = 0, $389 = 0.0, $39 = 0, $393 = 0.0, $397 = 0.0, $4 = 0, $42 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0.0, $432 = 0, $435 = 0.0, $436 = 0, $44 = 0, $440 = 0.0, $441 = 0, $445 = 0.0, $448 = 0.0, $45 = 0, $452 = 0.0, $456 = 0.0, $459 = 0.0, $46 = 0, $463 = 0.0, $467 = 0, $47 = 0, $470 = 0, $474 = 0, $48 = 0, $49 = 0, $494 = 0, $497 = 0, $50 = 0, $501 = 0, $51 = 0, $52 = 0, $521 = 0, $522 = 0, $523 = 0.0, $526 = 0.0, $527 = 0, $53 = 0, $531 = 0.0, $532 = 0, $538 = 0.0, $54 = 0, $541 = 0.0, $545 = 0.0, $55 = 0, $551 = 0.0, $554 = 0.0, $558 = 0.0, $56 = 0, $57 = 0, $571 = 0, $572 = 0, $575 = 0, $579 = 0, $58 = 0, $59 = 0, $599 = 0, $6 = 0, $60 = 0, $602 = 0, $606 = 0, $61 = 0, $62 = 0, $626 = 0, $629 = 0, $63 = 0, $633 = 0, $64 = 0, $65 = 0, $653 = 0, $656 = 0, $66 = 0, $661 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $700 = 0, $705 = 0, $706 = 0, $707 = 0, $71 = 0, $710 = 0, $713 = 0, $717 = 0, $718 = 0, $72 = 0, $723 = 0, $724 = 0, $725 = 0, $728 = 0, $73 = 0, $731 = 0, $737 = 0, $738 = 0, $739 = 0, $74 = 0, $749 = 0, $75 = 0, $750 = 0, $751 = 0, $752 = 0, $753 = 0.0, $758 = 0, $759 = 0, $76 = 0, $761 = 0, $762 = 0, $769 = 0, $77 = 0, $772 = 0, $773 = 0, $779 = 0.0, $78 = 0, $782 = 0.0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $bvt1 = 0, $bvt2 = 0, $c$01$i = 0, $c$01$i8 = 0, $min_test = 0, $p = 0, $p$0$be$i = 0, $p$01$i = 0, $q = 0, $storemerge = 0.0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 528 | 0;
 $min_test = sp + 408 | 0;
 $p = sp;
 $q = sp + 24 | 0;
 $bvt1 = sp + 48 | 0;
 $bvt2 = sp + 168 | 0;
 $0 = sp + 288 | 0;
 $2 = HEAP32[$res + 184 >> 2] | 0;
 $4 = __Znaj($2 >>> 0 > 35791394 ? -1 : $2 * 120 | 0) | 0;
 $6 = __Znaj($2 >>> 0 > 1073741823 ? -1 : $2 << 2) | 0;
 $7 = $min_test + 8 | 0;
 HEAP32[$7 >> 2] = $b1;
 $8 = $min_test + 12 | 0;
 HEAP32[$8 >> 2] = $b2;
 $9 = $min_test + 16 | 0;
 HEAPF64[$9 >> 3] = +HEAPF64[$R >> 3];
 $13 = $min_test + 24 | 0;
 HEAPF64[$13 >> 3] = +HEAPF64[$R + 8 >> 3];
 $16 = $min_test + 32 | 0;
 HEAPF64[$16 >> 3] = +HEAPF64[$R + 16 >> 3];
 $19 = $min_test + 40 | 0;
 HEAPF64[$19 >> 3] = +HEAPF64[$R + 24 >> 3];
 $22 = $min_test + 48 | 0;
 HEAPF64[$22 >> 3] = +HEAPF64[$R + 32 >> 3];
 $25 = $min_test + 56 | 0;
 HEAPF64[$25 >> 3] = +HEAPF64[$R + 40 >> 3];
 $28 = $min_test + 64 | 0;
 HEAPF64[$28 >> 3] = +HEAPF64[$R + 48 >> 3];
 $31 = $min_test + 72 | 0;
 HEAPF64[$31 >> 3] = +HEAPF64[$R + 56 >> 3];
 $34 = $min_test + 80 | 0;
 HEAPF64[$34 >> 3] = +HEAPF64[$R + 64 >> 3];
 $35 = $min_test + 88 | 0;
 HEAPF64[$35 >> 3] = +HEAPF64[$T >> 3];
 $39 = $min_test + 96 | 0;
 HEAPF64[$39 >> 3] = +HEAPF64[$T + 8 >> 3];
 $42 = $min_test + 104 | 0;
 HEAPF64[$42 >> 3] = +HEAPF64[$T + 16 >> 3];
 $43 = $o1 + 16 | 0;
 $44 = $o2 + 16 | 0;
 $45 = $2 + -1 | 0;
 $46 = $bvt1 + 8 | 0;
 $47 = $bvt1 + 12 | 0;
 $48 = $bvt1 + 16 | 0;
 $49 = $bvt1 + 40 | 0;
 $50 = $bvt1 + 64 | 0;
 $51 = $bvt1 + 24 | 0;
 $52 = $bvt1 + 48 | 0;
 $53 = $bvt1 + 72 | 0;
 $54 = $bvt1 + 32 | 0;
 $55 = $bvt1 + 56 | 0;
 $56 = $bvt1 + 80 | 0;
 $57 = $bvt1 + 88 | 0;
 $58 = $bvt1 + 96 | 0;
 $59 = $bvt1 + 104 | 0;
 $60 = $bvt2 + 8 | 0;
 $61 = $bvt2 + 12 | 0;
 $62 = $bvt2 + 16 | 0;
 $63 = $bvt2 + 40 | 0;
 $64 = $bvt2 + 64 | 0;
 $65 = $bvt2 + 24 | 0;
 $66 = $bvt2 + 48 | 0;
 $67 = $bvt2 + 72 | 0;
 $68 = $bvt2 + 32 | 0;
 $69 = $bvt2 + 56 | 0;
 $70 = $bvt2 + 80 | 0;
 $71 = $bvt2 + 88 | 0;
 $72 = $bvt2 + 96 | 0;
 $73 = $bvt2 + 104 | 0;
 $74 = $res + 120 | 0;
 $75 = $res + 128 | 0;
 $76 = $res + 112 | 0;
 $77 = $res + 4 | 0;
 $78 = $o1 + 4 | 0;
 $79 = $o2 + 4 | 0;
 $80 = $res + 16 | 0;
 $81 = $res + 88 | 0;
 $82 = $res + 136 | 0;
 $83 = $p + 8 | 0;
 $84 = $res + 144 | 0;
 $85 = $p + 16 | 0;
 $86 = $res + 152 | 0;
 $87 = $res + 160 | 0;
 $88 = $q + 8 | 0;
 $89 = $res + 168 | 0;
 $90 = $q + 16 | 0;
 $91 = $res + 176 | 0;
 $92 = $o1 + 28 | 0;
 $93 = $o2 + 28 | 0;
 $125 = 0;
 while (1) {
  $94 = HEAP32[$7 >> 2] | 0;
  $95 = HEAP32[$43 >> 2] | 0;
  $96 = $95 + ($94 * 176 | 0) + 168 | 0;
  $97 = HEAP32[$96 >> 2] | 0;
  $98 = HEAP32[$8 >> 2] | 0;
  $99 = HEAP32[$44 >> 2] | 0;
  $100 = $99 + ($98 * 176 | 0) + 168 | 0;
  $101 = HEAP32[$100 >> 2] | 0;
  $$not = ($97 | 0) > -1;
  $102 = ($101 | 0) > -1;
  do {
   if (($101 & $97 | 0) > -1) {
    if (($125 | 0) == ($45 | 0)) {
     __Z20DistanceQueueRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $9, $35, $o1, $94, $o2, $98);
     $737 = $45;
     break;
    }
    $127 = +HEAPF64[$95 + ($94 * 176 | 0) + 96 >> 3];
    $129 = +HEAPF64[$95 + ($94 * 176 | 0) + 104 >> 3];
    $131 = +HEAPF64[$95 + ($94 * 176 | 0) + 112 >> 3];
    $133 = +HEAPF64[$99 + ($98 * 176 | 0) + 96 >> 3];
    $135 = +HEAPF64[$99 + ($98 * 176 | 0) + 104 >> 3];
    $137 = +HEAPF64[$99 + ($98 * 176 | 0) + 112 >> 3];
    HEAP32[$res >> 2] = (HEAP32[$res >> 2] | 0) + 2;
    if ($102) {
     if ($$not & $131 * 2.0 + +Math_sqrt(+($127 * $127 + $129 * $129)) > $137 * 2.0 + +Math_sqrt(+($133 * $133 + $135 * $135))) {
      label = 9;
     } else {
      $429 = HEAP32[$100 >> 2] | 0;
      $430 = $429 + 1 | 0;
      HEAP32[$46 >> 2] = $94;
      HEAP32[$47 >> 2] = $429;
      $431 = +HEAPF64[$9 >> 3];
      $432 = $99 + ($429 * 176 | 0) | 0;
      $435 = +HEAPF64[$13 >> 3];
      $436 = $99 + ($429 * 176 | 0) + 24 | 0;
      $440 = +HEAPF64[$16 >> 3];
      $441 = $99 + ($429 * 176 | 0) + 48 | 0;
      HEAPF64[$48 >> 3] = $431 * +HEAPF64[$432 >> 3] + $435 * +HEAPF64[$436 >> 3] + $440 * +HEAPF64[$441 >> 3];
      $445 = +HEAPF64[$19 >> 3];
      $448 = +HEAPF64[$22 >> 3];
      $452 = +HEAPF64[$25 >> 3];
      HEAPF64[$49 >> 3] = $445 * +HEAPF64[$432 >> 3] + $448 * +HEAPF64[$436 >> 3] + $452 * +HEAPF64[$441 >> 3];
      $456 = +HEAPF64[$28 >> 3];
      $459 = +HEAPF64[$31 >> 3];
      $463 = +HEAPF64[$34 >> 3];
      HEAPF64[$50 >> 3] = $456 * +HEAPF64[$432 >> 3] + $459 * +HEAPF64[$436 >> 3] + $463 * +HEAPF64[$441 >> 3];
      $467 = $99 + ($429 * 176 | 0) + 8 | 0;
      $470 = $99 + ($429 * 176 | 0) + 32 | 0;
      $474 = $99 + ($429 * 176 | 0) + 56 | 0;
      HEAPF64[$51 >> 3] = $431 * +HEAPF64[$467 >> 3] + $435 * +HEAPF64[$470 >> 3] + $440 * +HEAPF64[$474 >> 3];
      HEAPF64[$52 >> 3] = $445 * +HEAPF64[$467 >> 3] + $448 * +HEAPF64[$470 >> 3] + $452 * +HEAPF64[$474 >> 3];
      HEAPF64[$53 >> 3] = $456 * +HEAPF64[$467 >> 3] + $459 * +HEAPF64[$470 >> 3] + $463 * +HEAPF64[$474 >> 3];
      $494 = $99 + ($429 * 176 | 0) + 16 | 0;
      $497 = $99 + ($429 * 176 | 0) + 40 | 0;
      $501 = $99 + ($429 * 176 | 0) + 64 | 0;
      HEAPF64[$54 >> 3] = $431 * +HEAPF64[$494 >> 3] + $435 * +HEAPF64[$497 >> 3] + $440 * +HEAPF64[$501 >> 3];
      HEAPF64[$55 >> 3] = $445 * +HEAPF64[$494 >> 3] + $448 * +HEAPF64[$497 >> 3] + $452 * +HEAPF64[$501 >> 3];
      HEAPF64[$56 >> 3] = $456 * +HEAPF64[$494 >> 3] + $459 * +HEAPF64[$497 >> 3] + $463 * +HEAPF64[$501 >> 3];
      $521 = HEAP32[$44 >> 2] | 0;
      $522 = $521 + ($429 * 176 | 0) + 72 | 0;
      $523 = +HEAPF64[$9 >> 3];
      $526 = +HEAPF64[$13 >> 3];
      $527 = $521 + ($429 * 176 | 0) + 80 | 0;
      $531 = +HEAPF64[$16 >> 3];
      $532 = $521 + ($429 * 176 | 0) + 88 | 0;
      HEAPF64[$57 >> 3] = +HEAPF64[$35 >> 3] + ($523 * +HEAPF64[$522 >> 3] + $526 * +HEAPF64[$527 >> 3] + $531 * +HEAPF64[$532 >> 3]);
      $538 = +HEAPF64[$19 >> 3];
      $541 = +HEAPF64[$22 >> 3];
      $545 = +HEAPF64[$25 >> 3];
      HEAPF64[$58 >> 3] = +HEAPF64[$39 >> 3] + ($538 * +HEAPF64[$522 >> 3] + $541 * +HEAPF64[$527 >> 3] + $545 * +HEAPF64[$532 >> 3]);
      $551 = +HEAPF64[$28 >> 3];
      $554 = +HEAPF64[$31 >> 3];
      $558 = +HEAPF64[$34 >> 3];
      HEAPF64[$59 >> 3] = +HEAPF64[$42 >> 3] + ($551 * +HEAPF64[$522 >> 3] + $554 * +HEAPF64[$527 >> 3] + $558 * +HEAPF64[$532 >> 3]);
      HEAPF64[$bvt1 >> 3] = +__Z11BV_DistancePA3_dPdP2BVS3_($48, $57, (HEAP32[$43 >> 2] | 0) + ((HEAP32[$46 >> 2] | 0) * 176 | 0) | 0, $521 + ((HEAP32[$47 >> 2] | 0) * 176 | 0) | 0);
      HEAP32[$60 >> 2] = HEAP32[$7 >> 2];
      HEAP32[$61 >> 2] = $430;
      $571 = HEAP32[$44 >> 2] | 0;
      $572 = $571 + ($430 * 176 | 0) | 0;
      $575 = $571 + ($430 * 176 | 0) + 24 | 0;
      $579 = $571 + ($430 * 176 | 0) + 48 | 0;
      HEAPF64[$62 >> 3] = $523 * +HEAPF64[$572 >> 3] + $526 * +HEAPF64[$575 >> 3] + $531 * +HEAPF64[$579 >> 3];
      HEAPF64[$63 >> 3] = $538 * +HEAPF64[$572 >> 3] + $541 * +HEAPF64[$575 >> 3] + $545 * +HEAPF64[$579 >> 3];
      HEAPF64[$64 >> 3] = $551 * +HEAPF64[$572 >> 3] + $554 * +HEAPF64[$575 >> 3] + $558 * +HEAPF64[$579 >> 3];
      $599 = $571 + ($430 * 176 | 0) + 8 | 0;
      $602 = $571 + ($430 * 176 | 0) + 32 | 0;
      $606 = $571 + ($430 * 176 | 0) + 56 | 0;
      HEAPF64[$65 >> 3] = $523 * +HEAPF64[$599 >> 3] + $526 * +HEAPF64[$602 >> 3] + $531 * +HEAPF64[$606 >> 3];
      HEAPF64[$66 >> 3] = $538 * +HEAPF64[$599 >> 3] + $541 * +HEAPF64[$602 >> 3] + $545 * +HEAPF64[$606 >> 3];
      HEAPF64[$67 >> 3] = $551 * +HEAPF64[$599 >> 3] + $554 * +HEAPF64[$602 >> 3] + $558 * +HEAPF64[$606 >> 3];
      $626 = $571 + ($430 * 176 | 0) + 16 | 0;
      $629 = $571 + ($430 * 176 | 0) + 40 | 0;
      $633 = $571 + ($430 * 176 | 0) + 64 | 0;
      HEAPF64[$68 >> 3] = $523 * +HEAPF64[$626 >> 3] + $526 * +HEAPF64[$629 >> 3] + $531 * +HEAPF64[$633 >> 3];
      HEAPF64[$69 >> 3] = $538 * +HEAPF64[$626 >> 3] + $541 * +HEAPF64[$629 >> 3] + $545 * +HEAPF64[$633 >> 3];
      HEAPF64[$70 >> 3] = $551 * +HEAPF64[$626 >> 3] + $554 * +HEAPF64[$629 >> 3] + $558 * +HEAPF64[$633 >> 3];
      $653 = $571 + ($430 * 176 | 0) + 72 | 0;
      $656 = $571 + ($430 * 176 | 0) + 80 | 0;
      $661 = $571 + ($430 * 176 | 0) + 88 | 0;
      HEAPF64[$71 >> 3] = +HEAPF64[$35 >> 3] + ($523 * +HEAPF64[$653 >> 3] + $526 * +HEAPF64[$656 >> 3] + +HEAPF64[$16 >> 3] * +HEAPF64[$661 >> 3]);
      HEAPF64[$72 >> 3] = +HEAPF64[$39 >> 3] + (+HEAPF64[$19 >> 3] * +HEAPF64[$653 >> 3] + +HEAPF64[$22 >> 3] * +HEAPF64[$656 >> 3] + +HEAPF64[$25 >> 3] * +HEAPF64[$661 >> 3]);
      HEAPF64[$73 >> 3] = +HEAPF64[$42 >> 3] + (+HEAPF64[$28 >> 3] * +HEAPF64[$653 >> 3] + +HEAPF64[$31 >> 3] * +HEAPF64[$656 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$661 >> 3]);
      $storemerge = +__Z11BV_DistancePA3_dPdP2BVS3_($62, $71, (HEAP32[$43 >> 2] | 0) + ((HEAP32[$60 >> 2] | 0) * 176 | 0) | 0, (HEAP32[$44 >> 2] | 0) + ((HEAP32[$61 >> 2] | 0) * 176 | 0) | 0);
     }
    } else {
     label = 9;
    }
    if ((label | 0) == 9) {
     label = 0;
     $153 = HEAP32[$96 >> 2] | 0;
     $154 = $153 + 1 | 0;
     HEAP32[$46 >> 2] = $153;
     HEAP32[$47 >> 2] = $98;
     $155 = $95 + ($153 * 176 | 0) | 0;
     $157 = +HEAPF64[$9 >> 3];
     $159 = $95 + ($153 * 176 | 0) + 24 | 0;
     $161 = +HEAPF64[$19 >> 3];
     $164 = $95 + ($153 * 176 | 0) + 48 | 0;
     $166 = +HEAPF64[$28 >> 3];
     HEAPF64[$48 >> 3] = +HEAPF64[$155 >> 3] * $157 + +HEAPF64[$159 >> 3] * $161 + +HEAPF64[$164 >> 3] * $166;
     $169 = $95 + ($153 * 176 | 0) + 8 | 0;
     $172 = $95 + ($153 * 176 | 0) + 32 | 0;
     $176 = $95 + ($153 * 176 | 0) + 56 | 0;
     HEAPF64[$49 >> 3] = +HEAPF64[$169 >> 3] * $157 + +HEAPF64[$172 >> 3] * $161 + +HEAPF64[$176 >> 3] * $166;
     $180 = $95 + ($153 * 176 | 0) + 16 | 0;
     $183 = $95 + ($153 * 176 | 0) + 40 | 0;
     $187 = $95 + ($153 * 176 | 0) + 64 | 0;
     HEAPF64[$50 >> 3] = +HEAPF64[$180 >> 3] * $157 + +HEAPF64[$183 >> 3] * $161 + +HEAPF64[$187 >> 3] * $166;
     $192 = +HEAPF64[$13 >> 3];
     $195 = +HEAPF64[$22 >> 3];
     $199 = +HEAPF64[$31 >> 3];
     HEAPF64[$51 >> 3] = +HEAPF64[$155 >> 3] * $192 + +HEAPF64[$159 >> 3] * $195 + +HEAPF64[$164 >> 3] * $199;
     HEAPF64[$52 >> 3] = +HEAPF64[$169 >> 3] * $192 + +HEAPF64[$172 >> 3] * $195 + +HEAPF64[$176 >> 3] * $199;
     HEAPF64[$53 >> 3] = +HEAPF64[$180 >> 3] * $192 + +HEAPF64[$183 >> 3] * $195 + +HEAPF64[$187 >> 3] * $199;
     $219 = +HEAPF64[$16 >> 3];
     $222 = +HEAPF64[$25 >> 3];
     $226 = +HEAPF64[$34 >> 3];
     HEAPF64[$54 >> 3] = +HEAPF64[$155 >> 3] * $219 + +HEAPF64[$159 >> 3] * $222 + +HEAPF64[$164 >> 3] * $226;
     HEAPF64[$55 >> 3] = +HEAPF64[$169 >> 3] * $219 + +HEAPF64[$172 >> 3] * $222 + +HEAPF64[$176 >> 3] * $226;
     HEAPF64[$56 >> 3] = +HEAPF64[$180 >> 3] * $219 + +HEAPF64[$183 >> 3] * $222 + +HEAPF64[$187 >> 3] * $226;
     $245 = HEAP32[$43 >> 2] | 0;
     $249 = +HEAPF64[$35 >> 3] - +HEAPF64[$245 + ($153 * 176 | 0) + 72 >> 3];
     $253 = +HEAPF64[$39 >> 3] - +HEAPF64[$245 + ($153 * 176 | 0) + 80 >> 3];
     $257 = +HEAPF64[$42 >> 3] - +HEAPF64[$245 + ($153 * 176 | 0) + 88 >> 3];
     HEAPF64[$57 >> 3] = $249 * +HEAPF64[$245 + ($153 * 176 | 0) >> 3] + $253 * +HEAPF64[$245 + ($153 * 176 | 0) + 24 >> 3] + $257 * +HEAPF64[$245 + ($153 * 176 | 0) + 48 >> 3];
     HEAPF64[$58 >> 3] = $249 * +HEAPF64[$245 + ($153 * 176 | 0) + 8 >> 3] + $253 * +HEAPF64[$245 + ($153 * 176 | 0) + 32 >> 3] + $257 * +HEAPF64[$245 + ($153 * 176 | 0) + 56 >> 3];
     HEAPF64[$59 >> 3] = $249 * +HEAPF64[$245 + ($153 * 176 | 0) + 16 >> 3] + $253 * +HEAPF64[$245 + ($153 * 176 | 0) + 40 >> 3] + $257 * +HEAPF64[$245 + ($153 * 176 | 0) + 64 >> 3];
     HEAPF64[$bvt1 >> 3] = +__Z11BV_DistancePA3_dPdP2BVS3_($48, $57, $245 + ((HEAP32[$46 >> 2] | 0) * 176 | 0) | 0, (HEAP32[$44 >> 2] | 0) + ((HEAP32[$47 >> 2] | 0) * 176 | 0) | 0);
     HEAP32[$60 >> 2] = $154;
     HEAP32[$61 >> 2] = HEAP32[$8 >> 2];
     $298 = HEAP32[$43 >> 2] | 0;
     $299 = $298 + ($154 * 176 | 0) | 0;
     $301 = +HEAPF64[$9 >> 3];
     $303 = $298 + ($154 * 176 | 0) + 24 | 0;
     $305 = +HEAPF64[$19 >> 3];
     $308 = $298 + ($154 * 176 | 0) + 48 | 0;
     $310 = +HEAPF64[$28 >> 3];
     HEAPF64[$62 >> 3] = +HEAPF64[$299 >> 3] * $301 + +HEAPF64[$303 >> 3] * $305 + +HEAPF64[$308 >> 3] * $310;
     $313 = $298 + ($154 * 176 | 0) + 8 | 0;
     $316 = $298 + ($154 * 176 | 0) + 32 | 0;
     $320 = $298 + ($154 * 176 | 0) + 56 | 0;
     HEAPF64[$63 >> 3] = +HEAPF64[$313 >> 3] * $301 + +HEAPF64[$316 >> 3] * $305 + +HEAPF64[$320 >> 3] * $310;
     $324 = $298 + ($154 * 176 | 0) + 16 | 0;
     $327 = $298 + ($154 * 176 | 0) + 40 | 0;
     $331 = $298 + ($154 * 176 | 0) + 64 | 0;
     HEAPF64[$64 >> 3] = +HEAPF64[$324 >> 3] * $301 + +HEAPF64[$327 >> 3] * $305 + +HEAPF64[$331 >> 3] * $310;
     $336 = +HEAPF64[$13 >> 3];
     $339 = +HEAPF64[$22 >> 3];
     $343 = +HEAPF64[$31 >> 3];
     HEAPF64[$65 >> 3] = +HEAPF64[$299 >> 3] * $336 + +HEAPF64[$303 >> 3] * $339 + +HEAPF64[$308 >> 3] * $343;
     HEAPF64[$66 >> 3] = +HEAPF64[$313 >> 3] * $336 + +HEAPF64[$316 >> 3] * $339 + +HEAPF64[$320 >> 3] * $343;
     HEAPF64[$67 >> 3] = +HEAPF64[$324 >> 3] * $336 + +HEAPF64[$327 >> 3] * $339 + +HEAPF64[$331 >> 3] * $343;
     HEAPF64[$68 >> 3] = +HEAPF64[$299 >> 3] * $219 + +HEAPF64[$303 >> 3] * $222 + +HEAPF64[$308 >> 3] * $226;
     HEAPF64[$69 >> 3] = +HEAPF64[$313 >> 3] * $219 + +HEAPF64[$316 >> 3] * $222 + +HEAPF64[$320 >> 3] * $226;
     HEAPF64[$70 >> 3] = +HEAPF64[$324 >> 3] * $219 + +HEAPF64[$327 >> 3] * $222 + +HEAPF64[$331 >> 3] * $226;
     $389 = +HEAPF64[$35 >> 3] - +HEAPF64[$298 + ($154 * 176 | 0) + 72 >> 3];
     $393 = +HEAPF64[$39 >> 3] - +HEAPF64[$298 + ($154 * 176 | 0) + 80 >> 3];
     $397 = +HEAPF64[$42 >> 3] - +HEAPF64[$298 + ($154 * 176 | 0) + 88 >> 3];
     HEAPF64[$71 >> 3] = $389 * +HEAPF64[$299 >> 3] + $393 * +HEAPF64[$303 >> 3] + $397 * +HEAPF64[$308 >> 3];
     HEAPF64[$72 >> 3] = $389 * +HEAPF64[$313 >> 3] + $393 * +HEAPF64[$316 >> 3] + $397 * +HEAPF64[$320 >> 3];
     HEAPF64[$73 >> 3] = $389 * +HEAPF64[$324 >> 3] + $393 * +HEAPF64[$327 >> 3] + $397 * +HEAPF64[$331 >> 3];
     $storemerge = +__Z11BV_DistancePA3_dPdP2BVS3_($62, $71, (HEAP32[$43 >> 2] | 0) + ((HEAP32[$60 >> 2] | 0) * 176 | 0) | 0, (HEAP32[$44 >> 2] | 0) + ((HEAP32[$61 >> 2] | 0) * 176 | 0) | 0);
    }
    HEAPF64[$bvt2 >> 3] = $storemerge;
    $700 = $4 + ($125 * 120 | 0) | 0;
    HEAP32[$6 + ($125 << 2) >> 2] = $700;
    dest = $700 + 0 | 0;
    src = $bvt1 + 0 | 0;
    stop = dest + 120 | 0;
    do {
     HEAP32[dest >> 2] = HEAP32[src >> 2];
     dest = dest + 4 | 0;
     src = src + 4 | 0;
    } while ((dest | 0) < (stop | 0));
    HEAP32[$4 + ($125 * 120 | 0) + 112 >> 2] = $125;
    L14 : do {
     if (($125 | 0) != 0) {
      $710 = $700;
      $c$01$i8 = $125;
      while (1) {
       $705 = ($c$01$i8 + -1 | 0) / 2 | 0;
       $706 = $6 + ($705 << 2) | 0;
       $707 = HEAP32[$706 >> 2] | 0;
       if (!(+HEAPF64[$707 >> 3] >= +HEAPF64[$710 >> 3])) {
        break L14;
       }
       HEAP32[$706 >> 2] = $710;
       HEAP32[$6 + ($c$01$i8 << 2) >> 2] = $707;
       $713 = HEAP32[$706 >> 2] | 0;
       HEAP32[$713 + 112 >> 2] = $705;
       HEAP32[$707 + 112 >> 2] = $c$01$i8;
       if ($c$01$i8 >>> 0 < 3) {
        break;
       } else {
        $710 = $713;
        $c$01$i8 = $705;
       }
      }
     }
    } while (0);
    $717 = $125 + 1 | 0;
    $718 = $4 + ($717 * 120 | 0) | 0;
    HEAP32[$6 + ($717 << 2) >> 2] = $718;
    dest = $718 + 0 | 0;
    src = $bvt2 + 0 | 0;
    stop = dest + 120 | 0;
    do {
     HEAP32[dest >> 2] = HEAP32[src >> 2];
     dest = dest + 4 | 0;
     src = src + 4 | 0;
    } while ((dest | 0) < (stop | 0));
    HEAP32[$4 + ($717 * 120 | 0) + 112 >> 2] = $717;
    L19 : do {
     if (($717 | 0) != 0) {
      $728 = $718;
      $c$01$i = $717;
      while (1) {
       $723 = ($c$01$i + -1 | 0) / 2 | 0;
       $724 = $6 + ($723 << 2) | 0;
       $725 = HEAP32[$724 >> 2] | 0;
       if (!(+HEAPF64[$725 >> 3] >= +HEAPF64[$728 >> 3])) {
        break L19;
       }
       HEAP32[$724 >> 2] = $728;
       HEAP32[$6 + ($c$01$i << 2) >> 2] = $725;
       $731 = HEAP32[$724 >> 2] | 0;
       HEAP32[$731 + 112 >> 2] = $723;
       HEAP32[$725 + 112 >> 2] = $c$01$i;
       if ($c$01$i >>> 0 < 3) {
        break;
       } else {
        $728 = $731;
        $c$01$i = $723;
       }
      }
     }
    } while (0);
    $737 = $125 + 2 | 0;
   } else {
    HEAP32[$77 >> 2] = (HEAP32[$77 >> 2] | 0) + 1;
    $110 = (HEAP32[$78 >> 2] | 0) + (~HEAP32[$96 >> 2] * 80 | 0) | 0;
    $114 = (HEAP32[$79 >> 2] | 0) + (~HEAP32[$100 >> 2] * 80 | 0) | 0;
    $115 = +__Z11TriDistancePA3_dPdP3TriS3_S1_S1_($80, $81, $110, $114, $p, $q);
    if ($115 < +HEAPF64[$75 >> 3]) {
     HEAPF64[$75 >> 3] = $115;
     HEAPF64[$82 >> 3] = +HEAPF64[$p >> 3];
     HEAPF64[$84 >> 3] = +HEAPF64[$83 >> 3];
     HEAPF64[$86 >> 3] = +HEAPF64[$85 >> 3];
     HEAPF64[$87 >> 3] = +HEAPF64[$q >> 3];
     HEAPF64[$89 >> 3] = +HEAPF64[$88 >> 3];
     HEAPF64[$91 >> 3] = +HEAPF64[$90 >> 3];
     HEAP32[$92 >> 2] = $110;
     HEAP32[$93 >> 2] = $114;
     $737 = $125;
    } else {
     $737 = $125;
    }
   }
  } while (0);
  if (($737 | 0) == 0) {
   break;
  }
  $738 = HEAP32[$6 >> 2] | 0;
  dest = $0 + 0 | 0;
  src = $738 + 0 | 0;
  stop = dest + 120 | 0;
  do {
   HEAP32[dest >> 2] = HEAP32[src >> 2];
   dest = dest + 4 | 0;
   src = src + 4 | 0;
  } while ((dest | 0) < (stop | 0));
  $739 = $737 + -1 | 0;
  dest = $738 + 0 | 0;
  src = $4 + ($739 * 120 | 0) + 0 | 0;
  stop = dest + 120 | 0;
  do {
   HEAP32[dest >> 2] = HEAP32[src >> 2];
   dest = dest + 4 | 0;
   src = src + 4 | 0;
  } while ((dest | 0) < (stop | 0));
  HEAP32[$6 + (HEAP32[$4 + ($739 * 120 | 0) + 112 >> 2] << 2) >> 2] = HEAP32[$6 >> 2];
  HEAP32[$6 >> 2] = HEAP32[$6 + ($739 << 2) >> 2];
  L28 : do {
   if (($739 | 0) > 1) {
    $749 = 2;
    $751 = 1;
    $p$01$i = 0;
    while (1) {
     $750 = $6 + ($751 << 2) | 0;
     $752 = HEAP32[$750 >> 2] | 0;
     $753 = +HEAPF64[$752 >> 3];
     if (($749 | 0) < ($739 | 0)) {
      $$$i = $753 < +HEAPF64[HEAP32[$6 + ($749 << 2) >> 2] >> 3] ? $751 : $749;
      $758 = $6 + ($$$i << 2) | 0;
      $759 = HEAP32[$758 >> 2] | 0;
      $761 = $6 + ($p$01$i << 2) | 0;
      $762 = HEAP32[$761 >> 2] | 0;
      if (!(+HEAPF64[$759 >> 3] < +HEAPF64[$762 >> 3])) {
       break L28;
      }
      HEAP32[$761 >> 2] = $759;
      HEAP32[$758 >> 2] = $762;
      HEAP32[(HEAP32[$761 >> 2] | 0) + 112 >> 2] = $p$01$i;
      HEAP32[$762 + 112 >> 2] = $$$i;
      $p$0$be$i = $$$i;
     } else {
      $772 = $6 + ($p$01$i << 2) | 0;
      $773 = HEAP32[$772 >> 2] | 0;
      if (!($753 < +HEAPF64[$773 >> 3])) {
       break L28;
      }
      HEAP32[$772 >> 2] = $752;
      HEAP32[$750 >> 2] = $773;
      HEAP32[(HEAP32[$772 >> 2] | 0) + 112 >> 2] = $p$01$i;
      HEAP32[$773 + 112 >> 2] = $751;
      $p$0$be$i = $751;
     }
     $769 = $p$0$be$i << 1 | 1;
     if (($769 | 0) < ($739 | 0)) {
      $749 = $769 + 1 | 0;
      $751 = $769;
      $p$01$i = $p$0$be$i;
     } else {
      break;
     }
    }
   }
  } while (0);
  dest = $min_test + 0 | 0;
  src = $0 + 0 | 0;
  stop = dest + 120 | 0;
  do {
   HEAP32[dest >> 2] = HEAP32[src >> 2];
   dest = dest + 4 | 0;
   src = src + 4 | 0;
  } while ((dest | 0) < (stop | 0));
  $779 = +HEAPF64[$min_test >> 3];
  $782 = +HEAPF64[$75 >> 3];
  if (!($779 + +HEAPF64[$74 >> 3] >= $782)) {
   $125 = $739;
   continue;
  }
  if (!($779 * (+HEAPF64[$76 >> 3] + 1.0) >= $782)) {
   $125 = $739;
  } else {
   break;
  }
 }
 if (($4 | 0) != 0) {
  __ZdaPv($4);
 }
 if (($6 | 0) == 0) {
  STACKTOP = sp;
  return;
 }
 __ZdaPv($6);
 STACKTOP = sp;
 return;
}
function __ZN2BV9FitToTrisEPA3_dP3Trii($this, $O, $tris, $num_tris) {
 $this = $this | 0;
 $O = $O | 0;
 $tris = $tris | 0;
 $num_tris = $num_tris | 0;
 var $$phi$trans$insert93 = 0, $$pre$phi106Z2D = 0, $0 = 0.0, $105 = 0, $107 = 0.0, $11 = 0.0, $111 = 0.0, $115 = 0.0, $118 = 0, $12 = 0, $120 = 0.0, $122 = 0.0, $124 = 0.0, $126 = 0.0, $128 = 0.0, $131 = 0.0, $134 = 0.0, $136 = 0.0, $139 = 0.0, $14 = 0.0, $143 = 0.0, $145 = 0.0, $148 = 0.0, $15 = 0, $161 = 0.0, $163 = 0.0, $166 = 0, $168 = 0.0, $17 = 0.0, $170 = 0.0, $172 = 0.0, $174 = 0.0, $18 = 0, $181 = 0, $184 = 0.0, $188 = 0.0, $191 = 0.0, $194 = 0.0, $198 = 0.0, $2 = 0.0, $20 = 0.0, $201 = 0.0, $203 = 0.0, $207 = 0.0, $209 = 0.0, $21 = 0, $212 = 0.0, $217 = 0.0, $221 = 0.0, $223 = 0.0, $226 = 0.0, $228 = 0, $23 = 0.0, $231 = 0.0, $238 = 0, $24 = 0, $241 = 0.0, $245 = 0.0, $248 = 0.0, $25 = 0, $251 = 0.0, $255 = 0.0, $258 = 0.0, $260 = 0.0, $264 = 0.0, $266 = 0.0, $269 = 0.0, $27 = 0, $274 = 0.0, $278 = 0.0, $28 = 0, $280 = 0.0, $283 = 0.0, $288 = 0.0, $291 = 0.0, $293 = 0.0, $294 = 0.0, $297 = 0.0, $298 = 0.0, $299 = 0.0, $3 = 0, $301 = 0.0, $306 = 0.0, $309 = 0.0, $31 = 0.0, $312 = 0.0, $314 = 0.0, $318 = 0.0, $319 = 0.0, $322 = 0.0, $324 = 0.0, $327 = 0.0, $332 = 0.0, $335 = 0.0, $338 = 0.0, $34 = 0.0, $340 = 0.0, $345 = 0.0, $347 = 0.0, $348 = 0.0, $351 = 0.0, $353 = 0.0, $356 = 0.0, $361 = 0.0, $364 = 0.0, $367 = 0.0, $369 = 0.0, $373 = 0.0, $374 = 0.0, $377 = 0.0, $378 = 0.0, $379 = 0.0, $38 = 0.0, $381 = 0.0, $386 = 0.0, $389 = 0.0, $392 = 0.0, $394 = 0.0, $397 = 0, $417 = 0.0, $420 = 0.0, $424 = 0.0, $425 = 0.0, $426 = 0.0, $5 = 0.0, $53 = 0, $56 = 0.0, $59 = 0.0, $6 = 0, $63 = 0.0, $78 = 0, $8 = 0.0, $81 = 0.0, $84 = 0.0, $88 = 0.0, $9 = 0, $i$081 = 0, $i$171 = 0, $i$259 = 0, $i$349 = 0, $i$445 = 0, $i$541 = 0, $i$632 = 0, $i$727 = 0, $i$823 = 0, $i$917 = 0, $maxindex$0$lcssa = 0, $maxindex$051 = 0, $maxindex$1 = 0, $maxindex$2$lcssa = 0, $maxindex$234 = 0, $maxindex$3 = 0, $maxx$0$lcssa = 0.0, $maxx$065 = 0.0, $maxx$1 = 0.0, $maxx$2$lcssa = 0.0, $maxx$240 = 0.0, $maxx$3 = 0.0, $maxx$4$lcssa = 0.0, $maxx$413 = 0.0, $maxx$5 = 0.0, $maxy$0$lcssa = 0.0, $maxy$067 = 0.0, $maxy$1 = 0.0, $maxy$222 = 0.0, $maxy$3 = 0.0, $maxy$4$lcssa = 0.0, $maxy$415 = 0.0, $maxy$5 = 0.0, $maxz$0$lcssa = 0.0, $maxz$069 = 0.0, $maxz$1 = 0.0, $maxz$2$lcssa = 0.0, $maxz$258 = 0.0, $maxz$3 = 0.0, $minindex$0$lcssa = 0, $minindex$050 = 0, $minindex$1 = 0, $minindex$2$lcssa = 0, $minindex$233 = 0, $minindex$3 = 0, $minx$0$lcssa = 0.0, $minx$070 = 0.0, $minx$1 = 0.0, $minx$2$lcssa107 = 0.0, $minx$244 = 0.0, $minx$3 = 0.0, $minx$4$lcssa = 0.0, $minx$416 = 0.0, $minx$5 = 0.0, $miny$0$lcssa = 0.0, $miny$066 = 0.0, $miny$1 = 0.0, $miny$226 = 0.0, $miny$3 = 0.0, $miny$4$lcssa = 0.0, $miny$414 = 0.0, $miny$5 = 0.0, $minz$0$lcssa = 0.0, $minz$068 = 0.0, $minz$1 = 0.0, $minz$2$lcssa = 0.0, $minz$257 = 0.0, $minz$3 = 0.0, $point$082 = 0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF64[$O >> 3];
 HEAPF64[$this >> 3] = $0;
 $2 = +HEAPF64[$O + 8 >> 3];
 $3 = $this + 8 | 0;
 HEAPF64[$3 >> 3] = $2;
 $5 = +HEAPF64[$O + 16 >> 3];
 $6 = $this + 16 | 0;
 HEAPF64[$6 >> 3] = $5;
 $8 = +HEAPF64[$O + 24 >> 3];
 $9 = $this + 24 | 0;
 HEAPF64[$9 >> 3] = $8;
 $11 = +HEAPF64[$O + 32 >> 3];
 $12 = $this + 32 | 0;
 HEAPF64[$12 >> 3] = $11;
 $14 = +HEAPF64[$O + 40 >> 3];
 $15 = $this + 40 | 0;
 HEAPF64[$15 >> 3] = $14;
 $17 = +HEAPF64[$O + 48 >> 3];
 $18 = $this + 48 | 0;
 HEAPF64[$18 >> 3] = $17;
 $20 = +HEAPF64[$O + 56 >> 3];
 $21 = $this + 56 | 0;
 HEAPF64[$21 >> 3] = $20;
 $23 = +HEAPF64[$O + 64 >> 3];
 $24 = $this + 64 | 0;
 HEAPF64[$24 >> 3] = $23;
 $25 = $num_tris * 3 | 0;
 $27 = __Znaj($25 >>> 0 > 178956970 ? -1 : $25 * 24 | 0) | 0;
 $28 = ($num_tris | 0) > 0;
 if ($28) {
  $i$081 = 0;
  $point$082 = 0;
  while (1) {
   $31 = +HEAPF64[$tris + ($i$081 * 80 | 0) >> 3];
   $34 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 8 >> 3];
   $38 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 16 >> 3];
   HEAPF64[$27 + ($point$082 * 24 | 0) >> 3] = $0 * $31 + $8 * $34 + $17 * $38;
   HEAPF64[$27 + ($point$082 * 24 | 0) + 8 >> 3] = $2 * $31 + $11 * $34 + $20 * $38;
   HEAPF64[$27 + ($point$082 * 24 | 0) + 16 >> 3] = $5 * $31 + $14 * $34 + $23 * $38;
   $53 = $point$082 + 1 | 0;
   $56 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 24 >> 3];
   $59 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 32 >> 3];
   $63 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 40 >> 3];
   HEAPF64[$27 + ($53 * 24 | 0) >> 3] = $0 * $56 + $8 * $59 + $17 * $63;
   HEAPF64[$27 + ($53 * 24 | 0) + 8 >> 3] = $2 * $56 + $11 * $59 + $20 * $63;
   HEAPF64[$27 + ($53 * 24 | 0) + 16 >> 3] = $5 * $56 + $14 * $59 + $23 * $63;
   $78 = $point$082 + 2 | 0;
   $81 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 48 >> 3];
   $84 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 56 >> 3];
   $88 = +HEAPF64[$tris + ($i$081 * 80 | 0) + 64 >> 3];
   HEAPF64[$27 + ($78 * 24 | 0) >> 3] = $0 * $81 + $8 * $84 + $17 * $88;
   HEAPF64[$27 + ($78 * 24 | 0) + 8 >> 3] = $2 * $81 + $11 * $84 + $20 * $88;
   HEAPF64[$27 + ($78 * 24 | 0) + 16 >> 3] = $5 * $81 + $14 * $84 + $23 * $88;
   $i$081 = $i$081 + 1 | 0;
   if (($i$081 | 0) == ($num_tris | 0)) {
    break;
   } else {
    $point$082 = $point$082 + 3 | 0;
   }
  }
  $$phi$trans$insert93 = $27 + 16 | 0;
  $$pre$phi106Z2D = $$phi$trans$insert93;
  $424 = +HEAPF64[$$phi$trans$insert93 >> 3];
  $425 = +HEAPF64[$27 + 8 >> 3];
  $426 = +HEAPF64[$27 >> 3];
 } else {
  $$pre$phi106Z2D = $27 + 16 | 0;
  $424 = 0.0;
  $425 = 0.0;
  $426 = 0.0;
 }
 $105 = ($25 | 0) > 1;
 if ($105) {
  $i$171 = 1;
  $maxx$065 = $426;
  $maxy$067 = $425;
  $maxz$069 = $424;
  $minx$070 = $426;
  $miny$066 = $425;
  $minz$068 = $424;
  while (1) {
   $107 = +HEAPF64[$27 + ($i$171 * 24 | 0) >> 3];
   if ($107 < $minx$070) {
    $maxx$1 = $maxx$065;
    $minx$1 = $107;
   } else {
    if ($107 > $maxx$065) {
     $maxx$1 = $107;
     $minx$1 = $minx$070;
    } else {
     $maxx$1 = $maxx$065;
     $minx$1 = $minx$070;
    }
   }
   $111 = +HEAPF64[$27 + ($i$171 * 24 | 0) + 8 >> 3];
   if ($111 < $miny$066) {
    $maxy$1 = $maxy$067;
    $miny$1 = $111;
   } else {
    if ($111 > $maxy$067) {
     $maxy$1 = $111;
     $miny$1 = $miny$066;
    } else {
     $maxy$1 = $maxy$067;
     $miny$1 = $miny$066;
    }
   }
   $115 = +HEAPF64[$27 + ($i$171 * 24 | 0) + 16 >> 3];
   if ($115 < $minz$068) {
    $maxz$1 = $maxz$069;
    $minz$1 = $115;
   } else {
    if ($115 > $maxz$069) {
     $maxz$1 = $115;
     $minz$1 = $minz$068;
    } else {
     $maxz$1 = $maxz$069;
     $minz$1 = $minz$068;
    }
   }
   $118 = $i$171 + 1 | 0;
   if (($118 | 0) == ($25 | 0)) {
    $maxx$0$lcssa = $maxx$1;
    $maxy$0$lcssa = $maxy$1;
    $maxz$0$lcssa = $maxz$1;
    $minx$0$lcssa = $minx$1;
    $miny$0$lcssa = $miny$1;
    $minz$0$lcssa = $minz$1;
    break;
   } else {
    $i$171 = $118;
    $maxx$065 = $maxx$1;
    $maxy$067 = $maxy$1;
    $maxz$069 = $maxz$1;
    $minx$070 = $minx$1;
    $miny$066 = $miny$1;
    $minz$068 = $minz$1;
   }
  }
 } else {
  $maxx$0$lcssa = $426;
  $maxy$0$lcssa = $425;
  $maxz$0$lcssa = $424;
  $minx$0$lcssa = $426;
  $miny$0$lcssa = $425;
  $minz$0$lcssa = $424;
 }
 $120 = ($maxx$0$lcssa + $minx$0$lcssa) * .5;
 $122 = ($miny$0$lcssa + $maxy$0$lcssa) * .5;
 $124 = ($minz$0$lcssa + $maxz$0$lcssa) * .5;
 $126 = +HEAPF64[$this >> 3];
 $128 = +HEAPF64[$3 >> 3];
 $131 = +HEAPF64[$6 >> 3];
 HEAPF64[$this + 120 >> 3] = $120 * $126 + $122 * $128 + $124 * $131;
 $134 = +HEAPF64[$9 >> 3];
 $136 = +HEAPF64[$12 >> 3];
 $139 = +HEAPF64[$15 >> 3];
 HEAPF64[$this + 128 >> 3] = $120 * $134 + $122 * $136 + $124 * $139;
 $143 = +HEAPF64[$18 >> 3];
 $145 = +HEAPF64[$21 >> 3];
 $148 = +HEAPF64[$24 >> 3];
 HEAPF64[$this + 136 >> 3] = $120 * $143 + $122 * $145 + $124 * $148;
 HEAPF64[$this + 144 >> 3] = ($maxx$0$lcssa - $minx$0$lcssa) * .5;
 HEAPF64[$this + 152 >> 3] = ($maxy$0$lcssa - $miny$0$lcssa) * .5;
 HEAPF64[$this + 160 >> 3] = ($maxz$0$lcssa - $minz$0$lcssa) * .5;
 $161 = +HEAPF64[$$pre$phi106Z2D >> 3];
 if ($105) {
  $i$259 = 1;
  $maxz$258 = $161;
  $minz$257 = $161;
  while (1) {
   $163 = +HEAPF64[$27 + ($i$259 * 24 | 0) + 16 >> 3];
   if ($163 < $minz$257) {
    $maxz$3 = $maxz$258;
    $minz$3 = $163;
   } else {
    if ($163 > $maxz$258) {
     $maxz$3 = $163;
     $minz$3 = $minz$257;
    } else {
     $maxz$3 = $maxz$258;
     $minz$3 = $minz$257;
    }
   }
   $166 = $i$259 + 1 | 0;
   if (($166 | 0) == ($25 | 0)) {
    $maxz$2$lcssa = $maxz$3;
    $minz$2$lcssa = $minz$3;
    break;
   } else {
    $i$259 = $166;
    $maxz$258 = $maxz$3;
    $minz$257 = $minz$3;
   }
  }
 } else {
  $maxz$2$lcssa = $161;
  $minz$2$lcssa = $161;
 }
 $168 = ($maxz$2$lcssa - $minz$2$lcssa) * .5;
 HEAPF64[$this + 112 >> 3] = $168;
 $170 = $168 * $168;
 $172 = ($minz$2$lcssa + $maxz$2$lcssa) * .5;
 if ($105) {
  $i$349 = 1;
  $maxindex$051 = 0;
  $minindex$050 = 0;
  while (1) {
   $174 = +HEAPF64[$27 + ($i$349 * 24 | 0) >> 3];
   if ($174 < +HEAPF64[$27 + ($minindex$050 * 24 | 0) >> 3]) {
    $maxindex$1 = $maxindex$051;
    $minindex$1 = $i$349;
   } else {
    if ($174 > +HEAPF64[$27 + ($maxindex$051 * 24 | 0) >> 3]) {
     $maxindex$1 = $i$349;
     $minindex$1 = $minindex$050;
    } else {
     $maxindex$1 = $maxindex$051;
     $minindex$1 = $minindex$050;
    }
   }
   $181 = $i$349 + 1 | 0;
   if (($181 | 0) == ($25 | 0)) {
    $maxindex$0$lcssa = $maxindex$1;
    $minindex$0$lcssa = $minindex$1;
    break;
   } else {
    $i$349 = $181;
    $maxindex$051 = $maxindex$1;
    $minindex$050 = $minindex$1;
   }
  }
 } else {
  $maxindex$0$lcssa = 0;
  $minindex$0$lcssa = 0;
 }
 $184 = +HEAPF64[$27 + ($minindex$0$lcssa * 24 | 0) + 16 >> 3] - $172;
 $188 = $170 - $184 * $184;
 $191 = +HEAPF64[$27 + ($minindex$0$lcssa * 24 | 0) >> 3] + +Math_sqrt(+($188 > 0.0 ? $188 : 0.0));
 $194 = +HEAPF64[$27 + ($maxindex$0$lcssa * 24 | 0) + 16 >> 3] - $172;
 $198 = $170 - $194 * $194;
 $201 = +HEAPF64[$27 + ($maxindex$0$lcssa * 24 | 0) >> 3] - +Math_sqrt(+($198 > 0.0 ? $198 : 0.0));
 if ($28) {
  $i$445 = 0;
  $minx$244 = $191;
  while (1) {
   $203 = +HEAPF64[$27 + ($i$445 * 24 | 0) >> 3];
   if ($203 < $minx$244) {
    $207 = +HEAPF64[$27 + ($i$445 * 24 | 0) + 16 >> 3] - $172;
    $209 = $170 - $207 * $207;
    $212 = $203 + +Math_sqrt(+($209 > 0.0 ? $209 : 0.0));
    if ($212 < $minx$244) {
     $minx$3 = $212;
    } else {
     $minx$3 = $minx$244;
    }
   } else {
    $minx$3 = $minx$244;
   }
   $i$445 = $i$445 + 1 | 0;
   if (($i$445 | 0) >= ($25 | 0)) {
    break;
   } else {
    $minx$244 = $minx$3;
   }
  }
  if ($28) {
   $i$541 = 0;
   $maxx$240 = $201;
   while (1) {
    $217 = +HEAPF64[$27 + ($i$541 * 24 | 0) >> 3];
    if ($217 > $maxx$240) {
     $221 = +HEAPF64[$27 + ($i$541 * 24 | 0) + 16 >> 3] - $172;
     $223 = $170 - $221 * $221;
     $226 = $217 - +Math_sqrt(+($223 > 0.0 ? $223 : 0.0));
     if ($226 > $maxx$240) {
      $maxx$3 = $226;
     } else {
      $maxx$3 = $maxx$240;
     }
    } else {
     $maxx$3 = $maxx$240;
    }
    $228 = $i$541 + 1 | 0;
    if (($228 | 0) < ($25 | 0)) {
     $i$541 = $228;
     $maxx$240 = $maxx$3;
    } else {
     $maxx$2$lcssa = $maxx$3;
     $minx$2$lcssa107 = $minx$3;
     break;
    }
   }
  } else {
   $maxx$2$lcssa = $201;
   $minx$2$lcssa107 = $minx$3;
  }
 } else {
  $maxx$2$lcssa = $201;
  $minx$2$lcssa107 = $191;
 }
 if ($105) {
  $i$632 = 1;
  $maxindex$234 = 0;
  $minindex$233 = 0;
  while (1) {
   $231 = +HEAPF64[$27 + ($i$632 * 24 | 0) + 8 >> 3];
   if ($231 < +HEAPF64[$27 + ($minindex$233 * 24 | 0) + 8 >> 3]) {
    $maxindex$3 = $maxindex$234;
    $minindex$3 = $i$632;
   } else {
    if ($231 > +HEAPF64[$27 + ($maxindex$234 * 24 | 0) + 8 >> 3]) {
     $maxindex$3 = $i$632;
     $minindex$3 = $minindex$233;
    } else {
     $maxindex$3 = $maxindex$234;
     $minindex$3 = $minindex$233;
    }
   }
   $238 = $i$632 + 1 | 0;
   if (($238 | 0) == ($25 | 0)) {
    $maxindex$2$lcssa = $maxindex$3;
    $minindex$2$lcssa = $minindex$3;
    break;
   } else {
    $i$632 = $238;
    $maxindex$234 = $maxindex$3;
    $minindex$233 = $minindex$3;
   }
  }
 } else {
  $maxindex$2$lcssa = 0;
  $minindex$2$lcssa = 0;
 }
 $241 = +HEAPF64[$27 + ($minindex$2$lcssa * 24 | 0) + 16 >> 3] - $172;
 $245 = $170 - $241 * $241;
 $248 = +HEAPF64[$27 + ($minindex$2$lcssa * 24 | 0) + 8 >> 3] + +Math_sqrt(+($245 > 0.0 ? $245 : 0.0));
 $251 = +HEAPF64[$27 + ($maxindex$2$lcssa * 24 | 0) + 16 >> 3] - $172;
 $255 = $170 - $251 * $251;
 $258 = +HEAPF64[$27 + ($maxindex$2$lcssa * 24 | 0) + 8 >> 3] - +Math_sqrt(+($255 > 0.0 ? $255 : 0.0));
 if ($28) {
  $i$727 = 0;
  $miny$226 = $248;
  while (1) {
   $260 = +HEAPF64[$27 + ($i$727 * 24 | 0) + 8 >> 3];
   if ($260 < $miny$226) {
    $264 = +HEAPF64[$27 + ($i$727 * 24 | 0) + 16 >> 3] - $172;
    $266 = $170 - $264 * $264;
    $269 = $260 + +Math_sqrt(+($266 > 0.0 ? $266 : 0.0));
    if ($269 < $miny$226) {
     $miny$3 = $269;
    } else {
     $miny$3 = $miny$226;
    }
   } else {
    $miny$3 = $miny$226;
   }
   $i$727 = $i$727 + 1 | 0;
   if (($i$727 | 0) >= ($25 | 0)) {
    break;
   } else {
    $miny$226 = $miny$3;
   }
  }
  if ($28) {
   $i$823 = 0;
   $maxy$222 = $258;
   while (1) {
    $274 = +HEAPF64[$27 + ($i$823 * 24 | 0) + 8 >> 3];
    if ($274 > $maxy$222) {
     $278 = +HEAPF64[$27 + ($i$823 * 24 | 0) + 16 >> 3] - $172;
     $280 = $170 - $278 * $278;
     $283 = $274 - +Math_sqrt(+($280 > 0.0 ? $280 : 0.0));
     if ($283 > $maxy$222) {
      $maxy$3 = $283;
     } else {
      $maxy$3 = $maxy$222;
     }
    } else {
     $maxy$3 = $maxy$222;
    }
    $i$823 = $i$823 + 1 | 0;
    if (($i$823 | 0) >= ($25 | 0)) {
     break;
    } else {
     $maxy$222 = $maxy$3;
    }
   }
   if ($28) {
    $i$917 = 0;
    $maxx$413 = $maxx$2$lcssa;
    $maxy$415 = $maxy$3;
    $minx$416 = $minx$2$lcssa107;
    $miny$414 = $miny$3;
    while (1) {
     $288 = +HEAPF64[$27 + ($i$917 * 24 | 0) >> 3];
     do {
      if ($288 > $maxx$413) {
       $291 = +HEAPF64[$27 + ($i$917 * 24 | 0) + 8 >> 3];
       if ($291 > $maxy$415) {
        $293 = $288 - $maxx$413;
        $294 = $291 - $maxy$415;
        $297 = $293 * .7071067811865476 + $294 * .7071067811865476;
        $298 = $297 * .7071067811865476;
        $299 = $298 - $293;
        $301 = $298 - $294;
        $306 = $172 - +HEAPF64[$27 + ($i$917 * 24 | 0) + 16 >> 3];
        $309 = $170 - ($299 * $299 + $301 * $301 + $306 * $306);
        $312 = $297 - +Math_sqrt(+($309 > 0.0 ? $309 : 0.0));
        if (!($312 > 0.0)) {
         $maxx$5 = $maxx$413;
         $maxy$5 = $maxy$415;
         $minx$5 = $minx$416;
         $miny$5 = $miny$414;
         break;
        }
        $314 = $312 * .7071067811865476;
        $maxx$5 = $maxx$413 + $314;
        $maxy$5 = $maxy$415 + $314;
        $minx$5 = $minx$416;
        $miny$5 = $miny$414;
        break;
       }
       if ($291 < $miny$414) {
        $318 = $288 - $maxx$413;
        $319 = $291 - $miny$414;
        $322 = $318 * .7071067811865476 - $319 * .7071067811865476;
        $324 = $322 * .7071067811865476 - $318;
        $327 = $322 * -.7071067811865476 - $319;
        $332 = $172 - +HEAPF64[$27 + ($i$917 * 24 | 0) + 16 >> 3];
        $335 = $170 - ($324 * $324 + $327 * $327 + $332 * $332);
        $338 = $322 - +Math_sqrt(+($335 > 0.0 ? $335 : 0.0));
        if ($338 > 0.0) {
         $340 = $338 * .7071067811865476;
         $maxx$5 = $maxx$413 + $340;
         $maxy$5 = $maxy$415;
         $minx$5 = $minx$416;
         $miny$5 = $miny$414 - $340;
        } else {
         $maxx$5 = $maxx$413;
         $maxy$5 = $maxy$415;
         $minx$5 = $minx$416;
         $miny$5 = $miny$414;
        }
       } else {
        $maxx$5 = $maxx$413;
        $maxy$5 = $maxy$415;
        $minx$5 = $minx$416;
        $miny$5 = $miny$414;
       }
      } else {
       if ($288 < $minx$416) {
        $345 = +HEAPF64[$27 + ($i$917 * 24 | 0) + 8 >> 3];
        if ($345 > $maxy$415) {
         $347 = $288 - $minx$416;
         $348 = $345 - $maxy$415;
         $351 = $348 * .7071067811865476 - $347 * .7071067811865476;
         $353 = $351 * -.7071067811865476 - $347;
         $356 = $351 * .7071067811865476 - $348;
         $361 = $172 - +HEAPF64[$27 + ($i$917 * 24 | 0) + 16 >> 3];
         $364 = $170 - ($353 * $353 + $356 * $356 + $361 * $361);
         $367 = $351 - +Math_sqrt(+($364 > 0.0 ? $364 : 0.0));
         if (!($367 > 0.0)) {
          $maxx$5 = $maxx$413;
          $maxy$5 = $maxy$415;
          $minx$5 = $minx$416;
          $miny$5 = $miny$414;
          break;
         }
         $369 = $367 * .7071067811865476;
         $maxx$5 = $maxx$413;
         $maxy$5 = $maxy$415 + $369;
         $minx$5 = $minx$416 - $369;
         $miny$5 = $miny$414;
         break;
        }
        if ($345 < $miny$414) {
         $373 = $288 - $minx$416;
         $374 = $345 - $miny$414;
         $377 = $373 * -.7071067811865476 - $374 * .7071067811865476;
         $378 = $377 * -.7071067811865476;
         $379 = $378 - $373;
         $381 = $378 - $374;
         $386 = $172 - +HEAPF64[$27 + ($i$917 * 24 | 0) + 16 >> 3];
         $389 = $170 - ($379 * $379 + $381 * $381 + $386 * $386);
         $392 = $377 - +Math_sqrt(+($389 > 0.0 ? $389 : 0.0));
         if ($392 > 0.0) {
          $394 = $392 * .7071067811865476;
          $maxx$5 = $maxx$413;
          $maxy$5 = $maxy$415;
          $minx$5 = $minx$416 - $394;
          $miny$5 = $miny$414 - $394;
         } else {
          $maxx$5 = $maxx$413;
          $maxy$5 = $maxy$415;
          $minx$5 = $minx$416;
          $miny$5 = $miny$414;
         }
        } else {
         $maxx$5 = $maxx$413;
         $maxy$5 = $maxy$415;
         $minx$5 = $minx$416;
         $miny$5 = $miny$414;
        }
       } else {
        $maxx$5 = $maxx$413;
        $maxy$5 = $maxy$415;
        $minx$5 = $minx$416;
        $miny$5 = $miny$414;
       }
      }
     } while (0);
     $397 = $i$917 + 1 | 0;
     if (($397 | 0) < ($25 | 0)) {
      $i$917 = $397;
      $maxx$413 = $maxx$5;
      $maxy$415 = $maxy$5;
      $minx$416 = $minx$5;
      $miny$414 = $miny$5;
     } else {
      $maxx$4$lcssa = $maxx$5;
      $maxy$4$lcssa = $maxy$5;
      $minx$4$lcssa = $minx$5;
      $miny$4$lcssa = $miny$5;
      break;
     }
    }
   } else {
    $maxx$4$lcssa = $maxx$2$lcssa;
    $maxy$4$lcssa = $maxy$3;
    $minx$4$lcssa = $minx$2$lcssa107;
    $miny$4$lcssa = $miny$3;
   }
  } else {
   $maxx$4$lcssa = $maxx$2$lcssa;
   $maxy$4$lcssa = $258;
   $minx$4$lcssa = $minx$2$lcssa107;
   $miny$4$lcssa = $miny$3;
  }
 } else {
  $maxx$4$lcssa = $maxx$2$lcssa;
  $maxy$4$lcssa = $258;
  $minx$4$lcssa = $minx$2$lcssa107;
  $miny$4$lcssa = $248;
 }
 HEAPF64[$this + 72 >> 3] = $minx$4$lcssa * $126 + $miny$4$lcssa * $128 + $172 * $131;
 HEAPF64[$this + 80 >> 3] = $minx$4$lcssa * $134 + $miny$4$lcssa * $136 + $172 * $139;
 HEAPF64[$this + 88 >> 3] = $minx$4$lcssa * $143 + $miny$4$lcssa * $145 + $172 * $148;
 $417 = $maxx$4$lcssa - $minx$4$lcssa;
 HEAPF64[$this + 96 >> 3] = $417 < 0.0 ? 0.0 : $417;
 $420 = $maxy$4$lcssa - $miny$4$lcssa;
 HEAPF64[$this + 104 >> 3] = $420 < 0.0 ? 0.0 : $420;
 if (($27 | 0) == 0) {
  STACKTOP = sp;
  return;
 }
 __ZdaPv($27);
 STACKTOP = sp;
 return;
}
function _free($mem) {
 $mem = $mem | 0;
 var $$pre$phi68Z2D = 0, $$pre$phi70Z2D = 0, $$pre$phiZ2D = 0, $$sum2 = 0, $1 = 0, $104 = 0, $113 = 0, $114 = 0, $12 = 0, $122 = 0, $130 = 0, $135 = 0, $136 = 0, $139 = 0, $14 = 0, $141 = 0, $143 = 0, $15 = 0, $158 = 0, $163 = 0, $165 = 0, $168 = 0, $171 = 0, $174 = 0, $177 = 0, $178 = 0, $180 = 0, $181 = 0, $183 = 0, $184 = 0, $186 = 0, $187 = 0, $19 = 0, $193 = 0, $194 = 0, $2 = 0, $203 = 0, $212 = 0, $219 = 0, $22 = 0, $234 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $243 = 0, $244 = 0, $250 = 0, $255 = 0, $256 = 0, $259 = 0, $26 = 0, $261 = 0, $264 = 0, $269 = 0, $275 = 0, $279 = 0, $280 = 0, $287 = 0, $296 = 0, $299 = 0, $304 = 0, $311 = 0, $312 = 0, $313 = 0, $321 = 0, $39 = 0, $44 = 0, $46 = 0, $49 = 0, $5 = 0, $51 = 0, $54 = 0, $57 = 0, $58 = 0, $6 = 0, $60 = 0, $61 = 0, $63 = 0, $64 = 0, $66 = 0, $67 = 0, $72 = 0, $73 = 0, $8 = 0, $82 = 0, $9 = 0, $91 = 0, $98 = 0, $F16$0 = 0, $I18$0 = 0, $K19$057 = 0, $R$0 = 0, $R$1 = 0, $R7$0 = 0, $R7$1 = 0, $RP$0 = 0, $RP9$0 = 0, $T$0$lcssa = 0, $T$056 = 0, $p$0 = 0, $psize$0 = 0, $psize$1 = 0, $sp$0$i = 0, $sp$0$in$i = 0, sp = 0;
 sp = STACKTOP;
 if (($mem | 0) == 0) {
  STACKTOP = sp;
  return;
 }
 $1 = $mem + -8 | 0;
 $2 = HEAP32[1504 >> 2] | 0;
 if ($1 >>> 0 < $2 >>> 0) {
  _abort();
 }
 $5 = HEAP32[$mem + -4 >> 2] | 0;
 $6 = $5 & 3;
 if (($6 | 0) == 1) {
  _abort();
 }
 $8 = $5 & -8;
 $9 = $mem + ($8 + -8) | 0;
 do {
  if (($5 & 1 | 0) == 0) {
   $12 = HEAP32[$1 >> 2] | 0;
   if (($6 | 0) == 0) {
    STACKTOP = sp;
    return;
   }
   $$sum2 = -8 - $12 | 0;
   $14 = $mem + $$sum2 | 0;
   $15 = $12 + $8 | 0;
   if ($14 >>> 0 < $2 >>> 0) {
    _abort();
   }
   if (($14 | 0) == (HEAP32[1508 >> 2] | 0)) {
    $104 = $mem + ($8 + -4) | 0;
    if ((HEAP32[$104 >> 2] & 3 | 0) != 3) {
     $p$0 = $14;
     $psize$0 = $15;
     break;
    }
    HEAP32[1496 >> 2] = $15;
    HEAP32[$104 >> 2] = HEAP32[$104 >> 2] & -2;
    HEAP32[$mem + ($$sum2 + 4) >> 2] = $15 | 1;
    HEAP32[$9 >> 2] = $15;
    STACKTOP = sp;
    return;
   }
   $19 = $12 >>> 3;
   if ($12 >>> 0 < 256) {
    $22 = HEAP32[$mem + ($$sum2 + 8) >> 2] | 0;
    $24 = HEAP32[$mem + ($$sum2 + 12) >> 2] | 0;
    $26 = 1528 + ($19 << 1 << 2) | 0;
    if (($22 | 0) != ($26 | 0)) {
     if ($22 >>> 0 < $2 >>> 0) {
      _abort();
     }
     if ((HEAP32[$22 + 12 >> 2] | 0) != ($14 | 0)) {
      _abort();
     }
    }
    if (($24 | 0) == ($22 | 0)) {
     HEAP32[372] = HEAP32[372] & ~(1 << $19);
     $p$0 = $14;
     $psize$0 = $15;
     break;
    }
    if (($24 | 0) == ($26 | 0)) {
     $$pre$phi70Z2D = $24 + 8 | 0;
    } else {
     if ($24 >>> 0 < $2 >>> 0) {
      _abort();
     }
     $39 = $24 + 8 | 0;
     if ((HEAP32[$39 >> 2] | 0) == ($14 | 0)) {
      $$pre$phi70Z2D = $39;
     } else {
      _abort();
     }
    }
    HEAP32[$22 + 12 >> 2] = $24;
    HEAP32[$$pre$phi70Z2D >> 2] = $22;
    $p$0 = $14;
    $psize$0 = $15;
    break;
   }
   $44 = HEAP32[$mem + ($$sum2 + 24) >> 2] | 0;
   $46 = HEAP32[$mem + ($$sum2 + 12) >> 2] | 0;
   do {
    if (($46 | 0) == ($14 | 0)) {
     $57 = $mem + ($$sum2 + 20) | 0;
     $58 = HEAP32[$57 >> 2] | 0;
     if (($58 | 0) == 0) {
      $60 = $mem + ($$sum2 + 16) | 0;
      $61 = HEAP32[$60 >> 2] | 0;
      if (($61 | 0) == 0) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $61;
       $RP$0 = $60;
      }
     } else {
      $R$0 = $58;
      $RP$0 = $57;
     }
     while (1) {
      $63 = $R$0 + 20 | 0;
      $64 = HEAP32[$63 >> 2] | 0;
      if (($64 | 0) != 0) {
       $R$0 = $64;
       $RP$0 = $63;
       continue;
      }
      $66 = $R$0 + 16 | 0;
      $67 = HEAP32[$66 >> 2] | 0;
      if (($67 | 0) == 0) {
       break;
      } else {
       $R$0 = $67;
       $RP$0 = $66;
      }
     }
     if ($RP$0 >>> 0 < $2 >>> 0) {
      _abort();
     } else {
      HEAP32[$RP$0 >> 2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $49 = HEAP32[$mem + ($$sum2 + 8) >> 2] | 0;
     if ($49 >>> 0 < $2 >>> 0) {
      _abort();
     }
     $51 = $49 + 12 | 0;
     if ((HEAP32[$51 >> 2] | 0) != ($14 | 0)) {
      _abort();
     }
     $54 = $46 + 8 | 0;
     if ((HEAP32[$54 >> 2] | 0) == ($14 | 0)) {
      HEAP32[$51 >> 2] = $46;
      HEAP32[$54 >> 2] = $49;
      $R$1 = $46;
      break;
     } else {
      _abort();
     }
    }
   } while (0);
   if (($44 | 0) == 0) {
    $p$0 = $14;
    $psize$0 = $15;
   } else {
    $72 = HEAP32[$mem + ($$sum2 + 28) >> 2] | 0;
    $73 = 1792 + ($72 << 2) | 0;
    if (($14 | 0) == (HEAP32[$73 >> 2] | 0)) {
     HEAP32[$73 >> 2] = $R$1;
     if (($R$1 | 0) == 0) {
      HEAP32[1492 >> 2] = HEAP32[1492 >> 2] & ~(1 << $72);
      $p$0 = $14;
      $psize$0 = $15;
      break;
     }
    } else {
     if ($44 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
      _abort();
     }
     $82 = $44 + 16 | 0;
     if ((HEAP32[$82 >> 2] | 0) == ($14 | 0)) {
      HEAP32[$82 >> 2] = $R$1;
     } else {
      HEAP32[$44 + 20 >> 2] = $R$1;
     }
     if (($R$1 | 0) == 0) {
      $p$0 = $14;
      $psize$0 = $15;
      break;
     }
    }
    if ($R$1 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
     _abort();
    }
    HEAP32[$R$1 + 24 >> 2] = $44;
    $91 = HEAP32[$mem + ($$sum2 + 16) >> 2] | 0;
    do {
     if (($91 | 0) != 0) {
      if ($91 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
       _abort();
      } else {
       HEAP32[$R$1 + 16 >> 2] = $91;
       HEAP32[$91 + 24 >> 2] = $R$1;
       break;
      }
     }
    } while (0);
    $98 = HEAP32[$mem + ($$sum2 + 20) >> 2] | 0;
    if (($98 | 0) == 0) {
     $p$0 = $14;
     $psize$0 = $15;
    } else {
     if ($98 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
      _abort();
     } else {
      HEAP32[$R$1 + 20 >> 2] = $98;
      HEAP32[$98 + 24 >> 2] = $R$1;
      $p$0 = $14;
      $psize$0 = $15;
      break;
     }
    }
   }
  } else {
   $p$0 = $1;
   $psize$0 = $8;
  }
 } while (0);
 if (!($p$0 >>> 0 < $9 >>> 0)) {
  _abort();
 }
 $113 = $mem + ($8 + -4) | 0;
 $114 = HEAP32[$113 >> 2] | 0;
 if (($114 & 1 | 0) == 0) {
  _abort();
 }
 if (($114 & 2 | 0) == 0) {
  if (($9 | 0) == (HEAP32[1512 >> 2] | 0)) {
   $122 = (HEAP32[1500 >> 2] | 0) + $psize$0 | 0;
   HEAP32[1500 >> 2] = $122;
   HEAP32[1512 >> 2] = $p$0;
   HEAP32[$p$0 + 4 >> 2] = $122 | 1;
   if (($p$0 | 0) != (HEAP32[1508 >> 2] | 0)) {
    STACKTOP = sp;
    return;
   }
   HEAP32[1508 >> 2] = 0;
   HEAP32[1496 >> 2] = 0;
   STACKTOP = sp;
   return;
  }
  if (($9 | 0) == (HEAP32[1508 >> 2] | 0)) {
   $130 = (HEAP32[1496 >> 2] | 0) + $psize$0 | 0;
   HEAP32[1496 >> 2] = $130;
   HEAP32[1508 >> 2] = $p$0;
   HEAP32[$p$0 + 4 >> 2] = $130 | 1;
   HEAP32[$p$0 + $130 >> 2] = $130;
   STACKTOP = sp;
   return;
  }
  $135 = ($114 & -8) + $psize$0 | 0;
  $136 = $114 >>> 3;
  do {
   if ($114 >>> 0 < 256) {
    $139 = HEAP32[$mem + $8 >> 2] | 0;
    $141 = HEAP32[$mem + ($8 | 4) >> 2] | 0;
    $143 = 1528 + ($136 << 1 << 2) | 0;
    if (($139 | 0) != ($143 | 0)) {
     if ($139 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
      _abort();
     }
     if ((HEAP32[$139 + 12 >> 2] | 0) != ($9 | 0)) {
      _abort();
     }
    }
    if (($141 | 0) == ($139 | 0)) {
     HEAP32[372] = HEAP32[372] & ~(1 << $136);
     break;
    }
    if (($141 | 0) == ($143 | 0)) {
     $$pre$phi68Z2D = $141 + 8 | 0;
    } else {
     if ($141 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
      _abort();
     }
     $158 = $141 + 8 | 0;
     if ((HEAP32[$158 >> 2] | 0) == ($9 | 0)) {
      $$pre$phi68Z2D = $158;
     } else {
      _abort();
     }
    }
    HEAP32[$139 + 12 >> 2] = $141;
    HEAP32[$$pre$phi68Z2D >> 2] = $139;
   } else {
    $163 = HEAP32[$mem + ($8 + 16) >> 2] | 0;
    $165 = HEAP32[$mem + ($8 | 4) >> 2] | 0;
    do {
     if (($165 | 0) == ($9 | 0)) {
      $177 = $mem + ($8 + 12) | 0;
      $178 = HEAP32[$177 >> 2] | 0;
      if (($178 | 0) == 0) {
       $180 = $mem + ($8 + 8) | 0;
       $181 = HEAP32[$180 >> 2] | 0;
       if (($181 | 0) == 0) {
        $R7$1 = 0;
        break;
       } else {
        $R7$0 = $181;
        $RP9$0 = $180;
       }
      } else {
       $R7$0 = $178;
       $RP9$0 = $177;
      }
      while (1) {
       $183 = $R7$0 + 20 | 0;
       $184 = HEAP32[$183 >> 2] | 0;
       if (($184 | 0) != 0) {
        $R7$0 = $184;
        $RP9$0 = $183;
        continue;
       }
       $186 = $R7$0 + 16 | 0;
       $187 = HEAP32[$186 >> 2] | 0;
       if (($187 | 0) == 0) {
        break;
       } else {
        $R7$0 = $187;
        $RP9$0 = $186;
       }
      }
      if ($RP9$0 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
       _abort();
      } else {
       HEAP32[$RP9$0 >> 2] = 0;
       $R7$1 = $R7$0;
       break;
      }
     } else {
      $168 = HEAP32[$mem + $8 >> 2] | 0;
      if ($168 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
       _abort();
      }
      $171 = $168 + 12 | 0;
      if ((HEAP32[$171 >> 2] | 0) != ($9 | 0)) {
       _abort();
      }
      $174 = $165 + 8 | 0;
      if ((HEAP32[$174 >> 2] | 0) == ($9 | 0)) {
       HEAP32[$171 >> 2] = $165;
       HEAP32[$174 >> 2] = $168;
       $R7$1 = $165;
       break;
      } else {
       _abort();
      }
     }
    } while (0);
    if (($163 | 0) != 0) {
     $193 = HEAP32[$mem + ($8 + 20) >> 2] | 0;
     $194 = 1792 + ($193 << 2) | 0;
     if (($9 | 0) == (HEAP32[$194 >> 2] | 0)) {
      HEAP32[$194 >> 2] = $R7$1;
      if (($R7$1 | 0) == 0) {
       HEAP32[1492 >> 2] = HEAP32[1492 >> 2] & ~(1 << $193);
       break;
      }
     } else {
      if ($163 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
       _abort();
      }
      $203 = $163 + 16 | 0;
      if ((HEAP32[$203 >> 2] | 0) == ($9 | 0)) {
       HEAP32[$203 >> 2] = $R7$1;
      } else {
       HEAP32[$163 + 20 >> 2] = $R7$1;
      }
      if (($R7$1 | 0) == 0) {
       break;
      }
     }
     if ($R7$1 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
      _abort();
     }
     HEAP32[$R7$1 + 24 >> 2] = $163;
     $212 = HEAP32[$mem + ($8 + 8) >> 2] | 0;
     do {
      if (($212 | 0) != 0) {
       if ($212 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
        _abort();
       } else {
        HEAP32[$R7$1 + 16 >> 2] = $212;
        HEAP32[$212 + 24 >> 2] = $R7$1;
        break;
       }
      }
     } while (0);
     $219 = HEAP32[$mem + ($8 + 12) >> 2] | 0;
     if (($219 | 0) != 0) {
      if ($219 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
       _abort();
      } else {
       HEAP32[$R7$1 + 20 >> 2] = $219;
       HEAP32[$219 + 24 >> 2] = $R7$1;
       break;
      }
     }
    }
   }
  } while (0);
  HEAP32[$p$0 + 4 >> 2] = $135 | 1;
  HEAP32[$p$0 + $135 >> 2] = $135;
  if (($p$0 | 0) == (HEAP32[1508 >> 2] | 0)) {
   HEAP32[1496 >> 2] = $135;
   STACKTOP = sp;
   return;
  } else {
   $psize$1 = $135;
  }
 } else {
  HEAP32[$113 >> 2] = $114 & -2;
  HEAP32[$p$0 + 4 >> 2] = $psize$0 | 1;
  HEAP32[$p$0 + $psize$0 >> 2] = $psize$0;
  $psize$1 = $psize$0;
 }
 $234 = $psize$1 >>> 3;
 if ($psize$1 >>> 0 < 256) {
  $236 = $234 << 1;
  $237 = 1528 + ($236 << 2) | 0;
  $238 = HEAP32[372] | 0;
  $239 = 1 << $234;
  if (($238 & $239 | 0) == 0) {
   HEAP32[372] = $238 | $239;
   $$pre$phiZ2D = 1528 + ($236 + 2 << 2) | 0;
   $F16$0 = $237;
  } else {
   $243 = 1528 + ($236 + 2 << 2) | 0;
   $244 = HEAP32[$243 >> 2] | 0;
   if ($244 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
    _abort();
   } else {
    $$pre$phiZ2D = $243;
    $F16$0 = $244;
   }
  }
  HEAP32[$$pre$phiZ2D >> 2] = $p$0;
  HEAP32[$F16$0 + 12 >> 2] = $p$0;
  HEAP32[$p$0 + 8 >> 2] = $F16$0;
  HEAP32[$p$0 + 12 >> 2] = $237;
  STACKTOP = sp;
  return;
 }
 $250 = $psize$1 >>> 8;
 if (($250 | 0) == 0) {
  $I18$0 = 0;
 } else {
  if ($psize$1 >>> 0 > 16777215) {
   $I18$0 = 31;
  } else {
   $255 = ($250 + 1048320 | 0) >>> 16 & 8;
   $256 = $250 << $255;
   $259 = ($256 + 520192 | 0) >>> 16 & 4;
   $261 = $256 << $259;
   $264 = ($261 + 245760 | 0) >>> 16 & 2;
   $269 = 14 - ($259 | $255 | $264) + ($261 << $264 >>> 15) | 0;
   $I18$0 = $psize$1 >>> ($269 + 7 | 0) & 1 | $269 << 1;
  }
 }
 $275 = 1792 + ($I18$0 << 2) | 0;
 HEAP32[$p$0 + 28 >> 2] = $I18$0;
 HEAP32[$p$0 + 20 >> 2] = 0;
 HEAP32[$p$0 + 16 >> 2] = 0;
 $279 = HEAP32[1492 >> 2] | 0;
 $280 = 1 << $I18$0;
 L199 : do {
  if (($279 & $280 | 0) == 0) {
   HEAP32[1492 >> 2] = $279 | $280;
   HEAP32[$275 >> 2] = $p$0;
   HEAP32[$p$0 + 24 >> 2] = $275;
   HEAP32[$p$0 + 12 >> 2] = $p$0;
   HEAP32[$p$0 + 8 >> 2] = $p$0;
  } else {
   $287 = HEAP32[$275 >> 2] | 0;
   if (($I18$0 | 0) == 31) {
    $296 = 0;
   } else {
    $296 = 25 - ($I18$0 >>> 1) | 0;
   }
   L205 : do {
    if ((HEAP32[$287 + 4 >> 2] & -8 | 0) == ($psize$1 | 0)) {
     $T$0$lcssa = $287;
    } else {
     $K19$057 = $psize$1 << $296;
     $T$056 = $287;
     while (1) {
      $304 = $T$056 + ($K19$057 >>> 31 << 2) + 16 | 0;
      $299 = HEAP32[$304 >> 2] | 0;
      if (($299 | 0) == 0) {
       break;
      }
      if ((HEAP32[$299 + 4 >> 2] & -8 | 0) == ($psize$1 | 0)) {
       $T$0$lcssa = $299;
       break L205;
      } else {
       $K19$057 = $K19$057 << 1;
       $T$056 = $299;
      }
     }
     if ($304 >>> 0 < (HEAP32[1504 >> 2] | 0) >>> 0) {
      _abort();
     } else {
      HEAP32[$304 >> 2] = $p$0;
      HEAP32[$p$0 + 24 >> 2] = $T$056;
      HEAP32[$p$0 + 12 >> 2] = $p$0;
      HEAP32[$p$0 + 8 >> 2] = $p$0;
      break L199;
     }
    }
   } while (0);
   $311 = $T$0$lcssa + 8 | 0;
   $312 = HEAP32[$311 >> 2] | 0;
   $313 = HEAP32[1504 >> 2] | 0;
   if ($T$0$lcssa >>> 0 < $313 >>> 0) {
    _abort();
   }
   if ($312 >>> 0 < $313 >>> 0) {
    _abort();
   } else {
    HEAP32[$312 + 12 >> 2] = $p$0;
    HEAP32[$311 >> 2] = $p$0;
    HEAP32[$p$0 + 8 >> 2] = $312;
    HEAP32[$p$0 + 12 >> 2] = $T$0$lcssa;
    HEAP32[$p$0 + 24 >> 2] = 0;
    break;
   }
  }
 } while (0);
 $321 = (HEAP32[1520 >> 2] | 0) + -1 | 0;
 HEAP32[1520 >> 2] = $321;
 if (($321 | 0) == 0) {
  $sp$0$in$i = 1944 | 0;
 } else {
  STACKTOP = sp;
  return;
 }
 while (1) {
  $sp$0$i = HEAP32[$sp$0$in$i >> 2] | 0;
  if (($sp$0$i | 0) == 0) {
   break;
  } else {
   $sp$0$in$i = $sp$0$i + 8 | 0;
  }
 }
 HEAP32[1520 >> 2] = -1;
 STACKTOP = sp;
 return;
}
function __Z7TriDistPdS_PA3_KdS2_($P, $Q, $S, $T) {
 $P = $P | 0;
 $Q = $Q | 0;
 $S = $S | 0;
 $T = $T | 0;
 var $$ = 0, $$0 = 0.0, $$2 = 0, $$4 = 0, $$5 = 0, $0 = 0, $1 = 0.0, $10 = 0, $100 = 0.0, $105 = 0.0, $11 = 0.0, $113 = 0.0, $115 = 0.0, $118 = 0.0, $12 = 0, $120 = 0.0, $122 = 0, $13 = 0.0, $136 = 0.0, $15 = 0, $154 = 0.0, $155 = 0.0, $157 = 0.0, $158 = 0.0, $16 = 0, $160 = 0.0, $161 = 0.0, $163 = 0.0, $165 = 0.0, $168 = 0.0, $17 = 0, $173 = 0.0, $175 = 0.0, $178 = 0.0, $18 = 0.0, $181 = 0.0, $188 = 0.0, $199 = 0.0, $2 = 0.0, $20 = 0, $21 = 0.0, $211 = 0.0, $225 = 0, $226 = 0.0, $228 = 0, $229 = 0.0, $23 = 0, $231 = 0, $232 = 0.0, $24 = 0, $25 = 0.0, $27 = 0, $276 = 0.0, $278 = 0.0, $28 = 0, $281 = 0.0, $296 = 0.0, $305 = 0.0, $306 = 0.0, $307 = 0.0, $309 = 0.0, $31 = 0, $312 = 0.0, $316 = 0.0, $320 = 0.0, $321 = 0.0, $323 = 0.0, $324 = 0.0, $326 = 0.0, $327 = 0.0, $329 = 0.0, $33 = 0, $331 = 0.0, $334 = 0.0, $339 = 0.0, $34 = 0, $341 = 0.0, $344 = 0.0, $347 = 0.0, $35 = 0.0, $354 = 0.0, $36 = 0.0, $365 = 0.0, $377 = 0.0, $38 = 0, $39 = 0.0, $391 = 0, $392 = 0.0, $394 = 0, $395 = 0.0, $397 = 0, $398 = 0.0, $4 = 0, $40 = 0, $41 = 0.0, $43 = 0, $44 = 0, $442 = 0.0, $444 = 0.0, $447 = 0.0, $45 = 0.0, $46 = 0, $464 = 0.0, $467 = 0.0, $47 = 0.0, $470 = 0.0, $473 = 0.0, $475 = 0.0, $478 = 0.0, $482 = 0.0, $487 = 0.0, $488 = 0.0, $489 = 0.0, $49 = 0, $490 = 0.0, $491 = 0.0, $492 = 0.0, $494 = 0.0, $495 = 0.0, $496 = 0.0, $497 = 0.0, $498 = 0.0, $499 = 0.0, $5 = 0.0, $50 = 0, $500 = 0.0, $501 = 0.0, $502 = 0.0, $503 = 0.0, $504 = 0.0, $505 = 0.0, $51 = 0, $52 = 0.0, $54 = 0, $55 = 0.0, $57 = 0, $58 = 0, $59 = 0.0, $6 = 0, $61 = 0, $62 = 0, $65 = 0, $67 = 0, $68 = 0.0, $7 = 0.0, $70 = 0.0, $73 = 0.0, $77 = 0, $78 = 0, $79 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $92 = 0.0, $93 = 0.0, $94 = 0.0, $95 = 0.0, $96 = 0.0, $97 = 0.0, $98 = 0.0, $99 = 0.0, $Sp = 0, $Sv = 0, $Tp = 0, $Tv = 0, $VEC = 0, $i$048 = 0, $j$031 = 0, $mindd$050 = 0.0, $mindd$133 = 0.0, $mindd$2 = 0.0, $point$2$ph = 0, $point1$2$ph = 0, $shown_disjoint$049 = 0, $shown_disjoint$132 = 0, $shown_disjoint$2 = 0, $shown_disjoint$3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224 | 0;
 $Sv = sp + 144 | 0;
 $Tv = sp;
 $VEC = sp + 72 | 0;
 $Tp = sp + 96 | 0;
 $Sp = sp + 120 | 0;
 $0 = $S + 24 | 0;
 $1 = +HEAPF64[$0 >> 3];
 $2 = +HEAPF64[$S >> 3];
 HEAPF64[$Sv >> 3] = $1 - $2;
 $4 = $S + 32 | 0;
 $5 = +HEAPF64[$4 >> 3];
 $6 = $S + 8 | 0;
 $7 = +HEAPF64[$6 >> 3];
 $9 = $Sv + 8 | 0;
 HEAPF64[$9 >> 3] = $5 - $7;
 $10 = $S + 40 | 0;
 $11 = +HEAPF64[$10 >> 3];
 $12 = $S + 16 | 0;
 $13 = +HEAPF64[$12 >> 3];
 $15 = $Sv + 16 | 0;
 HEAPF64[$15 >> 3] = $11 - $13;
 $16 = $Sv + 24 | 0;
 $17 = $S + 48 | 0;
 $18 = +HEAPF64[$17 >> 3];
 HEAPF64[$16 >> 3] = $18 - $1;
 $20 = $S + 56 | 0;
 $21 = +HEAPF64[$20 >> 3];
 $23 = $Sv + 32 | 0;
 HEAPF64[$23 >> 3] = $21 - $5;
 $24 = $S + 64 | 0;
 $25 = +HEAPF64[$24 >> 3];
 $27 = $Sv + 40 | 0;
 HEAPF64[$27 >> 3] = $25 - $11;
 $28 = $Sv + 48 | 0;
 HEAPF64[$28 >> 3] = $2 - $18;
 $31 = $Sv + 56 | 0;
 HEAPF64[$31 >> 3] = $7 - $21;
 $33 = $Sv + 64 | 0;
 HEAPF64[$33 >> 3] = $13 - $25;
 $34 = $T + 24 | 0;
 $35 = +HEAPF64[$34 >> 3];
 $36 = +HEAPF64[$T >> 3];
 HEAPF64[$Tv >> 3] = $35 - $36;
 $38 = $T + 32 | 0;
 $39 = +HEAPF64[$38 >> 3];
 $40 = $T + 8 | 0;
 $41 = +HEAPF64[$40 >> 3];
 $43 = $Tv + 8 | 0;
 HEAPF64[$43 >> 3] = $39 - $41;
 $44 = $T + 40 | 0;
 $45 = +HEAPF64[$44 >> 3];
 $46 = $T + 16 | 0;
 $47 = +HEAPF64[$46 >> 3];
 $49 = $Tv + 16 | 0;
 HEAPF64[$49 >> 3] = $45 - $47;
 $50 = $Tv + 24 | 0;
 $51 = $T + 48 | 0;
 $52 = +HEAPF64[$51 >> 3];
 HEAPF64[$50 >> 3] = $52 - $35;
 $54 = $T + 56 | 0;
 $55 = +HEAPF64[$54 >> 3];
 $57 = $Tv + 32 | 0;
 HEAPF64[$57 >> 3] = $55 - $39;
 $58 = $T + 64 | 0;
 $59 = +HEAPF64[$58 >> 3];
 $61 = $Tv + 40 | 0;
 HEAPF64[$61 >> 3] = $59 - $45;
 $62 = $Tv + 48 | 0;
 HEAPF64[$62 >> 3] = $36 - $52;
 $65 = $Tv + 56 | 0;
 HEAPF64[$65 >> 3] = $41 - $55;
 $67 = $Tv + 64 | 0;
 HEAPF64[$67 >> 3] = $47 - $59;
 $68 = $2 - $36;
 $70 = $7 - $41;
 $73 = $13 - $47;
 $77 = $Q + 8 | 0;
 $78 = $P + 8 | 0;
 $79 = $Q + 16 | 0;
 $80 = $P + 16 | 0;
 $81 = $VEC + 8 | 0;
 $82 = $VEC + 16 | 0;
 $494 = 0.0;
 $495 = 0.0;
 $496 = 0.0;
 $497 = 0.0;
 $498 = 0.0;
 $499 = 0.0;
 $i$048 = 0;
 $mindd$050 = $68 * $68 + $70 * $70 + $73 * $73 + 1.0;
 $shown_disjoint$049 = 0;
 L1 : while (1) {
  $83 = $S + ($i$048 * 24 | 0) | 0;
  $84 = $Sv + ($i$048 * 24 | 0) | 0;
  $86 = ($i$048 + 2 | 0) % 3 | 0;
  $87 = $S + ($86 * 24 | 0) | 0;
  $88 = $S + ($86 * 24 | 0) + 8 | 0;
  $89 = $S + ($86 * 24 | 0) + 16 | 0;
  $500 = $494;
  $501 = $495;
  $502 = $496;
  $503 = $497;
  $504 = $498;
  $505 = $499;
  $j$031 = 0;
  $mindd$133 = $mindd$050;
  $shown_disjoint$132 = $shown_disjoint$049;
  while (1) {
   __Z9SegPointsPdS_S_PKdS1_S1_S1_($VEC, $P, $Q, $83, $84, $T + ($j$031 * 24 | 0) | 0, $Tv + ($j$031 * 24 | 0) | 0);
   $92 = +HEAPF64[$Q >> 3];
   $93 = +HEAPF64[$P >> 3];
   $94 = $92 - $93;
   $95 = +HEAPF64[$77 >> 3];
   $96 = +HEAPF64[$78 >> 3];
   $97 = $95 - $96;
   $98 = +HEAPF64[$79 >> 3];
   $99 = +HEAPF64[$80 >> 3];
   $100 = $98 - $99;
   $105 = $94 * $94 + $97 * $97 + $100 * $100;
   if (!($105 <= $mindd$133)) {
    $487 = $503;
    $488 = $504;
    $489 = $505;
    $490 = $500;
    $491 = $501;
    $492 = $502;
    $mindd$2 = $mindd$133;
    $shown_disjoint$2 = $shown_disjoint$132;
   } else {
    $113 = +HEAPF64[$VEC >> 3];
    $115 = +HEAPF64[$81 >> 3];
    $118 = +HEAPF64[$82 >> 3];
    $120 = (+HEAPF64[$87 >> 3] - $93) * $113 + (+HEAPF64[$88 >> 3] - $96) * $115 + (+HEAPF64[$89 >> 3] - $99) * $118;
    $122 = ($j$031 + 2 | 0) % 3 | 0;
    $136 = $113 * (+HEAPF64[$T + ($122 * 24 | 0) >> 3] - $92) + $115 * (+HEAPF64[$T + ($122 * 24 | 0) + 8 >> 3] - $95) + $118 * (+HEAPF64[$T + ($122 * 24 | 0) + 16 >> 3] - $98);
    if (!(!($120 <= 0.0) | !($136 >= 0.0))) {
     label = 5;
     break L1;
    }
    if ($94 * $113 + $97 * $115 + $100 * $118 - ($120 < 0.0 ? 0.0 : $120) + ($136 > 0.0 ? 0.0 : $136) > 0.0) {
     $487 = $93;
     $488 = $96;
     $489 = $99;
     $490 = $92;
     $491 = $95;
     $492 = $98;
     $mindd$2 = $105;
     $shown_disjoint$2 = 1;
    } else {
     $487 = $93;
     $488 = $96;
     $489 = $99;
     $490 = $92;
     $491 = $95;
     $492 = $98;
     $mindd$2 = $105;
     $shown_disjoint$2 = $shown_disjoint$132;
    }
   }
   $j$031 = $j$031 + 1 | 0;
   if (($j$031 | 0) >= 3) {
    break;
   } else {
    $500 = $490;
    $501 = $491;
    $502 = $492;
    $503 = $487;
    $504 = $488;
    $505 = $489;
    $mindd$133 = $mindd$2;
    $shown_disjoint$132 = $shown_disjoint$2;
   }
  }
  $i$048 = $i$048 + 1 | 0;
  if (($i$048 | 0) >= 3) {
   break;
  } else {
   $494 = $490;
   $495 = $491;
   $496 = $492;
   $497 = $487;
   $498 = $488;
   $499 = $489;
   $mindd$050 = $mindd$2;
   $shown_disjoint$049 = $shown_disjoint$2;
  }
 }
 if ((label | 0) == 5) {
  $$0 = +Math_sqrt(+$105);
  STACKTOP = sp;
  return +$$0;
 }
 $154 = +HEAPF64[$9 >> 3];
 $155 = +HEAPF64[$27 >> 3];
 $157 = +HEAPF64[$15 >> 3];
 $158 = +HEAPF64[$23 >> 3];
 $160 = $154 * $155 - $157 * $158;
 $161 = +HEAPF64[$16 >> 3];
 $163 = +HEAPF64[$Sv >> 3];
 $165 = $157 * $161 - $155 * $163;
 $168 = $158 * $163 - $154 * $161;
 $173 = $168 * $168 + ($160 * $160 + $165 * $165);
 do {
  if ($173 > 1.0e-15) {
   $175 = +HEAPF64[$S >> 3];
   $178 = +HEAPF64[$6 >> 3];
   $181 = +HEAPF64[$12 >> 3];
   $188 = $160 * ($175 - +HEAPF64[$T >> 3]) + $165 * ($178 - +HEAPF64[$40 >> 3]) + $168 * ($181 - +HEAPF64[$46 >> 3]);
   HEAPF64[$Tp >> 3] = $188;
   $199 = $160 * ($175 - +HEAPF64[$34 >> 3]) + $165 * ($178 - +HEAPF64[$38 >> 3]) + $168 * ($181 - +HEAPF64[$44 >> 3]);
   HEAPF64[$Tp + 8 >> 3] = $199;
   $211 = $160 * ($175 - +HEAPF64[$51 >> 3]) + $165 * ($178 - +HEAPF64[$54 >> 3]) + $168 * ($181 - +HEAPF64[$58 >> 3]);
   HEAPF64[$Tp + 16 >> 3] = $211;
   if ($188 > 0.0) {
    if ($199 > 0.0 & $211 > 0.0) {
     $$ = !($188 < $199) & 1;
     if ($211 < +HEAPF64[$Tp + ($$ << 3) >> 3]) {
      $point$2$ph = 2;
     } else {
      $point$2$ph = $$;
     }
    } else {
     label = 15;
    }
   } else {
    label = 15;
   }
   if ((label | 0) == 15) {
    if (!($188 < 0.0 & $199 < 0.0 & $211 < 0.0)) {
     $shown_disjoint$3 = $shown_disjoint$2;
     break;
    }
    $$2 = !($188 > $199) & 1;
    if ($211 > +HEAPF64[$Tp + ($$2 << 3) >> 3]) {
     $point$2$ph = 2;
    } else {
     $point$2$ph = $$2;
    }
   }
   $225 = $T + ($point$2$ph * 24 | 0) | 0;
   $226 = +HEAPF64[$225 >> 3];
   $228 = $T + ($point$2$ph * 24 | 0) + 8 | 0;
   $229 = +HEAPF64[$228 >> 3];
   $231 = $T + ($point$2$ph * 24 | 0) + 16 | 0;
   $232 = +HEAPF64[$231 >> 3];
   if (($232 - $181) * ($160 * $154 - $165 * $163) + (($226 - $175) * ($165 * $157 - $168 * $154) + ($229 - $178) * ($168 * $163 - $160 * $157)) > 0.0) {
    if (($232 - +HEAPF64[$10 >> 3]) * ($160 * $158 - $165 * $161) + (($226 - +HEAPF64[$0 >> 3]) * ($165 * $155 - $168 * $158) + ($229 - +HEAPF64[$4 >> 3]) * ($168 * $161 - $160 * $155)) > 0.0) {
     $276 = +HEAPF64[$33 >> 3];
     $278 = +HEAPF64[$31 >> 3];
     $281 = +HEAPF64[$28 >> 3];
     if (($232 - +HEAPF64[$24 >> 3]) * ($160 * $278 - $165 * $281) + (($226 - +HEAPF64[$17 >> 3]) * ($165 * $276 - $168 * $278) + ($229 - +HEAPF64[$20 >> 3]) * ($168 * $281 - $160 * $276)) > 0.0) {
      $296 = +HEAPF64[$Tp + ($point$2$ph << 3) >> 3] / $173;
      HEAPF64[$P >> 3] = $226 + $160 * $296;
      HEAPF64[$78 >> 3] = +HEAPF64[$228 >> 3] + $165 * $296;
      HEAPF64[$80 >> 3] = $168 * $296 + +HEAPF64[$231 >> 3];
      $305 = +HEAPF64[$225 >> 3];
      HEAPF64[$Q >> 3] = $305;
      $306 = +HEAPF64[$228 >> 3];
      HEAPF64[$77 >> 3] = $306;
      $307 = +HEAPF64[$231 >> 3];
      HEAPF64[$79 >> 3] = $307;
      $309 = +HEAPF64[$P >> 3] - $305;
      $312 = +HEAPF64[$78 >> 3] - $306;
      $316 = +HEAPF64[$80 >> 3] - $307;
      $$0 = +Math_sqrt(+($309 * $309 + $312 * $312 + $316 * $316));
      STACKTOP = sp;
      return +$$0;
     } else {
      $shown_disjoint$3 = 1;
     }
    } else {
     $shown_disjoint$3 = 1;
    }
   } else {
    $shown_disjoint$3 = 1;
   }
  } else {
   $shown_disjoint$3 = $shown_disjoint$2;
  }
 } while (0);
 $320 = +HEAPF64[$43 >> 3];
 $321 = +HEAPF64[$61 >> 3];
 $323 = +HEAPF64[$49 >> 3];
 $324 = +HEAPF64[$57 >> 3];
 $326 = $320 * $321 - $323 * $324;
 $327 = +HEAPF64[$50 >> 3];
 $329 = +HEAPF64[$Tv >> 3];
 $331 = $323 * $327 - $321 * $329;
 $334 = $324 * $329 - $320 * $327;
 $339 = $334 * $334 + ($326 * $326 + $331 * $331);
 do {
  if ($339 > 1.0e-15) {
   $341 = +HEAPF64[$T >> 3];
   $344 = +HEAPF64[$40 >> 3];
   $347 = +HEAPF64[$46 >> 3];
   $354 = $326 * ($341 - +HEAPF64[$S >> 3]) + $331 * ($344 - +HEAPF64[$6 >> 3]) + $334 * ($347 - +HEAPF64[$12 >> 3]);
   HEAPF64[$Sp >> 3] = $354;
   $365 = $326 * ($341 - +HEAPF64[$0 >> 3]) + $331 * ($344 - +HEAPF64[$4 >> 3]) + $334 * ($347 - +HEAPF64[$10 >> 3]);
   HEAPF64[$Sp + 8 >> 3] = $365;
   $377 = $326 * ($341 - +HEAPF64[$17 >> 3]) + $331 * ($344 - +HEAPF64[$20 >> 3]) + $334 * ($347 - +HEAPF64[$24 >> 3]);
   HEAPF64[$Sp + 16 >> 3] = $377;
   if ($354 > 0.0) {
    if ($365 > 0.0 & $377 > 0.0) {
     $$4 = !($354 < $365) & 1;
     if ($377 < +HEAPF64[$Sp + ($$4 << 3) >> 3]) {
      $point1$2$ph = 2;
     } else {
      $point1$2$ph = $$4;
     }
    } else {
     label = 27;
    }
   } else {
    label = 27;
   }
   if ((label | 0) == 27) {
    if (!($354 < 0.0 & $365 < 0.0 & $377 < 0.0)) {
     label = 34;
     break;
    }
    $$5 = !($354 > $365) & 1;
    if ($377 > +HEAPF64[$Sp + ($$5 << 3) >> 3]) {
     $point1$2$ph = 2;
    } else {
     $point1$2$ph = $$5;
    }
   }
   $391 = $S + ($point1$2$ph * 24 | 0) | 0;
   $392 = +HEAPF64[$391 >> 3];
   $394 = $S + ($point1$2$ph * 24 | 0) + 8 | 0;
   $395 = +HEAPF64[$394 >> 3];
   $397 = $S + ($point1$2$ph * 24 | 0) + 16 | 0;
   $398 = +HEAPF64[$397 >> 3];
   if (($398 - $347) * ($326 * $320 - $331 * $329) + (($392 - $341) * ($331 * $323 - $334 * $320) + ($395 - $344) * ($334 * $329 - $326 * $323)) > 0.0) {
    if (($398 - +HEAPF64[$44 >> 3]) * ($326 * $324 - $331 * $327) + (($392 - +HEAPF64[$34 >> 3]) * ($331 * $321 - $334 * $324) + ($395 - +HEAPF64[$38 >> 3]) * ($334 * $327 - $326 * $321)) > 0.0) {
     $442 = +HEAPF64[$67 >> 3];
     $444 = +HEAPF64[$65 >> 3];
     $447 = +HEAPF64[$62 >> 3];
     if (($398 - +HEAPF64[$58 >> 3]) * ($326 * $444 - $331 * $447) + (($392 - +HEAPF64[$51 >> 3]) * ($331 * $442 - $334 * $444) + ($395 - +HEAPF64[$54 >> 3]) * ($334 * $447 - $326 * $442)) > 0.0) {
      HEAPF64[$P >> 3] = $392;
      HEAPF64[$78 >> 3] = +HEAPF64[$394 >> 3];
      HEAPF64[$80 >> 3] = +HEAPF64[$397 >> 3];
      $464 = +HEAPF64[$Sp + ($point1$2$ph << 3) >> 3] / $339;
      $467 = +HEAPF64[$391 >> 3] + $326 * $464;
      HEAPF64[$Q >> 3] = $467;
      $470 = $331 * $464 + +HEAPF64[$394 >> 3];
      HEAPF64[$77 >> 3] = $470;
      $473 = $334 * $464 + +HEAPF64[$397 >> 3];
      HEAPF64[$79 >> 3] = $473;
      $475 = +HEAPF64[$P >> 3] - $467;
      $478 = +HEAPF64[$78 >> 3] - $470;
      $482 = +HEAPF64[$80 >> 3] - $473;
      $$0 = +Math_sqrt(+($475 * $475 + $478 * $478 + $482 * $482));
      STACKTOP = sp;
      return +$$0;
     }
    }
   }
  } else {
   label = 34;
  }
 } while (0);
 if ((label | 0) == 34) {
  if (($shown_disjoint$3 | 0) == 0) {
   $$0 = 0.0;
   STACKTOP = sp;
   return +$$0;
  }
 }
 HEAPF64[$P >> 3] = $487;
 HEAPF64[$78 >> 3] = $488;
 HEAPF64[$80 >> 3] = $489;
 HEAPF64[$Q >> 3] = $490;
 HEAPF64[$77 >> 3] = $491;
 HEAPF64[$79 >> 3] = $492;
 $$0 = +Math_sqrt(+$mindd$2);
 STACKTOP = sp;
 return +$$0;
}
function __Z9SegPointsPdS_S_PKdS1_S1_S1_($VEC, $X, $Y, $P, $A, $Q, $B) {
 $VEC = $VEC | 0;
 $X = $X | 0;
 $Y = $Y | 0;
 $P = $P | 0;
 $A = $A | 0;
 $Q = $Q | 0;
 $B = $B | 0;
 var $0 = 0.0, $10 = 0, $108 = 0.0, $109 = 0.0, $110 = 0.0, $114 = 0, $118 = 0, $12 = 0.0, $13 = 0.0, $141 = 0.0, $143 = 0.0, $145 = 0.0, $146 = 0.0, $149 = 0.0, $15 = 0, $152 = 0.0, $16 = 0.0, $173 = 0, $177 = 0, $179 = 0.0, $183 = 0, $19 = 0, $2 = 0.0, $20 = 0.0, $206 = 0.0, $207 = 0.0, $208 = 0.0, $212 = 0, $216 = 0, $22 = 0.0, $23 = 0.0, $241 = 0.0, $244 = 0.0, $247 = 0.0, $248 = 0.0, $25 = 0, $250 = 0.0, $252 = 0.0, $253 = 0.0, $256 = 0.0, $259 = 0.0, $26 = 0.0, $29 = 0, $290 = 0, $3 = 0, $30 = 0.0, $301 = 0.0, $303 = 0.0, $305 = 0.0, $306 = 0.0, $309 = 0.0, $312 = 0.0, $32 = 0.0, $329 = 0.0, $330 = 0.0, $331 = 0.0, $334 = 0.0, $338 = 0.0, $341 = 0.0, $343 = 0.0, $345 = 0.0, $346 = 0.0, $348 = 0.0, $350 = 0.0, $351 = 0.0, $354 = 0.0, $357 = 0.0, $37 = 0.0, $391 = 0.0, $398 = 0.0, $399 = 0, $406 = 0.0, $407 = 0, $42 = 0.0, $47 = 0.0, $5 = 0, $54 = 0.0, $58 = 0, $67 = 0.0, $7 = 0.0, $71 = 0, $8 = 0, $81 = 0.0, $85 = 0, $t$0 = 0.0, sp = 0;
 sp = STACKTOP;
 $0 = +HEAPF64[$Q >> 3];
 $2 = $0 - +HEAPF64[$P >> 3];
 $3 = $Q + 8 | 0;
 $5 = $P + 8 | 0;
 $7 = +HEAPF64[$3 >> 3] - +HEAPF64[$5 >> 3];
 $8 = $Q + 16 | 0;
 $10 = $P + 16 | 0;
 $12 = +HEAPF64[$8 >> 3] - +HEAPF64[$10 >> 3];
 $13 = +HEAPF64[$A >> 3];
 $15 = $A + 8 | 0;
 $16 = +HEAPF64[$15 >> 3];
 $19 = $A + 16 | 0;
 $20 = +HEAPF64[$19 >> 3];
 $22 = $13 * $13 + $16 * $16 + $20 * $20;
 $23 = +HEAPF64[$B >> 3];
 $25 = $B + 8 | 0;
 $26 = +HEAPF64[$25 >> 3];
 $29 = $B + 16 | 0;
 $30 = +HEAPF64[$29 >> 3];
 $32 = $23 * $23 + $26 * $26 + $30 * $30;
 $37 = $13 * $23 + $16 * $26 + $20 * $30;
 $42 = $2 * $13 + $7 * $16 + $12 * $20;
 $47 = $2 * $23 + $7 * $26 + $12 * $30;
 $54 = ($42 * $32 - $47 * $37) / ($22 * $32 - $37 * $37);
 if ($54 < 0.0) {
  $t$0 = 0.0;
 } else {
  HEAPF64[tempDoublePtr >> 3] = $54;
  $58 = HEAP32[tempDoublePtr + 4 >> 2] & 2147483647;
  if ($58 >>> 0 > 2146435072 | ($58 | 0) == 2146435072 & (HEAP32[tempDoublePtr >> 2] | 0) >>> 0 > 0) {
   $t$0 = 0.0;
  } else {
   if ($54 > 1.0) {
    $t$0 = 1.0;
   } else {
    $t$0 = $54;
   }
  }
 }
 $67 = ($37 * $t$0 - $47) / $32;
 if (!($67 <= 0.0)) {
  HEAPF64[tempDoublePtr >> 3] = $67;
  $71 = HEAP32[tempDoublePtr + 4 >> 2] & 2147483647;
  if (!($71 >>> 0 > 2146435072 | ($71 | 0) == 2146435072 & (HEAP32[tempDoublePtr >> 2] | 0) >>> 0 > 0)) {
   if ($67 >= 1.0) {
    HEAPF64[$Y >> 3] = $0 + $23;
    $173 = $Y + 8 | 0;
    HEAPF64[$173 >> 3] = +HEAPF64[$3 >> 3] + +HEAPF64[$25 >> 3];
    $177 = $Y + 16 | 0;
    HEAPF64[$177 >> 3] = +HEAPF64[$8 >> 3] + +HEAPF64[$29 >> 3];
    $179 = ($42 + $37) / $22;
    if (!($179 <= 0.0)) {
     HEAPF64[tempDoublePtr >> 3] = $179;
     $183 = HEAP32[tempDoublePtr + 4 >> 2] & 2147483647;
     if (!($183 >>> 0 > 2146435072 | ($183 | 0) == 2146435072 & (HEAP32[tempDoublePtr >> 2] | 0) >>> 0 > 0)) {
      $206 = +HEAPF64[$P >> 3];
      $207 = +HEAPF64[$A >> 3];
      if (!($179 >= 1.0)) {
       HEAPF64[$X >> 3] = $206 + $179 * $207;
       HEAPF64[$X + 8 >> 3] = +HEAPF64[$5 >> 3] + $179 * +HEAPF64[$15 >> 3];
       HEAPF64[$X + 16 >> 3] = +HEAPF64[$10 >> 3] + $179 * +HEAPF64[$19 >> 3];
       $241 = +HEAPF64[$Y >> 3] - +HEAPF64[$P >> 3];
       $244 = +HEAPF64[$173 >> 3] - +HEAPF64[$5 >> 3];
       $247 = +HEAPF64[$177 >> 3] - +HEAPF64[$10 >> 3];
       $248 = +HEAPF64[$19 >> 3];
       $250 = +HEAPF64[$15 >> 3];
       $252 = $244 * $248 - $247 * $250;
       $253 = +HEAPF64[$A >> 3];
       $256 = $247 * $253 - $241 * $248;
       $259 = $241 * $250 - $244 * $253;
       HEAPF64[$VEC >> 3] = $250 * $259 - $248 * $256;
       HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$19 >> 3] * $252 - +HEAPF64[$A >> 3] * $259;
       HEAPF64[$VEC + 16 >> 3] = $256 * +HEAPF64[$A >> 3] - $252 * +HEAPF64[$15 >> 3];
       STACKTOP = sp;
       return;
      } else {
       $208 = $206 + $207;
       HEAPF64[$X >> 3] = $208;
       $212 = $X + 8 | 0;
       HEAPF64[$212 >> 3] = +HEAPF64[$5 >> 3] + +HEAPF64[$15 >> 3];
       $216 = $X + 16 | 0;
       HEAPF64[$216 >> 3] = +HEAPF64[$10 >> 3] + +HEAPF64[$19 >> 3];
       HEAPF64[$VEC >> 3] = +HEAPF64[$Y >> 3] - $208;
       HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$173 >> 3] - +HEAPF64[$212 >> 3];
       HEAPF64[$VEC + 16 >> 3] = +HEAPF64[$177 >> 3] - +HEAPF64[$216 >> 3];
       STACKTOP = sp;
       return;
      }
     }
    }
    HEAPF64[$X >> 3] = +HEAPF64[$P >> 3];
    HEAPF64[$X + 8 >> 3] = +HEAPF64[$5 >> 3];
    HEAPF64[$X + 16 >> 3] = +HEAPF64[$10 >> 3];
    HEAPF64[$VEC >> 3] = +HEAPF64[$Y >> 3] - +HEAPF64[$P >> 3];
    HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$173 >> 3] - +HEAPF64[$5 >> 3];
    HEAPF64[$VEC + 16 >> 3] = +HEAPF64[$177 >> 3] - +HEAPF64[$10 >> 3];
    STACKTOP = sp;
    return;
   }
   HEAPF64[$Y >> 3] = $0 + $67 * $23;
   HEAPF64[$Y + 8 >> 3] = +HEAPF64[$3 >> 3] + $67 * +HEAPF64[$25 >> 3];
   HEAPF64[$Y + 16 >> 3] = +HEAPF64[$8 >> 3] + $67 * +HEAPF64[$29 >> 3];
   if (!($t$0 <= 0.0)) {
    HEAPF64[tempDoublePtr >> 3] = $t$0;
    $290 = HEAP32[tempDoublePtr + 4 >> 2] & 2147483647;
    if (!($290 >>> 0 > 2146435072 | ($290 | 0) == 2146435072 & (HEAP32[tempDoublePtr >> 2] | 0) >>> 0 > 0)) {
     $329 = +HEAPF64[$P >> 3];
     $330 = +HEAPF64[$A >> 3];
     if ($t$0 >= 1.0) {
      $331 = $329 + $330;
      HEAPF64[$X >> 3] = $331;
      $334 = +HEAPF64[$5 >> 3] + +HEAPF64[$15 >> 3];
      HEAPF64[$X + 8 >> 3] = $334;
      $338 = +HEAPF64[$10 >> 3] + +HEAPF64[$19 >> 3];
      HEAPF64[$X + 16 >> 3] = $338;
      $341 = +HEAPF64[$Q >> 3] - $331;
      $343 = +HEAPF64[$3 >> 3] - $334;
      $345 = +HEAPF64[$8 >> 3] - $338;
      $346 = +HEAPF64[$29 >> 3];
      $348 = +HEAPF64[$25 >> 3];
      $350 = $343 * $346 - $345 * $348;
      $351 = +HEAPF64[$B >> 3];
      $354 = $345 * $351 - $341 * $346;
      $357 = $341 * $348 - $343 * $351;
      HEAPF64[$VEC >> 3] = $348 * $357 - $346 * $354;
      HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$29 >> 3] * $350 - +HEAPF64[$B >> 3] * $357;
      HEAPF64[$VEC + 16 >> 3] = $354 * +HEAPF64[$B >> 3] - $350 * +HEAPF64[$25 >> 3];
      STACKTOP = sp;
      return;
     }
     HEAPF64[$X >> 3] = $329 + $t$0 * $330;
     HEAPF64[$X + 8 >> 3] = +HEAPF64[$5 >> 3] + $t$0 * +HEAPF64[$15 >> 3];
     HEAPF64[$X + 16 >> 3] = +HEAPF64[$10 >> 3] + $t$0 * +HEAPF64[$19 >> 3];
     $391 = +HEAPF64[$15 >> 3] * +HEAPF64[$29 >> 3] - +HEAPF64[$19 >> 3] * +HEAPF64[$25 >> 3];
     HEAPF64[$VEC >> 3] = $391;
     $398 = +HEAPF64[$19 >> 3] * +HEAPF64[$B >> 3] - +HEAPF64[$A >> 3] * +HEAPF64[$29 >> 3];
     $399 = $VEC + 8 | 0;
     HEAPF64[$399 >> 3] = $398;
     $406 = +HEAPF64[$A >> 3] * +HEAPF64[$25 >> 3] - +HEAPF64[$15 >> 3] * +HEAPF64[$B >> 3];
     $407 = $VEC + 16 | 0;
     HEAPF64[$407 >> 3] = $406;
     if (!($12 * $406 + ($2 * $391 + $7 * $398) < 0.0)) {
      STACKTOP = sp;
      return;
     }
     HEAPF64[$VEC >> 3] = $391 * -1.0;
     HEAPF64[$399 >> 3] = $398 * -1.0;
     HEAPF64[$407 >> 3] = $406 * -1.0;
     STACKTOP = sp;
     return;
    }
   }
   HEAPF64[$X >> 3] = +HEAPF64[$P >> 3];
   HEAPF64[$X + 8 >> 3] = +HEAPF64[$5 >> 3];
   HEAPF64[$X + 16 >> 3] = +HEAPF64[$10 >> 3];
   $301 = +HEAPF64[$29 >> 3];
   $303 = +HEAPF64[$25 >> 3];
   $305 = $7 * $301 - $12 * $303;
   $306 = +HEAPF64[$B >> 3];
   $309 = $12 * $306 - $2 * $301;
   $312 = $2 * $303 - $7 * $306;
   HEAPF64[$VEC >> 3] = $303 * $312 - $301 * $309;
   HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$29 >> 3] * $305 - +HEAPF64[$B >> 3] * $312;
   HEAPF64[$VEC + 16 >> 3] = $309 * +HEAPF64[$B >> 3] - $305 * +HEAPF64[$25 >> 3];
   STACKTOP = sp;
   return;
  }
 }
 HEAPF64[$Y >> 3] = $0;
 HEAPF64[$Y + 8 >> 3] = +HEAPF64[$3 >> 3];
 HEAPF64[$Y + 16 >> 3] = +HEAPF64[$8 >> 3];
 $81 = $42 / $22;
 if (!($81 <= 0.0)) {
  HEAPF64[tempDoublePtr >> 3] = $81;
  $85 = HEAP32[tempDoublePtr + 4 >> 2] & 2147483647;
  if (!($85 >>> 0 > 2146435072 | ($85 | 0) == 2146435072 & (HEAP32[tempDoublePtr >> 2] | 0) >>> 0 > 0)) {
   $108 = +HEAPF64[$P >> 3];
   $109 = +HEAPF64[$A >> 3];
   if (!($81 >= 1.0)) {
    HEAPF64[$X >> 3] = $108 + $81 * $109;
    HEAPF64[$X + 8 >> 3] = +HEAPF64[$5 >> 3] + $81 * +HEAPF64[$15 >> 3];
    HEAPF64[$X + 16 >> 3] = +HEAPF64[$10 >> 3] + $81 * +HEAPF64[$19 >> 3];
    $141 = +HEAPF64[$19 >> 3];
    $143 = +HEAPF64[$15 >> 3];
    $145 = $7 * $141 - $12 * $143;
    $146 = +HEAPF64[$A >> 3];
    $149 = $12 * $146 - $2 * $141;
    $152 = $2 * $143 - $7 * $146;
    HEAPF64[$VEC >> 3] = $143 * $152 - $141 * $149;
    HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$19 >> 3] * $145 - +HEAPF64[$A >> 3] * $152;
    HEAPF64[$VEC + 16 >> 3] = $149 * +HEAPF64[$A >> 3] - $145 * +HEAPF64[$15 >> 3];
    STACKTOP = sp;
    return;
   } else {
    $110 = $108 + $109;
    HEAPF64[$X >> 3] = $110;
    $114 = $X + 8 | 0;
    HEAPF64[$114 >> 3] = +HEAPF64[$5 >> 3] + +HEAPF64[$15 >> 3];
    $118 = $X + 16 | 0;
    HEAPF64[$118 >> 3] = +HEAPF64[$10 >> 3] + +HEAPF64[$19 >> 3];
    HEAPF64[$VEC >> 3] = +HEAPF64[$Q >> 3] - $110;
    HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$3 >> 3] - +HEAPF64[$114 >> 3];
    HEAPF64[$VEC + 16 >> 3] = +HEAPF64[$8 >> 3] - +HEAPF64[$118 >> 3];
    STACKTOP = sp;
    return;
   }
  }
 }
 HEAPF64[$X >> 3] = +HEAPF64[$P >> 3];
 HEAPF64[$X + 8 >> 3] = +HEAPF64[$5 >> 3];
 HEAPF64[$X + 16 >> 3] = +HEAPF64[$10 >> 3];
 HEAPF64[$VEC >> 3] = +HEAPF64[$Q >> 3] - +HEAPF64[$P >> 3];
 HEAPF64[$VEC + 8 >> 3] = +HEAPF64[$3 >> 3] - +HEAPF64[$5 >> 3];
 HEAPF64[$VEC + 16 >> 3] = +HEAPF64[$8 >> 3] - +HEAPF64[$10 >> 3];
 STACKTOP = sp;
 return;
}
function __Z15DistanceRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R, $T, $o1, $b1, $o2, $b2) {
 $res = $res | 0;
 $R = $R | 0;
 $T = $T | 0;
 $o1 = $o1 | 0;
 $b1 = $b1 | 0;
 $o2 = $o2 | 0;
 $b2 = $b2 | 0;
 var $$not = 0, $0 = 0, $1 = 0, $126 = 0, $13 = 0.0, $130 = 0.0, $134 = 0.0, $138 = 0.0, $14 = 0, $15 = 0, $17 = 0.0, $174 = 0, $176 = 0, $177 = 0, $181 = 0, $183 = 0, $187 = 0, $189 = 0, $195 = 0, $199 = 0, $20 = 0.0, $204 = 0, $209 = 0, $213 = 0, $217 = 0, $222 = 0, $227 = 0, $23 = 0.0, $232 = 0, $233 = 0, $238 = 0, $243 = 0, $27 = 0.0, $28 = 0, $280 = 0, $282 = 0, $283 = 0.0, $288 = 0.0, $29 = 0, $290 = 0, $291 = 0.0, $292 = 0, $293 = 0.0, $294 = 0.0, $3 = 0.0, $30 = 0, $302 = 0.0, $303 = 0.0, $31 = 0, $317 = 0.0, $318 = 0.0, $34 = 0, $41 = 0, $46 = 0, $49 = 0.0, $50 = 0, $6 = 0.0, $73 = 0, $75 = 0, $79 = 0.0, $80 = 0, $84 = 0.0, $85 = 0, $89 = 0.0, $9 = 0.0, $R1 = 0, $R2 = 0, $T1 = 0, $T2 = 0, $a1$0 = 0, $a2$0 = 0, $c1$0 = 0, $c2$0 = 0, $p = 0, $q = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 240 | 0;
 $p = sp + 216 | 0;
 $q = sp;
 $R1 = sp + 24 | 0;
 $T1 = sp + 96 | 0;
 $R2 = sp + 120 | 0;
 $T2 = sp + 192 | 0;
 $0 = $o1 + 16 | 0;
 $1 = HEAP32[$0 >> 2] | 0;
 $3 = +HEAPF64[$1 + ($b1 * 176 | 0) + 96 >> 3];
 $6 = +HEAPF64[$1 + ($b1 * 176 | 0) + 104 >> 3];
 $9 = +Math_sqrt(+($3 * $3 + $6 * $6));
 $13 = $9 + +HEAPF64[$1 + ($b1 * 176 | 0) + 112 >> 3] * 2.0;
 $14 = $o2 + 16 | 0;
 $15 = HEAP32[$14 >> 2] | 0;
 $17 = +HEAPF64[$15 + ($b2 * 176 | 0) + 96 >> 3];
 $20 = +HEAPF64[$15 + ($b2 * 176 | 0) + 104 >> 3];
 $23 = +Math_sqrt(+($17 * $17 + $20 * $20));
 $27 = $23 + +HEAPF64[$15 + ($b2 * 176 | 0) + 112 >> 3] * 2.0;
 $28 = $1 + ($b1 * 176 | 0) + 168 | 0;
 $29 = HEAP32[$28 >> 2] | 0;
 $30 = $15 + ($b2 * 176 | 0) + 168 | 0;
 $31 = HEAP32[$30 >> 2] | 0;
 $$not = ($29 | 0) > -1;
 if (!(($31 & $29 | 0) > -1)) {
  $34 = $res + 4 | 0;
  HEAP32[$34 >> 2] = (HEAP32[$34 >> 2] | 0) + 1;
  $41 = (HEAP32[$o1 + 4 >> 2] | 0) + (~HEAP32[$28 >> 2] * 80 | 0) | 0;
  $46 = (HEAP32[$o2 + 4 >> 2] | 0) + (~HEAP32[$30 >> 2] * 80 | 0) | 0;
  $49 = +__Z11TriDistancePA3_dPdP3TriS3_S1_S1_($res + 16 | 0, $res + 88 | 0, $41, $46, $p, $q);
  $50 = $res + 128 | 0;
  if (!($49 < +HEAPF64[$50 >> 3])) {
   STACKTOP = sp;
   return;
  }
  HEAPF64[$50 >> 3] = $49;
  HEAPF64[$res + 136 >> 3] = +HEAPF64[$p >> 3];
  HEAPF64[$res + 144 >> 3] = +HEAPF64[$p + 8 >> 3];
  HEAPF64[$res + 152 >> 3] = +HEAPF64[$p + 16 >> 3];
  HEAPF64[$res + 160 >> 3] = +HEAPF64[$q >> 3];
  HEAPF64[$res + 168 >> 3] = +HEAPF64[$q + 8 >> 3];
  HEAPF64[$res + 176 >> 3] = +HEAPF64[$q + 16 >> 3];
  HEAP32[$o1 + 28 >> 2] = $41;
  HEAP32[$o2 + 28 >> 2] = $46;
  STACKTOP = sp;
  return;
 }
 if (($31 | 0) > -1) {
  if ($$not & $13 > $27) {
   label = 6;
  } else {
   $174 = $31 + 1 | 0;
   __Z3MxMPA3_dPA3_KdS3_($R1, $R, $15 + ($31 * 176 | 0) | 0);
   $176 = HEAP32[$14 >> 2] | 0;
   $177 = $176 + ($31 * 176 | 0) + 72 | 0;
   $181 = $R + 8 | 0;
   $183 = $176 + ($31 * 176 | 0) + 80 | 0;
   $187 = $R + 16 | 0;
   $189 = $176 + ($31 * 176 | 0) + 88 | 0;
   HEAPF64[$T1 >> 3] = +HEAPF64[$T >> 3] + (+HEAPF64[$R >> 3] * +HEAPF64[$177 >> 3] + +HEAPF64[$181 >> 3] * +HEAPF64[$183 >> 3] + +HEAPF64[$187 >> 3] * +HEAPF64[$189 >> 3]);
   $195 = $R + 24 | 0;
   $199 = $R + 32 | 0;
   $204 = $R + 40 | 0;
   $209 = $T + 8 | 0;
   HEAPF64[$T1 + 8 >> 3] = +HEAPF64[$209 >> 3] + (+HEAPF64[$195 >> 3] * +HEAPF64[$177 >> 3] + +HEAPF64[$199 >> 3] * +HEAPF64[$183 >> 3] + +HEAPF64[$204 >> 3] * +HEAPF64[$189 >> 3]);
   $213 = $R + 48 | 0;
   $217 = $R + 56 | 0;
   $222 = $R + 64 | 0;
   $227 = $T + 16 | 0;
   HEAPF64[$T1 + 16 >> 3] = +HEAPF64[$227 >> 3] + (+HEAPF64[$213 >> 3] * +HEAPF64[$177 >> 3] + +HEAPF64[$217 >> 3] * +HEAPF64[$183 >> 3] + +HEAPF64[$222 >> 3] * +HEAPF64[$189 >> 3]);
   __Z3MxMPA3_dPA3_KdS3_($R2, $R, $176 + ($174 * 176 | 0) | 0);
   $232 = HEAP32[$14 >> 2] | 0;
   $233 = $232 + ($174 * 176 | 0) + 72 | 0;
   $238 = $232 + ($174 * 176 | 0) + 80 | 0;
   $243 = $232 + ($174 * 176 | 0) + 88 | 0;
   HEAPF64[$T2 >> 3] = +HEAPF64[$T >> 3] + (+HEAPF64[$R >> 3] * +HEAPF64[$233 >> 3] + +HEAPF64[$181 >> 3] * +HEAPF64[$238 >> 3] + +HEAPF64[$187 >> 3] * +HEAPF64[$243 >> 3]);
   HEAPF64[$T2 + 8 >> 3] = +HEAPF64[$209 >> 3] + (+HEAPF64[$195 >> 3] * +HEAPF64[$233 >> 3] + +HEAPF64[$199 >> 3] * +HEAPF64[$238 >> 3] + +HEAPF64[$204 >> 3] * +HEAPF64[$243 >> 3]);
   HEAPF64[$T2 + 16 >> 3] = +HEAPF64[$227 >> 3] + (+HEAPF64[$213 >> 3] * +HEAPF64[$233 >> 3] + +HEAPF64[$217 >> 3] * +HEAPF64[$238 >> 3] + +HEAPF64[$222 >> 3] * +HEAPF64[$243 >> 3]);
   $280 = HEAP32[$0 >> 2] | 0;
   $282 = $232;
   $a1$0 = $b1;
   $a2$0 = $31;
   $c1$0 = $b1;
   $c2$0 = $174;
  }
 } else {
  label = 6;
 }
 if ((label | 0) == 6) {
  $73 = $29 + 1 | 0;
  __Z4MTxMPA3_dPA3_KdS3_($R1, $1 + ($29 * 176 | 0) | 0, $R);
  $75 = HEAP32[$0 >> 2] | 0;
  $79 = +HEAPF64[$T >> 3] - +HEAPF64[$75 + ($29 * 176 | 0) + 72 >> 3];
  $80 = $T + 8 | 0;
  $84 = +HEAPF64[$80 >> 3] - +HEAPF64[$75 + ($29 * 176 | 0) + 80 >> 3];
  $85 = $T + 16 | 0;
  $89 = +HEAPF64[$85 >> 3] - +HEAPF64[$75 + ($29 * 176 | 0) + 88 >> 3];
  HEAPF64[$T1 >> 3] = $79 * +HEAPF64[$75 + ($29 * 176 | 0) >> 3] + $84 * +HEAPF64[$75 + ($29 * 176 | 0) + 24 >> 3] + $89 * +HEAPF64[$75 + ($29 * 176 | 0) + 48 >> 3];
  HEAPF64[$T1 + 8 >> 3] = $79 * +HEAPF64[$75 + ($29 * 176 | 0) + 8 >> 3] + $84 * +HEAPF64[$75 + ($29 * 176 | 0) + 32 >> 3] + $89 * +HEAPF64[$75 + ($29 * 176 | 0) + 56 >> 3];
  HEAPF64[$T1 + 16 >> 3] = $79 * +HEAPF64[$75 + ($29 * 176 | 0) + 16 >> 3] + $84 * +HEAPF64[$75 + ($29 * 176 | 0) + 40 >> 3] + $89 * +HEAPF64[$75 + ($29 * 176 | 0) + 64 >> 3];
  __Z4MTxMPA3_dPA3_KdS3_($R2, $75 + ($73 * 176 | 0) | 0, $R);
  $126 = HEAP32[$0 >> 2] | 0;
  $130 = +HEAPF64[$T >> 3] - +HEAPF64[$126 + ($73 * 176 | 0) + 72 >> 3];
  $134 = +HEAPF64[$80 >> 3] - +HEAPF64[$126 + ($73 * 176 | 0) + 80 >> 3];
  $138 = +HEAPF64[$85 >> 3] - +HEAPF64[$126 + ($73 * 176 | 0) + 88 >> 3];
  HEAPF64[$T2 >> 3] = $130 * +HEAPF64[$126 + ($73 * 176 | 0) >> 3] + $134 * +HEAPF64[$126 + ($73 * 176 | 0) + 24 >> 3] + $138 * +HEAPF64[$126 + ($73 * 176 | 0) + 48 >> 3];
  HEAPF64[$T2 + 8 >> 3] = $130 * +HEAPF64[$126 + ($73 * 176 | 0) + 8 >> 3] + $134 * +HEAPF64[$126 + ($73 * 176 | 0) + 32 >> 3] + $138 * +HEAPF64[$126 + ($73 * 176 | 0) + 56 >> 3];
  HEAPF64[$T2 + 16 >> 3] = $130 * +HEAPF64[$126 + ($73 * 176 | 0) + 16 >> 3] + $134 * +HEAPF64[$126 + ($73 * 176 | 0) + 40 >> 3] + $138 * +HEAPF64[$126 + ($73 * 176 | 0) + 64 >> 3];
  $280 = $126;
  $282 = HEAP32[$14 >> 2] | 0;
  $a1$0 = $29;
  $a2$0 = $b2;
  $c1$0 = $73;
  $c2$0 = $b2;
 }
 HEAP32[$res >> 2] = (HEAP32[$res >> 2] | 0) + 2;
 $283 = +__Z11BV_DistancePA3_dPdP2BVS3_($R1, $T1, $280 + ($a1$0 * 176 | 0) | 0, $282 + ($a2$0 * 176 | 0) | 0);
 $288 = +__Z11BV_DistancePA3_dPdP2BVS3_($R2, $T2, (HEAP32[$0 >> 2] | 0) + ($c1$0 * 176 | 0) | 0, (HEAP32[$14 >> 2] | 0) + ($c2$0 * 176 | 0) | 0);
 $290 = $res + 128 | 0;
 $291 = +HEAPF64[$290 >> 3];
 $292 = $res + 120 | 0;
 $293 = +HEAPF64[$292 >> 3];
 $294 = $291 - $293;
 if ($288 < $283) {
  if ($288 < $294) {
   label = 11;
  } else {
   if ($288 * (+HEAPF64[$res + 112 >> 3] + 1.0) < $291) {
    label = 11;
   } else {
    $302 = $293;
    $303 = $291;
   }
  }
  if ((label | 0) == 11) {
   __Z15DistanceRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R2, $T2, $o1, $c1$0, $o2, $c2$0);
   $302 = +HEAPF64[$292 >> 3];
   $303 = +HEAPF64[$290 >> 3];
  }
  if (!($283 < $303 - $302)) {
   if (!($283 * (+HEAPF64[$res + 112 >> 3] + 1.0) < $303)) {
    STACKTOP = sp;
    return;
   }
  }
  __Z15DistanceRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R1, $T1, $o1, $a1$0, $o2, $a2$0);
  STACKTOP = sp;
  return;
 } else {
  if ($283 < $294) {
   label = 17;
  } else {
   if ($283 * (+HEAPF64[$res + 112 >> 3] + 1.0) < $291) {
    label = 17;
   } else {
    $317 = $293;
    $318 = $291;
   }
  }
  if ((label | 0) == 17) {
   __Z15DistanceRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R1, $T1, $o1, $a1$0, $o2, $a2$0);
   $317 = +HEAPF64[$292 >> 3];
   $318 = +HEAPF64[$290 >> 3];
  }
  if (!($288 < $318 - $317)) {
   if (!($288 * (+HEAPF64[$res + 112 >> 3] + 1.0) < $318)) {
    STACKTOP = sp;
    return;
   }
  }
  __Z15DistanceRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R2, $T2, $o1, $c1$0, $o2, $c2$0);
  STACKTOP = sp;
  return;
 }
}
function __Z6MeigenPA3_dPdS0_($vout, $dout, $a) {
 $vout = $vout | 0;
 $dout = $dout | 0;
 $a = $a | 0;
 var $0 = 0, $1 = 0, $10 = 0, $100 = 0.0, $101 = 0, $102 = 0.0, $113 = 0, $114 = 0.0, $115 = 0, $116 = 0.0, $127 = 0, $128 = 0.0, $129 = 0, $130 = 0.0, $139 = 0, $140 = 0.0, $141 = 0, $142 = 0.0, $151 = 0, $152 = 0.0, $153 = 0, $154 = 0.0, $163 = 0, $164 = 0.0, $165 = 0, $166 = 0.0, $176 = 0.0, $177 = 0, $179 = 0.0, $180 = 0, $182 = 0.0, $183 = 0, $2 = 0, $3 = 0, $37 = 0.0, $39 = 0.0, $4 = 0.0, $41 = 0.0, $44 = 0.0, $46 = 0, $48 = 0, $49 = 0, $50 = 0, $51 = 0, $52 = 0.0, $53 = 0.0, $54 = 0.0, $56 = 0.0, $6 = 0.0, $61 = 0.0, $65 = 0, $67 = 0.0, $68 = 0.0, $69 = 0.0, $7 = 0, $74 = 0.0, $80 = 0.0, $86 = 0.0, $87 = 0.0, $89 = 0.0, $9 = 0.0, $90 = 0.0, $93 = 0, $99 = 0, $d = 0, $i$028 = 0, $indvars$iv = 0, $indvars$iv$next = 0, $indvars$iv33 = 0, $indvars$iv35 = 0, $iq$02 = 0, $j$06 = 0, $j$19 = 0, $j$212 = 0, $j$213 = 0, $sm$11 = 0.0, $t$0 = 0.0, $tresh$0 = 0.0, $v = 0, $z = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128 | 0;
 $z = sp + 96 | 0;
 $v = sp;
 $d = sp + 72 | 0;
 $0 = $v + 64 | 0;
 HEAPF64[$0 >> 3] = 1.0;
 $1 = $v + 32 | 0;
 HEAPF64[$1 >> 3] = 1.0;
 HEAPF64[$v >> 3] = 1.0;
 $2 = $v + 40 | 0;
 $3 = $v + 8 | 0;
 HEAP32[$3 + 0 >> 2] = 0;
 HEAP32[$3 + 4 >> 2] = 0;
 HEAP32[$3 + 8 >> 2] = 0;
 HEAP32[$3 + 12 >> 2] = 0;
 HEAP32[$3 + 16 >> 2] = 0;
 HEAP32[$3 + 20 >> 2] = 0;
 HEAP32[$2 + 0 >> 2] = 0;
 HEAP32[$2 + 4 >> 2] = 0;
 HEAP32[$2 + 8 >> 2] = 0;
 HEAP32[$2 + 12 >> 2] = 0;
 HEAP32[$2 + 16 >> 2] = 0;
 HEAP32[$2 + 20 >> 2] = 0;
 HEAP32[$z + 0 >> 2] = 0;
 HEAP32[$z + 4 >> 2] = 0;
 HEAP32[$z + 8 >> 2] = 0;
 HEAP32[$z + 12 >> 2] = 0;
 HEAP32[$z + 16 >> 2] = 0;
 HEAP32[$z + 20 >> 2] = 0;
 $4 = +HEAPF64[$a >> 3];
 HEAPF64[$d >> 3] = $4;
 $6 = +HEAPF64[$a + 32 >> 3];
 $7 = $d + 8 | 0;
 HEAPF64[$7 >> 3] = $6;
 $9 = +HEAPF64[$a + 64 >> 3];
 $10 = $d + 16 | 0;
 HEAPF64[$10 >> 3] = $9;
 $37 = $4;
 $39 = $6;
 $41 = $9;
 $i$028 = 0;
 while (1) {
  $iq$02 = 1;
  $sm$11 = 0.0;
  do {
   $sm$11 = $sm$11 + +Math_abs(+(+HEAPF64[$a + ($iq$02 << 3) >> 3]));
   $iq$02 = $iq$02 + 1 | 0;
  } while (($iq$02 | 0) != 3);
  $44 = $sm$11 + +Math_abs(+(+HEAPF64[$a + 40 >> 3]));
  if ($44 == 0.0) {
   label = 4;
   break;
  }
  if (($i$028 | 0) < 3) {
   $tresh$0 = $44 * .2 / 9.0;
  } else {
   $tresh$0 = 0.0;
  }
  $46 = ($i$028 | 0) > 3;
  $indvars$iv = 0;
  $indvars$iv33 = 1;
  while (1) {
   $indvars$iv$next = $indvars$iv + 1 | 0;
   if (($indvars$iv$next | 0) < 3) {
    $48 = $d + ($indvars$iv << 3) | 0;
    $49 = $z + ($indvars$iv << 3) | 0;
    $50 = ($indvars$iv | 0) > 0;
    $indvars$iv35 = $indvars$iv33;
    do {
     $51 = $a + ($indvars$iv * 24 | 0) + ($indvars$iv35 << 3) | 0;
     $52 = +HEAPF64[$51 >> 3];
     $53 = +Math_abs(+$52);
     $54 = $53 * 100.0;
     if ($46) {
      $56 = +Math_abs(+(+HEAPF64[$48 >> 3]));
      if ($54 + $56 == $56) {
       $61 = +Math_abs(+(+HEAPF64[$d + ($indvars$iv35 << 3) >> 3]));
       if ($54 + $61 == $61) {
        HEAPF64[$51 >> 3] = 0.0;
       } else {
        label = 15;
       }
      } else {
       label = 15;
      }
     } else {
      label = 15;
     }
     if ((label | 0) == 15) {
      label = 0;
      if ($53 > $tresh$0) {
       $65 = $d + ($indvars$iv35 << 3) | 0;
       $67 = +HEAPF64[$48 >> 3];
       $68 = +HEAPF64[$65 >> 3] - $67;
       $69 = +Math_abs(+$68);
       if ($54 + $69 == $69) {
        $t$0 = $52 / $68;
       } else {
        $74 = $68 * .5 / $52;
        $80 = 1.0 / (+Math_abs(+$74) + +Math_sqrt(+($74 * $74 + 1.0)));
        if ($74 < 0.0) {
         $t$0 = -$80;
        } else {
         $t$0 = $80;
        }
       }
       $86 = 1.0 / +Math_sqrt(+($t$0 * $t$0 + 1.0));
       $87 = $t$0 * $86;
       $89 = $87 / ($86 + 1.0);
       $90 = $t$0 * $52;
       HEAPF64[$49 >> 3] = +HEAPF64[$49 >> 3] - $90;
       $93 = $z + ($indvars$iv35 << 3) | 0;
       HEAPF64[$93 >> 3] = $90 + +HEAPF64[$93 >> 3];
       HEAPF64[$48 >> 3] = $67 - $90;
       HEAPF64[$65 >> 3] = $90 + +HEAPF64[$65 >> 3];
       HEAPF64[$51 >> 3] = 0.0;
       if ($50) {
        $j$06 = 0;
        do {
         $99 = $a + ($j$06 * 24 | 0) + ($indvars$iv << 3) | 0;
         $100 = +HEAPF64[$99 >> 3];
         $101 = $a + ($j$06 * 24 | 0) + ($indvars$iv35 << 3) | 0;
         $102 = +HEAPF64[$101 >> 3];
         HEAPF64[$99 >> 3] = $100 - $87 * ($102 + $89 * $100);
         HEAPF64[$101 >> 3] = $102 + $87 * ($100 - $89 * $102);
         $j$06 = $j$06 + 1 | 0;
        } while (($j$06 | 0) != ($indvars$iv | 0));
       }
       if (($indvars$iv$next | 0) < ($indvars$iv35 | 0)) {
        $j$19 = $indvars$iv$next;
        do {
         $113 = $a + ($indvars$iv * 24 | 0) + ($j$19 << 3) | 0;
         $114 = +HEAPF64[$113 >> 3];
         $115 = $a + ($j$19 * 24 | 0) + ($indvars$iv35 << 3) | 0;
         $116 = +HEAPF64[$115 >> 3];
         HEAPF64[$113 >> 3] = $114 - $87 * ($116 + $89 * $114);
         HEAPF64[$115 >> 3] = $116 + $87 * ($114 - $89 * $116);
         $j$19 = $j$19 + 1 | 0;
        } while (($j$19 | 0) != ($indvars$iv35 | 0));
       }
       $j$212 = $indvars$iv35 + 1 | 0;
       if (($j$212 | 0) < 3) {
        $j$213 = $j$212;
        do {
         $127 = $a + ($indvars$iv * 24 | 0) + ($j$213 << 3) | 0;
         $128 = +HEAPF64[$127 >> 3];
         $129 = $a + ($indvars$iv35 * 24 | 0) + ($j$213 << 3) | 0;
         $130 = +HEAPF64[$129 >> 3];
         HEAPF64[$127 >> 3] = $128 - $87 * ($130 + $89 * $128);
         HEAPF64[$129 >> 3] = $130 + $87 * ($128 - $89 * $130);
         $j$213 = $j$213 + 1 | 0;
        } while (($j$213 | 0) != 3);
       }
       $139 = $v + ($indvars$iv << 3) | 0;
       $140 = +HEAPF64[$139 >> 3];
       $141 = $v + ($indvars$iv35 << 3) | 0;
       $142 = +HEAPF64[$141 >> 3];
       HEAPF64[$139 >> 3] = $140 - $87 * ($142 + $89 * $140);
       HEAPF64[$141 >> 3] = $142 + $87 * ($140 - $89 * $142);
       $151 = $v + ($indvars$iv << 3) + 24 | 0;
       $152 = +HEAPF64[$151 >> 3];
       $153 = $v + ($indvars$iv35 << 3) + 24 | 0;
       $154 = +HEAPF64[$153 >> 3];
       HEAPF64[$151 >> 3] = $152 - $87 * ($154 + $89 * $152);
       HEAPF64[$153 >> 3] = $154 + $87 * ($152 - $89 * $154);
       $163 = $v + ($indvars$iv << 3) + 48 | 0;
       $164 = +HEAPF64[$163 >> 3];
       $165 = $v + ($indvars$iv35 << 3) + 48 | 0;
       $166 = +HEAPF64[$165 >> 3];
       HEAPF64[$163 >> 3] = $164 - $87 * ($166 + $89 * $164);
       HEAPF64[$165 >> 3] = $166 + $87 * ($164 - $89 * $166);
      }
     }
     $indvars$iv35 = $indvars$iv35 + 1 | 0;
    } while (($indvars$iv35 | 0) != 3);
   }
   if (($indvars$iv$next | 0) == 3) {
    break;
   } else {
    $indvars$iv = $indvars$iv$next;
    $indvars$iv33 = $indvars$iv33 + 1 | 0;
   }
  }
  $176 = +HEAPF64[$z >> 3] + $37;
  HEAPF64[$d >> 3] = $176;
  HEAPF64[$z >> 3] = 0.0;
  $177 = $z + 8 | 0;
  $179 = +HEAPF64[$177 >> 3] + $39;
  HEAPF64[$7 >> 3] = $179;
  HEAPF64[$177 >> 3] = 0.0;
  $180 = $z + 16 | 0;
  $182 = +HEAPF64[$180 >> 3] + $41;
  HEAPF64[$10 >> 3] = $182;
  HEAPF64[$180 >> 3] = 0.0;
  $183 = $i$028 + 1 | 0;
  if (($183 | 0) < 50) {
   $37 = $176;
   $39 = $179;
   $41 = $182;
   $i$028 = $183;
  } else {
   label = 29;
   break;
  }
 }
 if ((label | 0) == 4) {
  HEAPF64[$vout >> 3] = +HEAPF64[$v >> 3];
  HEAPF64[$vout + 8 >> 3] = +HEAPF64[$3 >> 3];
  HEAPF64[$vout + 16 >> 3] = +HEAPF64[$v + 16 >> 3];
  HEAPF64[$vout + 24 >> 3] = +HEAPF64[$v + 24 >> 3];
  HEAPF64[$vout + 32 >> 3] = +HEAPF64[$1 >> 3];
  HEAPF64[$vout + 40 >> 3] = +HEAPF64[$2 >> 3];
  HEAPF64[$vout + 48 >> 3] = +HEAPF64[$v + 48 >> 3];
  HEAPF64[$vout + 56 >> 3] = +HEAPF64[$v + 56 >> 3];
  HEAPF64[$vout + 64 >> 3] = +HEAPF64[$0 >> 3];
  HEAPF64[$dout >> 3] = $37;
  HEAPF64[$dout + 8 >> 3] = $39;
  HEAPF64[$dout + 16 >> 3] = $41;
  STACKTOP = sp;
  return;
 } else if ((label | 0) == 29) {
  _fwrite(1432, 48, 1, HEAP32[_stderr >> 2] | 0) | 0;
  STACKTOP = sp;
  return;
 }
}
function __Z9DisplayCBv() {
 var $$pre = 0.0, $103 = 0, $104 = 0.0, $105 = 0.0, $106 = 0.0, $109 = 0.0, $110 = 0.0, $113 = 0.0, $116 = 0.0, $119 = 0.0, $121 = 0.0, $123 = 0.0, $124 = 0.0, $127 = 0.0, $13 = 0.0, $130 = 0.0, $131 = 0.0, $132 = 0.0, $133 = 0.0, $134 = 0.0, $138 = 0.0, $143 = 0.0, $145 = 0, $149 = 0.0, $15 = 0.0, $151 = 0, $156 = 0, $161 = 0, $166 = 0, $17 = 0.0, $170 = 0, $175 = 0, $18 = 0, $180 = 0, $183 = 0, $185 = 0, $186 = 0, $188 = 0, $19 = 0, $190 = 0, $192 = 0, $193 = 0, $195 = 0, $197 = 0, $199 = 0, $20 = 0, $200 = 0, $202 = 0, $204 = 0, $206 = 0, $207 = 0, $21 = 0, $22 = 0.0, $223 = 0.0, $225 = 0.0, $227 = 0.0, $229 = 0.0, $23 = 0.0, $231 = 0.0, $233 = 0.0, $24 = 0.0, $25 = 0.0, $253 = 0.0, $26 = 0.0, $263 = 0.0, $27 = 0.0, $273 = 0.0, $283 = 0.0, $293 = 0.0, $30 = 0.0, $31 = 0.0, $32 = 0.0, $35 = 0.0, $36 = 0.0, $39 = 0.0, $42 = 0.0, $44 = 0.0, $46 = 0.0, $47 = 0.0, $50 = 0.0, $53 = 0.0, $54 = 0.0, $55 = 0.0, $56 = 0.0, $57 = 0.0, $59 = 0.0, $61 = 0.0, $62 = 0.0, $66 = 0.0, $68 = 0, $72 = 0.0, $74 = 0, $76 = 0.0, $79 = 0, $84 = 0, $89 = 0, $93 = 0, $98 = 0, $R1 = 0, $R2 = 0, $T1 = 0, $T2 = 0, $oglm = 0, $res = 0, $v1p = 0, $v2p = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 544 | 0;
 $R1 = sp + 440 | 0;
 $R2 = sp;
 $T1 = sp + 72 | 0;
 $T2 = sp + 96 | 0;
 $res = sp + 120 | 0;
 $oglm = sp + 312 | 0;
 $v1p = sp + 524 | 0;
 $v2p = sp + 512 | 0;
 _glClear(16640);
 _glLoadIdentity();
 _glTranslatef(0.0, 0.0, +-(+HEAPF64[14] + +HEAPF64[17]));
 _glRotated(+(+HEAPF64[16] + +HEAPF64[19]), 1.0, 0.0, 0.0);
 _glRotated(+(+HEAPF64[15] + +HEAPF64[18]), 0.0, 1.0, 0.0);
 $$pre = +HEAPF64[20];
 if ((HEAP32[46] | 0) == 0) {
  $22 = $$pre;
  $25 = +HEAPF64[21];
  $54 = +HEAPF64[22];
 } else {
  $13 = $$pre + .1;
  HEAPF64[20] = $13;
  $15 = +HEAPF64[21] + .2;
  HEAPF64[21] = $15;
  $17 = +HEAPF64[22] + .3;
  HEAPF64[22] = $17;
  $22 = $13;
  $25 = $15;
  $54 = $17;
 }
 HEAPF64[$T1 >> 3] = -1.0;
 $18 = $T1 + 8 | 0;
 $19 = $T1 + 16 | 0;
 HEAP32[$18 + 0 >> 2] = 0;
 HEAP32[$18 + 4 >> 2] = 0;
 HEAP32[$18 + 8 >> 2] = 0;
 HEAP32[$18 + 12 >> 2] = 0;
 HEAPF64[$T2 >> 3] = 1.0;
 $20 = $T2 + 8 | 0;
 $21 = $T2 + 16 | 0;
 $23 = +Math_cos(+$22);
 $24 = +Math_sin(+$22);
 $26 = +Math_cos(+$25);
 $27 = +Math_sin(+$25);
 $30 = $26 + 0.0 + $27 * -0.0;
 $31 = $26 * 0.0;
 $32 = $23 * 0.0;
 $35 = $32 + $31 + $24 * $27;
 $36 = $24 * 0.0;
 $39 = $36 + $31 - $23 * $27;
 $42 = $23 + 0.0 + $24 * -0.0;
 $44 = $32 + ($24 + 0.0);
 $46 = $31 + ($27 + 0.0);
 $47 = $27 * 0.0;
 $50 = $32 + $47 - $24 * $26;
 $53 = $23 * $26 + ($36 + $47);
 $55 = +Math_cos(+$54);
 $56 = +Math_sin(+$54);
 $57 = -$56;
 $59 = $56 * 0.0;
 $61 = $46 * 0.0;
 $62 = $61 + ($30 * $55 + $59);
 HEAP32[$20 + 0 >> 2] = 0;
 HEAP32[$20 + 4 >> 2] = 0;
 HEAP32[$20 + 8 >> 2] = 0;
 HEAP32[$20 + 12 >> 2] = 0;
 HEAPF64[$R1 >> 3] = $62;
 $66 = $50 * 0.0;
 $68 = $R1 + 24 | 0;
 HEAPF64[$68 >> 3] = $66 + ($35 * $55 + $42 * $56);
 $72 = $53 * 0.0;
 $74 = $R1 + 48 | 0;
 HEAPF64[$74 >> 3] = $72 + ($39 * $55 + $44 * $56);
 $76 = $55 * 0.0;
 $79 = $R1 + 8 | 0;
 HEAPF64[$79 >> 3] = $61 + ($76 + $30 * $57);
 $84 = $R1 + 32 | 0;
 HEAPF64[$84 >> 3] = $66 + ($42 * $55 + $35 * $57);
 $89 = $R1 + 56 | 0;
 HEAPF64[$89 >> 3] = $72 + ($44 * $55 + $39 * $57);
 $93 = $R1 + 16 | 0;
 HEAPF64[$93 >> 3] = $46 + ($30 * 0.0 + 0.0);
 $98 = $R1 + 40 | 0;
 HEAPF64[$98 >> 3] = $50 + ($42 * 0.0 + $35 * 0.0);
 $103 = $R1 + 64 | 0;
 HEAPF64[$103 >> 3] = $53 + ($44 * 0.0 + $39 * 0.0);
 $104 = +HEAPF64[20];
 $105 = +Math_cos(+$104);
 $106 = +Math_sin(+$104);
 $109 = $105 + 0.0 + $106 * -0.0;
 $110 = $105 * 0.0;
 $113 = $76 + $110 + $56 * $106;
 $116 = $59 + $110 - $55 * $106;
 $119 = $55 + 0.0 + $56 * -0.0;
 $121 = $76 + ($56 + 0.0);
 $123 = $110 + ($106 + 0.0);
 $124 = $106 * 0.0;
 $127 = $76 + $124 - $56 * $105;
 $130 = $55 * $105 + ($59 + $124);
 $131 = +HEAPF64[21];
 $132 = +Math_cos(+$131);
 $133 = +Math_sin(+$131);
 $134 = -$133;
 $138 = $123 * 0.0;
 HEAPF64[$R2 >> 3] = $138 + ($109 * $132 + $133 * 0.0);
 $143 = $127 * 0.0;
 $145 = $R2 + 24 | 0;
 HEAPF64[$145 >> 3] = $143 + ($113 * $132 + $119 * $133);
 $149 = $130 * 0.0;
 $151 = $R2 + 48 | 0;
 HEAPF64[$151 >> 3] = $149 + ($116 * $132 + $121 * $133);
 $156 = $R2 + 8 | 0;
 HEAPF64[$156 >> 3] = $138 + ($132 * 0.0 + $109 * $134);
 $161 = $R2 + 32 | 0;
 HEAPF64[$161 >> 3] = $143 + ($119 * $132 + $113 * $134);
 $166 = $R2 + 56 | 0;
 HEAPF64[$166 >> 3] = $149 + ($121 * $132 + $116 * $134);
 $170 = $R2 + 16 | 0;
 HEAPF64[$170 >> 3] = $123 + ($109 * 0.0 + 0.0);
 $175 = $R2 + 40 | 0;
 HEAPF64[$175 >> 3] = $127 + ($119 * 0.0 + $113 * 0.0);
 $180 = $R2 + 64 | 0;
 HEAPF64[$180 >> 3] = $130 + ($121 * 0.0 + $116 * 0.0);
 __Z12PQP_DistanceP18PQP_DistanceResultPA3_dPdP9PQP_ModelS2_S3_S5_ddi($res, $R1, $T1, 8, $R2, $T2, 40, 0.0, 0.0, 2) | 0;
 _glColor3d(0.0, 0.0, 1.0);
 HEAPF64[$oglm >> 3] = +HEAPF64[$R1 >> 3];
 $183 = $oglm + 8 | 0;
 HEAPF64[$183 >> 3] = +HEAPF64[$68 >> 3];
 $185 = $oglm + 16 | 0;
 HEAPF64[$185 >> 3] = +HEAPF64[$74 >> 3];
 $186 = $oglm + 24 | 0;
 HEAPF64[$186 >> 3] = 0.0;
 $188 = $oglm + 32 | 0;
 HEAPF64[$188 >> 3] = +HEAPF64[$79 >> 3];
 $190 = $oglm + 40 | 0;
 HEAPF64[$190 >> 3] = +HEAPF64[$84 >> 3];
 $192 = $oglm + 48 | 0;
 HEAPF64[$192 >> 3] = +HEAPF64[$89 >> 3];
 $193 = $oglm + 56 | 0;
 HEAPF64[$193 >> 3] = 0.0;
 $195 = $oglm + 64 | 0;
 HEAPF64[$195 >> 3] = +HEAPF64[$93 >> 3];
 $197 = $oglm + 72 | 0;
 HEAPF64[$197 >> 3] = +HEAPF64[$98 >> 3];
 $199 = $oglm + 80 | 0;
 HEAPF64[$199 >> 3] = +HEAPF64[$103 >> 3];
 $200 = $oglm + 88 | 0;
 HEAPF64[$200 >> 3] = 0.0;
 $202 = $oglm + 96 | 0;
 HEAPF64[$202 >> 3] = +HEAPF64[$T1 >> 3];
 $204 = $oglm + 104 | 0;
 HEAPF64[$204 >> 3] = +HEAPF64[$18 >> 3];
 $206 = $oglm + 112 | 0;
 HEAPF64[$206 >> 3] = +HEAPF64[$19 >> 3];
 $207 = $oglm + 120 | 0;
 HEAPF64[$207 >> 3] = 1.0;
 _glPushMatrix();
 _glMultMatrixd($oglm | 0);
 __ZN5Model4DrawEv(HEAP32[18] | 0);
 _glPopMatrix();
 _glColor3d(0.0, 1.0, 0.0);
 HEAPF64[$oglm >> 3] = +HEAPF64[$R2 >> 3];
 HEAPF64[$183 >> 3] = +HEAPF64[$145 >> 3];
 HEAPF64[$185 >> 3] = +HEAPF64[$151 >> 3];
 HEAPF64[$186 >> 3] = 0.0;
 HEAPF64[$188 >> 3] = +HEAPF64[$156 >> 3];
 HEAPF64[$190 >> 3] = +HEAPF64[$161 >> 3];
 HEAPF64[$192 >> 3] = +HEAPF64[$166 >> 3];
 HEAPF64[$193 >> 3] = 0.0;
 HEAPF64[$195 >> 3] = +HEAPF64[$170 >> 3];
 HEAPF64[$197 >> 3] = +HEAPF64[$175 >> 3];
 HEAPF64[$199 >> 3] = +HEAPF64[$180 >> 3];
 HEAPF64[$200 >> 3] = 0.0;
 HEAPF64[$202 >> 3] = +HEAPF64[$T2 >> 3];
 HEAPF64[$204 >> 3] = +HEAPF64[$20 >> 3];
 HEAPF64[$206 >> 3] = +HEAPF64[$21 >> 3];
 HEAPF64[$207 >> 3] = 1.0;
 _glPushMatrix();
 _glMultMatrixd($oglm | 0);
 __ZN5Model4DrawEv(HEAP32[20] | 0);
 _glPopMatrix();
 _glColor3d(1.0, 0.0, 0.0);
 $223 = +HEAPF64[$res + 136 >> 3];
 $225 = +HEAPF64[$res + 144 >> 3];
 $227 = +HEAPF64[$res + 152 >> 3];
 $229 = +HEAPF64[$res + 160 >> 3];
 $231 = +HEAPF64[$res + 168 >> 3];
 $233 = +HEAPF64[$res + 176 >> 3];
 $253 = +HEAPF64[$18 >> 3] + ($223 * +HEAPF64[$68 >> 3] + $225 * +HEAPF64[$84 >> 3] + $227 * +HEAPF64[$98 >> 3]);
 $263 = +HEAPF64[$19 >> 3] + ($223 * +HEAPF64[$74 >> 3] + $225 * +HEAPF64[$89 >> 3] + $227 * +HEAPF64[$103 >> 3]);
 $273 = +HEAPF64[$T2 >> 3] + ($229 * +HEAPF64[$R2 >> 3] + $231 * +HEAPF64[$156 >> 3] + $233 * +HEAPF64[$170 >> 3]);
 $283 = +HEAPF64[$20 >> 3] + ($229 * +HEAPF64[$145 >> 3] + $231 * +HEAPF64[$161 >> 3] + $233 * +HEAPF64[$175 >> 3]);
 $293 = +HEAPF64[$21 >> 3] + ($229 * +HEAPF64[$151 >> 3] + $231 * +HEAPF64[$166 >> 3] + $233 * +HEAPF64[$180 >> 3]);
 HEAPF32[$v1p >> 2] = +HEAPF64[$T1 >> 3] + ($223 * +HEAPF64[$R1 >> 3] + $225 * +HEAPF64[$79 >> 3] + $227 * +HEAPF64[$93 >> 3]);
 HEAPF32[$v2p >> 2] = $273;
 HEAPF32[$v1p + 4 >> 2] = $253;
 HEAPF32[$v2p + 4 >> 2] = $283;
 HEAPF32[$v1p + 8 >> 2] = $263;
 HEAPF32[$v2p + 8 >> 2] = $293;
 _glBegin(1);
 _glVertex3fv($v1p | 0);
 _glVertex3fv($v2p | 0);
 _glEnd();
 _glFlush();
 _glutSwapBuffers();
 STACKTOP = sp;
 return;
}
function __Z12PQP_DistanceP18PQP_DistanceResultPA3_dPdP9PQP_ModelS2_S3_S5_ddi($res, $R1, $T1, $o1, $R2, $T2, $o2, $rel_err, $abs_err, $qsize) {
 $res = $res | 0;
 $R1 = $R1 | 0;
 $T1 = $T1 | 0;
 $o1 = $o1 | 0;
 $R2 = $R2 | 0;
 $T2 = $T2 | 0;
 $o2 = $o2 | 0;
 $rel_err = +$rel_err;
 $abs_err = +$abs_err;
 $qsize = $qsize | 0;
 var $$0 = 0, $101 = 0.0, $104 = 0, $107 = 0, $11 = 0, $111 = 0, $116 = 0, $119 = 0, $123 = 0, $130 = 0.0, $134 = 0.0, $139 = 0.0, $14 = 0.0, $163 = 0.0, $167 = 0.0, $172 = 0.0, $19 = 0.0, $194 = 0, $197 = 0.0, $199 = 0, $202 = 0.0, $205 = 0, $208 = 0.0, $213 = 0, $216 = 0, $220 = 0, $226 = 0, $229 = 0, $233 = 0, $239 = 0, $24 = 0.0, $242 = 0.0, $245 = 0.0, $248 = 0.0, $25 = 0, $287 = 0.0, $290 = 0.0, $293 = 0.0, $47 = 0, $59 = 0, $6 = 0.0, $74 = 0, $78 = 0, $81 = 0, $85 = 0, $87 = 0, $88 = 0, $90 = 0.0, $92 = 0, $95 = 0.0, $98 = 0, $R = 0, $Rtemp = 0, $T = 0, $p = 0, $q = 0, $thistime$i1 = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224 | 0;
 $thistime$i1 = sp + 216 | 0;
 $p = sp;
 $q = sp + 24 | 0;
 $Rtemp = sp + 48 | 0;
 $R = sp + 120 | 0;
 $T = sp + 192 | 0;
 _gettimeofday($thistime$i1 | 0, 0) | 0;
 $6 = +(HEAP32[$thistime$i1 >> 2] | 0) + +(HEAP32[$thistime$i1 + 4 >> 2] | 0) * 1.0e-6;
 if ((HEAP32[$o1 >> 2] | 0) != 2) {
  $$0 = -3;
  STACKTOP = sp;
  return $$0 | 0;
 }
 if ((HEAP32[$o2 >> 2] | 0) != 2) {
  $$0 = -3;
  STACKTOP = sp;
  return $$0 | 0;
 }
 $11 = $res + 16 | 0;
 __Z4MTxMPA3_dPA3_KdS3_($11, $R1, $R2);
 $14 = +HEAPF64[$T2 >> 3] - +HEAPF64[$T1 >> 3];
 $19 = +HEAPF64[$T2 + 8 >> 3] - +HEAPF64[$T1 + 8 >> 3];
 $24 = +HEAPF64[$T2 + 16 >> 3] - +HEAPF64[$T1 + 16 >> 3];
 $25 = $res + 88 | 0;
 HEAPF64[$25 >> 3] = $14 * +HEAPF64[$R1 >> 3] + $19 * +HEAPF64[$R1 + 24 >> 3] + $24 * +HEAPF64[$R1 + 48 >> 3];
 $47 = $res + 96 | 0;
 HEAPF64[$47 >> 3] = $14 * +HEAPF64[$R1 + 8 >> 3] + $19 * +HEAPF64[$R1 + 32 >> 3] + $24 * +HEAPF64[$R1 + 56 >> 3];
 $59 = $res + 104 | 0;
 HEAPF64[$59 >> 3] = $14 * +HEAPF64[$R1 + 16 >> 3] + $19 * +HEAPF64[$R1 + 40 >> 3] + $24 * +HEAPF64[$R1 + 64 >> 3];
 HEAPF64[$res + 128 >> 3] = +__Z11TriDistancePA3_dPdP3TriS3_S1_S1_($11, $25, HEAP32[$o1 + 28 >> 2] | 0, HEAP32[$o2 + 28 >> 2] | 0, $p, $q);
 HEAPF64[$res + 136 >> 3] = +HEAPF64[$p >> 3];
 HEAPF64[$res + 144 >> 3] = +HEAPF64[$p + 8 >> 3];
 HEAPF64[$res + 152 >> 3] = +HEAPF64[$p + 16 >> 3];
 $74 = $res + 160 | 0;
 HEAPF64[$74 >> 3] = +HEAPF64[$q >> 3];
 $78 = $res + 168 | 0;
 HEAPF64[$78 >> 3] = +HEAPF64[$q + 8 >> 3];
 $81 = $res + 176 | 0;
 HEAPF64[$81 >> 3] = +HEAPF64[$q + 16 >> 3];
 HEAPF64[$res + 120 >> 3] = $abs_err;
 HEAPF64[$res + 112 >> 3] = $rel_err;
 HEAP32[$res >> 2] = 0;
 HEAP32[$res + 4 >> 2] = 0;
 $85 = $o2 + 16 | 0;
 __Z3MxMPA3_dPA3_KdS3_($Rtemp, $11, HEAP32[$85 >> 2] | 0);
 $87 = $o1 + 16 | 0;
 $88 = HEAP32[$87 >> 2] | 0;
 $90 = +HEAPF64[$Rtemp >> 3];
 $92 = $88 + 24 | 0;
 $95 = +HEAPF64[$Rtemp + 24 >> 3];
 $98 = $88 + 48 | 0;
 $101 = +HEAPF64[$Rtemp + 48 >> 3];
 HEAPF64[$R >> 3] = +HEAPF64[$88 >> 3] * $90 + +HEAPF64[$92 >> 3] * $95 + +HEAPF64[$98 >> 3] * $101;
 $104 = $88 + 8 | 0;
 $107 = $88 + 32 | 0;
 $111 = $88 + 56 | 0;
 HEAPF64[$R + 24 >> 3] = +HEAPF64[$104 >> 3] * $90 + +HEAPF64[$107 >> 3] * $95 + +HEAPF64[$111 >> 3] * $101;
 $116 = $88 + 16 | 0;
 $119 = $88 + 40 | 0;
 $123 = $88 + 64 | 0;
 HEAPF64[$R + 48 >> 3] = +HEAPF64[$116 >> 3] * $90 + +HEAPF64[$119 >> 3] * $95 + +HEAPF64[$123 >> 3] * $101;
 $130 = +HEAPF64[$Rtemp + 8 >> 3];
 $134 = +HEAPF64[$Rtemp + 32 >> 3];
 $139 = +HEAPF64[$Rtemp + 56 >> 3];
 HEAPF64[$R + 8 >> 3] = +HEAPF64[$88 >> 3] * $130 + +HEAPF64[$92 >> 3] * $134 + +HEAPF64[$98 >> 3] * $139;
 HEAPF64[$R + 32 >> 3] = +HEAPF64[$104 >> 3] * $130 + +HEAPF64[$107 >> 3] * $134 + +HEAPF64[$111 >> 3] * $139;
 HEAPF64[$R + 56 >> 3] = +HEAPF64[$116 >> 3] * $130 + +HEAPF64[$119 >> 3] * $134 + +HEAPF64[$123 >> 3] * $139;
 $163 = +HEAPF64[$Rtemp + 16 >> 3];
 $167 = +HEAPF64[$Rtemp + 40 >> 3];
 $172 = +HEAPF64[$Rtemp + 64 >> 3];
 HEAPF64[$R + 16 >> 3] = +HEAPF64[$88 >> 3] * $163 + +HEAPF64[$92 >> 3] * $167 + +HEAPF64[$98 >> 3] * $172;
 HEAPF64[$R + 40 >> 3] = +HEAPF64[$104 >> 3] * $163 + +HEAPF64[$107 >> 3] * $167 + +HEAPF64[$111 >> 3] * $172;
 HEAPF64[$R + 64 >> 3] = +HEAPF64[$116 >> 3] * $163 + +HEAPF64[$119 >> 3] * $167 + +HEAPF64[$123 >> 3] * $172;
 $194 = HEAP32[$85 >> 2] | 0;
 $197 = +HEAPF64[$194 + 72 >> 3];
 $199 = $res + 24 | 0;
 $202 = +HEAPF64[$194 + 80 >> 3];
 $205 = $res + 32 | 0;
 $208 = +HEAPF64[$194 + 88 >> 3];
 $213 = $res + 40 | 0;
 $216 = $res + 48 | 0;
 $220 = $res + 56 | 0;
 $226 = $res + 64 | 0;
 $229 = $res + 72 | 0;
 $233 = $res + 80 | 0;
 $239 = HEAP32[$87 >> 2] | 0;
 $242 = +HEAPF64[$25 >> 3] + (+HEAPF64[$11 >> 3] * $197 + +HEAPF64[$199 >> 3] * $202 + +HEAPF64[$205 >> 3] * $208) - +HEAPF64[$239 + 72 >> 3];
 $245 = +HEAPF64[$47 >> 3] + ($197 * +HEAPF64[$213 >> 3] + $202 * +HEAPF64[$216 >> 3] + $208 * +HEAPF64[$220 >> 3]) - +HEAPF64[$239 + 80 >> 3];
 $248 = +HEAPF64[$59 >> 3] + ($197 * +HEAPF64[$226 >> 3] + $202 * +HEAPF64[$229 >> 3] + $208 * +HEAPF64[$233 >> 3]) - +HEAPF64[$239 + 88 >> 3];
 HEAPF64[$T >> 3] = $242 * +HEAPF64[$239 >> 3] + $245 * +HEAPF64[$239 + 24 >> 3] + $248 * +HEAPF64[$239 + 48 >> 3];
 HEAPF64[$T + 8 >> 3] = $242 * +HEAPF64[$239 + 8 >> 3] + $245 * +HEAPF64[$239 + 32 >> 3] + $248 * +HEAPF64[$239 + 56 >> 3];
 HEAPF64[$T + 16 >> 3] = $242 * +HEAPF64[$239 + 16 >> 3] + $245 * +HEAPF64[$239 + 40 >> 3] + $248 * +HEAPF64[$239 + 64 >> 3];
 if (($qsize | 0) < 3) {
  __Z15DistanceRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R, $T, $o1, 0, $o2, 0);
 } else {
  HEAP32[$res + 184 >> 2] = $qsize;
  __Z20DistanceQueueRecurseP18PQP_DistanceResultPA3_dPdP9PQP_ModeliS5_i($res, $R, $T, $o1, 0, $o2, 0);
 }
 $287 = +HEAPF64[$74 >> 3] - +HEAPF64[$25 >> 3];
 $290 = +HEAPF64[$78 >> 3] - +HEAPF64[$47 >> 3];
 $293 = +HEAPF64[$81 >> 3] - +HEAPF64[$59 >> 3];
 HEAPF64[$74 >> 3] = $287 * +HEAPF64[$11 >> 3] + $290 * +HEAPF64[$213 >> 3] + $293 * +HEAPF64[$226 >> 3];
 HEAPF64[$78 >> 3] = $287 * +HEAPF64[$199 >> 3] + $290 * +HEAPF64[$216 >> 3] + $293 * +HEAPF64[$229 >> 3];
 HEAPF64[$81 >> 3] = $287 * +HEAPF64[$205 >> 3] + $290 * +HEAPF64[$220 >> 3] + $293 * +HEAPF64[$233 >> 3];
 _gettimeofday($thistime$i1 | 0, 0) | 0;
 HEAPF64[$res + 8 >> 3] = +(HEAP32[$thistime$i1 >> 2] | 0) + +(HEAP32[$thistime$i1 + 4 >> 2] | 0) * 1.0e-6 - $6;
 $$0 = 0;
 STACKTOP = sp;
 return $$0 | 0;
}
function __Z13build_recurseP9PQP_Modeliii($m, $bn, $first_tri, $num_tris) {
 $m = $m | 0;
 $bn = $bn | 0;
 $first_tri = $first_tri | 0;
 $num_tris = $num_tris | 0;
 var $$ = 0, $$sum = 0, $$sum14 = 0, $0 = 0, $1 = 0, $10 = 0, $103 = 0.0, $104 = 0, $12 = 0.0, $135 = 0, $18 = 0, $20 = 0.0, $22 = 0.0, $23 = 0, $25 = 0.0, $26 = 0, $28 = 0.0, $3 = 0, $31 = 0.0, $34 = 0.0, $54 = 0, $59 = 0.0, $60 = 0.0, $61 = 0.0, $62 = 0, $72 = 0.0, $82 = 0.0, $92 = 0.0, $95 = 0.0, $C = 0, $E = 0, $R = 0, $c1$01$i = 0, $c1$1$i = 0, $c1$2$i = 0, $i$01$i = 0, $i$02$i = 0, $max$1 = 0, $mid$0 = 0, $s = 0, $temp$i = 0, dest = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 320 | 0;
 $temp$i = sp + 240 | 0;
 $C = sp;
 $E = sp + 72 | 0;
 $R = sp + 144 | 0;
 $s = sp + 216 | 0;
 $0 = $m + 16 | 0;
 $1 = HEAP32[$0 >> 2] | 0;
 $3 = $m + 4 | 0;
 __Z23get_covariance_trivertsPA3_dP3Trii($C, (HEAP32[$3 >> 2] | 0) + ($first_tri * 80 | 0) | 0, $num_tris);
 __Z6MeigenPA3_dPdS0_($E, $s, $C);
 $10 = +HEAPF64[$s >> 3] > +HEAPF64[$s + 8 >> 3] | 0;
 $$ = $10 ^ 1;
 $12 = +HEAPF64[$s + 16 >> 3];
 if ($12 < +HEAPF64[$s + ($10 << 3) >> 3]) {
  $max$1 = $$;
  $mid$0 = $10;
 } else {
  $18 = $12 > +HEAPF64[$s + ($$ << 3) >> 3];
  $max$1 = $18 ? 2 : $$;
  $mid$0 = $18 ? $$ : 2;
 }
 $20 = +HEAPF64[$E + ($max$1 << 3) >> 3];
 HEAPF64[$R >> 3] = $20;
 $22 = +HEAPF64[$E + ($max$1 << 3) + 24 >> 3];
 $23 = $R + 24 | 0;
 HEAPF64[$23 >> 3] = $22;
 $25 = +HEAPF64[$E + ($max$1 << 3) + 48 >> 3];
 $26 = $R + 48 | 0;
 HEAPF64[$26 >> 3] = $25;
 $28 = +HEAPF64[$E + ($mid$0 << 3) >> 3];
 HEAPF64[$R + 8 >> 3] = $28;
 $31 = +HEAPF64[$E + ($mid$0 << 3) + 24 >> 3];
 HEAPF64[$R + 32 >> 3] = $31;
 $34 = +HEAPF64[$E + ($mid$0 << 3) + 48 >> 3];
 HEAPF64[$R + 56 >> 3] = $34;
 HEAPF64[$R + 16 >> 3] = $22 * $34 - $31 * $25;
 HEAPF64[$R + 40 >> 3] = $28 * $25 - $20 * $34;
 HEAPF64[$R + 64 >> 3] = $20 * $31 - $28 * $22;
 __ZN2BV9FitToTrisEPA3_dP3Trii($1 + ($bn * 176 | 0) | 0, $R, (HEAP32[$3 >> 2] | 0) + ($first_tri * 80 | 0) | 0, $num_tris);
 if (($num_tris | 0) == 1) {
  HEAP32[$1 + ($bn * 176 | 0) + 168 >> 2] = ~$first_tri;
  STACKTOP = sp;
  return 0;
 }
 if (($num_tris | 0) <= 1) {
  STACKTOP = sp;
  return 0;
 }
 $54 = $m + 20 | 0;
 HEAP32[$1 + ($bn * 176 | 0) + 168 >> 2] = HEAP32[$54 >> 2];
 HEAP32[$54 >> 2] = (HEAP32[$54 >> 2] | 0) + 2;
 $59 = +HEAPF64[$R >> 3];
 $60 = +HEAPF64[$23 >> 3];
 $61 = +HEAPF64[$26 >> 3];
 $62 = HEAP32[$3 >> 2] | 0;
 $72 = 0.0;
 $82 = 0.0;
 $92 = 0.0;
 $i$01$i = 0;
 do {
  $$sum = $i$01$i + $first_tri | 0;
  $72 = $72 + (+HEAPF64[$62 + ($$sum * 80 | 0) >> 3] + +HEAPF64[$62 + ($$sum * 80 | 0) + 24 >> 3] + +HEAPF64[$62 + ($$sum * 80 | 0) + 48 >> 3]);
  $82 = $82 + (+HEAPF64[$62 + ($$sum * 80 | 0) + 8 >> 3] + +HEAPF64[$62 + ($$sum * 80 | 0) + 32 >> 3] + +HEAPF64[$62 + ($$sum * 80 | 0) + 56 >> 3]);
  $92 = $92 + (+HEAPF64[$62 + ($$sum * 80 | 0) + 16 >> 3] + +HEAPF64[$62 + ($$sum * 80 | 0) + 40 >> 3] + +HEAPF64[$62 + ($$sum * 80 | 0) + 64 >> 3]);
  $i$01$i = $i$01$i + 1 | 0;
 } while (($i$01$i | 0) != ($num_tris | 0));
 $95 = +($num_tris * 3 | 0);
 $103 = $59 * ($72 / $95) + $60 * ($82 / $95) + $61 * ($92 / $95);
 $c1$01$i = 0;
 $i$02$i = 0;
 while (1) {
  $$sum14 = $i$02$i + $first_tri | 0;
  $104 = $62 + ($$sum14 * 80 | 0) | 0;
  if (!(($59 * (+HEAPF64[$104 >> 3] + +HEAPF64[$62 + ($$sum14 * 80 | 0) + 24 >> 3] + +HEAPF64[$62 + ($$sum14 * 80 | 0) + 48 >> 3]) + $60 * (+HEAPF64[$62 + ($$sum14 * 80 | 0) + 8 >> 3] + +HEAPF64[$62 + ($$sum14 * 80 | 0) + 32 >> 3] + +HEAPF64[$62 + ($$sum14 * 80 | 0) + 56 >> 3]) + $61 * (+HEAPF64[$62 + ($$sum14 * 80 | 0) + 16 >> 3] + +HEAPF64[$62 + ($$sum14 * 80 | 0) + 40 >> 3] + +HEAPF64[$62 + ($$sum14 * 80 | 0) + 64 >> 3])) / 3.0 <= $103)) {
   $c1$1$i = $c1$01$i;
  } else {
   dest = $temp$i + 0 | 0;
   src = $104 + 0 | 0;
   stop = dest + 80 | 0;
   do {
    HEAP32[dest >> 2] = HEAP32[src >> 2];
    dest = dest + 4 | 0;
    src = src + 4 | 0;
   } while ((dest | 0) < (stop | 0));
   $135 = $62 + (($c1$01$i + $first_tri | 0) * 80 | 0) | 0;
   dest = $104 + 0 | 0;
   src = $135 + 0 | 0;
   stop = dest + 80 | 0;
   do {
    HEAP32[dest >> 2] = HEAP32[src >> 2];
    dest = dest + 4 | 0;
    src = src + 4 | 0;
   } while ((dest | 0) < (stop | 0));
   dest = $135 + 0 | 0;
   src = $temp$i + 0 | 0;
   stop = dest + 80 | 0;
   do {
    HEAP32[dest >> 2] = HEAP32[src >> 2];
    dest = dest + 4 | 0;
    src = src + 4 | 0;
   } while ((dest | 0) < (stop | 0));
   $c1$1$i = $c1$01$i + 1 | 0;
  }
  $i$02$i = $i$02$i + 1 | 0;
  if (($i$02$i | 0) == ($num_tris | 0)) {
   break;
  } else {
   $c1$01$i = $c1$1$i;
  }
 }
 if (($c1$1$i | 0) == 0 | ($c1$1$i | 0) == ($num_tris | 0)) {
  $c1$2$i = ($num_tris | 0) / 2 | 0;
 } else {
  $c1$2$i = $c1$1$i;
 }
 __Z13build_recurseP9PQP_Modeliii($m, HEAP32[(HEAP32[$0 >> 2] | 0) + ($bn * 176 | 0) + 168 >> 2] | 0, $first_tri, $c1$2$i) | 0;
 __Z13build_recurseP9PQP_Modeliii($m, (HEAP32[(HEAP32[$0 >> 2] | 0) + ($bn * 176 | 0) + 168 >> 2] | 0) + 1 | 0, $c1$2$i + $first_tri | 0, $num_tris - $c1$2$i | 0) | 0;
 STACKTOP = sp;
 return 0;
}
function _main($argc, $argv) {
 $argc = $argc | 0;
 $argv = $argv | 0;
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $25 = 0, $26 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $7 = 0, $8 = 0, $9 = 0, $i$03 = 0, $i$12 = 0, $ntris = 0, $p1 = 0, $p110 = 0, $p1x = 0, $p1x1 = 0, $p1y = 0, $p1y2 = 0, $p1z = 0, $p1z3 = 0, $p2 = 0, $p211 = 0, $p2x = 0, $p2x4 = 0, $p2y = 0, $p2y5 = 0, $p2z = 0, $p2z6 = 0, $p3 = 0, $p312 = 0, $p3x = 0, $p3x7 = 0, $p3y = 0, $p3y8 = 0, $p3z = 0, $p3z9 = 0, $vararg_buffer15 = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 336 | 0;
 $vararg_buffer15 = sp + 288 | 0;
 $0 = sp + 324 | 0;
 $ntris = sp + 328 | 0;
 $p1x = sp + 280 | 0;
 $p1y = sp + 272 | 0;
 $p1z = sp + 264 | 0;
 $p2x = sp + 256 | 0;
 $p2y = sp + 248 | 0;
 $p2z = sp + 240 | 0;
 $p3x = sp + 232 | 0;
 $p3y = sp + 224 | 0;
 $p3z = sp + 216 | 0;
 $p1 = sp + 192 | 0;
 $p2 = sp + 168 | 0;
 $p3 = sp + 40 | 0;
 $p1x1 = sp;
 $p1y2 = sp + 8 | 0;
 $p1z3 = sp + 16 | 0;
 $p2x4 = sp + 24 | 0;
 $p2y5 = sp + 32 | 0;
 $p2z6 = sp + 64 | 0;
 $p3x7 = sp + 72 | 0;
 $p3y8 = sp + 80 | 0;
 $p3z9 = sp + 88 | 0;
 $p110 = sp + 96 | 0;
 $p211 = sp + 120 | 0;
 $p312 = sp + 144 | 0;
 HEAP32[$0 >> 2] = $argc;
 _glutInit($0 | 0, $argv | 0);
 _glutInitDisplayMode(146);
 _glutInitWindowSize(512, 512);
 _glutCreateWindow(192) | 0;
 _glDepthFunc(515);
 _glEnable(2929);
 _glClearColor(0.0, 0.0, 0.0, 0.0);
 _glEnable(2884);
 _glCullFace(1029);
 _glEnable(2977);
 _glMatrixMode(5889);
 _glLoadIdentity();
 _glFrustum(-.004, .004, -.004, .004, .01, 100.0);
 _glMatrixMode(5888);
 _glutDisplayFunc(1);
 _glutIdleFunc(2);
 _glutMouseFunc(1);
 _glutMotionFunc(1);
 _glutKeyboardFunc(1);
 $1 = __Znwj(12) | 0;
 __ZN5ModelC2EPc($1, 216);
 HEAP32[18] = $1;
 $2 = _fopen(216, 232) | 0;
 if (($2 | 0) == 0) {
  _fwrite(240, 25, 1, HEAP32[_stderr >> 2] | 0) | 0;
  _exit(-1);
 }
 HEAP32[$vararg_buffer15 >> 2] = $ntris;
 _fscanf($2 | 0, 272, $vararg_buffer15 | 0) | 0;
 __ZN9PQP_Model10BeginModelEi(8, 8) | 0;
 if ((HEAP32[$ntris >> 2] | 0) > 0) {
  $7 = $p1 + 8 | 0;
  $8 = $p1 + 16 | 0;
  $9 = $p2 + 8 | 0;
  $10 = $p2 + 16 | 0;
  $11 = $p3 + 8 | 0;
  $12 = $p3 + 16 | 0;
  $i$03 = 0;
  do {
   HEAP32[$vararg_buffer15 >> 2] = $p1x;
   HEAP32[$vararg_buffer15 + 4 >> 2] = $p1y;
   HEAP32[$vararg_buffer15 + 8 >> 2] = $p1z;
   HEAP32[$vararg_buffer15 + 12 >> 2] = $p2x;
   HEAP32[$vararg_buffer15 + 16 >> 2] = $p2y;
   HEAP32[$vararg_buffer15 + 20 >> 2] = $p2z;
   HEAP32[$vararg_buffer15 + 24 >> 2] = $p3x;
   HEAP32[$vararg_buffer15 + 28 >> 2] = $p3y;
   HEAP32[$vararg_buffer15 + 32 >> 2] = $p3z;
   _fscanf($2 | 0, 280, $vararg_buffer15 | 0) | 0;
   HEAPF64[$p1 >> 3] = +HEAPF64[$p1x >> 3];
   HEAPF64[$7 >> 3] = +HEAPF64[$p1y >> 3];
   HEAPF64[$8 >> 3] = +HEAPF64[$p1z >> 3];
   HEAPF64[$p2 >> 3] = +HEAPF64[$p2x >> 3];
   HEAPF64[$9 >> 3] = +HEAPF64[$p2y >> 3];
   HEAPF64[$10 >> 3] = +HEAPF64[$p2z >> 3];
   HEAPF64[$p3 >> 3] = +HEAPF64[$p3x >> 3];
   HEAPF64[$11 >> 3] = +HEAPF64[$p3y >> 3];
   HEAPF64[$12 >> 3] = +HEAPF64[$p3z >> 3];
   __ZN9PQP_Model6AddTriEPKdS1_S1_i(8, $p1, $p2, $p3, $i$03) | 0;
   $i$03 = $i$03 + 1 | 0;
  } while (($i$03 | 0) < (HEAP32[$ntris >> 2] | 0));
 }
 __ZN9PQP_Model8EndModelEv(8) | 0;
 _fclose($2 | 0) | 0;
 $25 = __Znwj(12) | 0;
 __ZN5ModelC2EPc($25, 320);
 HEAP32[20] = $25;
 $26 = _fopen(320, 232) | 0;
 if (($26 | 0) == 0) {
  _fwrite(336, 25, 1, HEAP32[_stderr >> 2] | 0) | 0;
  _exit(-1);
 }
 HEAP32[$vararg_buffer15 >> 2] = $ntris;
 _fscanf($26 | 0, 272, $vararg_buffer15 | 0) | 0;
 __ZN9PQP_Model10BeginModelEi(40, 8) | 0;
 if ((HEAP32[$ntris >> 2] | 0) <= 0) {
  __ZN9PQP_Model8EndModelEv(40) | 0;
  _fclose($26 | 0) | 0;
  _puts(368) | 0;
  _glutMainLoop();
  STACKTOP = sp;
  return 0;
 }
 $31 = $p110 + 8 | 0;
 $32 = $p110 + 16 | 0;
 $33 = $p211 + 8 | 0;
 $34 = $p211 + 16 | 0;
 $35 = $p312 + 8 | 0;
 $36 = $p312 + 16 | 0;
 $i$12 = 0;
 do {
  HEAP32[$vararg_buffer15 >> 2] = $p1x1;
  HEAP32[$vararg_buffer15 + 4 >> 2] = $p1y2;
  HEAP32[$vararg_buffer15 + 8 >> 2] = $p1z3;
  HEAP32[$vararg_buffer15 + 12 >> 2] = $p2x4;
  HEAP32[$vararg_buffer15 + 16 >> 2] = $p2y5;
  HEAP32[$vararg_buffer15 + 20 >> 2] = $p2z6;
  HEAP32[$vararg_buffer15 + 24 >> 2] = $p3x7;
  HEAP32[$vararg_buffer15 + 28 >> 2] = $p3y8;
  HEAP32[$vararg_buffer15 + 32 >> 2] = $p3z9;
  _fscanf($26 | 0, 280, $vararg_buffer15 | 0) | 0;
  HEAPF64[$p110 >> 3] = +HEAPF64[$p1x1 >> 3];
  HEAPF64[$31 >> 3] = +HEAPF64[$p1y2 >> 3];
  HEAPF64[$32 >> 3] = +HEAPF64[$p1z3 >> 3];
  HEAPF64[$p211 >> 3] = +HEAPF64[$p2x4 >> 3];
  HEAPF64[$33 >> 3] = +HEAPF64[$p2y5 >> 3];
  HEAPF64[$34 >> 3] = +HEAPF64[$p2z6 >> 3];
  HEAPF64[$p312 >> 3] = +HEAPF64[$p3x7 >> 3];
  HEAPF64[$35 >> 3] = +HEAPF64[$p3y8 >> 3];
  HEAPF64[$36 >> 3] = +HEAPF64[$p3z9 >> 3];
  __ZN9PQP_Model6AddTriEPKdS1_S1_i(40, $p110, $p211, $p312, $i$12) | 0;
  $i$12 = $i$12 + 1 | 0;
 } while (($i$12 | 0) < (HEAP32[$ntris >> 2] | 0));
 __ZN9PQP_Model8EndModelEv(40) | 0;
 _fclose($26 | 0) | 0;
 _puts(368) | 0;
 _glutMainLoop();
 STACKTOP = sp;
 return 0;
}
function __Z23get_covariance_trivertsPA3_dP3Trii($M, $tris, $num_tris) {
 $M = $M | 0;
 $tris = $tris | 0;
 $num_tris = $num_tris | 0;
 var $11 = 0.0, $13 = 0.0, $16 = 0.0, $18 = 0.0, $20 = 0.0, $22 = 0.0, $25 = 0.0, $27 = 0.0, $33 = 0.0, $39 = 0.0, $4 = 0.0, $45 = 0.0, $5 = 0.0, $51 = 0.0, $57 = 0.0, $63 = 0.0, $64 = 0, $66 = 0.0, $7 = 0.0, $80 = 0.0, $84 = 0.0, $88 = 0.0, $9 = 0.0, $S1$sroa$0$0$lcssa = 0.0, $S1$sroa$0$07 = 0.0, $S1$sroa$1$0$lcssa = 0.0, $S1$sroa$1$08 = 0.0, $S1$sroa$2$0$lcssa = 0.0, $S1$sroa$2$09 = 0.0, $S2$sroa$0$0$lcssa = 0.0, $S2$sroa$0$06 = 0.0, $S2$sroa$1$0$lcssa = 0.0, $S2$sroa$1$05 = 0.0, $S2$sroa$2$0$lcssa = 0.0, $S2$sroa$2$04 = 0.0, $S2$sroa$4$0$lcssa = 0.0, $S2$sroa$4$02 = 0.0, $S2$sroa$5$0$lcssa = 0.0, $S2$sroa$5$01 = 0.0, $S2$sroa$8$0$lcssa = 0.0, $S2$sroa$8$03 = 0.0, $i$010 = 0, sp = 0;
 sp = STACKTOP;
 if (($num_tris | 0) > 0) {
  $S1$sroa$0$07 = 0.0;
  $S1$sroa$1$08 = 0.0;
  $S1$sroa$2$09 = 0.0;
  $S2$sroa$0$06 = 0.0;
  $S2$sroa$1$05 = 0.0;
  $S2$sroa$2$04 = 0.0;
  $S2$sroa$4$02 = 0.0;
  $S2$sroa$5$01 = 0.0;
  $S2$sroa$8$03 = 0.0;
  $i$010 = 0;
  while (1) {
   $4 = +HEAPF64[$tris + ($i$010 * 80 | 0) >> 3];
   $5 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 24 >> 3];
   $7 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 48 >> 3];
   $9 = $S1$sroa$0$07 + ($4 + $5 + $7);
   $11 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 8 >> 3];
   $13 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 32 >> 3];
   $16 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 56 >> 3];
   $18 = $S1$sroa$1$08 + ($11 + $13 + $16);
   $20 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 16 >> 3];
   $22 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 40 >> 3];
   $25 = +HEAPF64[$tris + ($i$010 * 80 | 0) + 64 >> 3];
   $27 = $S1$sroa$2$09 + ($20 + $22 + $25);
   $33 = $S2$sroa$0$06 + ($4 * $4 + $5 * $5 + $7 * $7);
   $39 = $S2$sroa$4$02 + ($11 * $11 + $13 * $13 + $16 * $16);
   $45 = $S2$sroa$8$03 + ($20 * $20 + $22 * $22 + $25 * $25);
   $51 = $S2$sroa$1$05 + ($4 * $11 + $5 * $13 + $7 * $16);
   $57 = $S2$sroa$2$04 + ($4 * $20 + $5 * $22 + $7 * $25);
   $63 = $S2$sroa$5$01 + ($11 * $20 + $13 * $22 + $16 * $25);
   $64 = $i$010 + 1 | 0;
   if (($64 | 0) == ($num_tris | 0)) {
    $S1$sroa$0$0$lcssa = $9;
    $S1$sroa$1$0$lcssa = $18;
    $S1$sroa$2$0$lcssa = $27;
    $S2$sroa$0$0$lcssa = $33;
    $S2$sroa$1$0$lcssa = $51;
    $S2$sroa$2$0$lcssa = $57;
    $S2$sroa$4$0$lcssa = $39;
    $S2$sroa$5$0$lcssa = $63;
    $S2$sroa$8$0$lcssa = $45;
    break;
   } else {
    $S1$sroa$0$07 = $9;
    $S1$sroa$1$08 = $18;
    $S1$sroa$2$09 = $27;
    $S2$sroa$0$06 = $33;
    $S2$sroa$1$05 = $51;
    $S2$sroa$2$04 = $57;
    $S2$sroa$4$02 = $39;
    $S2$sroa$5$01 = $63;
    $S2$sroa$8$03 = $45;
    $i$010 = $64;
   }
  }
 } else {
  $S1$sroa$0$0$lcssa = 0.0;
  $S1$sroa$1$0$lcssa = 0.0;
  $S1$sroa$2$0$lcssa = 0.0;
  $S2$sroa$0$0$lcssa = 0.0;
  $S2$sroa$1$0$lcssa = 0.0;
  $S2$sroa$2$0$lcssa = 0.0;
  $S2$sroa$4$0$lcssa = 0.0;
  $S2$sroa$5$0$lcssa = 0.0;
  $S2$sroa$8$0$lcssa = 0.0;
 }
 $66 = +($num_tris * 3 | 0);
 HEAPF64[$M >> 3] = $S2$sroa$0$0$lcssa - $S1$sroa$0$0$lcssa * $S1$sroa$0$0$lcssa / $66;
 HEAPF64[$M + 32 >> 3] = $S2$sroa$4$0$lcssa - $S1$sroa$1$0$lcssa * $S1$sroa$1$0$lcssa / $66;
 HEAPF64[$M + 64 >> 3] = $S2$sroa$8$0$lcssa - $S1$sroa$2$0$lcssa * $S1$sroa$2$0$lcssa / $66;
 $80 = $S2$sroa$1$0$lcssa - $S1$sroa$0$0$lcssa * $S1$sroa$1$0$lcssa / $66;
 HEAPF64[$M + 8 >> 3] = $80;
 $84 = $S2$sroa$5$0$lcssa - $S1$sroa$1$0$lcssa * $S1$sroa$2$0$lcssa / $66;
 HEAPF64[$M + 40 >> 3] = $84;
 $88 = $S2$sroa$2$0$lcssa - $S1$sroa$0$0$lcssa * $S1$sroa$2$0$lcssa / $66;
 HEAPF64[$M + 16 >> 3] = $88;
 HEAPF64[$M + 24 >> 3] = $80;
 HEAPF64[$M + 48 >> 3] = $88;
 HEAPF64[$M + 56 >> 3] = $84;
 STACKTOP = sp;
 return;
}
function __Z20make_parent_relativeP9PQP_ModeliPA3_KdPS1_S4_($m, $bn, $parentR, $parentTr, $parentTo) {
 $m = $m | 0;
 $bn = $bn | 0;
 $parentR = $parentR | 0;
 $parentTr = $parentTr | 0;
 $parentTo = $parentTo | 0;
 var $0 = 0, $1 = 0, $103 = 0.0, $16 = 0, $17 = 0, $3 = 0, $44 = 0, $47 = 0.0, $48 = 0, $52 = 0.0, $53 = 0, $57 = 0.0, $60 = 0, $64 = 0, $68 = 0, $71 = 0, $75 = 0, $79 = 0, $8 = 0, $82 = 0, $86 = 0, $90 = 0, $93 = 0.0, $94 = 0, $98 = 0.0, $99 = 0, $Rpc = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 80 | 0;
 $Rpc = sp;
 $0 = $m + 16 | 0;
 $1 = HEAP32[$0 >> 2] | 0;
 $3 = HEAP32[$1 + ($bn * 176 | 0) + 168 >> 2] | 0;
 if (($3 | 0) > -1) {
  __Z20make_parent_relativeP9PQP_ModeliPA3_KdPS1_S4_($m, $3, $1 + ($bn * 176 | 0) | 0, $1 + ($bn * 176 | 0) + 72 | 0, $1 + ($bn * 176 | 0) + 120 | 0);
  $8 = HEAP32[$0 >> 2] | 0;
  __Z20make_parent_relativeP9PQP_ModeliPA3_KdPS1_S4_($m, (HEAP32[$8 + ($bn * 176 | 0) + 168 >> 2] | 0) + 1 | 0, $8 + ($bn * 176 | 0) | 0, $8 + ($bn * 176 | 0) + 72 | 0, $8 + ($bn * 176 | 0) + 120 | 0);
  $16 = HEAP32[$0 >> 2] | 0;
 } else {
  $16 = $1;
 }
 __Z4MTxMPA3_dPA3_KdS3_($Rpc, $parentR, $16 + ($bn * 176 | 0) | 0);
 $17 = HEAP32[$0 >> 2] | 0;
 HEAPF64[$17 + ($bn * 176 | 0) >> 3] = +HEAPF64[$Rpc >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 8 >> 3] = +HEAPF64[$Rpc + 8 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 16 >> 3] = +HEAPF64[$Rpc + 16 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 24 >> 3] = +HEAPF64[$Rpc + 24 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 32 >> 3] = +HEAPF64[$Rpc + 32 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 40 >> 3] = +HEAPF64[$Rpc + 40 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 48 >> 3] = +HEAPF64[$Rpc + 48 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 56 >> 3] = +HEAPF64[$Rpc + 56 >> 3];
 HEAPF64[$17 + ($bn * 176 | 0) + 64 >> 3] = +HEAPF64[$Rpc + 64 >> 3];
 $44 = $17 + ($bn * 176 | 0) + 72 | 0;
 $47 = +HEAPF64[$44 >> 3] - +HEAPF64[$parentTr >> 3];
 $48 = $17 + ($bn * 176 | 0) + 80 | 0;
 $52 = +HEAPF64[$48 >> 3] - +HEAPF64[$parentTr + 8 >> 3];
 $53 = $17 + ($bn * 176 | 0) + 88 | 0;
 $57 = +HEAPF64[$53 >> 3] - +HEAPF64[$parentTr + 16 >> 3];
 $60 = $parentR + 24 | 0;
 $64 = $parentR + 48 | 0;
 HEAPF64[$44 >> 3] = $47 * +HEAPF64[$parentR >> 3] + $52 * +HEAPF64[$60 >> 3] + $57 * +HEAPF64[$64 >> 3];
 $68 = $parentR + 8 | 0;
 $71 = $parentR + 32 | 0;
 $75 = $parentR + 56 | 0;
 HEAPF64[$48 >> 3] = $47 * +HEAPF64[$68 >> 3] + $52 * +HEAPF64[$71 >> 3] + $57 * +HEAPF64[$75 >> 3];
 $79 = $parentR + 16 | 0;
 $82 = $parentR + 40 | 0;
 $86 = $parentR + 64 | 0;
 HEAPF64[$53 >> 3] = $47 * +HEAPF64[$79 >> 3] + $52 * +HEAPF64[$82 >> 3] + $57 * +HEAPF64[$86 >> 3];
 $90 = $17 + ($bn * 176 | 0) + 120 | 0;
 $93 = +HEAPF64[$90 >> 3] - +HEAPF64[$parentTo >> 3];
 $94 = $17 + ($bn * 176 | 0) + 128 | 0;
 $98 = +HEAPF64[$94 >> 3] - +HEAPF64[$parentTo + 8 >> 3];
 $99 = $17 + ($bn * 176 | 0) + 136 | 0;
 $103 = +HEAPF64[$99 >> 3] - +HEAPF64[$parentTo + 16 >> 3];
 HEAPF64[$90 >> 3] = $93 * +HEAPF64[$parentR >> 3] + $98 * +HEAPF64[$60 >> 3] + $103 * +HEAPF64[$64 >> 3];
 HEAPF64[$94 >> 3] = $93 * +HEAPF64[$68 >> 3] + $98 * +HEAPF64[$71 >> 3] + $103 * +HEAPF64[$75 >> 3];
 HEAPF64[$99 >> 3] = $93 * +HEAPF64[$79 >> 3] + $98 * +HEAPF64[$82 >> 3] + $103 * +HEAPF64[$86 >> 3];
 STACKTOP = sp;
 return;
}
function __ZN5ModelC2EPc($this, $tris_file) {
 $this = $this | 0;
 $tris_file = $tris_file | 0;
 var $0 = 0, $2 = 0, $22 = 0.0, $23 = 0.0, $27 = 0.0, $28 = 0.0, $3 = 0, $32 = 0.0, $33 = 0.0, $36 = 0.0, $39 = 0.0, $42 = 0.0, $46 = 0.0, $49 = 0.0, $5 = 0, $53 = 0.0, $6 = 0, $63 = 0.0, $9 = 0, $i$01 = 0, $vararg_buffer5 = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48 | 0;
 $vararg_buffer5 = sp;
 $0 = _fopen($tris_file | 0, 600) | 0;
 if (($0 | 0) == 0) {
  $2 = HEAP32[_stderr >> 2] | 0;
  HEAP32[$vararg_buffer5 >> 2] = $tris_file;
  _fprintf($2 | 0, 608, $vararg_buffer5 | 0) | 0;
  _exit(-1);
 }
 HEAP32[$vararg_buffer5 >> 2] = $this;
 _fscanf($0 | 0, 648, $vararg_buffer5 | 0) | 0;
 $3 = HEAP32[$this >> 2] | 0;
 $5 = __Znaj($3 >>> 0 > 89478485 ? -1 : $3 * 48 | 0) | 0;
 $6 = $this + 4 | 0;
 HEAP32[$6 >> 2] = $5;
 if (($3 | 0) > 0) {
  $9 = $5;
  $i$01 = 0;
 } else {
  _fclose($0 | 0) | 0;
  STACKTOP = sp;
  return;
 }
 do {
  HEAP32[$vararg_buffer5 >> 2] = $9 + ($i$01 * 48 | 0);
  HEAP32[$vararg_buffer5 + 4 >> 2] = $9 + ($i$01 * 48 | 0) + 4;
  HEAP32[$vararg_buffer5 + 8 >> 2] = $9 + ($i$01 * 48 | 0) + 8;
  HEAP32[$vararg_buffer5 + 12 >> 2] = $9 + ($i$01 * 48 | 0) + 12;
  HEAP32[$vararg_buffer5 + 16 >> 2] = $9 + ($i$01 * 48 | 0) + 16;
  HEAP32[$vararg_buffer5 + 20 >> 2] = $9 + ($i$01 * 48 | 0) + 20;
  HEAP32[$vararg_buffer5 + 24 >> 2] = $9 + ($i$01 * 48 | 0) + 24;
  HEAP32[$vararg_buffer5 + 28 >> 2] = $9 + ($i$01 * 48 | 0) + 28;
  HEAP32[$vararg_buffer5 + 32 >> 2] = $9 + ($i$01 * 48 | 0) + 32;
  _fscanf($0 | 0, 656, $vararg_buffer5 | 0) | 0;
  $9 = HEAP32[$6 >> 2] | 0;
  $22 = +HEAPF32[$9 + ($i$01 * 48 | 0) >> 2];
  $23 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 12 >> 2] - $22;
  $27 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 4 >> 2];
  $28 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 16 >> 2] - $27;
  $32 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 8 >> 2];
  $33 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 20 >> 2] - $32;
  $36 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 24 >> 2] - $22;
  $39 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 28 >> 2] - $27;
  $42 = +HEAPF32[$9 + ($i$01 * 48 | 0) + 32 >> 2] - $32;
  $46 = $28 * $42 - $33 * $39;
  $49 = $33 * $36 - $23 * $42;
  $53 = $23 * $39 - $28 * $36;
  $63 = 1.0 / +Math_sqrt(+($46 * $46 + $49 * $49 + $53 * $53));
  HEAPF32[$9 + ($i$01 * 48 | 0) + 36 >> 2] = $46 * $63;
  HEAPF32[$9 + ($i$01 * 48 | 0) + 40 >> 2] = $49 * $63;
  HEAPF32[$9 + ($i$01 * 48 | 0) + 44 >> 2] = $53 * $63;
  $i$01 = $i$01 + 1 | 0;
 } while (($i$01 | 0) < (HEAP32[$this >> 2] | 0));
 _fclose($0 | 0) | 0;
 STACKTOP = sp;
 return;
}
function __Z11TriDistancePA3_dPdP3TriS3_S1_S1_($R, $T, $t1, $t2, $p, $q) {
 $R = $R | 0;
 $T = $T | 0;
 $t1 = $t1 | 0;
 $t2 = $t2 | 0;
 $p = $p | 0;
 $q = $q | 0;
 var $101 = 0.0, $104 = 0.0, $108 = 0.0, $126 = 0.0, $25 = 0.0, $26 = 0.0, $29 = 0.0, $31 = 0.0, $35 = 0.0, $37 = 0.0, $40 = 0.0, $43 = 0.0, $46 = 0.0, $50 = 0.0, $54 = 0.0, $58 = 0.0, $61 = 0.0, $65 = 0.0, $69 = 0.0, $74 = 0.0, $77 = 0.0, $81 = 0.0, $tri1 = 0, $tri2 = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 144 | 0;
 $tri1 = sp + 72 | 0;
 $tri2 = sp;
 HEAPF64[$tri1 >> 3] = +HEAPF64[$t1 >> 3];
 HEAPF64[$tri1 + 8 >> 3] = +HEAPF64[$t1 + 8 >> 3];
 HEAPF64[$tri1 + 16 >> 3] = +HEAPF64[$t1 + 16 >> 3];
 HEAPF64[$tri1 + 24 >> 3] = +HEAPF64[$t1 + 24 >> 3];
 HEAPF64[$tri1 + 32 >> 3] = +HEAPF64[$t1 + 32 >> 3];
 HEAPF64[$tri1 + 40 >> 3] = +HEAPF64[$t1 + 40 >> 3];
 HEAPF64[$tri1 + 48 >> 3] = +HEAPF64[$t1 + 48 >> 3];
 HEAPF64[$tri1 + 56 >> 3] = +HEAPF64[$t1 + 56 >> 3];
 HEAPF64[$tri1 + 64 >> 3] = +HEAPF64[$t1 + 64 >> 3];
 $25 = +HEAPF64[$R >> 3];
 $26 = +HEAPF64[$t2 >> 3];
 $29 = +HEAPF64[$R + 8 >> 3];
 $31 = +HEAPF64[$t2 + 8 >> 3];
 $35 = +HEAPF64[$R + 16 >> 3];
 $37 = +HEAPF64[$t2 + 16 >> 3];
 $40 = +HEAPF64[$T >> 3];
 HEAPF64[$tri2 >> 3] = $40 + ($25 * $26 + $29 * $31 + $35 * $37);
 $43 = +HEAPF64[$R + 24 >> 3];
 $46 = +HEAPF64[$R + 32 >> 3];
 $50 = +HEAPF64[$R + 40 >> 3];
 $54 = +HEAPF64[$T + 8 >> 3];
 HEAPF64[$tri2 + 8 >> 3] = $54 + ($43 * $26 + $46 * $31 + $50 * $37);
 $58 = +HEAPF64[$R + 48 >> 3];
 $61 = +HEAPF64[$R + 56 >> 3];
 $65 = +HEAPF64[$R + 64 >> 3];
 $69 = +HEAPF64[$T + 16 >> 3];
 HEAPF64[$tri2 + 16 >> 3] = $69 + ($58 * $26 + $61 * $31 + $65 * $37);
 $74 = +HEAPF64[$t2 + 24 >> 3];
 $77 = +HEAPF64[$t2 + 32 >> 3];
 $81 = +HEAPF64[$t2 + 40 >> 3];
 HEAPF64[$tri2 + 24 >> 3] = $40 + ($25 * $74 + $29 * $77 + $35 * $81);
 HEAPF64[$tri2 + 32 >> 3] = $54 + ($43 * $74 + $46 * $77 + $50 * $81);
 HEAPF64[$tri2 + 40 >> 3] = $69 + ($58 * $74 + $61 * $77 + $65 * $81);
 $101 = +HEAPF64[$t2 + 48 >> 3];
 $104 = +HEAPF64[$t2 + 56 >> 3];
 $108 = +HEAPF64[$t2 + 64 >> 3];
 HEAPF64[$tri2 + 48 >> 3] = $40 + ($25 * $101 + $29 * $104 + $35 * $108);
 HEAPF64[$tri2 + 56 >> 3] = $54 + ($43 * $101 + $46 * $104 + $50 * $108);
 HEAPF64[$tri2 + 64 >> 3] = $69 + ($58 * $101 + $61 * $104 + $65 * $108);
 $126 = +__Z7TriDistPdS_PA3_KdS2_($p, $q, $tri1, $tri2);
 STACKTOP = sp;
 return +$126;
}
function __ZN9PQP_Model6AddTriEPKdS1_S1_i($this, $p1, $p2, $p3, $id) {
 $this = $this | 0;
 $p1 = $p1 | 0;
 $p2 = $p2 | 0;
 $p3 = $p3 | 0;
 $id = $id | 0;
 var $$0 = 0, $$pre = 0, $0 = 0, $12 = 0, $13 = 0, $17 = 0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $7 = 0, $9 = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[$this >> 2] | 0;
 if (($0 | 0) == 2) {
  _fwrite(888, 169, 1, HEAP32[_stderr >> 2] | 0) | 0;
  $$0 = -4;
  STACKTOP = sp;
  return $$0 | 0;
 } else if (($0 | 0) == 0) {
  __ZN9PQP_Model10BeginModelEi($this, 8) | 0;
 }
 $2 = $this + 8 | 0;
 $3 = HEAP32[$2 >> 2] | 0;
 $4 = $this + 12 | 0;
 $5 = HEAP32[$4 >> 2] | 0;
 if (($3 | 0) < ($5 | 0)) {
  $20 = HEAP32[$this + 4 >> 2] | 0;
  $21 = $3;
 } else {
  $7 = $5 << 1;
  $9 = __Znaj($7 >>> 0 > 53687091 ? -1 : $7 * 80 | 0) | 0;
  if (($9 | 0) == 0) {
   _fwrite(1064, 58, 1, HEAP32[_stderr >> 2] | 0) | 0;
   $$0 = -1;
   STACKTOP = sp;
   return $$0 | 0;
  }
  $12 = $this + 4 | 0;
  $13 = HEAP32[$12 >> 2] | 0;
  _memcpy($9 | 0, $13 | 0, $3 * 80 | 0) | 0;
  if (($13 | 0) == 0) {
   $$pre = $3;
   $17 = $5;
  } else {
   __ZdaPv($13);
   $$pre = HEAP32[$2 >> 2] | 0;
   $17 = HEAP32[$4 >> 2] | 0;
  }
  HEAP32[$12 >> 2] = $9;
  HEAP32[$4 >> 2] = $17 << 1;
  $20 = $9;
  $21 = $$pre;
 }
 HEAPF64[$20 + ($21 * 80 | 0) >> 3] = +HEAPF64[$p1 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 8 >> 3] = +HEAPF64[$p1 + 8 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 16 >> 3] = +HEAPF64[$p1 + 16 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 24 >> 3] = +HEAPF64[$p2 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 32 >> 3] = +HEAPF64[$p2 + 8 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 40 >> 3] = +HEAPF64[$p2 + 16 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 48 >> 3] = +HEAPF64[$p3 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 56 >> 3] = +HEAPF64[$p3 + 8 >> 3];
 HEAPF64[$20 + ($21 * 80 | 0) + 64 >> 3] = +HEAPF64[$p3 + 16 >> 3];
 HEAP32[$20 + ($21 * 80 | 0) + 72 >> 2] = $id;
 HEAP32[$2 >> 2] = (HEAP32[$2 >> 2] | 0) + 1;
 $$0 = 0;
 STACKTOP = sp;
 return $$0 | 0;
}
function __Z4MTxMPA3_dPA3_KdS3_($Mr, $M1, $M2) {
 $Mr = $Mr | 0;
 $M1 = $M1 | 0;
 $M2 = $M2 | 0;
 var $11 = 0, $15 = 0, $19 = 0, $24 = 0, $3 = 0, $30 = 0, $34 = 0, $39 = 0, $46 = 0, $5 = 0, $50 = 0, $55 = 0, $85 = 0, $89 = 0, $9 = 0, $94 = 0;
 $3 = $M1 + 24 | 0;
 $5 = $M2 + 24 | 0;
 $9 = $M1 + 48 | 0;
 $11 = $M2 + 48 | 0;
 HEAPF64[$Mr >> 3] = +HEAPF64[$M1 >> 3] * +HEAPF64[$M2 >> 3] + +HEAPF64[$3 >> 3] * +HEAPF64[$5 >> 3] + +HEAPF64[$9 >> 3] * +HEAPF64[$11 >> 3];
 $15 = $M1 + 8 | 0;
 $19 = $M1 + 32 | 0;
 $24 = $M1 + 56 | 0;
 HEAPF64[$Mr + 24 >> 3] = +HEAPF64[$15 >> 3] * +HEAPF64[$M2 >> 3] + +HEAPF64[$19 >> 3] * +HEAPF64[$5 >> 3] + +HEAPF64[$24 >> 3] * +HEAPF64[$11 >> 3];
 $30 = $M1 + 16 | 0;
 $34 = $M1 + 40 | 0;
 $39 = $M1 + 64 | 0;
 HEAPF64[$Mr + 48 >> 3] = +HEAPF64[$30 >> 3] * +HEAPF64[$M2 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$5 >> 3] + +HEAPF64[$39 >> 3] * +HEAPF64[$11 >> 3];
 $46 = $M2 + 8 | 0;
 $50 = $M2 + 32 | 0;
 $55 = $M2 + 56 | 0;
 HEAPF64[$Mr + 8 >> 3] = +HEAPF64[$M1 >> 3] * +HEAPF64[$46 >> 3] + +HEAPF64[$3 >> 3] * +HEAPF64[$50 >> 3] + +HEAPF64[$9 >> 3] * +HEAPF64[$55 >> 3];
 HEAPF64[$Mr + 32 >> 3] = +HEAPF64[$15 >> 3] * +HEAPF64[$46 >> 3] + +HEAPF64[$19 >> 3] * +HEAPF64[$50 >> 3] + +HEAPF64[$24 >> 3] * +HEAPF64[$55 >> 3];
 HEAPF64[$Mr + 56 >> 3] = +HEAPF64[$30 >> 3] * +HEAPF64[$46 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$50 >> 3] + +HEAPF64[$39 >> 3] * +HEAPF64[$55 >> 3];
 $85 = $M2 + 16 | 0;
 $89 = $M2 + 40 | 0;
 $94 = $M2 + 64 | 0;
 HEAPF64[$Mr + 16 >> 3] = +HEAPF64[$M1 >> 3] * +HEAPF64[$85 >> 3] + +HEAPF64[$3 >> 3] * +HEAPF64[$89 >> 3] + +HEAPF64[$9 >> 3] * +HEAPF64[$94 >> 3];
 HEAPF64[$Mr + 40 >> 3] = +HEAPF64[$15 >> 3] * +HEAPF64[$85 >> 3] + +HEAPF64[$19 >> 3] * +HEAPF64[$89 >> 3] + +HEAPF64[$24 >> 3] * +HEAPF64[$94 >> 3];
 HEAPF64[$Mr + 64 >> 3] = +HEAPF64[$30 >> 3] * +HEAPF64[$85 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$89 >> 3] + +HEAPF64[$39 >> 3] * +HEAPF64[$94 >> 3];
 return;
}
function __Z3MxMPA3_dPA3_KdS3_($Mr, $M1, $M2) {
 $Mr = $Mr | 0;
 $M1 = $M1 | 0;
 $M2 = $M2 | 0;
 var $11 = 0, $15 = 0, $19 = 0, $24 = 0, $3 = 0, $30 = 0, $34 = 0, $39 = 0, $46 = 0, $5 = 0, $50 = 0, $55 = 0, $85 = 0, $89 = 0, $9 = 0, $94 = 0;
 $3 = $M1 + 8 | 0;
 $5 = $M2 + 24 | 0;
 $9 = $M1 + 16 | 0;
 $11 = $M2 + 48 | 0;
 HEAPF64[$Mr >> 3] = +HEAPF64[$M1 >> 3] * +HEAPF64[$M2 >> 3] + +HEAPF64[$3 >> 3] * +HEAPF64[$5 >> 3] + +HEAPF64[$9 >> 3] * +HEAPF64[$11 >> 3];
 $15 = $M1 + 24 | 0;
 $19 = $M1 + 32 | 0;
 $24 = $M1 + 40 | 0;
 HEAPF64[$Mr + 24 >> 3] = +HEAPF64[$15 >> 3] * +HEAPF64[$M2 >> 3] + +HEAPF64[$19 >> 3] * +HEAPF64[$5 >> 3] + +HEAPF64[$24 >> 3] * +HEAPF64[$11 >> 3];
 $30 = $M1 + 48 | 0;
 $34 = $M1 + 56 | 0;
 $39 = $M1 + 64 | 0;
 HEAPF64[$Mr + 48 >> 3] = +HEAPF64[$30 >> 3] * +HEAPF64[$M2 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$5 >> 3] + +HEAPF64[$39 >> 3] * +HEAPF64[$11 >> 3];
 $46 = $M2 + 8 | 0;
 $50 = $M2 + 32 | 0;
 $55 = $M2 + 56 | 0;
 HEAPF64[$Mr + 8 >> 3] = +HEAPF64[$M1 >> 3] * +HEAPF64[$46 >> 3] + +HEAPF64[$3 >> 3] * +HEAPF64[$50 >> 3] + +HEAPF64[$9 >> 3] * +HEAPF64[$55 >> 3];
 HEAPF64[$Mr + 32 >> 3] = +HEAPF64[$15 >> 3] * +HEAPF64[$46 >> 3] + +HEAPF64[$19 >> 3] * +HEAPF64[$50 >> 3] + +HEAPF64[$24 >> 3] * +HEAPF64[$55 >> 3];
 HEAPF64[$Mr + 56 >> 3] = +HEAPF64[$30 >> 3] * +HEAPF64[$46 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$50 >> 3] + +HEAPF64[$39 >> 3] * +HEAPF64[$55 >> 3];
 $85 = $M2 + 16 | 0;
 $89 = $M2 + 40 | 0;
 $94 = $M2 + 64 | 0;
 HEAPF64[$Mr + 16 >> 3] = +HEAPF64[$M1 >> 3] * +HEAPF64[$85 >> 3] + +HEAPF64[$3 >> 3] * +HEAPF64[$89 >> 3] + +HEAPF64[$9 >> 3] * +HEAPF64[$94 >> 3];
 HEAPF64[$Mr + 40 >> 3] = +HEAPF64[$15 >> 3] * +HEAPF64[$85 >> 3] + +HEAPF64[$19 >> 3] * +HEAPF64[$89 >> 3] + +HEAPF64[$24 >> 3] * +HEAPF64[$94 >> 3];
 HEAPF64[$Mr + 64 >> 3] = +HEAPF64[$30 >> 3] * +HEAPF64[$85 >> 3] + +HEAPF64[$34 >> 3] * +HEAPF64[$89 >> 3] + +HEAPF64[$39 >> 3] * +HEAPF64[$94 >> 3];
 return;
}
function __ZN9PQP_Model8EndModelEv($this) {
 $this = $this | 0;
 var $$0 = 0, $$arith = 0, $$arith2 = 0, $11 = 0, $14 = 0, $15 = 0, $17 = 0, $19 = 0, $20 = 0, $23 = 0, $25 = 0, $26 = 0, $27 = 0, $3 = 0, $4 = 0, $7 = 0, sp = 0;
 sp = STACKTOP;
 if ((HEAP32[$this >> 2] | 0) == 2) {
  _fwrite(1128, 173, 1, HEAP32[_stderr >> 2] | 0) | 0;
  $$0 = -4;
  STACKTOP = sp;
  return $$0 | 0;
 }
 $3 = $this + 8 | 0;
 $4 = HEAP32[$3 >> 2] | 0;
 if (($4 | 0) == 0) {
  _fwrite(1304, 56, 1, HEAP32[_stderr >> 2] | 0) | 0;
  $$0 = -5;
  STACKTOP = sp;
  return $$0 | 0;
 }
 $7 = $this + 12 | 0;
 if ((HEAP32[$7 >> 2] | 0) > ($4 | 0)) {
  $$arith2 = $4 * 80 | 0;
  $11 = __Znaj($4 >>> 0 > 53687091 ? -1 : $$arith2) | 0;
  if (($11 | 0) == 0) {
   _fwrite(1368, 60, 1, HEAP32[_stderr >> 2] | 0) | 0;
   $$0 = -1;
   STACKTOP = sp;
   return $$0 | 0;
  }
  $14 = $this + 4 | 0;
  $15 = HEAP32[$14 >> 2] | 0;
  _memcpy($11 | 0, $15 | 0, $$arith2 | 0) | 0;
  if (($15 | 0) == 0) {
   $17 = $4;
  } else {
   __ZdaPv($15);
   $17 = HEAP32[$3 >> 2] | 0;
  }
  HEAP32[$14 >> 2] = $11;
  HEAP32[$7 >> 2] = $17;
  $19 = $17;
 } else {
  $19 = $4;
 }
 $20 = ($19 << 1) + -1 | 0;
 $$arith = $20 * 176 | 0;
 $23 = __Znaj($20 >>> 0 > 24403223 | $$arith >>> 0 > 4294967287 ? -1 : $$arith + 8 | 0) | 0;
 HEAP32[$23 + 4 >> 2] = $20;
 $25 = $23 + 8 | 0;
 $26 = $25 + ($20 * 176 | 0) | 0;
 $27 = $25;
 do {
  __ZN2BVC2Ev($27);
  $27 = $27 + 176 | 0;
 } while (($27 | 0) != ($26 | 0));
 HEAP32[$this + 16 >> 2] = $25;
 HEAP32[$this + 24 >> 2] = (HEAP32[$3 >> 2] << 1) + -1;
 HEAP32[$this + 20 >> 2] = 0;
 __Z11build_modelP9PQP_Model($this) | 0;
 HEAP32[$this >> 2] = 2;
 HEAP32[$this + 28 >> 2] = HEAP32[$this + 4 >> 2];
 $$0 = 0;
 STACKTOP = sp;
 return $$0 | 0;
}
function __ZN9PQP_Model10BeginModelEi($this, $n) {
 $this = $this | 0;
 $n = $n | 0;
 var $$0 = 0, $$n = 0, $$pre$phi7Z2D = 0, $$pre$phiZ2D = 0, $11 = 0, $13 = 0, $14 = 0, $17 = 0, $22 = 0, $3 = 0, $5 = 0, $7 = 0, sp = 0;
 sp = STACKTOP;
 if ((HEAP32[$this >> 2] | 0) == 0) {
  $$pre$phi7Z2D = $this + 4 | 0;
  $$pre$phiZ2D = $this + 12 | 0;
 } else {
  $3 = HEAP32[$this + 16 >> 2] | 0;
  if (($3 | 0) != 0) {
   $5 = $3 + -8 | 0;
   $7 = HEAP32[$5 + 4 >> 2] | 0;
   if (($7 | 0) != 0) {
    $11 = $3 + ($7 * 176 | 0) | 0;
    do {
     $11 = $11 + -176 | 0;
     __ZN2BVD2Ev($11);
    } while (($11 | 0) != ($3 | 0));
   }
   __ZdaPv($5);
  }
  $13 = $this + 4 | 0;
  $14 = HEAP32[$13 >> 2] | 0;
  if (($14 | 0) != 0) {
   __ZdaPv($14);
  }
  HEAP32[$this + 24 >> 2] = 0;
  $17 = $this + 12 | 0;
  HEAP32[$17 >> 2] = 0;
  HEAP32[$this + 20 >> 2] = 0;
  HEAP32[$this + 8 >> 2] = 0;
  $$pre$phi7Z2D = $13;
  $$pre$phiZ2D = $17;
 }
 $$n = ($n | 0) < 1 ? 8 : $n;
 HEAP32[$$pre$phiZ2D >> 2] = $$n;
 $22 = __Znaj($$n >>> 0 > 53687091 ? -1 : $$n * 80 | 0) | 0;
 HEAP32[$$pre$phi7Z2D >> 2] = $22;
 if (($22 | 0) == 0) {
  _fwrite(688, 62, 1, HEAP32[_stderr >> 2] | 0) | 0;
  $$0 = -1;
  STACKTOP = sp;
  return $$0 | 0;
 }
 if ((HEAP32[$this >> 2] | 0) == 0) {
  HEAP32[$this >> 2] = 1;
  $$0 = 0;
  STACKTOP = sp;
  return $$0 | 0;
 } else {
  _fwrite(752, 135, 1, HEAP32[_stderr >> 2] | 0) | 0;
  HEAP32[$this >> 2] = 1;
  $$0 = -4;
  STACKTOP = sp;
  return $$0 | 0;
 }
 return 0;
}
function __Z11build_modelP9PQP_Model($m) {
 $m = $m | 0;
 var $5 = 0, $6 = 0, $R = 0, $T = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 96 | 0;
 $R = sp + 24 | 0;
 $T = sp;
 HEAP32[$m + 20 >> 2] = 1;
 __Z13build_recurseP9PQP_Modeliii($m, 0, 0, HEAP32[$m + 8 >> 2] | 0) | 0;
 HEAPF64[$R + 64 >> 3] = 1.0;
 HEAPF64[$R + 32 >> 3] = 1.0;
 HEAPF64[$R >> 3] = 1.0;
 $5 = $R + 40 | 0;
 $6 = $R + 8 | 0;
 HEAP32[$6 + 0 >> 2] = 0;
 HEAP32[$6 + 4 >> 2] = 0;
 HEAP32[$6 + 8 >> 2] = 0;
 HEAP32[$6 + 12 >> 2] = 0;
 HEAP32[$6 + 16 >> 2] = 0;
 HEAP32[$6 + 20 >> 2] = 0;
 HEAP32[$5 + 0 >> 2] = 0;
 HEAP32[$5 + 4 >> 2] = 0;
 HEAP32[$5 + 8 >> 2] = 0;
 HEAP32[$5 + 12 >> 2] = 0;
 HEAP32[$5 + 16 >> 2] = 0;
 HEAP32[$5 + 20 >> 2] = 0;
 HEAP32[$T + 0 >> 2] = 0;
 HEAP32[$T + 4 >> 2] = 0;
 HEAP32[$T + 8 >> 2] = 0;
 HEAP32[$T + 12 >> 2] = 0;
 HEAP32[$T + 16 >> 2] = 0;
 HEAP32[$T + 20 >> 2] = 0;
 __Z20make_parent_relativeP9PQP_ModeliPA3_KdPS1_S4_($m, 0, $R, $T, $T);
 STACKTOP = sp;
 return 0;
}
function _memcpy(dest, src, num) {
 dest = dest | 0;
 src = src | 0;
 num = num | 0;
 var ret = 0;
 if ((num | 0) >= 4096) return _emscripten_memcpy_big(dest | 0, src | 0, num | 0) | 0;
 ret = dest | 0;
 if ((dest & 3) == (src & 3)) {
  while (dest & 3) {
   if ((num | 0) == 0) return ret | 0;
   HEAP8[dest] = HEAP8[src] | 0;
   dest = dest + 1 | 0;
   src = src + 1 | 0;
   num = num - 1 | 0;
  }
  while ((num | 0) >= 4) {
   HEAP32[dest >> 2] = HEAP32[src >> 2];
   dest = dest + 4 | 0;
   src = src + 4 | 0;
   num = num - 4 | 0;
  }
 }
 while ((num | 0) > 0) {
  HEAP8[dest] = HEAP8[src] | 0;
  dest = dest + 1 | 0;
  src = src + 1 | 0;
  num = num - 1 | 0;
 }
 return ret | 0;
}
function _memset(ptr, value, num) {
 ptr = ptr | 0;
 value = value | 0;
 num = num | 0;
 var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
 stop = ptr + num | 0;
 if ((num | 0) >= 20) {
  value = value & 255;
  unaligned = ptr & 3;
  value4 = value | value << 8 | value << 16 | value << 24;
  stop4 = stop & ~3;
  if (unaligned) {
   unaligned = ptr + 4 - unaligned | 0;
   while ((ptr | 0) < (unaligned | 0)) {
    HEAP8[ptr] = value;
    ptr = ptr + 1 | 0;
   }
  }
  while ((ptr | 0) < (stop4 | 0)) {
   HEAP32[ptr >> 2] = value4;
   ptr = ptr + 4 | 0;
  }
 }
 while ((ptr | 0) < (stop | 0)) {
  HEAP8[ptr] = value;
  ptr = ptr + 1 | 0;
 }
 return ptr - num | 0;
}
function __Z7MouseCBiiii($_b, $_s, $_x, $_y) {
 $_b = $_b | 0;
 $_s = $_s | 0;
 $_x = $_x | 0;
 $_y = $_y | 0;
 var sp = 0;
 sp = STACKTOP;
 if (($_s | 0) == 1) {
  HEAPF64[14] = +HEAPF64[17] + +HEAPF64[14];
  HEAPF64[15] = +HEAPF64[18] + +HEAPF64[15];
  HEAPF64[16] = +HEAPF64[19] + +HEAPF64[16];
  HEAPF64[17] = 0.0;
  HEAPF64[18] = 0.0;
  HEAPF64[19] = 0.0;
  STACKTOP = sp;
  return;
 }
 if (($_b | 0) == 2) {
  HEAP32[22] = 0;
  HEAPF64[13] = +($_y | 0);
  STACKTOP = sp;
  return;
 } else {
  HEAP32[22] = 1;
  HEAPF64[12] = +($_x | 0);
  HEAPF64[13] = +($_y | 0);
  STACKTOP = sp;
  return;
 }
}
function __Znwj($size) {
 $size = $size | 0;
 var $$size = 0, $1 = 0, $3 = 0, $6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $$size = ($size | 0) == 0 ? 1 : $size;
 while (1) {
  $1 = _malloc($$size) | 0;
  if (($1 | 0) != 0) {
   label = 6;
   break;
  }
  $3 = HEAP32[496] | 0;
  HEAP32[496] = $3 + 0;
  if (($3 | 0) == 0) {
   label = 5;
   break;
  }
  FUNCTION_TABLE_v[$3 & 3]();
 }
 if ((label | 0) == 5) {
  $6 = ___cxa_allocate_exception(4) | 0;
  HEAP32[$6 >> 2] = 2e3;
  ___cxa_throw($6 | 0, 2048, 1);
 } else if ((label | 0) == 6) {
  STACKTOP = sp;
  return $1 | 0;
 }
 return 0;
}
function __ZN5Model4DrawEv($this) {
 $this = $this | 0;
 var $2 = 0, $i$01 = 0, sp = 0;
 sp = STACKTOP;
 _glBegin(4);
 if ((HEAP32[$this >> 2] | 0) <= 0) {
  _glEnd();
  STACKTOP = sp;
  return;
 }
 $2 = $this + 4 | 0;
 $i$01 = 0;
 do {
  _glVertex3fv((HEAP32[$2 >> 2] | 0) + ($i$01 * 48 | 0) | 0);
  _glVertex3fv((HEAP32[$2 >> 2] | 0) + ($i$01 * 48 | 0) + 12 | 0);
  _glVertex3fv((HEAP32[$2 >> 2] | 0) + ($i$01 * 48 | 0) + 24 | 0);
  $i$01 = $i$01 + 1 | 0;
 } while (($i$01 | 0) < (HEAP32[$this >> 2] | 0));
 _glEnd();
 STACKTOP = sp;
 return;
}
function __ZN9PQP_ModelD2Ev($this) {
 $this = $this | 0;
 var $1 = 0, $12 = 0, $3 = 0, $5 = 0, $9 = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[$this + 16 >> 2] | 0;
 if (($1 | 0) != 0) {
  $3 = $1 + -8 | 0;
  $5 = HEAP32[$3 + 4 >> 2] | 0;
  if (($5 | 0) != 0) {
   $9 = $1 + ($5 * 176 | 0) | 0;
   do {
    $9 = $9 + -176 | 0;
    __ZN2BVD2Ev($9);
   } while (($9 | 0) != ($1 | 0));
  }
  __ZdaPv($3);
 }
 $12 = HEAP32[$this + 4 >> 2] | 0;
 if (($12 | 0) == 0) {
  STACKTOP = sp;
  return;
 }
 __ZdaPv($12);
 STACKTOP = sp;
 return;
}
function __Z10KeyboardCBhii($key, $x, $y) {
 $key = $key | 0;
 $x = $x | 0;
 $y = $y | 0;
 var $0 = 0, $2 = 0, sp = 0;
 sp = STACKTOP;
 if (!($key << 24 >> 24 == 113)) {
  HEAP32[46] = 1 - (HEAP32[46] | 0);
  _glutPostRedisplay();
  STACKTOP = sp;
  return;
 }
 $0 = HEAP32[18] | 0;
 if (($0 | 0) != 0) {
  __ZN5ModelD2Ev($0);
  __ZdlPv($0);
 }
 $2 = HEAP32[20] | 0;
 if (($2 | 0) == 0) {
  _exit(0);
 }
 __ZN5ModelD2Ev($2);
 __ZdlPv($2);
 _exit(0);
}
function copyTempDouble(ptr) {
 ptr = ptr | 0;
 HEAP8[tempDoublePtr] = HEAP8[ptr];
 HEAP8[tempDoublePtr + 1 | 0] = HEAP8[ptr + 1 | 0];
 HEAP8[tempDoublePtr + 2 | 0] = HEAP8[ptr + 2 | 0];
 HEAP8[tempDoublePtr + 3 | 0] = HEAP8[ptr + 3 | 0];
 HEAP8[tempDoublePtr + 4 | 0] = HEAP8[ptr + 4 | 0];
 HEAP8[tempDoublePtr + 5 | 0] = HEAP8[ptr + 5 | 0];
 HEAP8[tempDoublePtr + 6 | 0] = HEAP8[ptr + 6 | 0];
 HEAP8[tempDoublePtr + 7 | 0] = HEAP8[ptr + 7 | 0];
}
function __Z8MotionCBii($_x, $_y) {
 $_x = $_x | 0;
 $_y = $_y | 0;
 var sp = 0;
 sp = STACKTOP;
 if ((HEAP32[22] | 0) == 0) {
  HEAPF64[17] = +HEAPF64[14] * (+($_y | 0) - +HEAPF64[13]) / 200.0;
  _glutPostRedisplay();
  STACKTOP = sp;
  return;
 } else {
  HEAPF64[18] = (+($_x | 0) - +HEAPF64[12]) / 5.0;
  HEAPF64[19] = (+($_y | 0) - +HEAPF64[13]) / 5.0;
  _glutPostRedisplay();
  STACKTOP = sp;
  return;
 }
}
function __Z11BV_DistancePA3_dPdP2BVS3_($R, $T, $b1, $b2) {
 $R = $R | 0;
 $T = $T | 0;
 $b1 = $b1 | 0;
 $b2 = $b2 | 0;
 var $2 = 0.0, $8 = 0.0, sp = 0;
 sp = STACKTOP;
 $2 = +__Z8RectDistPA3_dPdS1_S1_($R, $T, $b1 + 96 | 0, $b2 + 96 | 0);
 $8 = $2 - (+HEAPF64[$b1 + 112 >> 3] + +HEAPF64[$b2 + 112 >> 3]);
 STACKTOP = sp;
 return +($8 < 0.0 ? 0.0 : $8);
}
function __ZN9PQP_ModelC2Ev($this) {
 $this = $this | 0;
 var sp = 0;
 sp = STACKTOP;
 HEAP32[$this + 0 >> 2] = 0;
 HEAP32[$this + 4 >> 2] = 0;
 HEAP32[$this + 8 >> 2] = 0;
 HEAP32[$this + 12 >> 2] = 0;
 HEAP32[$this + 16 >> 2] = 0;
 HEAP32[$this + 20 >> 2] = 0;
 HEAP32[$this + 24 >> 2] = 0;
 HEAP32[$this + 28 >> 2] = 0;
 STACKTOP = sp;
 return;
}
function copyTempFloat(ptr) {
 ptr = ptr | 0;
 HEAP8[tempDoublePtr] = HEAP8[ptr];
 HEAP8[tempDoublePtr + 1 | 0] = HEAP8[ptr + 1 | 0];
 HEAP8[tempDoublePtr + 2 | 0] = HEAP8[ptr + 2 | 0];
 HEAP8[tempDoublePtr + 3 | 0] = HEAP8[ptr + 3 | 0];
}
function __GLOBAL__I_a() {
 var sp = 0;
 sp = STACKTOP;
 __ZN9PQP_ModelC2Ev(8);
 _atexit(3, 8, ___dso_handle | 0) | 0;
 __ZN9PQP_ModelC2Ev(40);
 _atexit(3, 40, ___dso_handle | 0) | 0;
 STACKTOP = sp;
 return;
}
function dynCall_viiii(index, a1, a2, a3, a4) {
 index = index | 0;
 a1 = a1 | 0;
 a2 = a2 | 0;
 a3 = a3 | 0;
 a4 = a4 | 0;
 FUNCTION_TABLE_viiii[index & 1](a1 | 0, a2 | 0, a3 | 0, a4 | 0);
}
function __ZN5ModelD2Ev($this) {
 $this = $this | 0;
 var $1 = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[$this + 4 >> 2] | 0;
 if (($1 | 0) != 0) {
  __ZdaPv($1);
 }
 STACKTOP = sp;
 return;
}
function __ZNSt9bad_allocD0Ev($this) {
 $this = $this | 0;
 var sp = 0;
 sp = STACKTOP;
 __ZNSt9exceptionD2Ev($this | 0);
 __ZdlPv($this);
 STACKTOP = sp;
 return;
}
function dynCall_viii(index, a1, a2, a3) {
 index = index | 0;
 a1 = a1 | 0;
 a2 = a2 | 0;
 a3 = a3 | 0;
 FUNCTION_TABLE_viii[index & 1](a1 | 0, a2 | 0, a3 | 0);
}
function stackAlloc(size) {
 size = size | 0;
 var ret = 0;
 ret = STACKTOP;
 STACKTOP = STACKTOP + size | 0;
 STACKTOP = STACKTOP + 7 & -8;
 return ret | 0;
}
function setThrew(threw, value) {
 threw = threw | 0;
 value = value | 0;
 if ((__THREW__ | 0) == 0) {
  __THREW__ = threw;
  threwValue = value;
 }
}
function __ZNSt9bad_allocD2Ev($this) {
 $this = $this | 0;
 var sp = 0;
 sp = STACKTOP;
 __ZNSt9exceptionD2Ev($this | 0);
 STACKTOP = sp;
 return;
}
function _strlen(ptr) {
 ptr = ptr | 0;
 var curr = 0;
 curr = ptr;
 while (HEAP8[curr] | 0) {
  curr = curr + 1 | 0;
 }
 return curr - ptr | 0;
}
function __Znaj($size) {
 $size = $size | 0;
 var $0 = 0, sp = 0;
 sp = STACKTOP;
 $0 = __Znwj($size) | 0;
 STACKTOP = sp;
 return $0 | 0;
}
function __ZdlPv($ptr) {
 $ptr = $ptr | 0;
 var sp = 0;
 sp = STACKTOP;
 if (($ptr | 0) != 0) {
  _free($ptr);
 }
 STACKTOP = sp;
 return;
}
function dynCall_vii(index, a1, a2) {
 index = index | 0;
 a1 = a1 | 0;
 a2 = a2 | 0;
 FUNCTION_TABLE_vii[index & 1](a1 | 0, a2 | 0);
}
function runPostSets() {
 HEAP32[512] = __ZTVN10__cxxabiv120__si_class_type_infoE;
 HEAP32[514] = __ZTISt9exception;
}
function dynCall_ii(index, a1) {
 index = index | 0;
 a1 = a1 | 0;
 return FUNCTION_TABLE_ii[index & 1](a1 | 0) | 0;
}
function __ZdaPv($ptr) {
 $ptr = $ptr | 0;
 var sp = 0;
 sp = STACKTOP;
 __ZdlPv($ptr);
 STACKTOP = sp;
 return;
}
function ___clang_call_terminate($0) {
 $0 = $0 | 0;
 ___cxa_begin_catch($0 | 0) | 0;
 __ZSt9terminatev();
}
function dynCall_vi(index, a1) {
 index = index | 0;
 a1 = a1 | 0;
 FUNCTION_TABLE_vi[index & 3](a1 | 0);
}
function __Z6IdleCBv() {
 var sp = 0;
 sp = STACKTOP;
 _glutPostRedisplay();
 STACKTOP = sp;
 return;
}
function b5(p0, p1, p2, p3) {
 p0 = p0 | 0;
 p1 = p1 | 0;
 p2 = p2 | 0;
 p3 = p3 | 0;
 abort(5);
}
function __ZN2BVC2Ev($this) {
 $this = $this | 0;
 HEAP32[$this + 168 >> 2] = 0;
 return;
}
function dynCall_v(index) {
 index = index | 0;
 FUNCTION_TABLE_v[index & 3]();
}
function b3(p0, p1, p2) {
 p0 = p0 | 0;
 p1 = p1 | 0;
 p2 = p2 | 0;
 abort(3);
}
function __ZNKSt9bad_alloc4whatEv($this) {
 $this = $this | 0;
 return 2016;
}
function setTempRet9(value) {
 value = value | 0;
 tempRet9 = value;
}
function setTempRet8(value) {
 value = value | 0;
 tempRet8 = value;
}
function setTempRet7(value) {
 value = value | 0;
 tempRet7 = value;
}
function setTempRet6(value) {
 value = value | 0;
 tempRet6 = value;
}
function setTempRet5(value) {
 value = value | 0;
 tempRet5 = value;
}
function setTempRet4(value) {
 value = value | 0;
 tempRet4 = value;
}
function setTempRet3(value) {
 value = value | 0;
 tempRet3 = value;
}
function setTempRet2(value) {
 value = value | 0;
 tempRet2 = value;
}
function setTempRet1(value) {
 value = value | 0;
 tempRet1 = value;
}
function setTempRet0(value) {
 value = value | 0;
 tempRet0 = value;
}
function stackRestore(top) {
 top = top | 0;
 STACKTOP = top;
}
function b1(p0, p1) {
 p0 = p0 | 0;
 p1 = p1 | 0;
 abort(1);
}
function __ZN2BVD2Ev($this) {
 $this = $this | 0;
 return;
}
function b2(p0) {
 p0 = p0 | 0;
 abort(2);
 return 0;
}
function stackSave() {
 return STACKTOP | 0;
}
function b0(p0) {
 p0 = p0 | 0;
 abort(0);
}
function b4() {
 abort(4);
}

// EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_vi = [b0,__ZNSt9bad_allocD2Ev,__ZNSt9bad_allocD0Ev,__ZN9PQP_ModelD2Ev];
  var FUNCTION_TABLE_vii = [b1,__Z8MotionCBii];
  var FUNCTION_TABLE_ii = [b2,__ZNKSt9bad_alloc4whatEv];
  var FUNCTION_TABLE_viii = [b3,__Z10KeyboardCBhii];
  var FUNCTION_TABLE_v = [b4,__Z9DisplayCBv,__Z6IdleCBv,b4];
  var FUNCTION_TABLE_viiii = [b5,__Z7MouseCBiiii];

  return { _strlen: _strlen, _free: _free, _main: _main, _memset: _memset, _malloc: _malloc, _memcpy: _memcpy, __GLOBAL__I_a: __GLOBAL__I_a, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, setTempRet1: setTempRet1, setTempRet2: setTempRet2, setTempRet3: setTempRet3, setTempRet4: setTempRet4, setTempRet5: setTempRet5, setTempRet6: setTempRet6, setTempRet7: setTempRet7, setTempRet8: setTempRet8, setTempRet9: setTempRet9, dynCall_vi: dynCall_vi, dynCall_vii: dynCall_vii, dynCall_ii: dynCall_ii, dynCall_viii: dynCall_viii, dynCall_v: dynCall_v, dynCall_viiii: dynCall_viiii };
})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_viiii": invoke_viiii, "_glUseProgram": _glUseProgram, "_fabs": _fabs, "_fread": _fread, "__ZSt9terminatev": __ZSt9terminatev, "_glDeleteProgram": _glDeleteProgram, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_glBindBuffer": _glBindBuffer, "_glTranslatef": _glTranslatef, "_sbrk": _sbrk, "_glutReshapeWindow": _glutReshapeWindow, "_glDisableVertexAttribArray": _glDisableVertexAttribArray, "___cxa_begin_catch": ___cxa_begin_catch, "_glCreateShader": _glCreateShader, "_glutSwapBuffers": _glutSwapBuffers, "_sysconf": _sysconf, "_close": _close, "_cos": _cos, "_puts": _puts, "_glLoadIdentity": _glLoadIdentity, "_write": _write, "_fsync": _fsync, "_glShaderSource": _glShaderSource, "__ZNSt9exceptionD2Ev": __ZNSt9exceptionD2Ev, "___cxa_does_inherit": ___cxa_does_inherit, "_glutMotionFunc": _glutMotionFunc, "_glGetBooleanv": _glGetBooleanv, "_glVertex3fv": _glVertex3fv, "_glutPostRedisplay": _glutPostRedisplay, "_glEnableVertexAttribArray": _glEnableVertexAttribArray, "_glVertexAttribPointer": _glVertexAttribPointer, "_glHint": _glHint, "_send": _send, "_glutDisplayFunc": _glutDisplayFunc, "_glBegin": _glBegin, "___cxa_is_number_type": ___cxa_is_number_type, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_glutInitDisplayMode": _glutInitDisplayMode, "_fscanf": _fscanf, "___setErrNo": ___setErrNo, "_glDepthFunc": _glDepthFunc, "___resumeException": ___resumeException, "_glFrustum": _glFrustum, "_glEnable": _glEnable, "_glGetIntegerv": _glGetIntegerv, "_glGetString": _glGetString, "_glutMainLoop": _glutMainLoop, "_glPushMatrix": _glPushMatrix, "_glAttachShader": _glAttachShader, "_read": _read, "_fwrite": _fwrite, "_glColor3d": _glColor3d, "_time": _time, "_fprintf": _fprintf, "_glDetachShader": _glDetachShader, "_gettimeofday": _gettimeofday, "_exit": _exit, "_glCullFace": _glCullFace, "___cxa_allocate_exception": ___cxa_allocate_exception, "_pwrite": _pwrite, "_open": _open, "_glClearColor": _glClearColor, "_glIsEnabled": _glIsEnabled, "__scanString": __scanString, "_glGetFloatv": _glGetFloatv, "_glutMouseFunc": _glutMouseFunc, "_glutIdleFunc": _glutIdleFunc, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_glutInit": _glutInit, "_glActiveTexture": _glActiveTexture, "_recv": _recv, "_glCompileShader": _glCompileShader, "__getFloat": __getFloat, "_glRotated": _glRotated, "_abort": _abort, "_fopen": _fopen, "_glFlush": _glFlush, "_sin": _sin, "_emscripten_glVertex3f": _emscripten_glVertex3f, "_glutKeyboardFunc": _glutKeyboardFunc, "_ungetc": _ungetc, "_glLinkProgram": _glLinkProgram, "__reallyNegative": __reallyNegative, "_glutInitWindowSize": _glutInitWindowSize, "_glClear": _glClear, "_fileno": _fileno, "_glPopMatrix": _glPopMatrix, "_glMatrixMode": _glMatrixMode, "__exit": __exit, "_glBindAttribLocation": _glBindAttribLocation, "_emscripten_glColor4f": _emscripten_glColor4f, "_fputs": _fputs, "_pread": _pread, "_mkport": _mkport, "_glEnd": _glEnd, "_fflush": _fflush, "___errno_location": ___errno_location, "_fgetc": _fgetc, "_fputc": _fputc, "___cxa_throw": ___cxa_throw, "_glutCreateWindow": _glutCreateWindow, "_fclose": _fclose, "_glMultMatrixd": _glMultMatrixd, "_glDisable": _glDisable, "__formatString": __formatString, "_atexit": _atexit, "_sqrt": _sqrt, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity, "__ZTISt9exception": __ZTISt9exception, "__ZTVN10__cxxabiv120__si_class_type_infoE": __ZTVN10__cxxabiv120__si_class_type_infoE, "___dso_handle": ___dso_handle, "_stderr": _stderr }, buffer);
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var __GLOBAL__I_a = Module["__GLOBAL__I_a"] = asm["__GLOBAL__I_a"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];

Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };


// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;

// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      HEAPU8.set(data, STATIC_BASE);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
      Module.printErr('pre-main prep time: ' + (Date.now() - preloadStartTime) + ' ms');
    }

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.';

  throw 'abort() at ' + stackTrace() + extra;
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}






