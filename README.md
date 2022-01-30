# Next.js×Laravel で開発する簡易アプリケーションのハンズオン

## 前提

- M1Mac にも対応しています！
- Windows での動作確認は行っておらず環境構築のエラー対応はできないので悪しからず...

## 使用技術

- frontend: TypeScript/React/Next.js/Tailwind CSS
- backend(api): PHP/Laravel
- infra: Docker/Docker Compose

## ブランチ指定で clone

```
git clone -b init https://github.com/shimotaroo/nextjs-laravel-hands-on.git
```

## DB 用 Dockerfile の修正（M1Mac 以外）

`.docker/db/Dockerfile`を修正

```diff
- FROM --platform=linux/x86_64 mysql:8.0
+ FROM mysql:8.0

ENV TZ=UTC

COPY my.cnf /etc/my.cnf
```

## 環境構築

```sh
make init
```

以下の状態になれば OK

### api(Laravel)

- `api`ディレクトリ内に Laravel がインストールされている
- `localhost:80`にアクセスすると Laravel のウェルカムページが表示される

### frontend(Next.js)

- `front`ディレクトリ内に Next.js がインストールされる
- `localhost:3000`にアクセスするとログイン画面が表示される

<img width="557" alt="スクリーンショット 2022-01-24 23 55 13" src="https://user-images.githubusercontent.com/58982088/150806401-cef92bc1-633c-4bbc-943b-a08e17e0c800.png">

- `localhost:3000/memos`にアクセスするとメモ一覧画面が表示される

<img width="710" alt="スクリーンショット 2022-01-24 23 55 31" src="https://user-images.githubusercontent.com/58982088/150806412-1b101330-dd62-4bf9-9fa0-2bbc8c1e7d15.png">

- `localhost:3000/memos/post`にアクセスすると登録画面が表示される

<img width="546" alt="スクリーンショット 2022-01-24 23 55 49" src="https://user-images.githubusercontent.com/58982088/150806422-2466d8f6-9acd-4b93-bac6-63f56a1d28ef.png">

## GUI ツールで DB に接続

- Sequel Ace
- Table Plus

等の GUI ツールで DB(MySQL)に接続。（以下接続情報）

ホスト: 127.0.0.1
ユーザー: sample
パスワード: sample
データベース: next_laravel

## Next.js の開発用サーバーの起動・停止

- 起動: `make dev`
- 停止: `control + c`

## 備考
