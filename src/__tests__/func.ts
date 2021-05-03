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

describe("custom func", () => {
    test("basic", () => {
        const dic = jskawari();
        dic.addfunc("foo")((n1, n2) => n1 * n2);
        dic.insert("footest")("${foo:2 3}");
        assert.strictEqual(dic.call("footest"), "6");
    });
});
