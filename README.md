# jskawari
華和梨のJavaScriptによるサブセット再実装 / subset of pseudo AI module 'KAWARI' implemented by JavaScript

## 単語登録の方法(insert)

```javascript
dic.insert("単語エントリ名")("単語" [,"単語"...]);
```

- 単語と単語エントリ名はクォートで囲む
- 単語中の"${エントリ名}"はエントリ呼び出しで、単語エントリからランダムに１単語に置き換わる
- 一回の単語呼び出しの間、使用したエントリ呼び出しの履歴は${0}, ${1}, ...で再利用できる

## 単語呼び出しの方法(call)
```javascript
dic.call("単語エントリ名");
```

- 指定した単語エントリからランダムに１単語を呼び出す
