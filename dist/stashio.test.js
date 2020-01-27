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
var crypto = require("crypto");
var stashio_1 = require("./stashio");
describe('#stashio', function () {
    var mocks = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(void 0)
    };
    var AdapterMock = jest.fn().mockImplementation(function () { return ({
        get: mocks.get,
        set: mocks.set
    }); });
    beforeEach(function () {
        (mocks.get = jest.fn().mockResolvedValue(null)),
            (mocks.set = jest.fn().mockResolvedValue(void 0));
    });
    describe('Behaviour: Default', function () {
        it('should have a default TTL of 60 seconds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrap = stashio_1.stashio({ adapter: new AdapterMock() })(function noop() { });
                        return [4 /*yield*/, wrap()];
                    case 1:
                        _a.sent();
                        expect(mocks.set.mock.calls[0][2]).toEqual(60);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should have a default resolver function which resolves to false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrap = stashio_1.stashio({ adapter: new AdapterMock() })(function noop() { });
                        mocks.get.mockResolvedValue({
                            key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
                            value: { a: 1, b: 2 }
                        });
                        return [4 /*yield*/, wrap()];
                    case 1:
                        _a.sent();
                        expect(mocks.set).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw if an adapter is not passed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // eslint-disable-next-line
                expect(function () { return stashio_1.stashio()(function noop() { }); }).toThrow('No adapter given');
                return [2 /*return*/];
            });
        }); });
    });
    describe('Behaviour: Expiration policies', function () {
        it('should compute a new value and set it in cache with the expected TTL when null is returned from the cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var noop, wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noop = jest.fn().mockResolvedValue('foo');
                        wrap = stashio_1.stashio({ adapter: new AdapterMock(), ttl: 120 })(noop);
                        mocks.get.mockResolvedValue(null);
                        return [4 /*yield*/, wrap()];
                    case 1:
                        _a.sent();
                        expect(noop).toHaveBeenCalled();
                        expect(mocks.set.mock.calls[0][1]).toEqual('foo');
                        expect(mocks.set.mock.calls[0][2]).toEqual(120);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should compute a new value and set it in cache with the expected TTL when the resolver resolves to true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var noop, wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noop = jest.fn().mockReturnValue('foo');
                        wrap = stashio_1.stashio({
                            adapter: new AdapterMock(),
                            resolver: function () { return Promise.resolve(true); }
                        })(noop);
                        mocks.get.mockResolvedValue({
                            key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
                            value: { a: 1, b: 2 }
                        });
                        return [4 /*yield*/, wrap()];
                    case 1:
                        _a.sent();
                        expect(noop).toHaveBeenCalled();
                        expect(mocks.set.mock.calls[0][1]).toEqual('foo');
                        expect(mocks.set.mock.calls[0][2]).toEqual(60);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use an the cached value when it is not null and the resolver resolves to false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var noop, wrap, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noop = jest.fn();
                        wrap = stashio_1.stashio({
                            adapter: new AdapterMock(),
                            resolver: function () { return Promise.resolve(false); }
                        })(noop);
                        mocks.get.mockResolvedValue({
                            key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
                            value: { a: 1, b: 2 }
                        });
                        return [4 /*yield*/, wrap()];
                    case 1:
                        value = _a.sent();
                        expect(value).toEqual({ a: 1, b: 2 });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Behaviour: Argument proxying & Option overrides', function () {
        it('should pass on arguments from the returned wrapped function as expected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var noop, wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noop = jest.fn();
                        wrap = stashio_1.stashio({
                            adapter: new AdapterMock(),
                            resolver: function () { return Promise.resolve(false); }
                        })(noop);
                        return [4 /*yield*/, wrap(1, ['foo', 'bar'])];
                    case 1:
                        _a.sent();
                        expect(noop).toBeCalledWith(1, ['foo', 'bar']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass the existing value and args to the resolver(value, args) function', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResolver, wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResolver = jest.fn().mockResolvedValue(false);
                        wrap = stashio_1.stashio({
                            adapter: new AdapterMock(),
                            ttl: 120,
                            resolver: mockResolver
                        })(
                        // eslint-disable-next-line
                        function noop() { });
                        mocks.get.mockResolvedValue({
                            key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
                            value: { a: 1, b: 2 }
                        });
                        return [4 /*yield*/, wrap('foo', 'bar', 'baz')];
                    case 1:
                        _a.sent();
                        expect(mockResolver).toHaveBeenCalledWith({ a: 1, b: 2 }, [
                            'foo',
                            'bar',
                            'baz'
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow options to be overridden', function () { return __awaiter(void 0, void 0, void 0, function () {
            var overideResolver, wrap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        overideResolver = jest.fn().mockResolvedValue(false);
                        wrap = stashio_1.stashio({
                            adapter: new AdapterMock(),
                            ttl: 120,
                            resolver: function () { return Promise.resolve(true); }
                        })(
                        // eslint-disable-next-line
                        function noop() { }, {
                            ttl: 60,
                            adapter: new AdapterMock(),
                            resolver: overideResolver
                        });
                        mocks.get.mockResolvedValue({
                            key: '7323a5431d1c31072983a6a5bf23745b655ddf59',
                            value: { a: 1, b: 2 }
                        });
                        return [4 /*yield*/, wrap()];
                    case 1:
                        _a.sent();
                        expect(overideResolver).toHaveBeenCalled();
                        mocks.get.mockResolvedValue(null);
                        return [4 /*yield*/, wrap()];
                    case 2:
                        _a.sent();
                        expect(mocks.set.mock.calls[0][2]).toEqual(60);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Behaviour: Key hashing', function () {
        it('should compute the expected key value using the sha1 algorithm', function () { return __awaiter(void 0, void 0, void 0, function () {
            var functionToWrap, wrap, args, expectedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        functionToWrap = function (x, y) { return x + y; };
                        wrap = stashio_1.stashio({
                            adapter: new AdapterMock()
                        })(functionToWrap);
                        args = [1, 'foo', function () { return []; }];
                        expectedKey = crypto
                            .createHash('sha1')
                            .update("functionToWrap" + functionToWrap.toString() + "1foo" + (function () { return []; }).toString())
                            .digest('hex');
                        return [4 /*yield*/, wrap.apply(void 0, args)];
                    case 1:
                        _a.sent();
                        expect(mocks.set.mock.calls[0][0]).toEqual(expectedKey);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
