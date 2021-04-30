var jskawari = require('../build/jskawari');
var dic = jskawari();

// * 単語登録の方法(insert)
//   - 使用法： dic.insert("単語エントリ名")("単語" [,"単語"...]);
//   - 単語と単語エントリ名はクォートで囲む
//   - 単語中の"${エントリ名}"はエントリ呼び出しで、単語エントリからランダムに１単語に置き換わる
//
// * 単語呼び出しの方法(call)
//   - 使用法： dic.call("単語エントリ名")
//   - 指定した単語エントリからランダムに１単語を呼び出す


dic.insert("day")(
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thirsday',
    'Friday',
    'Satuday'
);

dic.insert("number")(
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"
);

dic.insert("sentence")(
    "${number}: Today is ${day}.",
    "No. ${number}: 今日の曜日は${day}",
    "${day}, ${day}, ${day}。逆順で言うと${2}, ${1}, ${0}。"
);

for(let i = 0; i< 10; i++) {
    console.log("sentence: " + dic.call("sentence"));
}

dic.insert("test")("1","2","3","4","5","6");
console.log("test: "+ dic.enumerate("test").join("/"));
console.log("test(is exist '3'): "+ dic.find("test", "3"));
console.log("test(is exist '7'): "+ dic.find("test", "7"));
dic.set("test")("a","b","c");
console.log("test(after set): "+ dic.enumerate("test").join("/"));
console.log("test(is exist 'a'): "+ dic.find("test", "a"));
console.log("test(is exist 'z'): "+ dic.find("test", "z"));
dic.clear("test");
console.log("test(after clear): "+ dic.enumerate("test").join("/"));

dic.insert("AAA")("A1", "A2", "A3");
dic.insert("BBB")("B1", "B2", "B3");
dic.insert("CCC")("C1", "C2", "C3", "C4");
dic.insert("AB")("${AAA+BBB}");
dic.insert("BC")("${BBB+CCC}");
dic.insert("CA")("${ CCC + AAA }");
dic.insert("ABC")("${AAA+BBB+CCC}");
dic.insert("TripleA")("${ AAA    }");
dic.insert("HistoryPlus")("${AAA+BBB},${BBB+CCC},${CCC+AAA},${0},${AAA},${1},${1+2}");
console.log("AB:" + dic.call("AB") + "+" + dic.call("AB") + "+" + dic.call("AB") + "+" + dic.call("AB") + "+" + dic.call("AB"));
console.log("BC:" + dic.call("BC") + "+" + dic.call("BC") + "+" + dic.call("BC") + "+" + dic.call("BC") + "+" + dic.call("BC"));
console.log("CA:" + dic.call("CA") + "+" + dic.call("CA") + "+" + dic.call("CA") + "+" + dic.call("CA") + "+" + dic.call("CA"));
console.log("ABC:" + dic.call("ABC") + "+" + dic.call("ABC") + "+" + dic.call("ABC") + "+" + dic.call("ABC") + "+" + dic.call("ABC"));
console.log("TripleA:" + dic.call("TripleA") + "+" + dic.call("TripleA") + "+" + dic.call("TripleA"));
console.log("history+:" + dic.call("HistoryPlus"));

dic.insert("choicetest")("${choice:a b c}");
console.log("choice:" + " " + dic.call("choicetest") + " " + dic.call("choicetest") + " " + dic.call("choicetest") + " " + dic.call("choicetest") + " " + dic.call("choicetest"));
dic.addfunc("random")(function(num){ return Math.floor(Math.random() * Number(num))});
dic.insert("randomtest")("Random(20): ${random:20}");
for(let i = 0; i< 10; i++) {
    console.log(dic.call("randomtest"));
}
