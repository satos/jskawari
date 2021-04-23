function jskawari() {
    // 単語集合：エントリに所属する全ての単語の集合で重複なし。単語をindexOfした結果が単語IDとなり、辞書配列に格納される。
    var wordcollection = [];
    // エントリ集合：全ての存在しているエントリの集合、配列として実装
    var entrycollection = [];
    // 辞書配列：所属する単語IDがworddictionary[エントリ名]に格納されている。確率調整目的で単語IDの重複を許す。
    var worddictionary = {};
    // 履歴辞書：一回の単語パースの際、解釈が確定したエントリ呼び出しが順に格納される辞書。パースの間のみ有効。N番目のエントリを${N-1}で引用できる。
    // この辞書は単語IDではなく、文字列が直接格納されている
    var historydictionary = [];

    // 内部関数：単語から単語IDを返す。単語集合に存在しない単語だった場合、新しい単語IDを生成し単語集合に格納した上で単語IDを返す
    function wordID(word) {
        if (wordcollection.indexOf(word) < 0) {
            // 未知単語だったので単語集合に追加
            wordcollection.push(word);
        }
        // 単語集合内におけるindexが単語ID
        return wordcollection.indexOf(word);
    }
    // 内部関数：あるエントリから1単語をランダムに呼び出す。エントリ呼び出しを解釈しない
    function rawEntryCall(...entries) {
        let wordidlist = [];
        // entries中のすべてエントリの中身を一度wordidlistにコピーする
        for(let eindex = 0; eindex < entries.length; eindex++) {
            let entry = entries[eindex];
            if (isNaN(entry) == false) { // エントリ名が整数なので履歴辞書の参照
                let index = Math.floor(entry);
                if (index < 0 || index >= historydictionary.length) { // 履歴辞書の範囲外だったので無視
                    continue;
                } else {
                    wordidlist.push(wordID(historydictionary[index])); // 履歴辞書から単語IDに変換してwordidlistに追加
                }
            } else if (entrycollection.indexOf(entry) == -1) {
                //該当するエントリは存在しなかったので無視
                continue;
            } else {
                // 該当するエントリが存在したので、wordidlistにエントリの中身をすべて追加
                wordidlist.push(...worddictionary[entry]);
            }
        }
        // エントリ辞書から該当単語IDをランダム選択
        if (wordidlist.length == 0) {
            // 有効な中身を持つエントリが一つも存在しなかった
            return "";
        }
        // ここに来るということは、有効な単語が一つは存在する
        let wordindex = Math.floor(Math.random() * wordidlist.length);
        // 単語IDから単語に変換の上で解釈を行わず返す
        return wordcollection[wordidlist[wordindex]];
    }
    // 内部関数：与えられた単語を文法に従って、ただの文字列になるまで再帰的に解釈する
    function parse(word) {
        var answer = word;
        //エントリ呼び出し見付ける正規表現、最も内側かつ最も左側にマッチする
        var entrycallRegex = /\$\{([^${}]+)\}/;
        var isExistEntryCall = true;
        historydictionary.splice(0);
        do {
            let result = entrycallRegex.exec(answer);
            if (result == null) {
                isExistEntryCall = false;
            } else {
                // エントリ呼び出しがあったのでエントリーの中身で置換
                // エントリ呼び出し= 'エントリ名1'('+エントリ名2'...)
                // エントリ名の前後にスペースがあってもよいので、スペースは排除する
                let entryString = rawEntryCall(...result[1].split('+').map(s => s.trim()));
                answer = answer.replace(result[0], entryString);
                if (isNaN(result[1])) { // もしエントリ名が数字ではない＝通常のエントリであれば、エントリの中身を履歴辞書に追加
                    historydictionary.push(entryString);
                }                
            }
        } while (isExistEntryCall);
        // ここに来た時点で、answerはエントリ呼び出しを含まない文字列
        return answer;        
    }
    // 内部関数: 指定されたエントリに単語を追加する。単語は複数同時追加対応
    function insert(entry,...words) {
        if (entrycollection.indexOf(entry) < 0) {
            // エントリが存在していなかったので初期化
            entrycollection.push(entry);
            worddictionary[entry]=[];
        }
        // wordsのすべての単語をentryに追加
        for(let i = 0; i < words.length; i++) {
            worddictionary[entry].push(wordID(words[i]));
        }
    }
    // 内部関数: 指定されたエントリを削除する。単語集合から該当エントリに所属する単語は削除しない。（実装簡易化のため）
    function clear(entry) {
        if (entrycollection.indexOf(entry) >= 0) { // エントリが実際に存在していたので辞書配列とエントリ集合から削除
            worddictionary[entry].splice(0); // メモリリークは嫌だ
            delete worddictionary[entry];
            entrycollection.splice(entrycollection.indexOf(entry), 1);
        }
    }
    // 内部関数: 指定されたエントリを一度初期化してから単語を追加する。単語は複数同時追加対応
    function set(entry,...words) {
        if (entrycollection.indexOf(entry) < 0) {
            // エントリが存在していなかったので初期化
            entrycollection.push(entry);
            worddictionary[entry]=[];
        } else {
            // エントリが存在していたので全要素削除
            worddictionary[entry].splice(0); // メモリリークは嫌だ
        }
        // wordsのすべての単語をentryに追加
        for(let i = 0; i < words.length; i++) {
            worddictionary[entry].push(wordID(words[i]));
        }
    }
    // 内部関数: 指定したエントリにある単語が存在すればtrue、存在しなければfalseを返す
    function find(entry, word) {
        // そもそもエントリが存在しない場合はfalseを返して終わる
        if (entrycollection.indexOf(entry) < 0) {
            return false;
        } else if (wordcollection.indexOf(word) < 0) {
            return false;
        } else {
            if (worddictionary[entry].indexOf(wordcollection.indexOf(word)) >= 0) {
                return true;
            } else {
                return false;
            }
        }
    }
    // 内部関数: 指定したエントリにある全ての単語を配列で返す
    function enumerate(entry) {
        var result = [];
        if (entrycollection.indexOf(entry) >= 0) {
            for(let i = 0; i < worddictionary[entry].length; i++) {
                result.push(wordcollection[worddictionary[entry][i]]);
            }
        }
        return result; // 存在しないエントリだった場合は空配列を返す
    }
    
    // クロージャーとしての返り値 => APIの開示
    return {
        // [API] call: エントリ呼び出し
        call : function(entry) {
            return parse(rawEntryCall(entry));
        },
        // [API] insert: 辞書に単語追加（複数単語同時追加対応）
        insert : function(entry) {
            return function(...words) {
                return insert(entry,...words);
            };
        },
        // [API] clear: エントリの削除
        clear : function(entry) {
            return clear(entry);
        },
        // [API] set: 辞書に単語を格納（複数単語同時追加対応）
        set : function(entry) {
            return function(...words) {
                return set(entry,...words);
            };
        },
        // [API] find: エントリの検索、もしwordがfindに存在するならtrue、それ以外はfalseを返す
        find : function(entry, word) {
            return find(entry, word);
        },
        // [API] enumerate: 指定したエントリにあるすべての単語を配列で返す
        enumerate : function(entry) {
            return enumerate(entry);
        }
    };
}
var dic = jskawari();

// * 単語登録の方法(insert)
//   - 使用法： dic.insert("単語エントリ名")("単語" [,"単語"...]);
//   - 単語と単語エントリ名はクォートで囲む
//   - 単語中の"${エントリ名}"はエントリ呼び出しで、単語エントリからランダムに１単語に置き換わる
//
// * 単語呼び出しの方法(call)
//   - 使用法： dic.call("単語エントリ名")
//   - 指定した単語エントリからランダムに１単語を呼び出す

/*
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
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
);

dic.insert("sentence")(
    "${number}: Today is ${day}.",
    "No. ${number}: 今日の曜日は${day}",
    "${number}, ${number}, ${number}。逆順で言うと${2}, ${1}, ${0}。"
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
*/