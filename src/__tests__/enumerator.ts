import assert from "assert";
import jskawari from "../jskawari";

describe("enumerate", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.insert("test")("1", "2", "3", "4", "5", "6");
        assert.deepStrictEqual(dic.enumerate("test"), ["1", "2", "3", "4", "5", "6"]);
    });

    test("with entry call", () => {
        const dic = jskawari();
        dic.insert("test")("${abc}");
        assert.deepStrictEqual(dic.enumerate("test"), ["${abc}"]);
    });
});

describe("find", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.insert("test")("1", "2", "3", "4", "5", "6");
        assert.strictEqual(dic.find("test", "3"), true);
        assert.strictEqual(dic.find("test", "7"), false);
    });
});

describe("set", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.insert("test")("1", "2", "3", "4", "5", "6");
        assert.deepStrictEqual(dic.enumerate("test"), ["1", "2", "3", "4", "5", "6"]);
        dic.set("test")("a", "b", "c");
        assert.deepStrictEqual(dic.enumerate("test"), ["a", "b", "c"]);
    });
});

describe("clear", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.insert("test")("1", "2", "3", "4", "5", "6");
        assert.deepStrictEqual(dic.enumerate("test"), ["1", "2", "3", "4", "5", "6"]);
        dic.clear("test");
        assert.deepStrictEqual(dic.enumerate("test"), []);
    });
});
