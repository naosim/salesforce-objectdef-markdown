# salesforce-objectdef-markdown
salesforceのオブジェクト定義をmarkdown出力します。

## 実行環境 (前提条件)
- node.jsがインストールされていること
- SalesforceCLIがインストールされていること
- SalesforceCLIにログイン済みであること

## 実行
### config.mjsの設定
config.mjsのaliasの値を設定してください。  
sfコマンドの`--target-org`に利用します。  
その他の値も任意で設定してください。  

### 実行
```
node index.mjs
```

### 結果確認
`./data/markdown/object` 配下にMarkdownファイルが出力されます。