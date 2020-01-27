"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var in_memory_1 = require("./in-memory");
var TEST_SHA1 = '7323a5431d1c31072983a6a5bf23745b655ddf59';
var TEST_VALUE = { a: 1, b: 2 };
describe('AdapterInMemory{}', function () {
    jest.useFakeTimers();
    afterEach(function () {
        jest.clearAllTimers();
    });
    describe('Behaviour: Getter', function () {
        it('should return null if no value is available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adapter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adapter = new in_memory_1.AdapterInMemory();
                        return [4 /*yield*/, adapter.get(TEST_SHA1)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return { key, value } if a value is available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adapter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adapter = new in_memory_1.AdapterInMemory();
                        return [4 /*yield*/, adapter.set(TEST_SHA1, TEST_VALUE, 60)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adapter.get(TEST_SHA1)];
                    case 2:
                        result = _a.sent();
                        expect(result).toEqual({
                            key: TEST_SHA1,
                            value: TEST_VALUE
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Behaviour: Clear', function () {
        // In order to provide behaviourial parity with most external caching mechanisms
        it('should clear expired items from the cache every 1 second', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ttl, ms, mockDateNow, adapter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ttl = 60;
                        ms = ttl * 1000;
                        mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(0);
                        adapter = new in_memory_1.AdapterInMemory();
                        return [4 /*yield*/, adapter.set(TEST_SHA1, TEST_VALUE, ttl)];
                    case 1:
                        _a.sent();
                        // Push forward UNIX timestamp so that it is > TTL, and advance setInterval() function
                        mockDateNow.mockReturnValue(ms + 1);
                        jest.advanceTimersByTime(ms);
                        return [4 /*yield*/, adapter.get(TEST_SHA1)];
                    case 2:
                        result = _a.sent();
                        expect(result).toBeNull();
                        mockDateNow.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should never clear items with a TTL of 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ttl, mockDateNow, adapter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ttl = 0;
                        mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1);
                        adapter = new in_memory_1.AdapterInMemory();
                        return [4 /*yield*/, adapter.set(TEST_SHA1, TEST_VALUE, ttl)];
                    case 1:
                        _a.sent();
                        // Despite the UNIX timestamp being > 0, and at least one clear cycle happening
                        // the item remains in private store as TTL is set to 0
                        jest.advanceTimersByTime(1000);
                        return [4 /*yield*/, adapter.get(TEST_SHA1)];
                    case 2:
                        result = _a.sent();
                        expect(result).toEqual({
                            key: TEST_SHA1,
                            value: TEST_VALUE
                        });
                        mockDateNow.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
