import assert from "assert";
import jskawari from "../jskawari";

describe("choice", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.insert("choicetest")("${choice:a b c}");
        const results: { [str: string]: boolean } = {};
        for (let i = 0; i < 100; ++i) {
            results[dic.call("choicetest")] = true;
        }
        assert.deepStrictEqual(Object.keys(results).sort(), ["a", "b", "c"]);
    });
});

describe("wordselect", () => {
    let dic: ReturnType<typeof import("../jskawari").default>;

    beforeEach(() => {
        dic = jskawari();
        dic.insert("number")("1", "2", "3", "4", "5", "6", "7", "8", "9", "10");
        dic.insert("sentence")("${wordselect:number 5}${number.0} ${number.1} ${number.2} ${number.3} ${number.4}");
    });

    test("basic", () => {
        const randomSpy = jest.spyOn(Math, "random");
        randomSpy.mockReturnValue(0);
        assert.strictEqual(dic.call("sentence"), "1 2 3 4 5");
    });
});

describe("custom func", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.addfunc("foo")((n1, n2) => n1 * n2);
        dic.insert("footest")("${foo:2 3}");
        assert.strictEqual(dic.call("footest"), "6");
    });
});
