import assert from "assert";
import jskawari from "../jskawari";

describe("エントリ集合演算", () => {
    let dic: ReturnType<typeof import("../jskawari").default>;

    beforeEach(() => {
        dic = jskawari();
        dic.loadobj({
            A: ["A1", "A2", "A3"],
            B: ["B1", "B2", "B3"],
            C: ["C1", "C2", "C3", "C4"],
            AB: ["${A+B}"],
            BC: ["${B+C}"],
            CA: ["${ C + A }"],
            ABC: ["${A+B+C}"],
            TripleA: ["${ AAA    }"],
            SetHistory: ["${A+B},${0}"],
            HistorySet: ["${A},${B},${0+1}"],
            SetHistorySet: ["${A+B},${B+C},${0+1}"],
        });
    });

    describe.each([
        ["AB", ["A", "B"]],
        ["BC", ["B", "C"]],
        ["CA", ["C", "A"]],
        ["ABC", ["A", "B", "C"]],
    ])("%s %o", (entry, elements) => {
        test("集合演算の値が全部出る", () => {
            const results: { [str: string]: boolean } = {};
            for (let i = 0; i < 100; ++i) {
                results[dic.call(entry)] = true;
            }
            assert.deepStrictEqual(Object.keys(results).sort(), elements.flatMap((element) => dic.enumerate(element)).sort());
        });
    });

    describe("履歴エントリ", () => {
        test("集合演算の履歴エントリ", () => {
            for (let i = 0; i < 100; ++i) {
                const [ab, history0] = dic.call("SetHistory").split(",");
                assert.strictEqual(ab, history0);
            }
        });

        test("履歴エントリの集合演算", () => {
            for (let i = 0; i < 100; ++i) {
                const [a, b, history01] = dic.call("HistorySet").split(",");
                assert([a, b].includes(history01));
            }
        });

        test("集合演算の履歴エントリの集合演算", () => {
            for (let i = 0; i < 1000; ++i) {
                const [ab, bc, history01] = dic.call("SetHistorySet").split(",");
                assert([ab, bc].includes(history01));
            }
        });
    });
});
