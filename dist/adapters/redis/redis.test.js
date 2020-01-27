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
var redis_1 = require("./redis");
var Redis = require("ioredis");
jest.mock('ioredis');
var TEST_SHA1 = '7323a5431d1c31072983a6a5bf23745b655ddf59';
var TEST_VALUE = { a: 1, b: 2 };
var TEST_VALUE_JSON = JSON.stringify(TEST_VALUE);
describe('AdapterRedis{}', function () {
    var MockRedisClient = new Redis('');
    describe('Behaviour: Setter', function () {
        var mocks = {
            set: jest.fn().mockResolvedValue(void 0),
            expire: jest.fn().mockResolvedValue(void 0),
            exec: jest.fn().mockResolvedValue(void 0)
        };
        MockRedisClient.pipeline = jest.fn().mockReturnValue(mocks);
        beforeEach(function () {
            Object.values(mocks).forEach(function (mock) {
                mock.mockClear();
            });
        });
        it('should SET a value in Redis as expected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adapter = new redis_1.AdapterRedis(MockRedisClient);
                        return [4 /*yield*/, adapter.set(TEST_SHA1, TEST_VALUE, 0)];
                    case 1:
                        _a.sent();
                        expect(mocks.set).toHaveBeenCalledWith(TEST_SHA1, TEST_VALUE_JSON);
                        expect(mocks.exec).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should SET and EXPIRE a value in Redis as expected if the TTL > 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adapter = new redis_1.AdapterRedis(MockRedisClient);
                        return [4 /*yield*/, adapter.set(TEST_SHA1, TEST_VALUE, 60)];
                    case 1:
                        _a.sent();
                        expect(mocks.set).toHaveBeenCalledWith(TEST_SHA1, TEST_VALUE_JSON);
                        expect(mocks.expire).toHaveBeenCalledWith(TEST_SHA1, 60);
                        expect(mocks.exec).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Behaviour: Getter', function () {
        var mocks = {
            get: jest.fn()
        };
        MockRedisClient.get = mocks.get;
        beforeEach(function () {
            mocks.get.mockClear();
        });
        it('should return null if no value is available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adapter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mocks.get.mockResolvedValue(null);
                        adapter = new redis_1.AdapterRedis(MockRedisClient);
                        return [4 /*yield*/, adapter.get(TEST_SHA1)];
                    case 1:
                        result = _a.sent();
                        expect(mocks.get).toHaveBeenCalledWith(TEST_SHA1);
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
                        mocks.get.mockResolvedValue(TEST_VALUE_JSON);
                        adapter = new redis_1.AdapterRedis(MockRedisClient);
                        return [4 /*yield*/, adapter.get(TEST_SHA1)];
                    case 1:
                        result = _a.sent();
                        expect(mocks.get).toHaveBeenCalledWith(TEST_SHA1);
                        expect(result).toEqual({
                            key: TEST_SHA1,
                            value: TEST_VALUE
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
