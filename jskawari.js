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

    // 内部関数：あるエントリから1単語をランダムに呼び出す。エントリ呼び出しを解釈しない
    function rawEntryCall(entry) {
        if (isNaN(entry) == false) { // エントリ名が整数なので履歴辞書の参照
            let index = Math.floor(entry);
            if (index < 0 || index >= historydictionary.length) { // 履歴辞書の範囲外だったので空文字を返す
                return "";
            } else {
                return historydictionary[index];
            }
        } else if (entrycollection.indexOf(entry) == -1) {
            //該当するエントリは存在しなかったので空文字を返す
            return "";
        } else {
            // 該当するエントリが存在したので、エントリ辞書から該当単語IDをランダム選択
            let wordindex = Math.floor(Math.random() * worddictionary[entry].length)
            let wordid = worddictionary[entry][wordindex];
            // 単語IDから単語に変換の上で解釈を行わず返す
            return wordcollection[wordid];
        }
    }
    // 内部関数：与えられた単語を文法に従って、ただの文字列になるまで再帰的に解釈する
    function parse(word) {
        var answer = word;
        //エントリ呼び出し見付ける正規表現、最も内側かつ最も左側にマッチする
        var entrycallRegex = /\$\{([^${}]+)\}/;
        var isExistEntryCall = true;
        historydictionary = [];
        do {
            let result = entrycallRegex.exec(answer);
            if (result == null) {
                isExistEntryCall = false;
            } else {
                // エントリ呼び出しがあったのでエントリーの中身で置換
                let entryString = rawEntryCall(result[1]);
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
            if (wordcollection.indexOf(words[i]) < 0) {
                // 未知単語だったので単語集合に追加
                wordcollection.push(words[i]);
            }
            // ここに来る時、words[i]は必ず既知の単語
            worddictionary[entry].push(wordcollection.indexOf(words[i]));
        }
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
*/
