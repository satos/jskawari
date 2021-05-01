function jskawari() {
    // 単語集合：エントリに所属する全ての単語の集合で重複なし。単語をindexOfした結果が単語IDとなり、辞書配列に格納される。
    const wordcollection: string[] = [];
    // エントリ集合：全ての存在しているエントリの集合、配列として実装
    const entrycollection: string[] = [];
    // 辞書配列：所属する単語IDがworddictionary[エントリ名]に格納されている。確率調整目的で単語IDの重複を許す。
    const worddictionary: { [entry: string]: number[] } = {};
    // 履歴辞書：一回の単語パースの際、解釈が確定したエントリ呼び出しが順に格納される辞書。パースの間のみ有効。N番目のエントリを${N-1}で引用できる。
    // この辞書は単語IDではなく、文字列が直接格納されている
    const historydictionary: string[] = [];
    // 関数辞書: インラインスクリプトが格納される辞書
    const functiondictionary: { [name: string]: (...fargs: any[]) => any } = {
        choice: function (...fargs) {
            return fargs[Math.floor(Math.random() * fargs.length)];
        },
    };

    // 内部関数：単語から単語IDを返す。単語集合に存在しない単語だった場合、新しい単語IDを生成し単語集合に格納した上で単語IDを返す
    function wordID(word: string) {
        if (wordcollection.indexOf(word) < 0) {
            // 未知単語だったので単語集合に追加
            wordcollection.push(word);
        }
        // 単語集合内におけるindexが単語ID
        return wordcollection.indexOf(word);
    }
    // 内部関数：あるエントリから1単語をランダムに呼び出す。エントリ呼び出しを解釈しない
    function rawEntryCall(...entries: string[]) {
        let wordidlist = [];
        // entries中のすべてエントリの中身を一度wordidlistにコピーする
        for (let eindex = 0; eindex < entries.length; eindex++) {
            let entry = entries[eindex];
            if (isNaN(entry as any) == false) {
                // エントリ名が整数なので履歴辞書の参照
                let index = Math.floor(entry as any);
                if (index < 0 || index >= historydictionary.length) {
                    // 履歴辞書の範囲外だったので無視
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
    // 内部関数: インラインスクリプトを実行する
    function inlineScriptCall(commandline: string) {
        // 関数呼び出し '関数名:(引数1 引数2...)
        // 引数の間、関数名、コロンの間にスペースがあってもよく、無視される
        let splitpos = commandline.indexOf(":");
        let funcname = commandline.substring(0, splitpos).trim();
        let funcargs = commandline
            .substring(splitpos + 1)
            .trim()
            .split(/\s+/);
        if (!(funcname in functiondictionary)) {
            return "";
        }
        return functiondictionary[funcname](...funcargs);
    }
    // 内部関数：与えられた単語を文法に従って、ただの文字列になるまで再帰的に解釈する
    function parse(word: string) {
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
                let entryString;
                if (result[1].indexOf(":") >= 0) {
                    // インラインスクリプト呼び出しなので関数呼び出し結果で置換
                    entryString = inlineScriptCall(result[1]);
                } else {
                    // エントリ呼び出しなのでエントリーの中身で置換
                    // エントリ呼び出し= 'エントリ名1'('+エントリ名2'...)
                    // エントリ名の前後にスペースがあってもよいので、スペースは排除する
                    entryString = rawEntryCall(
                        ...result[1].split("+").map((s) => s.trim())
                    );
                }
                answer = answer.replace(result[0], entryString);
                if (isNaN(result[1] as any)) {
                    // もしエントリ名が数字ではない＝通常のエントリであれば、エントリの中身を履歴辞書に追加
                    historydictionary.push(entryString);
                }
            }
        } while (isExistEntryCall);
        // ここに来た時点で、answerはエントリ呼び出しを含まない文字列
        return answer;
    }
    // 内部関数: 指定されたエントリに単語を追加する。単語は複数同時追加対応
    function insert(entry: string, ...words: string[]) {
        if (entrycollection.indexOf(entry) < 0) {
            // エントリが存在していなかったので初期化
            entrycollection.push(entry);
            worddictionary[entry] = [];
        }
        // wordsのすべての単語をentryに追加
        for (let i = 0; i < words.length; i++) {
            worddictionary[entry].push(wordID(words[i]));
        }
    }
    // 内部関数: 指定されたエントリを削除する。単語集合から該当エントリに所属する単語は削除しない。（実装簡易化のため）
    function clear(entry: string) {
        if (entrycollection.indexOf(entry) >= 0) {
            // エントリが実際に存在していたので辞書配列とエントリ集合から削除
            worddictionary[entry].splice(0); // メモリリークは嫌だ
            delete worddictionary[entry];
            entrycollection.splice(entrycollection.indexOf(entry), 1);
        }
    }
    // 内部関数: 指定されたエントリを一度初期化してから単語を追加する。単語は複数同時追加対応
    function set(entry: string, ...words: string[]) {
        if (entrycollection.indexOf(entry) < 0) {
            // エントリが存在していなかったので初期化
            entrycollection.push(entry);
            worddictionary[entry] = [];
        } else {
            // エントリが存在していたので全要素削除
            worddictionary[entry].splice(0); // メモリリークは嫌だ
        }
        // wordsのすべての単語をentryに追加
        for (let i = 0; i < words.length; i++) {
            worddictionary[entry].push(wordID(words[i]));
        }
    }
    // 内部関数: 指定したエントリにある単語が存在すればtrue、存在しなければfalseを返す
    function find(entry: string, word: string) {
        // そもそもエントリが存在しない場合はfalseを返して終わる
        if (entrycollection.indexOf(entry) < 0) {
            return false;
        } else if (wordcollection.indexOf(word) < 0) {
            return false;
        } else {
            if (
                worddictionary[entry].indexOf(wordcollection.indexOf(word)) >= 0
            ) {
                return true;
            } else {
                return false;
            }
        }
    }
    // 内部関数: 指定したエントリにある全ての単語を配列で返す
    function enumerate(entry: string) {
        var result = [];
        if (entrycollection.indexOf(entry) >= 0) {
            for (let i = 0; i < worddictionary[entry].length; i++) {
                result.push(wordcollection[worddictionary[entry][i]]);
            }
        }
        return result; // 存在しないエントリだった場合は空配列を返す
    }
    // 内部関数: インラインスクリプトを追加する
    function addfunc(funcname: string, funcbody: (...args: any[]) => any) {
        if (funcname in functiondictionary) {
            delete functiondictionary[funcname];
        }
        functiondictionary[funcname] = funcbody;
    }

    // クロージャーとしての返り値 => APIの開示
    return {
        // [API] call: エントリ呼び出し
        call: function (entry: string) {
            return parse(rawEntryCall(entry));
        },
        // [API] insert: 辞書に単語追加（複数単語同時追加対応）
        insert: function (entry: string) {
            return function (...words: string[]) {
                return insert(entry, ...words);
            };
        },
        // [API] clear: エントリの削除
        clear: function (entry: string) {
            return clear(entry);
        },
        // [API] set: 辞書に単語を格納（複数単語同時追加対応）
        set: function (entry: string) {
            return function (...words: string[]) {
                return set(entry, ...words);
            };
        },
        // [API] find: エントリの検索、もしwordがfindに存在するならtrue、それ以外はfalseを返す
        find: function (entry: string, word: string) {
            return find(entry, word);
        },
        // [API] enumerate: 指定したエントリにあるすべての単語を配列で返す
        enumerate: function (entry: string) {
            return enumerate(entry);
        },
        addfunc: function (funcname: string) {
            return function (funcbody: (...args: any[]) => any) {
                return addfunc(funcname, funcbody);
            };
        },
    };
}
// エクスポート設定
export default jskawari;
