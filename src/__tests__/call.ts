import assert from "assert";
import jskawari from "../jskawari";

describe("call", () => {
    let dic: ReturnType<typeof import("../jskawari").default>;

    beforeEach(() => {
        dic = jskawari();
        dic.insert("number")("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
        dic.insert("number2")("1", "2", "3", "4", "5", "6", "7", "8", "9", "${number2.sub}");
        dic.insert("number2.sub")("A", "10");
        dic.insert("sentence")("${number2} ${number2} ${number2} ${2} ${1} ${0}");
        const dicobj = {
            test1: ["a", "b", "c", "d", "e"],
            test2: ["Z", "Y", "X", "W", "V"],
        };
        dic.loadobj(dicobj);
    });

    test("内包されるエントリがランダムに呼び出され、履歴エントリが機能する。", () => {
        const randomSpy = jest.spyOn(Math, "random");
        randomSpy.mockReturnValueOnce(0);
        randomSpy.mockReturnValueOnce(0.9);
        randomSpy.mockReturnValueOnce(0.6);
        randomSpy.mockReturnValueOnce(0);
        randomSpy.mockReturnValueOnce(0.5);
        assert.strictEqual(dic.call("sentence"), "10 1 6 6 1 10");
    });

    test("エントリ自体がランダムに呼び出される。", () => {
        const randomSpy = jest.spyOn(Math, "random");
        randomSpy.mockReturnValueOnce(0.9);
        randomSpy.mockReturnValueOnce(0);
        randomSpy.mockReturnValueOnce(0.5);
        assert.strictEqual(dic.call("number"), "10");
        assert.strictEqual(dic.call("number"), "1");
        assert.strictEqual(dic.call("number"), "6");
    });

    test("辞書オブジェクトを読み込める", () => {
        assert.deepStrictEqual(dic.enumerate("test1"), ["a", "b", "c", "d", "e"]);
        assert.deepStrictEqual(dic.enumerate("test2"), ["Z", "Y", "X", "W", "V"]);
    });
});
