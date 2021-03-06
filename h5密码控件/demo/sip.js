var HTML5_SIP_VERSION = "3.1.4.2";
var DEFAULT_MIN_LENGTH = 4;
var DEFAULT_MAX_LENGTH = 100;
var KEYBOARD_TYPE_COMPLETE = 0;
var KEYBOARD_TYPE_DIGITAL = 1;
var CFCA_OK = 0;
var CFCA_ERROR_INVALID_PARAMETER = 4097;
var CFCA_ERROR_INVALID_SIP_HANDLE_ID = 4098;
var CFCA_ERROR_INPUT_LENGTH_OUT_OF_RANGE = 4099;
var CFCA_ERROR_INPUT_VALUE_IS_NULL = 4100;
var CFCA_ERROR_SERVER_RANDOM_INVALID = 4101;
var CFCA_ERROR_SERVER_RANDOM_IS_NULL = 4102;
var CFCA_ERROR_INPUT_VALUE_OR_SERVER_RANDOM_TOO_LONG = 4103;
var CFCA_ERROR_INPUT_VALUE_NOT_MATCH_REGEX = 4104;
var CFCA_ERROR_PUBLIC_KEY_INVALID = 4105;
var CFCA_ERROR_PUBLIC_KEY_IS_NULL = 4106;
var CFCA_ERROR_RSA_ENCRYPT_FAILED = 4107;
var CFCA_ERROR_NOT_MATCH_INPUT_REGEX = 4108;
var CFCA_ERROR_SERVER_RANDOM_TOO_SHORT = 4109;
var CFCA_ERROR_SERVER_RANDOM_WITH_INPUT = 4110;
var CryptoJS = CryptoJS || function(a, b) {
    var c = {},
        d = c.lib = {},
        e = d.Base = function() {
            function a() {}
            return {
                extend: function(b) {
                    a.prototype = this;
                    var c = new a;
                    b && c.mixIn(b);
                    c.hasOwnProperty("init") || (c.init = function() {
                        c.$super.init.apply(this, arguments)
                    });
                    c.init.prototype = c;
                    c.$super = this;
                    return c
                },
                create: function() {
                    var a = this.extend();
                    a.init.apply(a, arguments);
                    return a
                },
                init: function() {},
                mixIn: function(a) {
                    for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]);
                    a.hasOwnProperty("toString") && (this.toString = a.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            }
        }(),
        f = d.WordArray = e.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != b ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || h).stringify(this)
            },
            concat: function(a) {
                var b = this.words,
                    c = a.words,
                    d = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (d % 4)
                    for (var e = 0; e < a; e++) b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - e % 4 * 8 & 255) << 24 - (d + e) % 4 * 8;
                else if (65535 < c.length)
                    for (e = 0; e < a; e += 4) b[d + e >>> 2] = c[e >>> 2];
                else b.push.apply(b, c);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var b =
                    this.words,
                    c = this.sigBytes;
                b[c >>> 2] &= 4294967295 << 32 - c % 4 * 8;
                b.length = a.ceil(c / 4)
            },
            clone: function() {
                var a = e.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(b) {
                for (var c = [], d = 0; d < b; d += 4) c.push(4294967296 * a.random() | 0);
                return new f.init(c, b)
            }
        }),
        g = c.enc = {},
        h = g.Hex = {
            stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; d < a; d++) {
                    var e = b[d >>> 2] >>> 24 - d % 4 * 8 & 255;
                    c.push((e >>> 4).toString(16));
                    c.push((e & 15).toString(16))
                }
                return c.join("")
            },
            parse: function(a) {
                for (var b = a.length,
                    c = [], d = 0; d < b; d += 2) c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - d % 8 * 4;
                return new f.init(c, b / 2)
            }
        },
        l = g.Latin1 = {
            stringify: function(a) {
                var b = a.words;
                a = a.sigBytes;
                for (var c = [], d = 0; d < a; d++) c.push(String.fromCharCode(b[d >>> 2] >>> 24 - d % 4 * 8 & 255));
                return c.join("")
            },
            parse: function(a) {
                for (var b = a.length, c = [], d = 0; d < b; d++) c[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - d % 4 * 8;
                return new f.init(c, b)
            }
        },
        k = g.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(l.stringify(a)))
                } catch (b) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return l.parse(unescape(encodeURIComponent(a)))
            }
        },
        u = d.BufferedBlockAlgorithm = e.extend({
            reset: function() {
                this._data = new f.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = k.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(b) {
                var c = this._data,
                    d = c.words,
                    e = c.sigBytes,
                    g = this.blockSize,
                    h = e / (4 * g),
                    h = b ? a.ceil(h) : a.max((h | 0) - this._minBufferSize, 0);
                b = h * g;
                e = a.min(4 * b, e);
                if (b) {
                    for (var l = 0; l < b; l += g) this._doProcessBlock(d, l);
                    l = d.splice(0, b);
                    c.sigBytes -=
                        e
                }
                return new f.init(l, e)
            },
            clone: function() {
                var a = e.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    d.Hasher = u.extend({
        cfg: e.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            u.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(b, c) {
                return (new a.init(c)).finalize(b)
            }
        },
        _createHmacHelper: function(a) {
            return function(b,
                c) {
                return (new y.HMAC.init(a, c)).finalize(b)
            }
        }
    });
    var y = c.algo = {};
    return c
}(Math);
(function() {
    var a = CryptoJS,
        b = a.lib.WordArray;
    a.enc.Base64 = {
        stringify: function(a) {
            var b = a.words,
                e = a.sigBytes,
                f = this._map;
            a.clamp();
            a = [];
            for (var g = 0; g < e; g += 3)
                for (var h = (b[g >>> 2] >>> 24 - g % 4 * 8 & 255) << 16 | (b[g + 1 >>> 2] >>> 24 - (g + 1) % 4 * 8 & 255) << 8 | b[g + 2 >>> 2] >>> 24 - (g + 2) % 4 * 8 & 255, l = 0; 4 > l && g + .75 * l < e; l++) a.push(f.charAt(h >>> 6 * (3 - l) & 63));
            if (b = f.charAt(64))
                for (; a.length % 4;) a.push(b);
            return a.join("")
        },
        parse: function(a) {
            var d = a.length,
                e = this._map,
                f = e.charAt(64);
            f && (f = a.indexOf(f), -1 != f && (d = f));
            for (var f = [], g = 0, h = 0; h < d; h++)
                if (h %
                    4) {
                    var l = e.indexOf(a.charAt(h - 1)) << h % 4 * 2,
                        k = e.indexOf(a.charAt(h)) >>> 6 - h % 4 * 2;
                    f[g >>> 2] |= (l | k) << 24 - g % 4 * 8;
                    g++
                }
            return b.create(f, g)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function(a) {
    function b(a, b, c, d, e, f, g) {
        a = a + (b & c | ~b & d) + e + g;
        return (a << f | a >>> 32 - f) + b
    }

    function c(a, b, c, d, e, f, g) {
        a = a + (b & d | c & ~d) + e + g;
        return (a << f | a >>> 32 - f) + b
    }

    function d(a, b, c, d, e, f, g) {
        a = a + (b ^ c ^ d) + e + g;
        return (a << f | a >>> 32 - f) + b
    }

    function e(a, b, c, d, e, f, g) {
        a = a + (c ^ (b | ~d)) + e + g;
        return (a << f | a >>> 32 - f) + b
    }
    var f = CryptoJS,
        g = f.lib,
        h = g.WordArray,
        l = g.Hasher,
        g = f.algo,
        k = [];
    (function() {
        for (var b = 0; 64 > b; b++) k[b] = 4294967296 * a.abs(a.sin(b + 1)) | 0
    })();
    g = g.MD5 = l.extend({
        _doReset: function() {
            this._hash = new h.init([1732584193, 4023233417,
                2562383102, 271733878
            ])
        },
        _doProcessBlock: function(a, f) {
            for (var g = 0; 16 > g; g++) {
                var h = f + g,
                    l = a[h];
                a[h] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360
            }
            var g = this._hash.words,
                h = a[f + 0],
                l = a[f + 1],
                B = a[f + 2],
                C = a[f + 3],
                D = a[f + 4],
                v = a[f + 5],
                r = a[f + 6],
                G = a[f + 7],
                E = a[f + 8],
                J = a[f + 9],
                F = a[f + 10],
                K = a[f + 11],
                L = a[f + 12],
                M = a[f + 13],
                H = a[f + 14],
                I = a[f + 15],
                m = g[0],
                n = g[1],
                p = g[2],
                q = g[3],
                m = b(m, n, p, q, h, 7, k[0]),
                q = b(q, m, n, p, l, 12, k[1]),
                p = b(p, q, m, n, B, 17, k[2]),
                n = b(n, p, q, m, C, 22, k[3]),
                m = b(m, n, p, q, D, 7, k[4]),
                q = b(q, m, n, p, v, 12, k[5]),
                p = b(p, q, m, n, r, 17, k[6]),
                n = b(n, p, q, m, G, 22, k[7]),
                m = b(m, n, p, q, E, 7, k[8]),
                q = b(q, m, n, p, J, 12, k[9]),
                p = b(p, q, m, n, F, 17, k[10]),
                n = b(n, p, q, m, K, 22, k[11]),
                m = b(m, n, p, q, L, 7, k[12]),
                q = b(q, m, n, p, M, 12, k[13]),
                p = b(p, q, m, n, H, 17, k[14]),
                n = b(n, p, q, m, I, 22, k[15]),
                m = c(m, n, p, q, l, 5, k[16]),
                q = c(q, m, n, p, r, 9, k[17]),
                p = c(p, q, m, n, K, 14, k[18]),
                n = c(n, p, q, m, h, 20, k[19]),
                m = c(m, n, p, q, v, 5, k[20]),
                q = c(q, m, n, p, F, 9, k[21]),
                p = c(p, q, m, n, I, 14, k[22]),
                n = c(n, p, q, m, D, 20, k[23]),
                m = c(m, n, p, q, J, 5, k[24]),
                q = c(q, m, n, p, H, 9, k[25]),
                p = c(p, q, m, n, C, 14, k[26]),
                n = c(n, p, q, m, E, 20, k[27]),
                m = c(m, n,
                    p, q, M, 5, k[28]),
                q = c(q, m, n, p, B, 9, k[29]),
                p = c(p, q, m, n, G, 14, k[30]),
                n = c(n, p, q, m, L, 20, k[31]),
                m = d(m, n, p, q, v, 4, k[32]),
                q = d(q, m, n, p, E, 11, k[33]),
                p = d(p, q, m, n, K, 16, k[34]),
                n = d(n, p, q, m, H, 23, k[35]),
                m = d(m, n, p, q, l, 4, k[36]),
                q = d(q, m, n, p, D, 11, k[37]),
                p = d(p, q, m, n, G, 16, k[38]),
                n = d(n, p, q, m, F, 23, k[39]),
                m = d(m, n, p, q, M, 4, k[40]),
                q = d(q, m, n, p, h, 11, k[41]),
                p = d(p, q, m, n, C, 16, k[42]),
                n = d(n, p, q, m, r, 23, k[43]),
                m = d(m, n, p, q, J, 4, k[44]),
                q = d(q, m, n, p, L, 11, k[45]),
                p = d(p, q, m, n, I, 16, k[46]),
                n = d(n, p, q, m, B, 23, k[47]),
                m = e(m, n, p, q, h, 6, k[48]),
                q = e(q, m, n, p,
                    G, 10, k[49]),
                p = e(p, q, m, n, H, 15, k[50]),
                n = e(n, p, q, m, v, 21, k[51]),
                m = e(m, n, p, q, L, 6, k[52]),
                q = e(q, m, n, p, C, 10, k[53]),
                p = e(p, q, m, n, F, 15, k[54]),
                n = e(n, p, q, m, l, 21, k[55]),
                m = e(m, n, p, q, E, 6, k[56]),
                q = e(q, m, n, p, I, 10, k[57]),
                p = e(p, q, m, n, r, 15, k[58]),
                n = e(n, p, q, m, M, 21, k[59]),
                m = e(m, n, p, q, D, 6, k[60]),
                q = e(q, m, n, p, K, 10, k[61]),
                p = e(p, q, m, n, B, 15, k[62]),
                n = e(n, p, q, m, J, 21, k[63]);
            g[0] = g[0] + m | 0;
            g[1] = g[1] + n | 0;
            g[2] = g[2] + p | 0;
            g[3] = g[3] + q | 0
        },
        _doFinalize: function() {
            var b = this._data,
                c = b.words,
                d = 8 * this._nDataBytes,
                e = 8 * b.sigBytes;
            c[e >>> 5] |= 128 <<
                24 - e % 32;
            var f = a.floor(d / 4294967296);
            c[(e + 64 >>> 9 << 4) + 15] = (f << 8 | f >>> 24) & 16711935 | (f << 24 | f >>> 8) & 4278255360;
            c[(e + 64 >>> 9 << 4) + 14] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
            b.sigBytes = 4 * (c.length + 1);
            this._process();
            b = this._hash;
            c = b.words;
            for (d = 0; 4 > d; d++) e = c[d], c[d] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;
            return b
        },
        clone: function() {
            var a = l.clone.call(this);
            a._hash = this._hash.clone();
            return a
        }
    });
    f.MD5 = l._createHelper(g);
    f.HmacMD5 = l._createHmacHelper(g)
})(Math);
(function() {
    var a = CryptoJS,
        b = a.lib,
        c = b.Base,
        d = b.WordArray,
        b = a.algo,
        e = b.EvpKDF = c.extend({
            cfg: c.extend({
                keySize: 4,
                hasher: b.MD5,
                iterations: 1
            }),
            init: function(a) {
                this.cfg = this.cfg.extend(a)
            },
            compute: function(a, b) {
                for (var c = this.cfg, e = c.hasher.create(), k = d.create(), u = k.words, y = c.keySize, c = c.iterations; u.length < y;) {
                    A && e.update(A);
                    var A = e.update(a).finalize(b);
                    e.reset();
                    for (var x = 1; x < c; x++) A = e.finalize(A), e.reset();
                    k.concat(A)
                }
                k.sigBytes = 4 * y;
                return k
            }
        });
    a.EvpKDF = function(a, b, c) {
        return e.create(c).compute(a,
            b)
    }
})();
CryptoJS.lib.Cipher || function(a) {
    var b = CryptoJS,
        c = b.lib,
        d = c.Base,
        e = c.WordArray,
        f = c.BufferedBlockAlgorithm,
        g = b.enc.Base64,
        h = b.algo.EvpKDF,
        l = c.Cipher = f.extend({
            cfg: d.extend(),
            createEncryptor: function(a, b) {
                return this.create(this._ENC_XFORM_MODE, a, b)
            },
            createDecryptor: function(a, b) {
                return this.create(this._DEC_XFORM_MODE, a, b)
            },
            init: function(a, b, c) {
                this.cfg = this.cfg.extend(c);
                this._xformMode = a;
                this._key = b;
                this.reset()
            },
            reset: function() {
                f.reset.call(this);
                this._doReset()
            },
            process: function(a) {
                this._append(a);
                return this._process()
            },
            finalize: function(a) {
                a && this._append(a);
                return this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function() {
                return function(a) {
                    return {
                        encrypt: function(b, c, d) {
                            return ("string" == typeof c ? w : x).encrypt(a, b, c, d)
                        },
                        decrypt: function(b, c, d) {
                            return ("string" == typeof c ? w : x).decrypt(a, b, c, d)
                        }
                    }
                }
            }()
        });
    c.StreamCipher = l.extend({
        _doFinalize: function() {
            return this._process(!0)
        },
        blockSize: 1
    });
    var k = b.mode = {},
        u = c.BlockCipherMode = d.extend({
            createEncryptor: function(a, b) {
                return this.Encryptor.create(a,
                    b)
            },
            createDecryptor: function(a, b) {
                return this.Decryptor.create(a, b)
            },
            init: function(a, b) {
                this._cipher = a;
                this._iv = b
            }
        }),
        k = k.CBC = function() {
            function b(c, d, e) {
                var f = this._iv;
                f ? this._iv = a : f = this._prevBlock;
                for (var g = 0; g < e; g++) c[d + g] ^= f[g]
            }
            var c = u.extend();
            c.Encryptor = c.extend({
                processBlock: function(a, c) {
                    var d = this._cipher,
                        e = d.blockSize;
                    b.call(this, a, c, e);
                    d.encryptBlock(a, c);
                    this._prevBlock = a.slice(c, c + e)
                }
            });
            c.Decryptor = c.extend({
                processBlock: function(a, c) {
                    var d = this._cipher,
                        e = d.blockSize,
                        f = a.slice(c, c +
                            e);
                    d.decryptBlock(a, c);
                    b.call(this, a, c, e);
                    this._prevBlock = f
                }
            });
            return c
        }(),
        y = (b.pad = {}).Pkcs7 = {
            pad: function(a, b) {
                for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, f = [], g = 0; g < c; g += 4) f.push(d);
                c = e.create(f, c);
                a.concat(c)
            },
            unpad: function(a) {
                a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
            }
        };
    c.BlockCipher = l.extend({
        cfg: l.cfg.extend({
            mode: k,
            padding: y
        }),
        reset: function() {
            l.reset.call(this);
            var a = this.cfg,
                b = a.iv,
                a = a.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
            else c = a.createDecryptor,
                this._minBufferSize = 1;
            this._mode = c.call(a, this, b && b.words)
        },
        _doProcessBlock: function(a, b) {
            this._mode.processBlock(a, b)
        },
        _doFinalize: function() {
            var a = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                a.pad(this._data, this.blockSize);
                var b = this._process(!0)
            } else b = this._process(!0), a.unpad(b);
            return b
        },
        blockSize: 4
    });
    var A = c.CipherParams = d.extend({
            init: function(a) {
                this.mixIn(a)
            },
            toString: function(a) {
                return (a || this.formatter).stringify(this)
            }
        }),
        k = (b.format = {}).OpenSSL = {
            stringify: function(a) {
                var b =
                    a.ciphertext;
                a = a.salt;
                return (a ? e.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(g)
            },
            parse: function(a) {
                a = g.parse(a);
                var b = a.words;
                if (1398893684 == b[0] && 1701076831 == b[1]) {
                    var c = e.create(b.slice(2, 4));
                    b.splice(0, 4);
                    a.sigBytes -= 16
                }
                return A.create({
                    ciphertext: a,
                    salt: c
                })
            }
        },
        x = c.SerializableCipher = d.extend({
            cfg: d.extend({
                format: k
            }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                var e = a.createEncryptor(c, d);
                b = e.finalize(b);
                e = e.cfg;
                return A.create({
                    ciphertext: b,
                    key: c,
                    iv: e.iv,
                    algorithm: a,
                    mode: e.mode,
                    padding: e.padding,
                    blockSize: a.blockSize,
                    formatter: d.format
                })
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                return a.createDecryptor(c, d).finalize(b.ciphertext)
            },
            _parse: function(a, b) {
                return "string" == typeof a ? b.parse(a, this) : a
            }
        }),
        b = (b.kdf = {}).OpenSSL = {
            execute: function(a, b, c, d) {
                d || (d = e.random(8));
                a = h.create({
                    keySize: b + c
                }).compute(a, d);
                c = e.create(a.words.slice(b), 4 * c);
                a.sigBytes = 4 * b;
                return A.create({
                    key: a,
                    iv: c,
                    salt: d
                })
            }
        },
        w = c.PasswordBasedCipher = x.extend({
            cfg: x.cfg.extend({
                kdf: b
            }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                c = d.kdf.execute(c, a.keySize, a.ivSize);
                d.iv = c.iv;
                a = x.encrypt.call(this, a, b, c.key, d);
                a.mixIn(c);
                return a
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt);
                d.iv = c.iv;
                return x.decrypt.call(this, a, b, c.key, d)
            }
        })
}();
(function() {
    function a() {
        var a = this._S,
            b = this._i,
            c = this._j,
            b = (b + 1) % 256,
            c = (c + a[b]) % 256,
            d = a[b];
        a[b] = a[c];
        a[c] = d;
        this._i = b;
        this._j = c;
        return a[(a[b] + a[c]) % 256]
    }
    var b = CryptoJS,
        c = b.lib.StreamCipher,
        d = b.algo,
        e = d.RC4 = c.extend({
            _doReset: function() {
                for (var a = this._key, b = a.words, a = a.sigBytes, c = this._S = [], d = 0; 256 > d; d++) c[d] = d;
                for (var e = d = 0; 256 > d; d++) {
                    var u = d % a,
                        e = (e + c[d] + (b[u >>> 2] >>> 24 - u % 4 * 8 & 255)) % 256,
                        u = c[d];
                    c[d] = c[e];
                    c[e] = u
                }
                this._i = this._j = 0
            },
            _doProcessBlock: function(b, c) {
                for (var d = 0, e = 0; 4 > e; e++) {
                    var k = b[c] >>>
                        24 - 8 * e & 255;
                    if (0 === k) break;
                    var u = a.call(this),
                        d = d | (k ^ u) << 24 - 8 * e
                }
                b[c] = d
            },
            keySize: 8,
            ivSize: 0
        });
    b.RC4 = c._createHelper(e);
    d = d.RC4Drop = e.extend({
        cfg: e.cfg.extend({
            drop: 192
        }),
        _doReset: function() {
            e._doReset.call(this);
            for (var b = this.cfg.drop; 0 < b; b--) a.call(this)
        }
    });
    b.RC4Drop = c._createHelper(d)
})();
(function() {
    var a = CryptoJS,
        b = a.lib,
        c = b.WordArray,
        d = b.Hasher,
        e = [],
        b = a.algo.SHA1 = d.extend({
            _doReset: function() {
                this._hash = new c.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(a, b) {
                for (var c = this._hash.words, d = c[0], k = c[1], u = c[2], y = c[3], A = c[4], x = 0; 80 > x; x++) {
                    if (16 > x) e[x] = a[b + x] | 0;
                    else {
                        var w = e[x - 3] ^ e[x - 8] ^ e[x - 14] ^ e[x - 16];
                        e[x] = w << 1 | w >>> 31
                    }
                    w = (d << 5 | d >>> 27) + A + e[x];
                    w = 20 > x ? w + ((k & u | ~k & y) + 1518500249) : 40 > x ? w + ((k ^ u ^ y) + 1859775393) : 60 > x ? w + ((k & u | k & y | u & y) - 1894007588) : w + ((k ^ u ^
                        y) - 899497514);
                    A = y;
                    y = u;
                    u = k << 30 | k >>> 2;
                    k = d;
                    d = w
                }
                c[0] = c[0] + d | 0;
                c[1] = c[1] + k | 0;
                c[2] = c[2] + u | 0;
                c[3] = c[3] + y | 0;
                c[4] = c[4] + A | 0
            },
            _doFinalize: function() {
                var a = this._data,
                    b = a.words,
                    c = 8 * this._nDataBytes,
                    d = 8 * a.sigBytes;
                b[d >>> 5] |= 128 << 24 - d % 32;
                b[(d + 64 >>> 9 << 4) + 14] = Math.floor(c / 4294967296);
                b[(d + 64 >>> 9 << 4) + 15] = c;
                a.sigBytes = 4 * b.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var a = d.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
    a.SHA1 = d._createHelper(b);
    a.HmacSHA1 = d._createHmacHelper(b)
})();
var ASN1HEX = new function() {
    this.getByteLengthOfL_AtObj = function(a, b) {
        if ("8" != a.substring(b + 2, b + 3)) return 1;
        var c = parseInt(a.substring(b + 3, b + 4));
        return 0 == c ? -1 : 0 < c && 10 > c ? c + 1 : -2
    };
    this.getHexOfL_AtObj = function(a, b) {
        var c = this.getByteLengthOfL_AtObj(a, b);
        return 1 > c ? "" : a.substring(b + 2, b + 2 + 2 * c)
    };
    this.getIntOfL_AtObj = function(a, b) {
        var c = this.getHexOfL_AtObj(a, b);
        return "" == c ? -1 : (8 > parseInt(c.substring(0, 1)) ? new BigInteger(c, 16) : new BigInteger(c.substring(2), 16)).intValue()
    };
    this.getStartPosOfV_AtObj = function(a,
        b) {
        var c = this.getByteLengthOfL_AtObj(a, b);
        return 0 > c ? c : b + 2 * (c + 1)
    };
    this.getHexOfV_AtObj = function(a, b) {
        var c = this.getStartPosOfV_AtObj(a, b),
            d = this.getIntOfL_AtObj(a, b);
        return a.substring(c, c + 2 * d)
    };
    this.getHexOfTLV_AtObj = function(a, b) {
        var c = a.substr(b, 2),
            d = this.getHexOfL_AtObj(a, b),
            e = this.getHexOfV_AtObj(a, b);
        return c + d + e
    };
    this.getPosOfNextSibling_AtObj = function(a, b) {
        var c = this.getStartPosOfV_AtObj(a, b),
            d = this.getIntOfL_AtObj(a, b);
        return c + 2 * d
    };
    this.getPosArrayOfChildren_AtObj = function(a, b) {
        var c = [],
            d = this.getStartPosOfV_AtObj(a, b);
        c.push(d);
        for (var e = this.getIntOfL_AtObj(a, b), f = d, g = 0;;) {
            f = this.getPosOfNextSibling_AtObj(a, f);
            if (null == f || f - d >= 2 * e) break;
            if (200 <= g) break;
            c.push(f);
            g++
        }
        return c
    };
    this.getNthChildIndex_AtObj = function(a, b, c) {
        return this.getPosArrayOfChildren_AtObj(a, b)[c]
    };
    this.getDecendantIndexByNthList = function(a, b, c) {
        if (0 == c.length) return b;
        var d = c.shift();
        b = this.getPosArrayOfChildren_AtObj(a, b);
        return this.getDecendantIndexByNthList(a, b[d], c)
    };
    this.getDecendantHexTLVByNthList = function(a,
        b, c) {
        b = this.getDecendantIndexByNthList(a, b, c);
        return this.getHexOfTLV_AtObj(a, b)
    };
    this.getDecendantHexVByNthList = function(a, b, c) {
        b = this.getDecendantIndexByNthList(a, b, c);
        return this.getHexOfV_AtObj(a, b)
    }
};
ASN1HEX.getVbyList = function(a, b, c, d) {
    b = this.getDecendantIndexByNthList(a, b, c);
    if (void 0 === b) throw "can't find nthList object";
    if (void 0 !== d && a.substr(b, 2) != d) throw "checking tag doesn't match: " + a.substr(b, 2) + "!=" + d;
    return this.getHexOfV_AtObj(a, b)
};
ASN1HEX.hextooidstr = function(a) {
    var b = function(a, b) {
            return a.length >= b ? a : Array(b - a.length + 1).join("0") + a
        },
        c = [],
        d = a.substr(0, 2),
        d = parseInt(d, 16);
    c[0] = new String(Math.floor(d / 40));
    c[1] = new String(d % 40);
    var e = a.substr(2);
    a = [];
    for (d = 0; d < e.length / 2; d++) a.push(parseInt(e.substr(2 * d, 2), 16));
    for (var e = [], f = "", d = 0; d < a.length; d++) a[d] & 128 ? f += b((a[d] & 127).toString(2), 7) : (f += b((a[d] & 127).toString(2), 7), e.push(new String(parseInt(f, 2))), f = "");
    b = c.join(".");
    0 < e.length && (b = b + "." + e.join("."));
    return b
};
"undefined" != typeof KJUR && KJUR || (KJUR = {});
"undefined" != typeof KJUR.crypto && KJUR.crypto || (KJUR.crypto = {});
KJUR.crypto.Util = new function() {
    this.DIGESTINFOHEAD = {
        sha1: "3021300906052b0e03021a05000414",
        sha224: "302d300d06096086480165030402040500041c",
        sha256: "3031300d060960864801650304020105000420",
        sha384: "3041300d060960864801650304020205000430",
        sha512: "3051300d060960864801650304020305000440",
        md2: "3020300c06082a864886f70d020205000410",
        md5: "3020300c06082a864886f70d020505000410",
        ripemd160: "3021300906052b2403020105000414"
    };
    this.DEFAULTPROVIDER = {
        md5: "cryptojs",
        sha1: "cryptojs",
        sha224: "cryptojs",
        sha256: "cryptojs",
        sha384: "cryptojs",
        sha512: "cryptojs",
        ripemd160: "cryptojs",
        hmacmd5: "cryptojs",
        hmacsha1: "cryptojs",
        hmacsha224: "cryptojs",
        hmacsha256: "cryptojs",
        hmacsha384: "cryptojs",
        hmacsha512: "cryptojs",
        hmacripemd160: "cryptojs",
        MD5withRSA: "cryptojs/jsrsa",
        SHA1withRSA: "cryptojs/jsrsa",
        SHA224withRSA: "cryptojs/jsrsa",
        SHA256withRSA: "cryptojs/jsrsa",
        SHA384withRSA: "cryptojs/jsrsa",
        SHA512withRSA: "cryptojs/jsrsa",
        RIPEMD160withRSA: "cryptojs/jsrsa",
        MD5withECDSA: "cryptojs/jsrsa",
        SHA1withECDSA: "cryptojs/jsrsa",
        SHA224withECDSA: "cryptojs/jsrsa",
        SHA256withECDSA: "cryptojs/jsrsa",
        SHA384withECDSA: "cryptojs/jsrsa",
        SHA512withECDSA: "cryptojs/jsrsa",
        RIPEMD160withECDSA: "cryptojs/jsrsa",
        SHA1withDSA: "cryptojs/jsrsa",
        SHA224withDSA: "cryptojs/jsrsa",
        SHA256withDSA: "cryptojs/jsrsa",
        MD5withRSAandMGF1: "cryptojs/jsrsa",
        SHA1withRSAandMGF1: "cryptojs/jsrsa",
        SHA224withRSAandMGF1: "cryptojs/jsrsa",
        SHA256withRSAandMGF1: "cryptojs/jsrsa",
        SHA384withRSAandMGF1: "cryptojs/jsrsa",
        SHA512withRSAandMGF1: "cryptojs/jsrsa",
        RIPEMD160withRSAandMGF1: "cryptojs/jsrsa"
    };
    this.CRYPTOJSMESSAGEDIGESTNAME = {
        md5: "CryptoJS.algo.MD5",
        sha1: "CryptoJS.algo.SHA1",
        sha224: "CryptoJS.algo.SHA224",
        sha256: "CryptoJS.algo.SHA256",
        sha384: "CryptoJS.algo.SHA384",
        sha512: "CryptoJS.algo.SHA512",
        ripemd160: "CryptoJS.algo.RIPEMD160"
    };
    this.getDigestInfoHex = function(a, b) {
        if ("undefined" == typeof this.DIGESTINFOHEAD[b]) throw "alg not supported in Util.DIGESTINFOHEAD: " + b;
        return this.DIGESTINFOHEAD[b] + a
    };
    this.getPaddedDigestInfoHex = function(a, b, c) {
        var d = this.getDigestInfoHex(a, b);
        a = c / 4;
        if (d.length + 22 > a) throw "key is too short for SigAlg: keylen=" +
            c + "," + b;
        b = "00" + d;
        c = "";
        a = a - 4 - b.length;
        for (d = 0; d < a; d += 2) c += "ff";
        return "0001" + c + b
    };
    this.hashString = function(a, b) {
        return (new KJUR.crypto.MessageDigest({
            alg: b
        })).digestString(a)
    };
    this.hashHex = function(a, b) {
        return (new KJUR.crypto.MessageDigest({
            alg: b
        })).digestHex(a)
    };
    this.sha1 = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "sha1",
            prov: "cryptojs"
        })).digestString(a)
    };
    this.sha256 = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "sha256",
            prov: "cryptojs"
        })).digestString(a)
    };
    this.sha256Hex = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "sha256",
            prov: "cryptojs"
        })).digestHex(a)
    };
    this.sha512 = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "sha512",
            prov: "cryptojs"
        })).digestString(a)
    };
    this.sha512Hex = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "sha512",
            prov: "cryptojs"
        })).digestHex(a)
    };
    this.md5 = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "md5",
            prov: "cryptojs"
        })).digestString(a)
    };
    this.ripemd160 = function(a) {
        return (new KJUR.crypto.MessageDigest({
            alg: "ripemd160",
            prov: "cryptojs"
        })).digestString(a)
    };
    this.getCryptoJSMDByName =
        function(a) {}
};
KJUR.crypto.MessageDigest = function(a) {
    this.setAlgAndProvider = function(a, c) {
        null != a && void 0 === c && (c = KJUR.crypto.Util.DEFAULTPROVIDER[a]);
        if (-1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(a) && "cryptojs" == c) {
            try {
                this.md = eval(KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[a]).create()
            } catch (d) {
                throw "setAlgAndProvider hash alg set fail alg=" + a + "/" + d;
            }
            this.updateString = function(a) {
                this.md.update(a)
            };
            this.updateHex = function(a) {
                a = CryptoJS.enc.Hex.parse(a);
                this.md.update(a)
            };
            this.digest = function() {
                return this.md.finalize().toString(CryptoJS.enc.Hex)
            };
            this.digestString = function(a) {
                this.updateString(a);
                return this.digest()
            };
            this.digestHex = function(a) {
                this.updateHex(a);
                return this.digest()
            }
        }
        if (-1 != ":sha256:".indexOf(a) && "sjcl" == c) {
            try {
                this.md = new sjcl.hash.sha256
            } catch (e) {
                throw "setAlgAndProvider hash alg set fail alg=" + a + "/" + e;
            }
            this.updateString = function(a) {
                this.md.update(a)
            };
            this.updateHex = function(a) {
                a = sjcl.codec.hex.toBits(a);
                this.md.update(a)
            };
            this.digest = function() {
                var a = this.md.finalize();
                return sjcl.codec.hex.fromBits(a)
            };
            this.digestString =
                function(a) {
                    this.updateString(a);
                    return this.digest()
                };
            this.digestHex = function(a) {
                this.updateHex(a);
                return this.digest()
            }
        }
    };
    this.updateString = function(a) {
        throw "updateString(str) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };
    this.updateHex = function(a) {
        throw "updateHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };
    this.digest = function() {
        throw "digest() not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };
    this.digestString = function(a) {
        throw "digestString(str) not supported for this alg/prov: " +
        this.algName + "/" + this.provName;
    };
    this.digestHex = function(a) {
        throw "digestHex(hex) not supported for this alg/prov: " + this.algName + "/" + this.provName;
    };
    void 0 !== a && void 0 !== a.alg && (this.algName = a.alg, void 0 === a.prov && (this.provName = KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName, this.provName))
};
KJUR.crypto.Mac = function(a) {
    this.setAlgAndProvider = function(a, c) {
        null == a && (a = "hmacsha1");
        a = a.toLowerCase();
        if ("hmac" != a.substr(0, 4)) throw "setAlgAndProvider unsupported HMAC alg: " + a;
        void 0 === c && (c = KJUR.crypto.Util.DEFAULTPROVIDER[a]);
        this.algProv = a + "/" + c;
        var d = a.substr(4);
        if (-1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(d) && "cryptojs" == c) {
            try {
                var e = eval(KJUR.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[d]);
                this.mac = CryptoJS.algo.HMAC.create(e, this.pass)
            } catch (f) {
                throw "setAlgAndProvider hash alg set fail hashAlg=" +
                d + "/" + f;
            }
            this.updateString = function(a) {
                this.mac.update(a)
            };
            this.updateHex = function(a) {
                a = CryptoJS.enc.Hex.parse(a);
                this.mac.update(a)
            };
            this.doFinal = function() {
                return this.mac.finalize().toString(CryptoJS.enc.Hex)
            };
            this.doFinalString = function(a) {
                this.updateString(a);
                return this.doFinal()
            };
            this.doFinalHex = function(a) {
                this.updateHex(a);
                return this.doFinal()
            }
        }
    };
    this.updateString = function(a) {
        throw "updateString(str) not supported for this alg/prov: " + this.algProv;
    };
    this.updateHex = function(a) {
        throw "updateHex(hex) not supported for this alg/prov: " +
        this.algProv;
    };
    this.doFinal = function() {
        throw "digest() not supported for this alg/prov: " + this.algProv;
    };
    this.doFinalString = function(a) {
        throw "digestString(str) not supported for this alg/prov: " + this.algProv;
    };
    this.doFinalHex = function(a) {
        throw "digestHex(hex) not supported for this alg/prov: " + this.algProv;
    };
    void 0 !== a && (void 0 !== a.pass && (this.pass = a.pass), void 0 !== a.alg && (this.algName = a.alg, void 0 === a.prov && (this.provName = KJUR.crypto.Util.DEFAULTPROVIDER[this.algName]), this.setAlgAndProvider(this.algName,
        this.provName)))
};
KJUR.crypto.Signature = function(a) {
    var b = null;
    this._setAlgNames = function() {
        this.algName.match(/^(.+)with(.+)$/) && (this.mdAlgName = RegExp.$1.toLowerCase(), this.pubkeyAlgName = RegExp.$2.toLowerCase())
    };
    this._zeroPaddingOfSignature = function(a, b) {
        for (var c = "", g = b / 4 - a.length, h = 0; h < g; h++) c += "0";
        return c + a
    };
    this.setAlgAndProvider = function(a, b) {
        this._setAlgNames();
        if ("cryptojs/jsrsa" != b) throw "provider not supported: " + b;
        if (-1 != ":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)) {
            try {
                this.md = new KJUR.crypto.MessageDigest({
                    alg: this.mdAlgName
                })
            } catch (c) {
                throw "setAlgAndProvider hash alg set fail alg=" +
                this.mdAlgName + "/" + c;
            }
            this.init = function(a, b) {
                var c = null;
                try {
                    c = void 0 === b ? KEYUTIL.getKey(a) : KEYUTIL.getKey(a, b)
                } catch (d) {
                    throw "init failed:" + d;
                }
                if (!0 === c.isPrivate) this.prvKey = c, this.state = "SIGN";
                else if (!0 === c.isPublic) this.pubKey = c, this.state = "VERIFY";
                else throw "init failed.:" + c;
            };
            this.initSign = function(a) {
                "string" == typeof a.ecprvhex && "string" == typeof a.eccurvename ? (this.ecprvhex = a.ecprvhex, this.eccurvename = a.eccurvename) : this.prvKey = a;
                this.state = "SIGN"
            };
            this.initVerifyByPublicKey = function(a) {
                "string" ==
                typeof a.ecpubhex && "string" == typeof a.eccurvename ? (this.ecpubhex = a.ecpubhex, this.eccurvename = a.eccurvename) : a instanceof KJUR.crypto.ECDSA ? this.pubKey = a : a instanceof RSAKey && (this.pubKey = a);
                this.state = "VERIFY"
            };
            this.initVerifyByCertificatePEM = function(a) {
                var b = new X509;
                b.readCertPEM(a);
                this.pubKey = b.subjectPublicKeyRSA;
                this.state = "VERIFY"
            };
            this.updateString = function(a) {
                this.md.updateString(a)
            };
            this.updateHex = function(a) {
                this.md.updateHex(a)
            };
            this.sign = function() {
                this.sHashHex = this.md.digest();
                if ("undefined" !=
                    typeof this.ecprvhex && "undefined" != typeof this.eccurvename) this.hSign = (new KJUR.crypto.ECDSA({
                    curve: this.eccurvename
                })).signHex(this.sHashHex, this.ecprvhex);
                else if ("rsaandmgf1" == this.pubkeyAlgName) this.hSign = this.prvKey.signWithMessageHashPSS(this.sHashHex, this.mdAlgName, this.pssSaltLen);
                else if ("rsa" == this.pubkeyAlgName) this.hSign = this.prvKey.signWithMessageHash(this.sHashHex, this.mdAlgName);
                else if (this.prvKey instanceof KJUR.crypto.ECDSA) this.hSign = this.prvKey.signWithMessageHash(this.sHashHex);
                else if (this.prvKey instanceof KJUR.crypto.DSA) this.hSign = this.prvKey.signWithMessageHash(this.sHashHex);
                else throw "Signature: unsupported public key alg: " + this.pubkeyAlgName;
                return this.hSign
            };
            this.signString = function(a) {
                this.updateString(a);
                return this.sign()
            };
            this.signHex = function(a) {
                this.updateHex(a);
                return this.sign()
            };
            this.verify = function(a) {
                this.sHashHex = this.md.digest();
                if ("undefined" != typeof this.ecpubhex && "undefined" != typeof this.eccurvename) return (new KJUR.crypto.ECDSA({
                    curve: this.eccurvename
                })).verifyHex(this.sHashHex,
                    a, this.ecpubhex);
                if ("rsaandmgf1" == this.pubkeyAlgName) return this.pubKey.verifyWithMessageHashPSS(this.sHashHex, a, this.mdAlgName, this.pssSaltLen);
                if ("rsa" == this.pubkeyAlgName || this.pubKey instanceof KJUR.crypto.ECDSA || this.pubKey instanceof KJUR.crypto.DSA) return this.pubKey.verifyWithMessageHash(this.sHashHex, a);
                throw "Signature: unsupported public key alg: " + this.pubkeyAlgName;
            }
        }
    };
    this.init = function(a, b) {
        throw "init(key, pass) not supported for this alg:prov=" + this.algProvName;
    };
    this.initVerifyByPublicKey =
        function(a) {
            throw "initVerifyByPublicKey(rsaPubKeyy) not supported for this alg:prov=" + this.algProvName;
        };
    this.initVerifyByCertificatePEM = function(a) {
        throw "initVerifyByCertificatePEM(certPEM) not supported for this alg:prov=" + this.algProvName;
    };
    this.initSign = function(a) {
        throw "initSign(prvKey) not supported for this alg:prov=" + this.algProvName;
    };
    this.updateString = function(a) {
        throw "updateString(str) not supported for this alg:prov=" + this.algProvName;
    };
    this.updateHex = function(a) {
        throw "updateHex(hex) not supported for this alg:prov=" +
        this.algProvName;
    };
    this.sign = function() {
        throw "sign() not supported for this alg:prov=" + this.algProvName;
    };
    this.signString = function(a) {
        throw "digestString(str) not supported for this alg:prov=" + this.algProvName;
    };
    this.signHex = function(a) {
        throw "digestHex(hex) not supported for this alg:prov=" + this.algProvName;
    };
    this.verify = function(a) {
        throw "verify(hSigVal) not supported for this alg:prov=" + this.algProvName;
    };
    this.initParams = a;
    if (void 0 !== a && (void 0 !== a.alg && (this.algName = a.alg, this.provName = void 0 ===
        a.prov ? KJUR.crypto.Util.DEFAULTPROVIDER[this.algName] : a.prov, this.algProvName = this.algName + ":" + this.provName, this.setAlgAndProvider(this.algName, this.provName), this._setAlgNames()), void 0 !== a.psssaltlen && (this.pssSaltLen = a.psssaltlen), void 0 !== a.prvkeypem)) {
        if (void 0 !== a.prvkeypas) throw "both prvkeypem and prvkeypas parameters not supported";
        try {
            b = new RSAKey, b.readPrivateKeyFromPEMString(a.prvkeypem), this.initSign(b)
        } catch (c) {
            throw "fatal error to load pem private key: " + c;
        }
    }
};
KJUR.crypto.OID = new function() {
    this.oidhex2name = {
        "2a864886f70d010101": "rsaEncryption",
        "2a8648ce3d0201": "ecPublicKey",
        "2a8648ce380401": "dsa",
        "2a8648ce3d030107": "secp256r1",
        "2b8104001f": "secp192k1",
        "2b81040021": "secp224r1",
        "2b8104000a": "secp256k1",
        "2b81040023": "secp521r1",
        "2b81040022": "secp384r1",
        "2a8648ce380403": "SHA1withDSA",
        "608648016503040301": "SHA224withDSA",
        "608648016503040302": "SHA256withDSA"
    }
};
var _RE_HEXDECONLY = RegExp("");
_RE_HEXDECONLY.compile("[^0-9a-f]", "gi");

function _rsasign_getHexPaddedDigestInfoForString(a, b, c) {
    a = KJUR.crypto.Util.hashString(a, c);
    return KJUR.crypto.Util.getPaddedDigestInfoHex(a, c, b)
}

function _zeroPaddingOfSignature(a, b) {
    for (var c = "", d = b / 4 - a.length, e = 0; e < d; e++) c += "0";
    return c + a
}

function _rsasign_signString(a, b) {
    var c = KJUR.crypto.Util.hashString(a, b);
    return this.signWithMessageHash(c, b)
}

function _rsasign_signWithMessageHash(a, b) {
    var c = KJUR.crypto.Util.getPaddedDigestInfoHex(a, b, this.n.bitLength()),
        c = parseBigInt(c, 16),
        c = this.doPrivate(c).toString(16);
    return _zeroPaddingOfSignature(c, this.n.bitLength())
}

function _rsasign_signStringWithSHA1(a) {
    return _rsasign_signString.call(this, a, "sha1")
}

function _rsasign_signStringWithSHA256(a) {
    return _rsasign_signString.call(this, a, "sha256")
}

function pss_mgf1_str(a, b, c) {
    for (var d = "", e = 0; d.length < b;) d += hextorstr(c(rstrtohex(a + String.fromCharCode.apply(String, [(e & 4278190080) >> 24, (e & 16711680) >> 16, (e & 65280) >> 8, e & 255])))), e += 1;
    return d
}

function _rsasign_signStringPSS(a, b, c) {
    a = rstrtohex(a);
    a = KJUR.crypto.Util.hashHex(a, b);
    void 0 === c && (c = -1);
    return this.signWithMessageHashPSS(a, b, c)
}

function _rsasign_signWithMessageHashPSS(a, b, c) {
    var d = hextorstr(a);
    a = d.length;
    var e = this.n.bitLength() - 1,
        f = Math.ceil(e / 8),
        g = function(a) {
            return KJUR.crypto.Util.hashHex(a, b)
        };
    if (-1 === c || void 0 === c) c = a;
    else if (-2 === c) c = f - a - 2;
    else if (-2 > c) throw "invalid salt length";
    if (f < a + c + 2) throw "data too long";
    var h = "";
    0 < c && (h = Array(c), (new SecureRandom).nextBytes(h), h = String.fromCharCode.apply(String, h));
    for (var l = hextorstr(g(rstrtohex("\x00\x00\x00\x00\x00\x00\x00\x00" + d + h))), k = [], d = 0; d < f - c - a - 2; d += 1) k[d] = 0;
    c = String.fromCharCode.apply(String,
        k) + "\u0001" + h;
    g = pss_mgf1_str(l, c.length, g);
    h = [];
    for (d = 0; d < c.length; d += 1) h[d] = c.charCodeAt(d) ^ g.charCodeAt(d);
    h[0] &= ~(65280 >> 8 * f - e & 255);
    for (d = 0; d < a; d++) h.push(l.charCodeAt(d));
    h.push(188);
    return _zeroPaddingOfSignature(this.doPrivate(new BigInteger(h)).toString(16), this.n.bitLength())
}

function _rsasign_getDecryptSignatureBI(a, b, c) {
    var d = new RSAKey;
    d.setPublic(b, c);
    return d.doPublic(a)
}

function _rsasign_getHexDigestInfoFromSig(a, b, c) {
    return _rsasign_getDecryptSignatureBI(a, b, c).toString(16).replace(/^1f+00/, "")
}

function _rsasign_getAlgNameAndHashFromHexDisgestInfo(a) {
    for (var b in KJUR.crypto.Util.DIGESTINFOHEAD) {
        var c = KJUR.crypto.Util.DIGESTINFOHEAD[b],
            d = c.length;
        if (a.substring(0, d) == c) return [b, a.substring(d)]
    }
    return []
}

function _rsasign_verifySignatureWithArgs(a, b, c, d) {
    b = _rsasign_getHexDigestInfoFromSig(b, c, d);
    c = _rsasign_getAlgNameAndHashFromHexDisgestInfo(b);
    if (0 == c.length) return !1;
    b = c[1];
    a = KJUR.crypto.Util.hashString(a, c[0]);
    return b == a
}

function _rsasign_verifyHexSignatureForMessage(a, b) {
    var c = parseBigInt(a, 16);
    return _rsasign_verifySignatureWithArgs(b, c, this.n.toString(16), this.e.toString(16))
}

function _rsasign_verifyString(a, b) {
    b = b.replace(_RE_HEXDECONLY, "");
    b = b.replace(/[ \n]+/g, "");
    var c = parseBigInt(b, 16);
    if (c.bitLength() > this.n.bitLength()) return 0;
    var c = this.doPublic(c).toString(16).replace(/^1f+00/, ""),
        d = _rsasign_getAlgNameAndHashFromHexDisgestInfo(c);
    if (0 == d.length) return !1;
    c = d[1];
    d = KJUR.crypto.Util.hashString(a, d[0]);
    return c == d
}

function _rsasign_verifyWithMessageHash(a, b) {
    b = b.replace(_RE_HEXDECONLY, "");
    b = b.replace(/[ \n]+/g, "");
    var c = parseBigInt(b, 16);
    if (c.bitLength() > this.n.bitLength()) return 0;
    c = this.doPublic(c).toString(16).replace(/^1f+00/, "");
    c = _rsasign_getAlgNameAndHashFromHexDisgestInfo(c);
    return 0 == c.length ? !1 : c[1] == a
}

function _rsasign_verifyStringPSS(a, b, c, d) {
    a = rstrtohex(a);
    a = KJUR.crypto.Util.hashHex(a, c);
    void 0 === d && (d = -1);
    return this.verifyWithMessageHashPSS(a, b, c, d)
}

function _rsasign_verifyWithMessageHashPSS(a, b, c, d) {
    var e = new BigInteger(b, 16);
    if (e.bitLength() > this.n.bitLength()) return !1;
    b = function(a) {
        return KJUR.crypto.Util.hashHex(a, c)
    };
    a = hextorstr(a);
    var f = a.length,
        g = this.n.bitLength() - 1,
        h = Math.ceil(g / 8);
    if (-1 === d || void 0 === d) d = f;
    else if (-2 === d) d = h - f - 2;
    else if (-2 > d) throw "invalid salt length";
    if (h < f + d + 2) throw "data too long";
    for (var l = this.doPublic(e).toByteArray(), e = 0; e < l.length; e += 1) l[e] &= 255;
    for (; l.length < h;) l.unshift(0);
    if (188 !== l[h - 1]) throw "encoded message does not end in 0xbc";
    var l = String.fromCharCode.apply(String, l),
        k = l.substr(0, h - f - 1),
        l = l.substr(k.length, f),
        u = 65280 >> 8 * h - g & 255;
    if (0 !== (k.charCodeAt(0) & u)) throw "bits beyond keysize not zero";
    for (var y = pss_mgf1_str(l, k.length, b), g = [], e = 0; e < k.length; e += 1) g[e] = k.charCodeAt(e) ^ y.charCodeAt(e);
    g[0] &= ~u;
    f = h - f - d - 2;
    for (e = 0; e < f; e += 1)
        if (0 !== g[e]) throw "leftmost octets not zero";
    if (1 !== g[f]) throw "0x01 marker not found";
    return l === hextorstr(b(rstrtohex("\x00\x00\x00\x00\x00\x00\x00\x00" + a + String.fromCharCode.apply(String, g.slice(-d)))))
}
RSAKey.prototype.signWithMessageHash = _rsasign_signWithMessageHash;
RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.signStringWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signStringWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.sign = _rsasign_signString;
RSAKey.prototype.signWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.signWithMessageHashPSS = _rsasign_signWithMessageHashPSS;
RSAKey.prototype.signStringPSS = _rsasign_signStringPSS;
RSAKey.prototype.signPSS = _rsasign_signStringPSS;
RSAKey.SALT_LEN_HLEN = -1;
RSAKey.SALT_LEN_MAX = -2;
RSAKey.prototype.verifyWithMessageHash = _rsasign_verifyWithMessageHash;
RSAKey.prototype.verifyString = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage = _rsasign_verifyHexSignatureForMessage;
RSAKey.prototype.verify = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForByteArrayMessage = _rsasign_verifyHexSignatureForMessage;
RSAKey.prototype.verifyWithMessageHashPSS = _rsasign_verifyWithMessageHashPSS;
RSAKey.prototype.verifyStringPSS = _rsasign_verifyStringPSS;
RSAKey.prototype.verifyPSS = _rsasign_verifyStringPSS;
RSAKey.SALT_LEN_RECOVER = -2;
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    b64padchar = "=";

function hex2b64(a) {
    var b, c, d = "";
    for (b = 0; b + 3 <= a.length; b += 3) c = parseInt(a.substring(b, b + 3), 16), d += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    b + 1 == a.length ? (c = parseInt(a.substring(b, b + 1), 16), d += b64map.charAt(c << 2)) : b + 2 == a.length && (c = parseInt(a.substring(b, b + 2), 16), d += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4));
    for (; 0 < (d.length & 3);) d += b64padchar;
    return d
}

function b64tohex(a) {
    var b = "",
        c, d = 0,
        e, f;
    for (c = 0; c < a.length && a.charAt(c) != b64padchar; ++c) f = b64map.indexOf(a.charAt(c)), 0 > f || (0 == d ? (b += int2char(f >> 2), e = f & 3, d = 1) : 1 == d ? (b += int2char(e << 2 | f >> 4), e = f & 15, d = 2) : 2 == d ? (b += int2char(e), b += int2char(f >> 2), e = f & 3, d = 3) : (b += int2char(e << 2 | f >> 4), b += int2char(f & 15), d = 0));
    1 == d && (b += int2char(e << 2));
    return b
}

function b64toBA(a) {
    a = b64tohex(a);
    var b, c = [];
    for (b = 0; 2 * b < a.length; ++b) c[b] = parseInt(a.substring(2 * b, 2 * b + 2), 16);
    return c
}
if ("undefined" === typeof SIPHandle) var SIPHandle = {};

function initSIPHandle(a) {
    SIPHandle[a] = {
        clientRandom: null,
        serverRandom: null,
        publicKey: null,
        inputRegex: null,
        maxLength: DEFAULT_MAX_LENGTH,
        minLength: DEFAULT_MIN_LENGTH,
        errorCode: CFCA_OK,
        encryptor: null,
        encryptedValue: new CryptoJS.lib.WordArray.init
    };
    return CFCA_OK
}

function getInnerEncryptedValueLength(a) {
    return "undefined" === typeof SIPHandle[a] ? -1 : SIPHandle[a].encryptedValue.sigBytes
}

function initSIPEncryptor(a) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    if (null === SIPHandle[a].serverRandom) return CFCA_ERROR_SERVER_RANDOM_IS_NULL;
    if (16 > SIPHandle[a].serverRandom.length) return CFCA_ERROR_SERVER_RANDOM_TOO_SHORT;
    a = SIPHandle[a];
    var b = CryptoJS.enc.Latin1.parse(a.serverRandom.slice(0, 16)),
        b = convertHelper(b.words, b.sigBytes),
        c = Array(16),
        d = "";
    rng_get_bytes_without0(c, 0, 16);
    for (var e = 0; e < c.length; e++) d += (c[e] >>> 4).toString(16), d += (c[e] & 15).toString(16);
    a.clientRandom = CryptoJS.enc.Hex.parse(d);
    d = [];
    for (e = 0; 16 > e; e++) {
        var f = (b[e] ^ c[e]) & 255;
        d.push((f >>> 4).toString(16));
        d.push((f & 15).toString(16))
    }
    a.encryptor = CryptoJS.algo.RC4.createEncryptor(CryptoJS.enc.Hex.parse(d.join("")));
    return CFCA_OK
}

function insertCharacter(a, b) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    if (null === SIPHandle[a].serverRandom) return CFCA_ERROR_SERVER_RANDOM_IS_NULL;
    if (null != SIPHandle[a].inputRegex && b.match(SIPHandle[a].inputRegex) != b) return CFCA_ERROR_NOT_MATCH_INPUT_REGEX;
    if (null == SIPHandle[a].encryptor) {
        var c = initSIPEncryptor(a);
        if (c != CFCA_OK) return c
    }
    SIPHandle[a].encryptedValue.concat(SIPHandle[a].encryptor.finalize(b));
    return CFCA_OK
}

function verifyRSASignature(a, b, c) {
    var d = ASN1HEX.getPosArrayOfChildren_AtObj(a, 0);
    if (2 != d.length) return !1;
    var e = ASN1HEX.getHexOfV_AtObj(a, d[0]);
    a = ASN1HEX.getHexOfV_AtObj(a, d[1]);
    d = new RSAKey;
    d.setPublic(e, a);
    return d.verifyString(b, c)
}

function setPublicKey(a, b, c) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    var d = b64tohex(CMBC_VERIFY_PUBLICKEY_PRODUCT);
    if (verifyRSASignature(d, b, c)) SIPHandle[a].publicKey = b;
    else if (d = b64tohex(CMBC_VERIFY_PUBLICKEY_TEST), verifyRSASignature(d, b, c)) SIPHandle[a].publicKey = b;
    else return SIPHandle[a].publicKey = null, CFCA_ERROR_PUBLIC_KEY_INVALID;
    return CFCA_OK
}

function setServerRandom(a, b) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    if (0 < getInnerEncryptedValueLength(a)) return CFCA_ERROR_SERVER_RANDOM_WITH_INPUT;
    SIPHandle[a].serverRandom = null == b || 0 == b.length ? null : b;
    return initSIPEncryptor(a)
}

function getMaxLength(a) {
    return SIPHandle[a].maxLength
}

function setMaxLength(a, b) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    if (0 > b) return CFCA_ERROR_INVALID_PARAMETER;
    SIPHandle[a].maxLength = b;
    return CFCA_OK
}

function setMinLength(a, b) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    if (0 > b) return CFCA_ERROR_INVALID_PARAMETER;
    SIPHandle[a].minLength = b;
    return CFCA_OK
}

function setInputRegex(a, b) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    SIPHandle[a].inputRegex = null == b || 0 == b.length ? null : b;
    return CFCA_OK
}

function RSAEncryptForArray(a, b) {
    var c = ASN1HEX.getPosArrayOfChildren_AtObj(a, 0);
    if (2 != c.length) return !1;
    var d = ASN1HEX.getHexOfV_AtObj(a, c[0]),
        c = ASN1HEX.getHexOfV_AtObj(a, c[1]),
        e = new RSAKey;
    e.setPublic(d, c);
    return e.encryptForArrayNoPadding(b)
}

function getEncryptedValue(a) {
    if ("undefined" === typeof SIPHandle[a]) return SIPHandle[a].errorCode = CFCA_ERROR_INVALID_SIP_HANDLE_ID, null;
    if (null == SIPHandle[a].serverRandom) return SIPHandle[a].errorCode = CFCA_ERROR_SERVER_RANDOM_IS_NULL, null;
    if (16 > SIPHandle[a].serverRandom.length) return SIPHandle[a].errorCode = CFCA_ERROR_SERVER_RANDOM_TOO_SHORT, null;
    if (null == SIPHandle[a].publicKey) return SIPHandle[a].errorCode = CFCA_ERROR_PUBLIC_KEY_IS_NULL, null;
    if (0 === SIPHandle[a].encryptedValue.sigBytes) return SIPHandle[a].errorCode =
        CFCA_ERROR_INPUT_VALUE_IS_NULL, null;
    var b = SIPHandle[a].encryptedValue.words,
        c = SIPHandle[a].encryptedValue.sigBytes;
    if (c < SIPHandle[a].minLength || c > SIPHandle[a].maxLength) return SIPHandle[a].errorCode = CFCA_ERROR_INPUT_LENGTH_OUT_OF_RANGE, null;
    var d = SIPHandle[a].serverRandom.length.toString(),
        e = 1 == d.length ? "0" + d + SIPHandle[a].serverRandom : d + SIPHandle[a].serverRandom;
    if (128 <= e.length + c + 2 + 1 + 16) return SIPHandle[a].errorCode = CFCA_ERROR_INPUT_VALUE_OR_SERVER_RANDOM_TOO_LONG, null;
    d = Array(128);
    d[0] = 0;
    d[1] = 2;
    for (var f = 0; f < e.length; f++) d[f + 2] = e.charCodeAt(f);
    for (var f = convertHelper(SIPHandle[a].clientRandom.words, SIPHandle[a].clientRandom.sigBytes), g = 2 + e.length, h = 0; h < f.length; h++) d[h + g] = f[h];
    g = 126 - e.length - 1 - c - 16;
    rng_get_bytes_without0(d, 2 + e.length + 16, g);
    g = 2 + e.length + g + 16;
    d[g] = 0;
    g += 1;
    b = convertHelper(b, c);
    for (f = 0; f < c; f++) d[f + g] = b[f];
    c = hex2b64(RSAEncryptForArray(SIPHandle[a].publicKey, d));
    SIPHandle[a].errorCode = CFCA_OK;
    return c
}

function clearAllCharacters(a) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    SIPHandle[a].encryptedValue = new CryptoJS.lib.WordArray.init;
    return initSIPEncryptor(a)
}

function setOutputType(a, b) {
    if ("undefined" === typeof SIPHandle[a]) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    SIPHandle[a].outputType = b;
    return CFCA_OK
}

function getErrorCode(a) {
    return "undefined" === typeof SIPHandle[a] ? CFCA_ERROR_INVALID_SIP_HANDLE_ID : SIPHandle[a].errorCode
}

function convertHelper(a, b) {
    for (var c = [], d = 0; d < b; d++) c.push(a[d >>> 2] >>> 24 - d % 4 * 8 & 255);
    return c
}
var viewportSize = viewportSize || {};
viewportSize.getHeight = function() {
    return getSize("Height")
};
viewportSize.getWidth = function() {
    return getSize("Width")
};
var getSize = function(a) {
    var b = window.document.documentElement;
    return void 0 === window["inner" + a] ? b["client" + a] : window["inner" + a]
};
if (document.all && !window.setTimeout.isPolyfill) {
    var __nativeST__ = window.setTimeout;
    window.setTimeout = function(a, b) {
        var c = Array.prototype.slice.call(arguments, 2);
        return __nativeST__(a instanceof Function ? function() {
            a.apply(null, c)
        } : a, b)
    };
    window.setTimeout.isPolyfill = !0
}
if (document.all && !window.setInterval.isPolyfill) {
    var __nativeSI__ = window.setInterval;
    window.setInterval = function(a, b) {
        var c = Array.prototype.slice.call(arguments, 2);
        return __nativeSI__(a instanceof Function ? function() {
            a.apply(null, c)
        } : a, b)
    };
    window.setInterval.isPolyfill = !0
}

function contentLoaded(a, b) {
    var c = !1,
        d = !0,
        e = a.document,
        f = e.documentElement,
        g = e.addEventListener,
        h = g ? "addEventListener" : "attachEvent",
        l = g ? "removeEventListener" : "detachEvent",
        k = g ? "" : "on",
        u = function(d) {
            if ("readystatechange" != d.type || "complete" == e.readyState)("load" == d.type ? a : e)[l](k + d.type, u, !1), !c && (c = !0) && b.call(a, d.type || d)
        },
        y = function() {
            try {
                f.doScroll("left")
            } catch (a) {
                setTimeout(y, 50);
                return
            }
            u("poll")
        };
    if ("complete" == e.readyState) b.call(a, "lazy");
    else {
        if (!g && f.doScroll) {
            try {
                d = !a.frameElement
            } catch (A) {}
            d &&
                y()
        }
        e[h](k + "DOMContentLoaded", u, !1);
        e[h](k + "readystatechange", u, !1);
        a[h](k + "load", u, !1)
    }
}

function CFCAKeyboard(a, b) {
    return this._construct(a, b)
}
CFCAKeyboard.keyboards = {};
CFCAKeyboard.layoutParams = {
    marginLeftOfLetterA: "5.625%",
    widthMiddle: "13.75%",
    widthLarge: "18.75%",
    widthSpace: "58.75%"
};
CFCAKeyboard.SPLIT_STRING = "___";
CFCAKeyboard.BLANK_DIV_NAME = "_INNER_BLANK_";
CFCAKeyboard.blankHeight = 0;
CFCAKeyboard.windowHeight = viewportSize.getHeight();
CFCAKeyboard.windowWidth = viewportSize.getWidth();
CFCAKeyboard.originWindowHeight = viewportSize.getHeight();
CFCAKeyboard.originWindowWidth = viewportSize.getWidth();
contentLoaded(window, function(a) {
    window.setTimeout(function() {
        CFCAKeyboard.originWindowHeight = Math.max(viewportSize.getHeight(), CFCAKeyboard.originWindowHeight);
        CFCAKeyboard.originWindowWidth = Math.max(viewportSize.getWidth(), CFCAKeyboard.originWindowWidth)
    }, 800)
});
CFCAKeyboard.insertAfter = function(a, b) {
    var c = b.parentNode;
    c.lastChild == b ? c.appendChild(a) : c.insertBefore(a, b.nextSibling)
};
CFCAKeyboard.Range = function(a, b) {
    this.N = a;
    this.M = b
};
CFCAKeyboard.Range.prototype.getMin = function() {
    return this.N
};
CFCAKeyboard.Range.prototype.getMax = function() {
    return this.M
};
CFCAKeyboard.Range.prototype.include = function(a) {
    return a >= this.N && a <= this.M
};
CFCAKeyboard.lengthProperties = {};
CFCAKeyboard.lengthProperties.initialize = function(a) {
    CFCAKeyboard.lengthProperties[a] = {
        total: 0,
        lower: 0,
        upper: 0,
        digit: 0,
        special: 0
    }
};
CFCAKeyboard.lengthProperties._addLower = function(a) {
    void 0 != CFCAKeyboard.lengthProperties[a] && (CFCAKeyboard.lengthProperties[a].lower += 1, CFCAKeyboard.lengthProperties[a].total += 1)
};
CFCAKeyboard.lengthProperties._addUpper = function(a) {
    void 0 != CFCAKeyboard.lengthProperties[a] && (CFCAKeyboard.lengthProperties[a].upper += 1, CFCAKeyboard.lengthProperties[a].total += 1)
};
CFCAKeyboard.lengthProperties._addDigit = function(a) {
    void 0 != CFCAKeyboard.lengthProperties[a] && (CFCAKeyboard.lengthProperties[a].digit += 1, CFCAKeyboard.lengthProperties[a].total += 1)
};
CFCAKeyboard.lengthProperties._addSpecial = function(a) {
    void 0 != CFCAKeyboard.lengthProperties[a] && (CFCAKeyboard.lengthProperties[a].special += 1, CFCAKeyboard.lengthProperties[a].total += 1)
};
CFCAKeyboard.lengthProperties._clear = function(a) {
    void 0 != CFCAKeyboard.lengthProperties[a] && CFCAKeyboard.lengthProperties.initialize(a)
};
var CFCADevice = {};
CFCADevice.userAgent = window.navigator.userAgent.toLowerCase();
CFCADevice.find = function(a) {
    return -1 !== CFCADevice.userAgent.indexOf(a)
};
CFCADevice.ios = function() {
    return CFCADevice.iphone() || CFCADevice.ipad() || CFCADevice.ipod()
};
CFCADevice.iphone = function() {
    return !CFCADevice.windows() && CFCADevice.find("iphone")
};
CFCADevice.ipod = function() {
    return CFCADevice.find("ipod")
};
CFCADevice.ipad = function() {
    return CFCADevice.find("ipad")
};
CFCADevice.android = function() {
    return !CFCADevice.windows() && CFCADevice.find("android")
};
CFCADevice.androidPhone = function() {
    return CFCADevice.android() && CFCADevice.find("mobile")
};
CFCADevice.androidTablet = function() {
    return CFCADevice.android() && !CFCADevice.find("mobile")
};
CFCADevice.windows = function() {
    return CFCADevice.find("windows")
};
CFCADevice.fk_android = function() {
    return CFCADevice.android() && (CFCADevice.find("mqqbrowser") || CFCADevice.find("ucbrowser"))
};
CFCADevice.mobile = function() {
    return CFCADevice.android() || CFCADevice.ios()
};
var CFCATouchEvent = CFCATouchEvent || {};
CFCATouchEvent.touchKeys = [];
CFCATouchEvent.touchMove = "touchmove" + (window.navigator.msPointerEnabled ? " MSPointerMove" : "");
CFCATouchEvent.touchStart = "touchstart" + (window.navigator.msPointerEnabled ? " MSPointerDown" : "");
CFCATouchEvent.touchEnd = "touchend" + (window.navigator.msPointerEnabled ? " MSPointerUp" : "");
CFCATouchEvent.preventHandler = function(a) {
    a.preventDefault && a.preventDefault()
};
CFCATouchEvent.touchStartHandler = function(a) {
    CFCATouchEvent.touchKeys.push(a);
    var b = a.element,
        c = b.id.indexOf(CFCAKeyboard.SPLIT_STRING);
    a = b.id.substring(0, c);
    var c = b.id.substring(c + CFCAKeyboard.SPLIT_STRING.length),
        d = parseInt(c);
    a = CFCAKeyboard.keyboards[a];
    switch (c) {
        case "caps":
            a.bShift || (b.className = "cfca-btn cfca-mod-click");
            break;
        case "del":
        case "sp":
        case "done":
            b.className = "cfca-btn cfca-mod-click";
            break;
        default:
            if (!isNaN(d)) {
                c = a.bCaps ? b.value.toUpperCase() : b.value.toLowerCase();
                if (void 0 === c ||
                    0 === c.length) break;
                b.className = "cfca-btn cfca-click";
                var b = a._getLocation(b),
                    d = viewportSize.getHeight(),
                    e = viewportSize.getWidth();
                null != b && d > e && a.keyboardType == KEYBOARD_TYPE_COMPLETE && (CFCAKeyboard.bubble = new Bubble(b.x - b.w / 2, b.y - b.h, 2 * b.w, b.h, c), CFCAKeyboard.bubble.show())
            }
    }
};
CFCATouchEvent.touchCancelHandler = function(a) {
    CFCATouchEvent.touchKeys.pop();
    a = a.element;
    var b = a.id.indexOf(CFCAKeyboard.SPLIT_STRING),
        c = a.id.substring(0, b),
        c = CFCAKeyboard.keyboards[c],
        b = a.id.substring(b + CFCAKeyboard.SPLIT_STRING.length);
    switch (b) {
        case "caps":
            c.bShift || (a.className = "cfca-btn cfca-mod");
            break;
        case "del":
        case "sp":
        case "done":
            a.className = "cfca-btn cfca-mod";
            break;
        default:
            if (!isNaN(parseInt(b))) {
                b = a.value;
                if (void 0 === b || 0 === b.length) break;
                a.className = "cfca-btn cfca-default";
                "object" ===
                typeof CFCAKeyboard.bubble && (CFCAKeyboard.bubble.remove(), delete CFCAKeyboard.bubble)
            }
    }
};
CFCATouchEvent.touchEndHandler = function(a) {
    CFCATouchEvent.touchKeys.pop();
    a = a.element;
    var b = a.id.indexOf(CFCAKeyboard.SPLIT_STRING),
        c = a.id.substring(0, b),
        b = a.id.substring(b + CFCAKeyboard.SPLIT_STRING.length),
        c = CFCAKeyboard.keyboards[c];
    switch (b) {
        case "caps":
            c.bShift || (c.bCaps = !c.bCaps, a.className = "cfca-btn cfca-mod", c._refresh());
            break;
        case "del":
            a.className = "cfca-btn cfca-mod";
            c._deleteAllCharacters();
            break;
        case "sp":
            a.className = "cfca-btn cfca-mod";
            c.bShift = !c.bShift;
            c._refresh();
            break;
        case "done":
            a.className =
                "cfca-btn cfca-mod";
            c._show(!1);
            void 0 != c._onDone && c._onDone(c.sipHandleID);
            break;
        default:
            if (!isNaN(parseInt(b))) {
                b = c.bCaps ? a.value.toUpperCase() : a.value.toLowerCase();
                if (void 0 === b || 0 === b.length) break;
                a.className = "cfca-btn cfca-default";
                c._insertCharacter(b);
                "object" === typeof CFCAKeyboard.bubble && (CFCAKeyboard.bubble.remove(), delete CFCAKeyboard.bubble)
            }
    }
};
CFCATouchEvent.setupEvent = function(a, b, c) {
    b = b.split(" ");
    for (var d = 0; d < b.length; d++) a.addEventListener(b[d], c, !1)
};
CFCATouchEvent.removeEvent = function(a, b, c) {
    b = b.split(" ");
    for (var d = 0; d < b.length; d++) a.removeEventListener(b[d], c, !1)
};
CFCAKeyboard.clickbuster = {};
CFCAKeyboard.clickbuster.coordinates = [];
CFCAKeyboard.FastButton = function(a) {
    this.element = a;
    CFCATouchEvent.setupEvent(a, CFCATouchEvent.touchStart, this);
    a.addEventListener("click", this, !1)
};
CFCAKeyboard.FastButton.startHandler = CFCATouchEvent.touchStartHandler;
CFCAKeyboard.FastButton.cancelHandler = CFCATouchEvent.touchCancelHandler;
CFCAKeyboard.FastButton.endHandler = CFCATouchEvent.touchEndHandler;
CFCAKeyboard.FastButton.prototype.handleEvent = function(a) {
    switch (a.type) {
        case "touchstart":
        case "pointerdown":
            this.onTouchStart(a);
            break;
        case "touchmove":
        case "pointermove":
            this.onTouchMove(a);
            break;
        case "touchend":
        case "pointerup":
            this.onClick(a);
            break;
        case "click":
            this.onClick(a)
    }
};
CFCAKeyboard.FastButton.prototype.onTouchStart = function(a) {
    a.preventDefault && a.preventDefault();
    a.stopPropagation && a.stopPropagation();
    for (var b = 0; b < CFCATouchEvent.touchKeys.length; b++) CFCATouchEvent.touchKeys[b].reset(), CFCAKeyboard.FastButton.cancelHandler(CFCATouchEvent.touchKeys[b]);
    CFCAKeyboard.FastButton.startHandler(this);
    CFCATouchEvent.setupEvent(this.element, CFCATouchEvent.touchEnd, this);
    CFCATouchEvent.setupEvent(document.body, CFCATouchEvent.touchMove, this);
    this.startX = a.clientX || a.changedTouches[0].clientX;
    this.startY = a.clientY || a.changedTouches[0].clientY
};
CFCAKeyboard.FastButton.prototype.onTouchMove = function(a) {
    if (!window.navigator.msPointerEnabled || a.isPrimary) {
        if (window.navigator.msPointerEnabled) {
            if (10 >= Math.abs(a.clientX - this.startX) && 10 >= Math.abs(a.clientY - this.startY)) return
        } else
            for (var b = 0; b < a.touches.length; b++)
                if (10 >= Math.abs(a.touches[b].clientX - this.startX) && 10 >= Math.abs(a.touches[b].clientY - this.startY)) return;
        this.reset();
        CFCAKeyboard.FastButton.cancelHandler(this)
    }
};
CFCAKeyboard.FastButton.prototype.onClick = function(a) {
    a.stopPropagation && a.stopPropagation();
    this.reset();
    CFCAKeyboard.FastButton.endHandler(this);
    "touchend" != a.type && "pointerup" != a.type || CFCAKeyboard.clickbuster.preventGhostClick(this.startX, this.startY)
};
CFCAKeyboard.FastButton.prototype.reset = function() {
    CFCATouchEvent.removeEvent(this.element, CFCATouchEvent.touchEnd, this);
    CFCATouchEvent.removeEvent(document.body, CFCATouchEvent.touchMove, this)
};
CFCAKeyboard.clickbuster.preventGhostClick = function(a, b) {
    CFCAKeyboard.clickbuster.coordinates.push(a, b);
    window.setTimeout(CFCAKeyboard.clickbuster.pop, 2500)
};
CFCAKeyboard.clickbuster.pop = function() {
    CFCAKeyboard.clickbuster.coordinates.splice(0, 2)
};
CFCAKeyboard.clickbuster.onClick = function(a) {
    for (var b = 0; b < CFCAKeyboard.clickbuster.coordinates.length; b += 2) {
        var c = CFCAKeyboard.clickbuster.coordinates[b + 1];
        25 > Math.abs(a.clientX - CFCAKeyboard.clickbuster.coordinates[b]) && 25 > Math.abs(a.clientY - c) && (a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault())
    }
};
document.addEventListener("click", CFCAKeyboard.clickbuster.onClick, !0);
CFCAKeyboard.NORMAL_KEYS = "1234567890qwertyuiopasdfghjklzxcvbnm".split("");
CFCAKeyboard.CAPS_KEYS = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM".split("");
CFCAKeyboard.SHIFT_KEYS = "! @ # $ % ^ & * ( ) - _ + { } [ ] < > : ; \" ' , . ? = / \\   | ~ `  ".split(" ");
CFCAKeyboard.NUMBER_KEYS = "1234567890".split("");
CFCAKeyboard.prototype._setKeyState = function(a) {
    new CFCAKeyboard.FastButton(a)
};
CFCAKeyboard.prototype._getLocation = function(a) {
    if (void 0 == a) return null;
    for (var b = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }, c = a, d = 0, e = 0; c;) d += c.offsetLeft, e += c.offsetTop, c = c.offsetParent;
    b.x = d;
    b.y = e;
    b.w = a.offsetWidth;
    b.h = a.offsetHeight;
    return b
};
CFCAKeyboard.prototype._heightLine = function() {
    var a = Math.min(CFCAKeyboard.originWindowHeight, CFCAKeyboard.originWindowWidth),
        b = Math.min(viewportSize.getHeight(), viewportSize.getWidth()),
        a = Math.max(a, b),
        b = window.screen ? Math.min(window.screen.availHeight, window.screen.availWidth) : NaN;
    isNaN(b) || (b < 1.5 * a ? a = Math.max(b, a) : window.devicePixelRatio && (a = window.screen.availWidth == viewportSize.getWidth() * window.devicePixelRatio || window.screen.availHeight == viewportSize.getWidth() * window.devicePixelRatio ? Math.max(b /
        window.devicePixelRatio, a) : Math.max(b / window.devicePixelRatio - 50, a)));
    return Math.floor(this.scale * a)
};
CFCAKeyboard.prototype._defaultFontSize = function() {
    return Math.floor(14 * this._heightLine() / 25)
};
CFCAKeyboard.prototype._heightLineNumber = function() {
    return this._heightLine()
};
CFCAKeyboard.prototype._defaultFontSizeNumber = function() {
    return this._defaultFontSize()
};
CFCAKeyboard.prototype._updateHeightLine = function() {
    this.heightLine = this._heightLine();
    this.heightLineNumber = this._heightLineNumber();
    this.defaultFontSize = this._defaultFontSize();
    this.defaultFontSizeNumber = this._defaultFontSizeNumber()
};
CFCAKeyboard.prototype._initProperty = function(a, b) {
    var c = (this.bExists = void 0 != this.container) ? this.container : document.getElementById(a);
    this.bExists || (this.scale = CFCADevice.ipad() || CFCADevice.androidTablet() ? .0625 : .125, this.bRefreshMargin = this.bShift = this.bCaps = !1, this.numberKeys = [], this.completeKeys = [], this.modKeys = {}, this.keyboardType = void 0 === b || b === KEYBOARD_TYPE_COMPLETE ? KEYBOARD_TYPE_COMPLETE : KEYBOARD_TYPE_DIGITAL, this.container = c, this.container.className = "cfca-keyboard", this.sipHandleID = void 0,
        this._updateHeightLine(), this.timeoutIDs = {}, CFCAKeyboard.keyboards[a] = this)
};
CFCAKeyboard.prototype._createKeyboardMain = function() {
    var a = this.bExists ? this.container.childNodes[1] : document.createElement("DIV");
    this.bExists || (this.container.appendChild(a), a.style.position = "relative", a.style.top = "0px", a.style.left = "0px");
    return a
};
CFCAKeyboard.prototype._createKey = function(a, b, c) {
    b = this.container.id + b;
    var d = document.createElement("SPAN");
    a.appendChild(d);
    a = document.createElement(c);
    d.appendChild(a);
    a.id = b;
    this._setKeyState(a);
    return a
};
CFCAKeyboard.prototype._createCompleteKey = function(a, b) {
    var c = this._createKey(a, b, "INPUT");
    c.parentNode.className = "col";
    c.parentNode.style.height = this.heightLine + "px";
    c.className = "cfca-btn cfca-default";
    c.setAttribute("type", "button");
    c.style.height = this.heightLine + "px";
    c.style.fontSize = this.defaultFontSize + "px";
    return c
};
CFCAKeyboard.prototype._createCompleteRow = function(a, b, c) {
    var d = document.createElement("DIV");
    d.className = "cfca-row";
    a.appendChild(d);
    for (a = b; a < c; a++) this.completeKeys[a] = this._createCompleteKey(d, CFCAKeyboard.SPLIT_STRING + String(a))
};
CFCAKeyboard.prototype._createModKey = function(a, b, c, d) {
    a = this._createCompleteKey(a, b);
    a.parentNode.style.width = c;
    a.value = d;
    return a
};
CFCAKeyboard.prototype._createCompleteKeyboard = function(a) {
    var b = this.bExists ? a.childNodes[0] : document.createElement("DIV");
    if (!this.bExists) {
        a.appendChild(b);
        this._createCompleteRow(b, 0, 10);
        this._createCompleteRow(b, 10, 20);
        this._createCompleteRow(b, 20, 29);
        this.completeKeys[20].parentNode.style.marginLeft = CFCAKeyboard.layoutParams.marginLeftOfLetterA;
        a = document.createElement("DIV");
        b.appendChild(a);
        a.className = "cfca-row";
        this.modKeys.caps = this._createModKey(a, CFCAKeyboard.SPLIT_STRING + "caps", CFCAKeyboard.layoutParams.widthMiddle,
            "\u21e7");
        this.modKeys.caps.className = "cfca-btn cfca-mod";
        for (var c = 29; 36 > c; c++) this.completeKeys[c] = this._createCompleteKey(a, CFCAKeyboard.SPLIT_STRING + String(c));
        this.modKeys.del = this._createModKey(a, CFCAKeyboard.SPLIT_STRING + "del", CFCAKeyboard.layoutParams.widthMiddle, "\u2190");
        this.modKeys.del.className = "cfca-btn cfca-mod";
        a = document.createElement("DIV");
        b.appendChild(a);
        a.className = "cfca-row";
        this.modKeys.sp = this._createModKey(a, CFCAKeyboard.SPLIT_STRING + "sp", CFCAKeyboard.layoutParams.widthLarge,
            "#+=");
        this.modKeys.sp.className = "cfca-btn cfca-mod";
        this.modKeys.sp.parentNode.style.marginBottom = "1%";
        this.modKeys.space = this._createModKey(a, CFCAKeyboard.SPLIT_STRING + "space", CFCAKeyboard.layoutParams.widthSpace, "");
        this.modKeys.space.className = "cfca-btn cfca-space";
        this.modKeys.space.parentNode.style.marginBottom = "1%";
        this.modKeys.done = this._createModKey(a, CFCAKeyboard.SPLIT_STRING + "done", CFCAKeyboard.layoutParams.widthLarge, "\u5b8c\u6210");
        this.modKeys.done.className = "cfca-btn cfca-mod";
        this.modKeys.done.parentNode.style.marginBottom =
            "1%"
    }
};
CFCAKeyboard.prototype._createNumberKey = function(a, b) {
    var c = this._createKey(a, b, "INPUT");
    c.parentNode.className = "col-pad";
    c.parentNode.style.height = this.heightLineNumber + "px";
    c.className = "cfca-btn cfca-default";
    c.setAttribute("type", "button");
    c.style.height = this.heightLineNumber + "px";
    c.style.fontSize = this.defaultFontSizeNumber + "px";
    return c
};
CFCAKeyboard.prototype._createNumberRow = function(a, b, c, d) {
    var e = document.createElement("DIV");
    e.className = "cfca-row";
    a.appendChild(e);
    for (a = b; a < c; a++) this.numberKeys[a - d] = this._createNumberKey(e, CFCAKeyboard.SPLIT_STRING + String(a))
};
CFCAKeyboard.prototype._createNumberKeyboard = function(a) {
    var b = this.keyboardType == KEYBOARD_TYPE_COMPLETE ? 1 : 0,
        b = this.bExists ? a.childNodes[b] : document.createElement("DIV");
    this.bExists || (a.appendChild(b), this._createNumberRow(b, 100, 103, 100), this._createNumberRow(b, 103, 106, 100), this._createNumberRow(b, 106, 109, 100), a = document.createElement("DIV"), a.className = "cfca-row", b.appendChild(a), this.modKeys.del = this._createNumberKey(a, CFCAKeyboard.SPLIT_STRING + "del"), this.modKeys.del.value = "\u2190", this.modKeys.del.className =
        "cfca-btn cfca-mod", this.numberKeys[9] = this._createNumberKey(a, CFCAKeyboard.SPLIT_STRING + "109"), this.modKeys.done = this._createNumberKey(a, CFCAKeyboard.SPLIT_STRING + "done"), this.modKeys.done.value = "\u5b8c\u6210", this.modKeys.done.className = "cfca-btn cfca-mod")
};
CFCAKeyboard.prototype._construct = function(a, b) {
    this._initProperty(a, b);
    var c = this._createKeyboardMain();
    CFCATouchEvent.setupEvent(c, "selectstart", function(a) {
        return !1
    });
    CFCATouchEvent.setupEvent(c, CFCATouchEvent.touchMove, CFCATouchEvent.preventHandler);
    CFCATouchEvent.setupEvent(c, CFCATouchEvent.touchStart, CFCATouchEvent.preventHandler);
    this.keyboardType == KEYBOARD_TYPE_DIGITAL ? this._createNumberKeyboard(c) : this._createCompleteKeyboard(c)
};
CFCAKeyboard.prototype._getKeyAndSetWidth = function(a) {
    var b = void 0,
        b = 0;
    if (58 > a) b = Math.floor(a / 2), b = this.completeKeys[b], b.parentNode.style.width = this.percentKey + "%";
    else if (58 == a || 59 == a) b = this.modKeys.caps, b.parentNode.style.width = this.percentModS + "%";
    else if (59 < a && 74 > a) b = Math.floor(a / 2) - 1, b = this.completeKeys[b], b.parentNode.style.width = this.percentKey + "%";
    else if (74 == a || 75 == a) b = this.modKeys.del, b.parentNode.style.width = this.percentModS + "%";
    else if (76 == a || 77 == a) b = this.modKeys.sp, b.parentNode.style.width =
        this.percentModM + "%";
    else if (78 == a || 79 == a) b = this.modKeys.space, b.parentNode.style.width = this.percentModL + "%";
    else if (80 == a || 81 == a) b = this.modKeys.done, b.parentNode.style.width = this.percentModM + "%";
    else return;
    return b
};
CFCAKeyboard.prototype._setPercent = function(a, b) {
    var c = this._getKeyAndSetWidth(a);
    void 0 != c && (0 == a % 2 ? (40 == a && (b += 5), c.parentNode.style.marginLeft = b + "%") : (57 == a && (b += 5), c.parentNode.style.marginRight = b + "%"))
};
CFCAKeyboard.prototype._adjustRow = function(a, b, c) {
    for (var d = 0; a < b; a++) d += c, 1 < d ? (--d, this._setPercent(a, this.percentMarginPlus1)) : this._setPercent(a, this.percentMargin)
};
CFCAKeyboard.prototype._restoreMargin = function() {
    for (var a = 0; a < this.completeKeys.length; a++) this.completeKeys[a].parentNode.style.width = "8.75%", this.completeKeys[a].parentNode.style.marginLeft = 20 == a ? "5.625%" : "0.625%", this.completeKeys[a].parentNode.style.marginRight = "0.625%";
    for (var b = ["caps", "del", "sp", "space", "done"], a = 0; a < b.length; a++) this.modKeys[b[a]].parentNode.style.marginLeft = "0.625%", this.modKeys[b[a]].parentNode.style.marginRight = "0.625%";
    this.modKeys.caps.parentNode.style.width = "13.75%";
    this.modKeys.del.parentNode.style.width = "13.75%";
    this.modKeys.sp.parentNode.style.width = "18.75%";
    this.modKeys.space.parentNode.style.width = "58.75%";
    this.modKeys.done.parentNode.style.width = "18.75%"
};
CFCAKeyboard.prototype._refreshLayoutMargin = function() {
    var a = viewportSize.getWidth(),
        b = viewportSize.getHeight();
    CFCAKeyboard.windowWidth != a && (this.bRefreshMargin = !1, CFCAKeyboard.windowWidth = a, CFCAKeyboard.windowHeight = b, CFCAKeyboard.originWindowWidth = a, CFCAKeyboard.originWindowHeight = b);
    if (this.keyboardType == KEYBOARD_TYPE_COMPLETE && !this.bRefreshMargin) {
        this.bRefreshMargin = !0;
        var c = .0875 * a,
            d = Math.floor(c),
            c = c - d,
            e = .00625 * a,
            f = Math.floor(e),
            e = e - f,
            g = .1375 * a,
            h = Math.floor(g),
            g = g - h,
            l = .1875 * a,
            k = Math.floor(l),
            l = l - k,
            u = .5875 * a,
            y = Math.floor(u),
            u = u - y; - 1E-4 > e || 1E-4 < e ? (this.percentMargin = 100 * (f + .001) / a, this.percentMarginPlus1 = 100 * (f + 1.001) / a, this.percentKey = 100 * (d + .001) / a, this.percentModS = 100 * (h + .001) / a, this.percentModM = 100 * (k + .001) / a, this.percentModL = 100 * (y + .001) / a, this._adjustRow(0, 20, e + .5 * c), this._adjustRow(20, 40, e + .5 * c), this._adjustRow(40, 58, e + .5 * c), this._adjustRow(58, 76, e + (7 * c + 2 * g) / 18), this._adjustRow(76, 82, e + (2 * l + u) / 6)) : this._restoreMargin()
    }
    CFCAKeyboard.windowHeight != b && (CFCAKeyboard.windowWidth = a, CFCAKeyboard.windowHeight =
        b)
};
CFCAKeyboard.prototype._refreshKeyHeight = function() {
    if (this.heightLine != this._heightLine()) {
        this._updateHeightLine();
        var a = this,
            b = function(b) {
                b && (b.parentNode.style.height = a._heightLineNumber() + "px", b.style.height = a._heightLineNumber() + "px", b.style.fontSize = a._defaultFontSizeNumber() + "px")
            },
            c = function(b) {
                b && (b.parentNode.style.height = a._heightLine() + "px", b.style.height = a._heightLine() + "px", b.style.fontSize = a._defaultFontSize() + "px")
            };
        this.numberKeys.forEach(b);
        this.completeKeys.forEach(c);
        var d = ["caps",
                "del", "sp", "space", "done"
            ],
            e = ["del", "done"];
        if (this.keyboardType === KEYBOARD_TYPE_COMPLETE)
            for (var f = 0; f < d.length; f++) c(this.modKeys[d[f]]);
        else
            for (f = 0; f < e.length; f++) b(this.modKeys[e[f]])
    }
};
CFCAKeyboard.prototype._refresh = function() {
    if (this.keyboardType === KEYBOARD_TYPE_COMPLETE) {
        this.bShift ? (this.bCaps = !1, this.modKeys.sp.value = "abc") : this.modKeys.sp.value = "#+=";
        for (var a = this.bShift ? CFCAKeyboard.SHIFT_KEYS : this.bCaps ? CFCAKeyboard.CAPS_KEYS : CFCAKeyboard.NORMAL_KEYS, b = a.length - 1; 0 <= b; b--) this.completeKeys[b].value = a[b], this.completeKeys[b].className = 0 == a[b].length ? "cfca-btn cfca-disable" : "cfca-btn cfca-default"
    } else
        for (a = CFCAKeyboard.NUMBER_KEYS.length - 1; 0 <= a; a--) this.numberKeys[a].value =
            CFCAKeyboard.NUMBER_KEYS[a];
    this._refreshLayoutMargin();
    this._refreshKeyHeight()
};
CFCAKeyboard.prototype._show = function(a) {
    this.container.style.display = void 0 === a || !0 === a ? "block" : "none";
    var b = document.getElementById(CFCAKeyboard.BLANK_DIV_NAME);
    if (void 0 === a || !0 === a) {
        if (this.bCaps = this.bShift = !1, this._refresh(), a = document.getElementById(this.sipHandleID))
            if (a = this._getLocation(a), null != a) {
                var c = this.keyboardType == KEYBOARD_TYPE_COMPLETE ? Math.floor(5 * this.heightLine + .06 * CFCAKeyboard.windowWidth) : Math.floor(4 * this.heightLineNumber + .08 * CFCAKeyboard.windowWidth),
                    d = document.body,
                    e = document.documentElement,
                    d = Math.max(d.scrollHeight, d.offsetHeight, e.clientHeight, e.scrollHeight, e.offsetHeight),
                    e = c - (d - (a.y + a.h)),
                    f = viewportSize.getHeight(),
                    f = c - ((f + 150 > CFCAKeyboard.originWindowHeight ? f : CFCAKeyboard.originWindowHeight) - (a.y + a.h));
                a.y + a.h + c >= d && (e += d - a.y - a.h);
                0 == e && (e = f - window.pageYOffset);
                0 <= e && (b || (b = document.createElement("DIV"), b.id = CFCAKeyboard.BLANK_DIV_NAME, CFCAKeyboard.insertAfter(b, this.container)), b.style.height = e + "px", CFCAKeyboard.blankHeight = e);
                window.scrollTo(0, Math.max(f, window.pageYOffset))
            }
    } else b &&
        b.parentNode && b.parentNode.removeChild(b), this.bCaps = !1
};
CFCAKeyboard.prototype._updateLengthProperties = function(a) {
    a = a.charCodeAt(0);
    48 <= a && 57 >= a ? CFCAKeyboard.lengthProperties._addDigit(this.sipHandleID) : 65 <= a && 90 >= a ? CFCAKeyboard.lengthProperties._addUpper(this.sipHandleID) : 97 <= a && 122 >= a ? CFCAKeyboard.lengthProperties._addLower(this.sipHandleID) : CFCAKeyboard.lengthProperties._addSpecial(this.sipHandleID)
};
CFCAKeyboard.prototype._insertCharacter = function(a) {
    if (void 0 !== this.sipHandleID) {
        var b = document.getElementById(this.sipHandleID);
        void 0 != b && void 0 !== b.value && (0 == getInnerEncryptedValueLength(this.sipHandleID) && (b.value = ""), b.value.length >= this.getMaxLength() || a && 0 == a.length || insertCharacter(this.sipHandleID, a) != CFCA_OK || (this._stopTimer(), 0 < b.value.length && "*" != b.value.charAt(b.value.length - 1) && (b.value = b.value.substring(0, b.value.length - 1).concat("*")), this._startTimer(b), b.value += a, this._updateLengthProperties(a)))
    }
};
CFCAKeyboard.prototype._deleteAllCharacters = function() {
    if (void 0 == this.sipHandleID) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    this._stopTimer();
    var a = document.getElementById(this.sipHandleID);
    if (void 0 != a && void 0 !== a.value) {
        CFCAKeyboard.lengthProperties.initialize(this.sipHandleID);
        if (0 >= getInnerEncryptedValueLength(this.sipHandleID)) return a.value = "", CFCA_OK;
        a.value = "";
        return clearAllCharacters(this.sipHandleID)
    }
};
CFCAKeyboard.prototype._stopTimer = function() {
    "number" == typeof this.timeoutIDs[this.sipHandleID] && (window.clearTimeout(this.timeoutIDs[this.sipHandleID]), delete this.timeoutIDs[this.sipHandleID])
};
CFCAKeyboard.prototype._startTimer = function(a) {
    this.timeoutIDs[this.sipHandleID] = window.setTimeout(function(a) {
        a.value = a.value.substring(0, a.value.length - 1).concat("*")
    }, 1E3, a)
};

function Bubble(a, b, c, d, e) {
    this.xLoc = Math.floor(a);
    this.yLoc = Math.floor(b);
    this.width = Math.floor(c);
    this.height = Math.floor(d);
    this.text = e
}
Bubble.prototype.show = function() {
    var a = document.getElementById("CFCABubble");
    if (a) a.style.top = this.yLoc + "px", a.style.left = this.xLoc + "px", a.style.height = this.height + "px", a.style.width = this.width + "px", a.firstChild.value = this.text;
    else {
        a = document.createElement("DIV");
        a.id = "CFCABubble";
        document.body.appendChild(a);
        var b = a.style;
        b.position = "fixed";
        b.zIndex = "99999999";
        b.top = this.yLoc + "px";
        b.left = this.xLoc + "px";
        b.height = this.height + "px";
        b.width = this.width + "px";
        b = document.createElement("INPUT");
        a.appendChild(b);
        b.className = "cfca-btn cfca-bubble";
        b.setAttribute("type", "button");
        b.value = this.text;
        b.style.fontSize = Math.floor(14 * this.height / 20) + "px";
        b.style.height = "100%";
        b.style.fontWeight = "bold"
    }
};
Bubble.prototype.remove = function() {
    var a = document.getElementById("CFCABubble") || null;
    a && a.parentNode.removeChild(a)
};
CFCAKeyboard.prototype.showKeyboard = function() {
    this._show(!0)
};
CFCAKeyboard.prototype.hideKeyboard = function() {
    this._show(!1)
};
CFCAKeyboard.prototype.isShowing = function() {
    return void 0 !== this.container && "block" === this.container.style.display
};
CFCAKeyboard.prototype.bindInputBox = function(a) {
    var b, c;
    if (void 0 === a || null === a) return CFCA_ERROR_INVALID_PARAMETER;
    "string" === typeof a ? (b = a, c = document.getElementById(b) || null) : "object" === typeof a && (b = a.id, c = a);
    if (!c) return CFCA_ERROR_INVALID_PARAMETER;
    this.sipHandleID = b;
    void 0 == SIPHandle[a] && (initSIPHandle(this.sipHandleID), CFCAKeyboard.lengthProperties.initialize(this.sipHandleID));
    return CFCA_OK
};
CFCAKeyboard.prototype.setDoneCallback = function(a) {
    "function" === typeof a && 1 === a.length && (this._onDone = a)
};
CFCAKeyboard.prototype.setPublicKey = function(a, b, c) {
    return void 0 !== c ? setPublicKey(c, a, b) : setPublicKey(this.sipHandleID, a, b)
};
CFCAKeyboard.prototype.setMaxLength = function(a, b) {
    return void 0 !== b ? setMaxLength(b, a) : setMaxLength(this.sipHandleID, a)
};
CFCAKeyboard.prototype.getMaxLength = function(a) {
    return void 0 !== a ? getMaxLength(a) : getMaxLength(this.sipHandleID)
};
CFCAKeyboard.prototype.setMinLength = function(a, b) {
    return void 0 !== b ? setMinLength(b, a) : setMinLength(this.sipHandleID, a)
};
CFCAKeyboard.prototype.getMinLength = function(a) {
    return void 0 !== a ? getMinLength(a) : getMinLength(this.sipHandleID)
};
CFCAKeyboard.prototype.setServerRandom = function(a, b) {
    return void 0 !== b ? setServerRandom(b, a) : setServerRandom(this.sipHandleID, a)
};
CFCAKeyboard.prototype.setInputRegex = function(a, b) {
    return void 0 !== b ? setInputRegex(b, a) : setInputRegex(this.sipHandleID, a)
};
CFCAKeyboard.prototype.getEncryptedInputValue = function(a) {
    a = getEncryptedValue(a ? a : this.sipHandleID);
    return "" == a ? a : _getCFCAInnerVersion() + "1@" + a
};
CFCAKeyboard.prototype.clearInputValue = function(a) {
    a = a || this.sipHandleID;
    if (void 0 === a) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    a === this.sipHandleID && this._stopTimer();
    var b = document.getElementById(a);
    if (void 0 == b || void 0 == b.value) return CFCA_ERROR_INVALID_SIP_HANDLE_ID;
    CFCAKeyboard.lengthProperties.initialize(a);
    if (0 >= getInnerEncryptedValueLength(a)) return b.value = "", CFCA_OK;
    b.value = "";
    return clearAllCharacters(a)
};
CFCAKeyboard.prototype.checkPasswordStrength = function(a, b, c, d, e, f) {
    a = a || this.sipHandleID;
    if (void 0 == a) throw Error("sipHandleID is invalid");
    a = CFCAKeyboard.lengthProperties[a];
    if (void 0 == a) throw Error("sipHandleID is invalid, please check whether input has bind");
    var g = !0;
    b && (g = g && b.include(a.total));
    c && (g = g && c.include(a.digit));
    d && (g = g && d.include(a.lower));
    e && (g = g && e.include(a.upper));
    f && (g = g && f.include(a.special));
    return g
};
CFCAKeyboard.prototype.getErrorCode = function(a) {
    return void 0 !== a ? getErrorCode(a) : getErrorCode(this.sipHandleID)
};

function getCFCAKeyboardVersion() {
    return HTML5_SIP_VERSION
}

function _getCFCAInnerVersion() {
    return "010" + HTML5_SIP_VERSION.split(".").join("")
}

function des(a, b, c, d, e, f) {
    var g = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756],
        h = [-2146402272, -2147450880,
            32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880,
            32800, -2147483648, -2146435040, -2146402272, 1081344
        ],
        l = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800,
            131592, 8, 134348808, 131584
        ],
        k = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928],
        u = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688,
            1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080
        ],
        y = [536870928, 541065216,
            16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312
        ],
        A = [2097152,
            69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154
        ],
        x = [268439616, 4096, 262144, 268701760, 268435456,
            268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696
        ];
    a = des_createKeys(a);
    var w = 0,
        B, C, D, v, r, G, E, J, F, K, L,
        M, H = b.length,
        I = 0,
        m = 32 == a.length ? 3 : 9;
    G = 3 == m ? c ? [0, 32, 2] : [30, -2, -2] : c ? [0, 32, 2, 62, 30, -2, 64, 96, 2] : [94, 62, -2, 32, 64, 2, 30, -2, -2];
    2 == f ? b += "        " : 1 == f ? (f = 8 - H % 8, b += String.fromCharCode(f, f, f, f, f, f, f, f), 8 == f && (H += 8)) : f || (b += "\x00\x00\x00\x00\x00\x00\x00\x00");
    tempresult = result = "";
    1 == d && (E = e.charCodeAt(w++) << 24 | e.charCodeAt(w++) << 16 | e.charCodeAt(w++) << 8 | e.charCodeAt(w++), F = e.charCodeAt(w++) << 24 | e.charCodeAt(w++) << 16 | e.charCodeAt(w++) << 8 | e.charCodeAt(w++), w = 0);
    for (; w < H;) {
        v = b.charCodeAt(w++) << 24 | b.charCodeAt(w++) <<
            16 | b.charCodeAt(w++) << 8 | b.charCodeAt(w++);
        r = b.charCodeAt(w++) << 24 | b.charCodeAt(w++) << 16 | b.charCodeAt(w++) << 8 | b.charCodeAt(w++);
        1 == d && (c ? (v ^= E, r ^= F) : (J = E, K = F, E = v, F = r));
        f = (v >>> 4 ^ r) & 252645135;
        r ^= f;
        v ^= f << 4;
        f = (v >>> 16 ^ r) & 65535;
        r ^= f;
        v ^= f << 16;
        f = (r >>> 2 ^ v) & 858993459;
        v ^= f;
        r ^= f << 2;
        f = (r >>> 8 ^ v) & 16711935;
        v ^= f;
        r ^= f << 8;
        f = (v >>> 1 ^ r) & 1431655765;
        r ^= f;
        v ^= f << 1;
        v = v << 1 | v >>> 31;
        r = r << 1 | r >>> 31;
        for (B = 0; B < m; B += 3) {
            L = G[B + 1];
            M = G[B + 2];
            for (e = G[B]; e != L; e += M) C = r ^ a[e], D = (r >>> 4 | r << 28) ^ a[e + 1], f = v, v = r, r = f ^ (h[C >>> 24 & 63] | k[C >>> 16 & 63] | y[C >>>
                8 & 63] | x[C & 63] | g[D >>> 24 & 63] | l[D >>> 16 & 63] | u[D >>> 8 & 63] | A[D & 63]);
            f = v;
            v = r;
            r = f
        }
        v = v >>> 1 | v << 31;
        r = r >>> 1 | r << 31;
        f = (v >>> 1 ^ r) & 1431655765;
        r ^= f;
        v ^= f << 1;
        f = (r >>> 8 ^ v) & 16711935;
        v ^= f;
        r ^= f << 8;
        f = (r >>> 2 ^ v) & 858993459;
        v ^= f;
        r ^= f << 2;
        f = (v >>> 16 ^ r) & 65535;
        r ^= f;
        v ^= f << 16;
        f = (v >>> 4 ^ r) & 252645135;
        r ^= f;
        v ^= f << 4;
        1 == d && (c ? (E = v, F = r) : (v ^= J, r ^= K));
        tempresult += String.fromCharCode(v >>> 24, v >>> 16 & 255, v >>> 8 & 255, v & 255, r >>> 24, r >>> 16 & 255, r >>> 8 & 255, r & 255);
        I += 8;
        512 == I && (result += tempresult, tempresult = "", I = 0)
    }
    return result + tempresult
}

function des_createKeys(a) {
    pc2bytes0 = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964];
    pc2bytes1 = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697];
    pc2bytes2 = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272];
    pc2bytes3 = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952,
        139264, 2236416, 134356992, 136454144
    ];
    pc2bytes4 = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256];
    pc2bytes5 = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488];
    pc2bytes6 = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746];
    pc2bytes7 = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032,
        537069568
    ];
    pc2bytes8 = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578];
    pc2bytes9 = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488];
    pc2bytes10 = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800];
    pc2bytes11 = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744];
    pc2bytes12 = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128];
    pc2bytes13 = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261];
    for (var b = 8 < a.length ? 3 : 1, c = Array(32 * b), d = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0], e, f, g = 0, h = 0, l, k = 0; k < b; k++) {
        left = a.charCodeAt(g++) << 24 | a.charCodeAt(g++) << 16 | a.charCodeAt(g++) << 8 | a.charCodeAt(g++);
        right = a.charCodeAt(g++) << 24 | a.charCodeAt(g++) << 16 | a.charCodeAt(g++) << 8 | a.charCodeAt(g++);
        l = (left >>> 4 ^ right) & 252645135;
        right ^= l;
        left ^= l << 4;
        l = (right >>> -16 ^ left) & 65535;
        left ^= l;
        right ^= l << -16;
        l = (left >>> 2 ^ right) & 858993459;
        right ^= l;
        left ^= l << 2;
        l = (right >>> -16 ^ left) & 65535;
        left ^= l;
        right ^= l << -16;
        l = (left >>> 1 ^ right) & 1431655765;
        right ^= l;
        left ^= l << 1;
        l = (right >>> 8 ^ left) & 16711935;
        left ^= l;
        right ^= l << 8;
        l = (left >>> 1 ^ right) & 1431655765;
        right ^= l;
        left ^= l << 1;
        l = left << 8 | right >>> 20 & 240;
        left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
        right = l;
        for (var u = 0; u < d.length; u++) d[u] ? (left = left << 2 | left >>> 26, right = right << 2 | right >>> 26) : (left =
            left << 1 | left >>> 27, right = right << 1 | right >>> 27), left &= -15, right &= -15, e = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15], f = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15], l = (f >>> 16 ^ e) & 65535, c[h++] = e ^ l, c[h++] = f ^ l << 16
    }
    return c
}

function removePKCS7Padding(a) {
    return a.substr(0, a.length - a.charCodeAt(a.length - 1))
}

function stringToHexForDES(a) {
    for (var b = "", c = "0123456789abcdef".split(""), d = 0; d < a.length; d++) b += c[a.charCodeAt(d) >> 4] + c[a.charCodeAt(d) & 15];
    return b
}

function hexToStringForDES(a) {
    for (var b = "", c = 0; c < a.length; c += 2) b += String.fromCharCode(parseInt(a.substr(c, 2), 16));
    return b
}

function arrayToStringForDES(a) {
    for (var b = "", c = 0; c < a.length; c++) b += String.fromCharCode(a[c]);
    return b
}

function ECFieldElementFp(a, b) {
    this.x = b;
    this.q = a
}

function feFpEquals(a) {
    return a == this ? !0 : this.q.equals(a.q) && this.x.equals(a.x)
}

function feFpToBigInteger() {
    return this.x
}

function feFpNegate() {
    return new ECFieldElementFp(this.q, this.x.negate().mod(this.q))
}

function feFpAdd(a) {
    return new ECFieldElementFp(this.q, this.x.add(a.toBigInteger()).mod(this.q))
}

function feFpSubtract(a) {
    return new ECFieldElementFp(this.q, this.x.subtract(a.toBigInteger()).mod(this.q))
}

function feFpMultiply(a) {
    return new ECFieldElementFp(this.q, this.x.multiply(a.toBigInteger()).mod(this.q))
}

function feFpSquare() {
    return new ECFieldElementFp(this.q, this.x.square().mod(this.q))
}

function feFpDivide(a) {
    return new ECFieldElementFp(this.q, this.x.multiply(a.toBigInteger().modInverse(this.q)).mod(this.q))
}
ECFieldElementFp.prototype.equals = feFpEquals;
ECFieldElementFp.prototype.toBigInteger = feFpToBigInteger;
ECFieldElementFp.prototype.negate = feFpNegate;
ECFieldElementFp.prototype.add = feFpAdd;
ECFieldElementFp.prototype.subtract = feFpSubtract;
ECFieldElementFp.prototype.multiply = feFpMultiply;
ECFieldElementFp.prototype.square = feFpSquare;
ECFieldElementFp.prototype.divide = feFpDivide;

function ECPointFp(a, b, c, d) {
    this.curve = a;
    this.x = b;
    this.y = c;
    this.z = null == d ? BigInteger.ONE : d;
    this.zinv = null
}

function pointFpGetX() {
    null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q));
    var a = this.x.toBigInteger().multiply(this.zinv);
    this.curve.reduce(a);
    return this.curve.fromBigInteger(a)
}

function pointFpGetY() {
    null == this.zinv && (this.zinv = this.z.modInverse(this.curve.q));
    var a = this.y.toBigInteger().multiply(this.zinv);
    this.curve.reduce(a);
    return this.curve.fromBigInteger(a)
}

function pointFpEquals(a) {
    return a == this ? !0 : this.isInfinity() ? a.isInfinity() : a.isInfinity() ? this.isInfinity() : a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q).equals(BigInteger.ZERO) ? a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q).equals(BigInteger.ZERO) : !1
}

function pointFpIsInfinity() {
    return null == this.x && null == this.y ? !0 : this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO)
}

function pointFpNegate() {
    return new ECPointFp(this.curve, this.x, this.y.negate(), this.z)
}

function pointFpAdd(a) {
    if (this.isInfinity()) return a;
    if (a.isInfinity()) return this;
    var b = a.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(a.z)).mod(this.curve.q),
        c = a.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(a.z)).mod(this.curve.q);
    if (BigInteger.ZERO.equals(c)) return BigInteger.ZERO.equals(b) ? this.twice() : this.curve.getInfinity();
    var d = new BigInteger("3"),
        e = this.x.toBigInteger(),
        f = this.y.toBigInteger();
    a.x.toBigInteger();
    a.y.toBigInteger();
    var g = c.square(),
        h = g.multiply(c),
        e = e.multiply(g),
        g = b.square().multiply(this.z),
        c = g.subtract(e.shiftLeft(1)).multiply(a.z).subtract(h).multiply(c).mod(this.curve.q),
        b = e.multiply(d).multiply(b).subtract(f.multiply(h)).subtract(g.multiply(b)).multiply(a.z).add(b.multiply(h)).mod(this.curve.q);
    a = h.multiply(this.z).multiply(a.z).mod(this.curve.q);
    return new ECPointFp(this.curve, this.curve.fromBigInteger(c), this.curve.fromBigInteger(b), a)
}

function pointFpTwice() {
    if (this.isInfinity()) return this;
    if (0 == this.y.toBigInteger().signum()) return this.curve.getInfinity();
    var a = new BigInteger("3"),
        b = this.x.toBigInteger(),
        c = this.y.toBigInteger(),
        d = c.multiply(this.z),
        e = d.multiply(c).mod(this.curve.q),
        c = this.curve.a.toBigInteger(),
        f = b.square().multiply(a);
    BigInteger.ZERO.equals(c) || (f = f.add(this.z.square().multiply(c)));
    f = f.mod(this.curve.q);
    c = f.square().subtract(b.shiftLeft(3).multiply(e)).shiftLeft(1).multiply(d).mod(this.curve.q);
    a = f.multiply(a).multiply(b).subtract(e.shiftLeft(1)).shiftLeft(2).multiply(e).subtract(f.square().multiply(f)).mod(this.curve.q);
    d = d.square().multiply(d).shiftLeft(3).mod(this.curve.q);
    return new ECPointFp(this.curve, this.curve.fromBigInteger(c), this.curve.fromBigInteger(a), d)
}

function pointFpMultiply(a) {
    if (this.isInfinity()) return this;
    if (0 == a.signum()) return this.curve.getInfinity();
    var b = a.multiply(new BigInteger("3")),
        c = this.negate(),
        d = this,
        e;
    for (e = b.bitLength() - 2; 0 < e; --e) {
        var d = d.twice(),
            f = b.testBit(e),
            g = a.testBit(e);
        f != g && (d = d.add(f ? this : c))
    }
    return d
}

function pointFpMultiplyTwo(a, b, c) {
    var d;
    d = a.bitLength() > c.bitLength() ? a.bitLength() - 1 : c.bitLength() - 1;
    for (var e = this.curve.getInfinity(), f = this.add(b); 0 <= d;) e = e.twice(), a.testBit(d) ? e = c.testBit(d) ? e.add(f) : e.add(this) : c.testBit(d) && (e = e.add(b)), --d;
    return e
}
ECPointFp.prototype.getX = pointFpGetX;
ECPointFp.prototype.getY = pointFpGetY;
ECPointFp.prototype.equals = pointFpEquals;
ECPointFp.prototype.isInfinity = pointFpIsInfinity;
ECPointFp.prototype.negate = pointFpNegate;
ECPointFp.prototype.add = pointFpAdd;
ECPointFp.prototype.twice = pointFpTwice;
ECPointFp.prototype.multiply = pointFpMultiply;
ECPointFp.prototype.multiplyTwo = pointFpMultiplyTwo;

function ECCurveFp(a, b, c) {
    this.q = a;
    this.a = this.fromBigInteger(b);
    this.b = this.fromBigInteger(c);
    this.infinity = new ECPointFp(this, null, null);
    this.reducer = new Barrett(this.q)
}

function curveFpGetQ() {
    return this.q
}

function curveFpGetA() {
    return this.a
}

function curveFpGetB() {
    return this.b
}

function curveFpEquals(a) {
    return a == this ? !0 : this.q.equals(a.q) && this.a.equals(a.a) && this.b.equals(a.b)
}

function curveFpGetInfinity() {
    return this.infinity
}

function curveFpFromBigInteger(a) {
    return new ECFieldElementFp(this.q, a)
}

function curveReduce(a) {
    this.reducer.reduce(a)
}

function curveFpDecodePointHex(a) {
    switch (parseInt(a.substr(0, 2), 16)) {
        case 0:
            return this.infinity;
        case 2:
        case 3:
            return null;
        case 4:
        case 6:
        case 7:
            var b = (a.length - 2) / 2,
                c = a.substr(2, b);
            a = a.substr(b + 2, b);
            return new ECPointFp(this, this.fromBigInteger(new BigInteger(c, 16)), this.fromBigInteger(new BigInteger(a, 16)));
        default:
            return null
    }
}

function curveFpEncodePointHex(a) {
    if (a.isInfinity()) return "00";
    var b = a.getX().toBigInteger().toString(16);
    a = a.getY().toBigInteger().toString(16);
    var c = this.getQ().toString(16).length;
    for (0 != c % 2 && c++; b.length < c;) b = "0" + b;
    for (; a.length < c;) a = "0" + a;
    return "04" + b + a
}
ECCurveFp.prototype.getQ = curveFpGetQ;
ECCurveFp.prototype.getA = curveFpGetA;
ECCurveFp.prototype.getB = curveFpGetB;
ECCurveFp.prototype.equals = curveFpEquals;
ECCurveFp.prototype.getInfinity = curveFpGetInfinity;
ECCurveFp.prototype.fromBigInteger = curveFpFromBigInteger;
ECCurveFp.prototype.reduce = curveReduce;
ECCurveFp.prototype.decodePointHex = curveFpDecodePointHex;
ECCurveFp.prototype.encodePointHex = curveFpEncodePointHex;
var dbits, canary = 0xdeadbeefcafe,
    j_lm = 15715070 == (canary & 16777215);

function BigInteger(a, b, c) {
    null != a && ("number" == typeof a ? this.fromNumber(a, b, c) : null == b && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, b))
}

function nbi() {
    return new BigInteger(null)
}

function am1(a, b, c, d, e, f) {
    for (; 0 <= --f;) {
        var g = b * this[a++] + c[d] + e;
        e = Math.floor(g / 67108864);
        c[d++] = g & 67108863
    }
    return e
}

function am2(a, b, c, d, e, f) {
    var g = b & 32767;
    for (b >>= 15; 0 <= --f;) {
        var h = this[a] & 32767,
            l = this[a++] >> 15,
            k = b * h + l * g,
            h = g * h + ((k & 32767) << 15) + c[d] + (e & 1073741823);
        e = (h >>> 30) + (k >>> 15) + b * l + (e >>> 30);
        c[d++] = h & 1073741823
    }
    return e
}

function am3(a, b, c, d, e, f) {
    var g = b & 16383;
    for (b >>= 14; 0 <= --f;) {
        var h = this[a] & 16383,
            l = this[a++] >> 14,
            k = b * h + l * g,
            h = g * h + ((k & 16383) << 14) + c[d] + e;
        e = (h >> 28) + (k >> 14) + b * l;
        c[d++] = h & 268435455
    }
    return e
}
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2, dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1, dbits = 26) : (BigInteger.prototype.am = am3, dbits = 28);
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz",
    BI_RC = [],
    rr, vv;
rr = 48;
for (vv = 0; 9 >= vv; ++vv) BI_RC[rr++] = vv;
rr = 97;
for (vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;
rr = 65;
for (vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;

function int2char(a) {
    return BI_RM.charAt(a)
}

function intAt(a, b) {
    var c = BI_RC[a.charCodeAt(b)];
    return null == c ? -1 : c
}

function bnpCopyTo(a) {
    for (var b = this.t - 1; 0 <= b; --b) a[b] = this[b];
    a.t = this.t;
    a.s = this.s
}

function bnpFromInt(a) {
    this.t = 1;
    this.s = 0 > a ? -1 : 0;
    0 < a ? this[0] = a : -1 > a ? this[0] = a + this.DV : this.t = 0
}

function nbv(a) {
    var b = nbi();
    b.fromInt(a);
    return b
}

function bnpFromString(a, b) {
    var c;
    if (16 == b) c = 4;
    else if (8 == b) c = 3;
    else if (256 == b) c = 8;
    else if (2 == b) c = 1;
    else if (32 == b) c = 5;
    else if (4 == b) c = 2;
    else {
        this.fromRadix(a, b);
        return
    }
    this.s = this.t = 0;
    for (var d = a.length, e = !1, f = 0; 0 <= --d;) {
        var g = 8 == c ? a[d] & 255 : intAt(a, d);
        0 > g ? "-" == a.charAt(d) && (e = !0) : (e = !1, 0 == f ? this[this.t++] = g : f + c > this.DB ? (this[this.t - 1] |= (g & (1 << this.DB - f) - 1) << f, this[this.t++] = g >> this.DB - f) : this[this.t - 1] |= g << f, f += c, f >= this.DB && (f -= this.DB))
    }
    8 == c && 0 != (a[0] & 128) && (this.s = -1, 0 < f && (this[this.t - 1] |= (1 << this.DB -
        f) - 1 << f));
    this.clamp();
    e && BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
    for (var a = this.s & this.DM; 0 < this.t && this[this.t - 1] == a;)--this.t
}

function bnToString(a) {
    if (0 > this.s) return "-" + this.negate().toString(a);
    if (16 == a) a = 4;
    else if (8 == a) a = 3;
    else if (2 == a) a = 1;
    else if (32 == a) a = 5;
    else if (4 == a) a = 2;
    else return this.toRadix(a);
    var b = (1 << a) - 1,
        c, d = !1,
        e = "",
        f = this.t,
        g = this.DB - f * this.DB % a;
    if (0 < f--)
        for (g < this.DB && 0 < (c = this[f] >> g) && (d = !0, e = int2char(c)); 0 <= f;) g < a ? (c = (this[f] & (1 << g) - 1) << a - g, c |= this[--f] >> (g += this.DB - a)) : (c = this[f] >> (g -= a) & b, 0 >= g && (g += this.DB, --f)), 0 < c && (d = !0), d && (e += int2char(c));
    return d ? e : "0"
}

function bnNegate() {
    var a = nbi();
    BigInteger.ZERO.subTo(this, a);
    return a
}

function bnAbs() {
    return 0 > this.s ? this.negate() : this
}

function bnCompareTo(a) {
    var b = this.s - a.s;
    if (0 != b) return b;
    var c = this.t,
        b = c - a.t;
    if (0 != b) return 0 > this.s ? -b : b;
    for (; 0 <= --c;)
        if (0 != (b = this[c] - a[c])) return b;
    return 0
}

function nbits(a) {
    var b = 1,
        c;
    0 != (c = a >>> 16) && (a = c, b += 16);
    0 != (c = a >> 8) && (a = c, b += 8);
    0 != (c = a >> 4) && (a = c, b += 4);
    0 != (c = a >> 2) && (a = c, b += 2);
    0 != a >> 1 && (b += 1);
    return b
}

function bnBitLength() {
    return 0 >= this.t ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}

function bnpDLShiftTo(a, b) {
    var c;
    for (c = this.t - 1; 0 <= c; --c) b[c + a] = this[c];
    for (c = a - 1; 0 <= c; --c) b[c] = 0;
    b.t = this.t + a;
    b.s = this.s
}

function bnpDRShiftTo(a, b) {
    for (var c = a; c < this.t; ++c) b[c - a] = this[c];
    b.t = Math.max(this.t - a, 0);
    b.s = this.s
}

function bnpLShiftTo(a, b) {
    var c = a % this.DB,
        d = this.DB - c,
        e = (1 << d) - 1,
        f = Math.floor(a / this.DB),
        g = this.s << c & this.DM,
        h;
    for (h = this.t - 1; 0 <= h; --h) b[h + f + 1] = this[h] >> d | g, g = (this[h] & e) << c;
    for (h = f - 1; 0 <= h; --h) b[h] = 0;
    b[f] = g;
    b.t = this.t + f + 1;
    b.s = this.s;
    b.clamp()
}

function bnpRShiftTo(a, b) {
    b.s = this.s;
    var c = Math.floor(a / this.DB);
    if (c >= this.t) b.t = 0;
    else {
        var d = a % this.DB,
            e = this.DB - d,
            f = (1 << d) - 1;
        b[0] = this[c] >> d;
        for (var g = c + 1; g < this.t; ++g) b[g - c - 1] |= (this[g] & f) << e, b[g - c] = this[g] >> d;
        0 < d && (b[this.t - c - 1] |= (this.s & f) << e);
        b.t = this.t - c;
        b.clamp()
    }
}

function bnpSubTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] - a[c], b[c++] = d & this.DM, d >>= this.DB;
    if (a.t < this.t) {
        for (d -= a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d -= a[c], b[c++] = d & this.DM, d >>= this.DB;
        d -= a.s
    }
    b.s = 0 > d ? -1 : 0; - 1 > d ? b[c++] = this.DV + d : 0 < d && (b[c++] = d);
    b.t = c;
    b.clamp()
}

function bnpMultiplyTo(a, b) {
    var c = this.abs(),
        d = a.abs(),
        e = c.t;
    for (b.t = e + d.t; 0 <= --e;) b[e] = 0;
    for (e = 0; e < d.t; ++e) b[e + c.t] = c.am(0, d[e], b, e, 0, c.t);
    b.s = 0;
    b.clamp();
    this.s != a.s && BigInteger.ZERO.subTo(b, b)
}

function bnpSquareTo(a) {
    for (var b = this.abs(), c = a.t = 2 * b.t; 0 <= --c;) a[c] = 0;
    for (c = 0; c < b.t - 1; ++c) {
        var d = b.am(c, b[c], a, 2 * c, 0, 1);
        (a[c + b.t] += b.am(c + 1, 2 * b[c], a, 2 * c + 1, d, b.t - c - 1)) >= b.DV && (a[c + b.t] -= b.DV, a[c + b.t + 1] = 1)
    }
    0 < a.t && (a[a.t - 1] += b.am(c, b[c], a, 2 * c, 0, 1));
    a.s = 0;
    a.clamp()
}

function bnpDivRemTo(a, b, c) {
    var d = a.abs();
    if (!(0 >= d.t)) {
        var e = this.abs();
        if (e.t < d.t) null != b && b.fromInt(0), null != c && this.copyTo(c);
        else {
            null == c && (c = nbi());
            var f = nbi(),
                g = this.s;
            a = a.s;
            var h = this.DB - nbits(d[d.t - 1]);
            0 < h ? (d.lShiftTo(h, f), e.lShiftTo(h, c)) : (d.copyTo(f), e.copyTo(c));
            d = f.t;
            e = f[d - 1];
            if (0 != e) {
                var l = e * (1 << this.F1) + (1 < d ? f[d - 2] >> this.F2 : 0),
                    k = this.FV / l,
                    l = (1 << this.F1) / l,
                    u = 1 << this.F2,
                    y = c.t,
                    A = y - d,
                    x = null == b ? nbi() : b;
                f.dlShiftTo(A, x);
                0 <= c.compareTo(x) && (c[c.t++] = 1, c.subTo(x, c));
                BigInteger.ONE.dlShiftTo(d,
                    x);
                for (x.subTo(f, f); f.t < d;) f[f.t++] = 0;
                for (; 0 <= --A;) {
                    var w = c[--y] == e ? this.DM : Math.floor(c[y] * k + (c[y - 1] + u) * l);
                    if ((c[y] += f.am(0, w, c, A, 0, d)) < w)
                        for (f.dlShiftTo(A, x), c.subTo(x, c); c[y] < --w;) c.subTo(x, c)
                }
                null != b && (c.drShiftTo(d, b), g != a && BigInteger.ZERO.subTo(b, b));
                c.t = d;
                c.clamp();
                0 < h && c.rShiftTo(h, c);
                0 > g && BigInteger.ZERO.subTo(c, c)
            }
        }
    }
}

function bnMod(a) {
    var b = nbi();
    this.abs().divRemTo(a, null, b);
    0 > this.s && 0 < b.compareTo(BigInteger.ZERO) && a.subTo(b, b);
    return b
}

function Classic(a) {
    this.m = a
}

function cConvert(a) {
    return 0 > a.s || 0 <= a.compareTo(this.m) ? a.mod(this.m) : a
}

function cRevert(a) {
    return a
}

function cReduce(a) {
    a.divRemTo(this.m, null, a)
}

function cMulTo(a, b, c) {
    a.multiplyTo(b, c);
    this.reduce(c)
}

function cSqrTo(a, b) {
    a.squareTo(b);
    this.reduce(b)
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
    if (1 > this.t) return 0;
    var a = this[0];
    if (0 == (a & 1)) return 0;
    var b = a & 3,
        b = b * (2 - (a & 15) * b) & 15,
        b = b * (2 - (a & 255) * b) & 255,
        b = b * (2 - ((a & 65535) * b & 65535)) & 65535,
        b = b * (2 - a * b % this.DV) % this.DV;
    return 0 < b ? this.DV - b : -b
}

function Montgomery(a) {
    this.m = a;
    this.mp = a.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << a.DB - 15) - 1;
    this.mt2 = 2 * a.t
}

function montConvert(a) {
    var b = nbi();
    a.abs().dlShiftTo(this.m.t, b);
    b.divRemTo(this.m, null, b);
    0 > a.s && 0 < b.compareTo(BigInteger.ZERO) && this.m.subTo(b, b);
    return b
}

function montRevert(a) {
    var b = nbi();
    a.copyTo(b);
    this.reduce(b);
    return b
}

function montReduce(a) {
    for (; a.t <= this.mt2;) a[a.t++] = 0;
    for (var b = 0; b < this.m.t; ++b) {
        var c = a[b] & 32767,
            d = c * this.mpl + ((c * this.mph + (a[b] >> 15) * this.mpl & this.um) << 15) & a.DM,
            c = b + this.m.t;
        for (a[c] += this.m.am(0, d, a, b, 0, this.m.t); a[c] >= a.DV;) a[c] -= a.DV, a[++c]++
    }
    a.clamp();
    a.drShiftTo(this.m.t, a);
    0 <= a.compareTo(this.m) && a.subTo(this.m, a)
}

function montSqrTo(a, b) {
    a.squareTo(b);
    this.reduce(b)
}

function montMulTo(a, b, c) {
    a.multiplyTo(b, c);
    this.reduce(c)
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
    return 0 == (0 < this.t ? this[0] & 1 : this.s)
}

function bnpExp(a, b) {
    if (4294967295 < a || 1 > a) return BigInteger.ONE;
    var c = nbi(),
        d = nbi(),
        e = b.convert(this),
        f = nbits(a) - 1;
    for (e.copyTo(c); 0 <= --f;)
        if (b.sqrTo(c, d), 0 < (a & 1 << f)) b.mulTo(d, e, c);
        else var g = c,
            c = d,
            d = g;
    return b.revert(c)
}

function bnModPowInt(a, b) {
    var c;
    c = 256 > a || b.isEven() ? new Classic(b) : new Montgomery(b);
    return this.exp(a, c)
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function bnClone() {
    var a = nbi();
    this.copyTo(a);
    return a
}

function bnIntValue() {
    if (0 > this.s) {
        if (1 == this.t) return this[0] - this.DV;
        if (0 == this.t) return -1
    } else {
        if (1 == this.t) return this[0];
        if (0 == this.t) return 0
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}

function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24
}

function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16
}

function bnpChunkSize(a) {
    return Math.floor(Math.LN2 * this.DB / Math.log(a))
}

function bnSigNum() {
    return 0 > this.s ? -1 : 0 >= this.t || 1 == this.t && 0 >= this[0] ? 0 : 1
}

function bnpToRadix(a) {
    null == a && (a = 10);
    if (0 == this.signum() || 2 > a || 36 < a) return "0";
    var b = this.chunkSize(a),
        b = Math.pow(a, b),
        c = nbv(b),
        d = nbi(),
        e = nbi(),
        f = "";
    for (this.divRemTo(c, d, e); 0 < d.signum();) f = (b + e.intValue()).toString(a).substr(1) + f, d.divRemTo(c, d, e);
    return e.intValue().toString(a) + f
}

function bnpFromRadix(a, b) {
    this.fromInt(0);
    null == b && (b = 10);
    for (var c = this.chunkSize(b), d = Math.pow(b, c), e = !1, f = 0, g = 0, h = 0; h < a.length; ++h) {
        var l = intAt(a, h);
        0 > l ? "-" == a.charAt(h) && 0 == this.signum() && (e = !0) : (g = b * g + l, ++f >= c && (this.dMultiply(d), this.dAddOffset(g, 0), g = f = 0))
    }
    0 < f && (this.dMultiply(Math.pow(b, f)), this.dAddOffset(g, 0));
    e && BigInteger.ZERO.subTo(this, this)
}

function bnpFromNumber(a, b, c) {
    if ("number" == typeof b)
        if (2 > a) this.fromInt(1);
        else
            for (this.fromNumber(a, c), this.testBit(a - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(b);) this.dAddOffset(2, 0), this.bitLength() > a && this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
    else {
        c = [];
        var d = a & 7;
        c.length = (a >> 3) + 1;
        b.nextBytes(c);
        c[0] = 0 < d ? c[0] & (1 << d) - 1 : 0;
        this.fromString(c, 256)
    }
}

function bnToByteArray() {
    var a = this.t,
        b = [];
    b[0] = this.s;
    var c = this.DB - a * this.DB % 8,
        d, e = 0;
    if (0 < a--)
        for (c < this.DB && (d = this[a] >> c) != (this.s & this.DM) >> c && (b[e++] = d | this.s << this.DB - c); 0 <= a;)
            if (8 > c ? (d = (this[a] & (1 << c) - 1) << 8 - c, d |= this[--a] >> (c += this.DB - 8)) : (d = this[a] >> (c -= 8) & 255, 0 >= c && (c += this.DB, --a)), 0 != (d & 128) && (d |= -256), 0 == e && (this.s & 128) != (d & 128) && ++e, 0 < e || d != this.s) b[e++] = d;
    return b
}

function bnEquals(a) {
    return 0 == this.compareTo(a)
}

function bnMin(a) {
    return 0 > this.compareTo(a) ? this : a
}

function bnMax(a) {
    return 0 < this.compareTo(a) ? this : a
}

function bnpBitwiseTo(a, b, c) {
    var d, e, f = Math.min(a.t, this.t);
    for (d = 0; d < f; ++d) c[d] = b(this[d], a[d]);
    if (a.t < this.t) {
        e = a.s & this.DM;
        for (d = f; d < this.t; ++d) c[d] = b(this[d], e);
        c.t = this.t
    } else {
        e = this.s & this.DM;
        for (d = f; d < a.t; ++d) c[d] = b(e, a[d]);
        c.t = a.t
    }
    c.s = b(this.s, a.s);
    c.clamp()
}

function op_and(a, b) {
    return a & b
}

function bnAnd(a) {
    var b = nbi();
    this.bitwiseTo(a, op_and, b);
    return b
}

function op_or(a, b) {
    return a | b
}

function bnOr(a) {
    var b = nbi();
    this.bitwiseTo(a, op_or, b);
    return b
}

function op_xor(a, b) {
    return a ^ b
}

function bnXor(a) {
    var b = nbi();
    this.bitwiseTo(a, op_xor, b);
    return b
}

function op_andnot(a, b) {
    return a & ~b
}

function bnAndNot(a) {
    var b = nbi();
    this.bitwiseTo(a, op_andnot, b);
    return b
}

function bnNot() {
    for (var a = nbi(), b = 0; b < this.t; ++b) a[b] = this.DM & ~this[b];
    a.t = this.t;
    a.s = ~this.s;
    return a
}

function bnShiftLeft(a) {
    var b = nbi();
    0 > a ? this.rShiftTo(-a, b) : this.lShiftTo(a, b);
    return b
}

function bnShiftRight(a) {
    var b = nbi();
    0 > a ? this.lShiftTo(-a, b) : this.rShiftTo(a, b);
    return b
}

function lbit(a) {
    if (0 == a) return -1;
    var b = 0;
    0 == (a & 65535) && (a >>= 16, b += 16);
    0 == (a & 255) && (a >>= 8, b += 8);
    0 == (a & 15) && (a >>= 4, b += 4);
    0 == (a & 3) && (a >>= 2, b += 2);
    0 == (a & 1) && ++b;
    return b
}

function bnGetLowestSetBit() {
    for (var a = 0; a < this.t; ++a)
        if (0 != this[a]) return a * this.DB + lbit(this[a]);
    return 0 > this.s ? this.t * this.DB : -1
}

function cbit(a) {
    for (var b = 0; 0 != a;) a &= a - 1, ++b;
    return b
}

function bnBitCount() {
    for (var a = 0, b = this.s & this.DM, c = 0; c < this.t; ++c) a += cbit(this[c] ^ b);
    return a
}

function bnTestBit(a) {
    var b = Math.floor(a / this.DB);
    return b >= this.t ? 0 != this.s : 0 != (this[b] & 1 << a % this.DB)
}

function bnpChangeBit(a, b) {
    var c = BigInteger.ONE.shiftLeft(a);
    this.bitwiseTo(c, b, c);
    return c
}

function bnSetBit(a) {
    return this.changeBit(a, op_or)
}

function bnClearBit(a) {
    return this.changeBit(a, op_andnot)
}

function bnFlipBit(a) {
    return this.changeBit(a, op_xor)
}

function bnpAddTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] + a[c], b[c++] = d & this.DM, d >>= this.DB;
    if (a.t < this.t) {
        for (d += a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d += a[c], b[c++] = d & this.DM, d >>= this.DB;
        d += a.s
    }
    b.s = 0 > d ? -1 : 0;
    0 < d ? b[c++] = d : -1 > d && (b[c++] = this.DV + d);
    b.t = c;
    b.clamp()
}

function bnAdd(a) {
    var b = nbi();
    this.addTo(a, b);
    return b
}

function bnSubtract(a) {
    var b = nbi();
    this.subTo(a, b);
    return b
}

function bnMultiply(a) {
    var b = nbi();
    this.multiplyTo(a, b);
    return b
}

function bnSquare() {
    var a = nbi();
    this.squareTo(a);
    return a
}

function bnDivide(a) {
    var b = nbi();
    this.divRemTo(a, b, null);
    return b
}

function bnRemainder(a) {
    var b = nbi();
    this.divRemTo(a, null, b);
    return b
}

function bnDivideAndRemainder(a) {
    var b = nbi(),
        c = nbi();
    this.divRemTo(a, b, c);
    return [b, c]
}

function bnpDMultiply(a) {
    this[this.t] = this.am(0, a - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp()
}

function bnpDAddOffset(a, b) {
    if (0 != a) {
        for (; this.t <= b;) this[this.t++] = 0;
        for (this[b] += a; this[b] >= this.DV;) this[b] -= this.DV, ++b >= this.t && (this[this.t++] = 0), ++this[b]
    }
}

function NullExp() {}

function nNop(a) {
    return a
}

function nMulTo(a, b, c) {
    a.multiplyTo(b, c)
}

function nSqrTo(a, b) {
    a.squareTo(b)
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow(a) {
    return this.exp(a, new NullExp)
}

function bnpMultiplyLowerTo(a, b, c) {
    var d = Math.min(this.t + a.t, b);
    c.s = 0;
    for (c.t = d; 0 < d;) c[--d] = 0;
    var e;
    for (e = c.t - this.t; d < e; ++d) c[d + this.t] = this.am(0, a[d], c, d, 0, this.t);
    for (e = Math.min(a.t, b); d < e; ++d) this.am(0, a[d], c, d, 0, b - d);
    c.clamp()
}

function bnpMultiplyUpperTo(a, b, c) {
    --b;
    var d = c.t = this.t + a.t - b;
    for (c.s = 0; 0 <= --d;) c[d] = 0;
    for (d = Math.max(b - this.t, 0); d < a.t; ++d) c[this.t + d - b] = this.am(b - d, a[d], c, 0, 0, this.t + d - b);
    c.clamp();
    c.drShiftTo(1, c)
}

function Barrett(a) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * a.t, this.r2);
    this.mu = this.r2.divide(a);
    this.m = a
}

function barrettConvert(a) {
    if (0 > a.s || a.t > 2 * this.m.t) return a.mod(this.m);
    if (0 > a.compareTo(this.m)) return a;
    var b = nbi();
    a.copyTo(b);
    this.reduce(b);
    return b
}

function barrettRevert(a) {
    return a
}

function barrettReduce(a) {
    a.drShiftTo(this.m.t - 1, this.r2);
    a.t > this.m.t + 1 && (a.t = this.m.t + 1, a.clamp());
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    for (this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); 0 > a.compareTo(this.r2);) a.dAddOffset(1, this.m.t + 1);
    for (a.subTo(this.r2, a); 0 <= a.compareTo(this.m);) a.subTo(this.m, a)
}

function barrettSqrTo(a, b) {
    a.squareTo(b);
    this.reduce(b)
}

function barrettMulTo(a, b, c) {
    a.multiplyTo(b, c);
    this.reduce(c)
}
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow(a, b) {
    var c = a.bitLength(),
        d, e = nbv(1),
        f;
    if (0 >= c) return e;
    d = 18 > c ? 1 : 48 > c ? 3 : 144 > c ? 4 : 768 > c ? 5 : 6;
    f = 8 > c ? new Classic(b) : b.isEven() ? new Barrett(b) : new Montgomery(b);
    var g = [],
        h = 3,
        l = d - 1,
        k = (1 << d) - 1;
    g[1] = f.convert(this);
    if (1 < d)
        for (c = nbi(), f.sqrTo(g[1], c); h <= k;) g[h] = nbi(), f.mulTo(c, g[h - 2], g[h]), h += 2;
    for (var u = a.t - 1, y, A = !0, x = nbi(), c = nbits(a[u]) - 1; 0 <= u;) {
        c >= l ? y = a[u] >> c - l & k : (y = (a[u] & (1 << c + 1) - 1) << l - c, 0 < u && (y |= a[u - 1] >> this.DB + c - l));
        for (h = d; 0 == (y & 1);) y >>= 1, --h;
        0 > (c -= h) && (c += this.DB, --u);
        if (A) g[y].copyTo(e),
            A = !1;
        else {
            for (; 1 < h;) f.sqrTo(e, x), f.sqrTo(x, e), h -= 2;
            0 < h ? f.sqrTo(e, x) : (h = e, e = x, x = h);
            f.mulTo(x, g[y], e)
        }
        for (; 0 <= u && 0 == (a[u] & 1 << c);) f.sqrTo(e, x), h = e, e = x, x = h, 0 > --c && (c = this.DB - 1, --u)
    }
    return f.revert(e)
}

function bnGCD(a) {
    var b = 0 > this.s ? this.negate() : this.clone();
    a = 0 > a.s ? a.negate() : a.clone();
    if (0 > b.compareTo(a)) {
        var c = b,
            b = a;
        a = c
    }
    var c = b.getLowestSetBit(),
        d = a.getLowestSetBit();
    if (0 > d) return b;
    c < d && (d = c);
    0 < d && (b.rShiftTo(d, b), a.rShiftTo(d, a));
    for (; 0 < b.signum();) 0 < (c = b.getLowestSetBit()) && b.rShiftTo(c, b), 0 < (c = a.getLowestSetBit()) && a.rShiftTo(c, a), 0 <= b.compareTo(a) ? (b.subTo(a, b), b.rShiftTo(1, b)) : (a.subTo(b, a), a.rShiftTo(1, a));
    0 < d && a.lShiftTo(d, a);
    return a
}

function bnpModInt(a) {
    if (0 >= a) return 0;
    var b = this.DV % a,
        c = 0 > this.s ? a - 1 : 0;
    if (0 < this.t)
        if (0 == b) c = this[0] % a;
        else
            for (var d = this.t - 1; 0 <= d; --d) c = (b * c + this[d]) % a;
    return c
}

function bnModInverse(a) {
    var b = a.isEven();
    if (this.isEven() && b || 0 == a.signum()) return BigInteger.ZERO;
    for (var c = a.clone(), d = this.clone(), e = nbv(1), f = nbv(0), g = nbv(0), h = nbv(1); 0 != c.signum();) {
        for (; c.isEven();) c.rShiftTo(1, c), b ? (e.isEven() && f.isEven() || (e.addTo(this, e), f.subTo(a, f)), e.rShiftTo(1, e)) : f.isEven() || f.subTo(a, f), f.rShiftTo(1, f);
        for (; d.isEven();) d.rShiftTo(1, d), b ? (g.isEven() && h.isEven() || (g.addTo(this, g), h.subTo(a, h)), g.rShiftTo(1, g)) : h.isEven() || h.subTo(a, h), h.rShiftTo(1, h);
        0 <= c.compareTo(d) ?
            (c.subTo(d, c), b && e.subTo(g, e), f.subTo(h, f)) : (d.subTo(c, d), b && g.subTo(e, g), h.subTo(f, h))
    }
    if (0 != d.compareTo(BigInteger.ONE)) return BigInteger.ZERO;
    if (0 <= h.compareTo(a)) return h.subtract(a);
    if (0 > h.signum()) h.addTo(a, h);
    else return h;
    return 0 > h.signum() ? h.add(a) : h
}
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727,
        733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
    ],
    lplim = 67108864 / lowprimes[lowprimes.length - 1];

function bnIsProbablePrime(a) {
    var b, c = this.abs();
    if (1 == c.t && c[0] <= lowprimes[lowprimes.length - 1]) {
        for (b = 0; b < lowprimes.length; ++b)
            if (c[0] == lowprimes[b]) return !0;
        return !1
    }
    if (c.isEven()) return !1;
    for (b = 1; b < lowprimes.length;) {
        for (var d = lowprimes[b], e = b + 1; e < lowprimes.length && d < lplim;) d *= lowprimes[e++];
        for (d = c.modInt(d); b < e;)
            if (0 == d % lowprimes[b++]) return !1
    }
    return c.millerRabin(a)
}

function bnpMillerRabin(a) {
    var b = this.subtract(BigInteger.ONE),
        c = b.getLowestSetBit();
    if (0 >= c) return !1;
    var d = b.shiftRight(c);
    a = a + 1 >> 1;
    a > lowprimes.length && (a = lowprimes.length);
    for (var e = nbi(), f = 0; f < a; ++f) {
        e.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var g = e.modPow(d, this);
        if (0 != g.compareTo(BigInteger.ONE) && 0 != g.compareTo(b)) {
            for (var h = 1; h++ < c && 0 != g.compareTo(b);)
                if (g = g.modPowInt(2, this), 0 == g.compareTo(BigInteger.ONE)) return !1;
            if (0 != g.compareTo(b)) return !1
        }
    }
    return !0
}
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;

function Arcfour() {
    this.j = this.i = 0;
    this.S = []
}

function ARC4init(a) {
    var b, c, d;
    for (b = 0; 256 > b; ++b) this.S[b] = b;
    for (b = c = 0; 256 > b; ++b) c = c + this.S[b] + a[b % a.length] & 255, d = this.S[b], this.S[b] = this.S[c], this.S[c] = d;
    this.j = this.i = 0
}

function ARC4next() {
    var a;
    this.i = this.i + 1 & 255;
    this.j = this.j + this.S[this.i] & 255;
    a = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = a;
    return this.S[a + this.S[this.i] & 255]
}
Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

function prng_newstate() {
    return new Arcfour
}
var rng_psize = 256;
var CMBC_VERIFY_PUBLICKEY_TEST = "MIGIAoGAqxARRHZtYTLYxG2TZt/lXH1NOvXLlR6rVg6qEbUzQLT0Zu/PKZYyMwrCnC/JuLhFwR79PozJJLaAMJyMLc2MOJjxyO79cYxGzuZ1JhdXu53PaUOJwX4SRHmqY9VG1ZgiS27TMeo87fL79IqhA9YzJCo60Zmh52JZcWjvIHDOYDECAwEAAQ==",
    CMBC_VERIFY_PUBLICKEY_PRODUCT = "MIGIAoGA2HC+wRPOyBGjrWY8EjJ/hgY5QSqAX3XoOjr6IzfUMmOXh9uTDvC5WHYt6kuTVl3EN9Nk0xG6ZhuL93gm5qvqGfOcJAanzKiE3000pztk/iKM9Un9rGNoRCf6lYEZteMFQ65Iaw+0fPwuOLZIf9Dood0xSqhIicVvW1POyGujQ48CAwEAAQ==";
var rng_state, rng_pool, rng_pptr;

function rng_seed_int(a) {
    rng_pool[rng_pptr++] ^= a & 255;
    rng_pool[rng_pptr++] ^= a >> 8 & 255;
    rng_pool[rng_pptr++] ^= a >> 16 & 255;
    rng_pool[rng_pptr++] ^= a >> 24 & 255;
    rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
}

function rng_seed_time() {
    rng_seed_int((new Date).getTime())
}
if (null == rng_pool) {
    rng_pool = [];
    rng_pptr = 0;
    var t;
    if (window.crypto && window.crypto.getRandomValues) {
        var ua = new Uint8Array(32);
        window.crypto.getRandomValues(ua);
        for (t = 0; 32 > t; ++t) rng_pool[rng_pptr++] = ua[t]
    }
    if ("Netscape" == navigator.appName && "5" > navigator.appVersion && window.crypto) {
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
    }
    for (; rng_pptr < rng_psize;) t = Math.floor(65536 * Math.random()), rng_pool[rng_pptr++] = t >>> 8, rng_pool[rng_pptr++] = t & 255;
    rng_pptr = 0;
    rng_seed_time()
}

function rng_get_byte() {
    if (null == rng_state) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
        rng_pptr = 0
    }
    return rng_state.next()
}

function rng_get_bytes(a) {
    var b;
    for (b = 0; b < a.length; ++b) a[b] = rng_get_byte()
}

function rng_get_bytes_without0(a, b, c) {
    for (var d = 0; d < c; ++d) {
        var e = rng_get_byte();
        0 == e && (e = rng_get_byte() + 1);
        a[b + d] = e
    }
}

function SecureRandom() {}
SecureRandom.prototype.nextBytes = rng_get_bytes;

function parseBigInt(a, b) {
    return new BigInteger(a, b)
}

function linebrk(a, b) {
    for (var c = "", d = 0; d + b < a.length;) c += a.substring(d, d + b) + "\n", d += b;
    return c + a.substring(d, a.length)
}

function byte2Hex(a) {
    return 16 > a ? "0" + a.toString(16) : a.toString(16)
}

function pkcs1pad2(a, b) {
    if (b < a.length + 11) throw Error("Message too long for RSA");
    for (var c = [], d = a.length - 1; 0 <= d && 0 < b;) {
        var e = a.charCodeAt(d--);
        128 > e ? c[--b] = e : 127 < e && 2048 > e ? (c[--b] = e & 63 | 128, c[--b] = e >> 6 | 192) : (c[--b] = e & 63 | 128, c[--b] = e >> 6 & 63 | 128, c[--b] = e >> 12 | 224)
    }
    c[--b] = 0;
    d = new SecureRandom;
    for (e = []; 2 < b;) {
        for (e[0] = 0; 0 == e[0];) d.nextBytes(e);
        c[--b] = e[0]
    }
    c[--b] = 2;
    c[--b] = 0;
    return new BigInteger(c)
}

function RSAKey() {
    this.n = null;
    this.e = 0;
    this.coeff = this.dmq1 = this.dmp1 = this.q = this.p = this.d = null
}

function RSASetPublic(a, b) {
    if (null != a && null != b && 0 < a.length && 0 < b.length) this.n = parseBigInt(a, 16), this.e = parseInt(b, 16);
    else throw Error("Invalid RSA public key");
}

function RSADoPublic(a) {
    return a.modPowInt(this.e, this.n)
}

function RSAEncrypt(a) {
    a = pkcs1pad2(a, this.n.bitLength() + 7 >> 3);
    if (null == a) return null;
    a = this.doPublic(a);
    if (null == a) return null;
    a = a.toString(16);
    return 0 == (a.length & 1) ? a : "0" + a
}

function RSAEncryptForArrayInner(a) {
    var b = this.n.bitLength() + 7 >> 3;
    if (b < a.length + 11) throw Error("Message too long for RSA");
    for (var c = [], d = a.length - 1; 0 <= d && 0 < b;) c[--b] = a[d--];
    c[--b] = 0;
    a = new SecureRandom;
    for (d = []; 2 < b;) {
        for (d[0] = 0; 0 == d[0];) a.nextBytes(d);
        c[--b] = d[0]
    }
    c[--b] = 2;
    c[--b] = 0;
    b = this.doPublic(new BigInteger(c));
    if (null == b) return null;
    b = b.toString(16);
    return 0 == (b.length & 1) ? b : "0" + b
}

function RSAEncryptForArrayNoPadding(a) {
    if (this.n.bitLength() + 7 >> 3 != a.length) throw Error("Message length must equal to RSA key bit length");
    a = this.doPublic(new BigInteger(a));
    if (null == a) return null;
    a = a.toString(16);
    return 0 == (a.length & 1) ? a : "0" + a
}
RSAKey.prototype.doPublic = RSADoPublic;
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.encryptForArray = RSAEncryptForArrayInner;
RSAKey.prototype.encryptForArrayNoPadding = RSAEncryptForArrayNoPadding;

function pkcs1unpad2(a, b) {
    for (var c = a.toByteArray(), d = 0; d < c.length && 0 == c[d];)++d;
    if (c.length - d != b - 1 || 2 != c[d]) return null;
    for (++d; 0 != c[d];)
        if (++d >= c.length) return null;
    for (var e = ""; ++d < c.length;) {
        var f = c[d] & 255;
        128 > f ? e += String.fromCharCode(f) : 191 < f && 224 > f ? (e += String.fromCharCode((f & 31) << 6 | c[d + 1] & 63), ++d) : (e += String.fromCharCode((f & 15) << 12 | (c[d + 1] & 63) << 6 | c[d + 2] & 63), d += 2)
    }
    return e
}

function RSASetPrivate(a, b, c) {
    if (null != a && null != b && 0 < a.length && 0 < b.length) this.n = parseBigInt(a, 16), this.e = parseInt(b, 16), this.d = parseBigInt(c, 16);
    else throw Error("Invalid RSA private key");
}

function RSASetPrivateEx(a, b, c, d, e, f, g, h) {
    if (null != a && null != b && 0 < a.length && 0 < b.length) this.n = parseBigInt(a, 16), this.e = parseInt(b, 16), this.d = parseBigInt(c, 16), this.p = parseBigInt(d, 16), this.q = parseBigInt(e, 16), this.dmp1 = parseBigInt(f, 16), this.dmq1 = parseBigInt(g, 16), this.coeff = parseBigInt(h, 16);
    else throw Error("Invalid RSA private key");
}

function RSAGenerate(a, b) {
    var c = new SecureRandom,
        d = a >> 1;
    this.e = parseInt(b, 16);
    for (var e = new BigInteger(b, 16);;) {
        for (; this.p = new BigInteger(a - d, 1, c), 0 != this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) || !this.p.isProbablePrime(10););
        for (; this.q = new BigInteger(d, 1, c), 0 != this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) || !this.q.isProbablePrime(10););
        if (0 >= this.p.compareTo(this.q)) {
            var f = this.p;
            this.p = this.q;
            this.q = f
        }
        var f = this.p.subtract(BigInteger.ONE),
            g = this.q.subtract(BigInteger.ONE),
            h = f.multiply(g);
        if (0 == h.gcd(e).compareTo(BigInteger.ONE)) {
            this.n = this.p.multiply(this.q);
            this.d = e.modInverse(h);
            this.dmp1 = this.d.mod(f);
            this.dmq1 = this.d.mod(g);
            this.coeff = this.q.modInverse(this.p);
            break
        }
    }
}

function RSADoPrivate(a) {
    if (null == this.p || null == this.q) return a.modPow(this.d, this.n);
    var b = a.mod(this.p).modPow(this.dmp1, this.p);
    for (a = a.mod(this.q).modPow(this.dmq1, this.q); 0 > b.compareTo(a);) b = b.add(this.p);
    return b.subtract(a).multiply(this.coeff).mod(this.p).multiply(this.q).add(a)
}

function RSADecrypt(a) {
    a = parseBigInt(a, 16);
    a = this.doPrivate(a);
    return null == a ? null : pkcs1unpad2(a, this.n.bitLength() + 7 >> 3)
}
RSAKey.prototype.doPrivate = RSADoPrivate;
RSAKey.prototype.setPrivate = RSASetPrivate;
RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
RSAKey.prototype.generate = RSAGenerate;
RSAKey.prototype.decrypt = RSADecrypt;

function X9ECParameters(a, b, c, d) {
    this.curve = a;
    this.g = b;
    this.n = c;
    this.h = d
}

function x9getCurve() {
    return this.curve
}

function x9getG() {
    return this.g
}

function x9getN() {
    return this.n
}

function x9getH() {
    return this.h
}
X9ECParameters.prototype.getCurve = x9getCurve;
X9ECParameters.prototype.getG = x9getG;
X9ECParameters.prototype.getN = x9getN;
X9ECParameters.prototype.getH = x9getH;

function fromHex(a) {
    return new BigInteger(a, 16)
}

function secp128r1() {
    var a = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF"),
        b = fromHex("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC"),
        c = fromHex("E87579C11079F43DD824993C2CEE5ED3"),
        d = fromHex("FFFFFFFE0000000075A30D1B9038A115"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("04161FF7528B899B2D0C28607CA52C5B86CF5AC8395BAFEB13C02DA292DDED7A83");
    return new X9ECParameters(a, b, d, e)
}

function secp160k1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73"),
        b = BigInteger.ZERO,
        c = fromHex("7"),
        d = fromHex("0100000000000000000001B8FA16DFAB9ACA16B6B3"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("043B4C382CE37AA192A4019E763036F4F5DD4D7EBB938CF935318FDCED6BC28286531733C3F03C4FEE");
    return new X9ECParameters(a, b, d, e)
}

function secp160r1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF"),
        b = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC"),
        c = fromHex("1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45"),
        d = fromHex("0100000000000000000001F4C8F927AED3CA752257"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("044A96B5688EF573284664698968C38BB913CBFC8223A628553168947D59DCC912042351377AC5FB32");
    return new X9ECParameters(a, b, d, e)
}

function secp192k1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37"),
        b = BigInteger.ZERO,
        c = fromHex("3"),
        d = fromHex("FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("04DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D");
    return new X9ECParameters(a, b, d, e)
}

function secp192r1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF"),
        b = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC"),
        c = fromHex("64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1"),
        d = fromHex("FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("04188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF101207192B95FFC8DA78631011ED6B24CDD573F977A11E794811");
    return new X9ECParameters(a, b, d, e)
}

function secp224r1() {
    var a = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001"),
        b = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE"),
        c = fromHex("B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4"),
        d = fromHex("FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("04B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34");
    return new X9ECParameters(a,
        b, d, e)
}

function secp256r1() {
    var a = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF"),
        b = fromHex("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC"),
        c = fromHex("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B"),
        d = fromHex("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551"),
        e = BigInteger.ONE,
        a = new ECCurveFp(a, b, c),
        b = a.decodePointHex("046B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C2964FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5");
    return new X9ECParameters(a,
        b, d, e)
}

function getSECCurveByName(a) {
    return "secp128r1" == a ? secp128r1() : "secp160k1" == a ? secp160k1() : "secp160r1" == a ? secp160r1() : "secp192k1" == a ? secp192k1() : "secp192r1" == a ? secp192r1() : "secp224r1" == a ? secp224r1() : "secp256r1" == a ? secp256r1() : null
}
var hexcase = 0,
    b64pad = "=";

function hex_sha1(a) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(a)))
}

function b64_sha1(a) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(a)))
}

function any_sha1(a, b) {
    return rstr2any(rstr_sha1(str2rstr_utf8(a)), b)
}

function hex_hmac_sha1(a, b) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(b)))
}

function b64_hmac_sha1(a, b) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(b)))
}

function any_hmac_sha1(a, b, c) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(b)), c)
}

function sha1_vm_test() {
    return "a9993e364706816aba3e25717850c26c9cd0d89d" == hex_sha1("abc").toLowerCase()
}

function rstr_sha1(a) {
    return binb2rstr(binb_sha1(rstr2binb(a), 8 * a.length))
}

function rstr_hmac_sha1(a, b) {
    var c = rstr2binb(a);
    16 < c.length && (c = binb_sha1(c, 8 * a.length));
    for (var d = Array(16), e = Array(16), f = 0; 16 > f; f++) d[f] = c[f] ^ 909522486, e[f] = c[f] ^ 1549556828;
    c = binb_sha1(d.concat(rstr2binb(b)), 512 + 8 * b.length);
    return binb2rstr(binb_sha1(e.concat(c), 672))
}

function rstr2hex(a) {
    try {
        hexcase
    } catch (b) {
        hexcase = 0
    }
    for (var c = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", d = "", e, f = 0; f < a.length; f++) e = a.charCodeAt(f), d += c.charAt(e >>> 4 & 15) + c.charAt(e & 15);
    return d
}

function rstr2b64(a) {
    try {
        b64pad
    } catch (b) {
        b64pad = ""
    }
    for (var c = "", d = a.length, e = 0; e < d; e += 3)
        for (var f = a.charCodeAt(e) << 16 | (e + 1 < d ? a.charCodeAt(e + 1) << 8 : 0) | (e + 2 < d ? a.charCodeAt(e + 2) : 0), g = 0; 4 > g; g++) c = 8 * e + 6 * g > 8 * a.length ? c + b64pad : c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f >>> 6 * (3 - g) & 63);
    return c
}

function rstr2any(a, b) {
    var c = b.length,
        d = [],
        e, f, g, h, l = Array(Math.ceil(a.length / 2));
    for (e = 0; e < l.length; e++) l[e] = a.charCodeAt(2 * e) << 8 | a.charCodeAt(2 * e + 1);
    for (; 0 < l.length;) {
        h = [];
        for (e = g = 0; e < l.length; e++)
            if (g = (g << 16) + l[e], f = Math.floor(g / c), g -= f * c, 0 < h.length || 0 < f) h[h.length] = f;
        d[d.length] = g;
        l = h
    }
    c = "";
    for (e = d.length - 1; 0 <= e; e--) c += b.charAt(d[e]);
    d = Math.ceil(8 * a.length / (Math.log(b.length) / Math.log(2)));
    for (e = c.length; e < d; e++) c = b[0] + c;
    return c
}

function str2rstr_utf8(a) {
    for (var b = "", c = -1, d, e; ++c < a.length;) d = a.charCodeAt(c), e = c + 1 < a.length ? a.charCodeAt(c + 1) : 0, 55296 <= d && 56319 >= d && 56320 <= e && 57343 >= e && (d = 65536 + ((d & 1023) << 10) + (e & 1023), c++), 127 >= d ? b += String.fromCharCode(d) : 2047 >= d ? b += String.fromCharCode(192 | d >>> 6 & 31, 128 | d & 63) : 65535 >= d ? b += String.fromCharCode(224 | d >>> 12 & 15, 128 | d >>> 6 & 63, 128 | d & 63) : 2097151 >= d && (b += String.fromCharCode(240 | d >>> 18 & 7, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | d & 63));
    return b
}

function str2rstr_utf16le(a) {
    for (var b = "", c = 0; c < a.length; c++) b += String.fromCharCode(a.charCodeAt(c) & 255, a.charCodeAt(c) >>> 8 & 255);
    return b
}

function str2rstr_utf16be(a) {
    for (var b = "", c = 0; c < a.length; c++) b += String.fromCharCode(a.charCodeAt(c) >>> 8 & 255, a.charCodeAt(c) & 255);
    return b
}

function rstr2binb(a) {
    for (var b = Array(a.length >> 2), c = 0; c < b.length; c++) b[c] = 0;
    for (c = 0; c < 8 * a.length; c += 8) b[c >> 5] |= (a.charCodeAt(c / 8) & 255) << 24 - c % 32;
    return b
}

function binb2rstr(a) {
    for (var b = "", c = 0; c < 32 * a.length; c += 8) b += String.fromCharCode(a[c >> 5] >>> 24 - c % 32 & 255);
    return b
}

function binb_sha1(a, b) {
    a[b >> 5] |= 128 << 24 - b % 32;
    a[(b + 64 >> 9 << 4) + 15] = b;
    for (var c = Array(80), d = 1732584193, e = -271733879, f = -1732584194, g = 271733878, h = -1009589776, l = 0; l < a.length; l += 16) {
        for (var k = d, u = e, y = f, A = g, x = h, w = 0; 80 > w; w++) {
            c[w] = 16 > w ? a[l + w] : bit_rol(c[w - 3] ^ c[w - 8] ^ c[w - 14] ^ c[w - 16], 1);
            var B = safe_add(safe_add(bit_rol(d, 5), sha1_ft(w, e, f, g)), safe_add(safe_add(h, c[w]), sha1_kt(w))),
                h = g,
                g = f,
                f = bit_rol(e, 30),
                e = d,
                d = B
        }
        d = safe_add(d, k);
        e = safe_add(e, u);
        f = safe_add(f, y);
        g = safe_add(g, A);
        h = safe_add(h, x)
    }
    return [d, e, f, g, h]
}

function sha1_ft(a, b, c, d) {
    return 20 > a ? b & c | ~b & d : 40 > a ? b ^ c ^ d : 60 > a ? b & c | b & d | c & d : b ^ c ^ d
}

function sha1_kt(a) {
    return 20 > a ? 1518500249 : 40 > a ? 1859775393 : 60 > a ? -1894007588 : -899497514
}

function safe_add(a, b) {
    var c = (a & 65535) + (b & 65535);
    return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
}

function bit_rol(a, b) {
    return a << b | a >>> 32 - b
};