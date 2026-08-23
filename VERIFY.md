# 動作確認

## 環境

- API: `docker compose up` (port: 3000)
- Web: `cd apps/web && npm run dev` (port: 3001)
- DB: PostgreSQL (Docker Compose 内)

## 確認手順

### API ヘルスチェック

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/up
# 期待: 200
```

### API テスト

```bash
docker compose exec -e RAILS_ENV=test api bundle exec rspec
# 期待: 全テスト pass
```

### Rubocop

```bash
docker compose exec api bin/rubocop
# 期待: no offenses detected
```

### Web ビルド

```bash
cd apps/web && npx next build
# 期待: ビルド成功
```

### Web ユニットテスト

```bash
cd apps/web && npx vitest run
# 期待: 全テスト pass（エディタのテーブル検出・アップロード位置追跡・テーブル操作）
```

### エディタのブラウザ確認（agent-browser）

```bash
# 検証用ユーザーを用意（冪等）
docker compose exec api bin/rails runner \
  "u = User.find_or_initialize_by(email: 'e2e-test@example.com'); u.password = 'e2e-test-password-1'; u.save!"

# ログイン
agent-browser --session srkn open http://localhost:3001/login
agent-browser --session srkn snapshot -i   # Email/Password/UNLOCK のrefを確認
agent-browser --session srkn fill @e4 "e2e-test@example.com"
agent-browser --session srkn fill @e5 "e2e-test-password-1"
agent-browser --session srkn click @e2
# 期待: /new に遷移し、Edit / Split / View のモードトグルとエディタが表示される

# エディタへの入力はCodeMirrorをフォーカスしてから keyboard type / press を使う
agent-browser --session srkn eval 'document.querySelector(".cm-content").focus()'
```

注意:
- Cmd+/ 等の修飾キーコンボは `press "Meta+/"` が届かないことがある。`eval` で `KeyboardEvent` を `.cm-content` に dispatch する（Reactの描画が非同期なので判定は setTimeout 後に行う）
- テーブルツールバーの出現判定は `document.querySelector('[aria-label="Table editing toolbar"]')`
- 本文をまとめて差し替えるときは CodeMirror の EditorView を直接叩く（``` を含む Markdown は `keyboard type` だと自動補完で崩れる）。CodeMirror 6.43 では `.cm-content` の `cmTile.view` が EditorView

```bash
agent-browser --session srkn eval '(() => { const view = document.querySelector(".cm-content").cmTile.view; view.dispatch({changes: {from: 0, to: view.state.doc.length, insert: "..."}}); })()'
```

### Mermaid ダイアグラム（agent-browser）

プレビュー・公開ページの ```mermaid ブロックが SVG になることの確認。

```bash
# エディタのプレビュー（上記の dispatch で mermaid ブロックを含む本文を入れてから）
agent-browser --session srkn eval '(() => { const d = document.querySelector(".mermaid-diagram"); const svg = d && d.querySelector("svg"); return JSON.stringify({hasSvg: !!svg, err: !!document.querySelector(".mermaid-error"), stray: document.querySelectorAll("[id^=dmermaid]").length}); })()'
# 期待: hasSvg=true / err=false / stray=0
```

注意:
- 構文エラーのときは `.mermaid-error` にメッセージと元のコードが出る。壊れた図に続けて正しい図を入れると復帰することも確認する
- `stray` は mermaid が body に作る一時 div（`#d<renderId>`）の残骸。0 でないとライブプレビューで溜まる
- 公開ページ（`/p/<uuid>`）は SSR 経由なので、`agent-browser console` に hydration エラーが出ていないことも見る

### 公開記事ページ（いいね・チップ）

```bash
# いいね
curl -s -X POST http://localhost:3000/articles/<uuid>/like -w "%{http_code}"
# 期待: 201

# チップセッション作成
curl -s -X POST http://localhost:3000/articles/<uuid>/tip \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "success_url": "http://localhost:3001", "cancel_url": "http://localhost:3001"}' \
  -w "\n%{http_code}"
# 期待: 201 + session_url を含む JSON
```

### 本番ヘルスチェック

```bash
curl -s -o /dev/null -w "%{http_code}" https://api.d0ne1s.com/up
# 期待: 200

# DNS キャッシュを疑う場合（本番サーバー直指定）
curl -s -o /dev/null -w "%{http_code}" --resolve api.d0ne1s.com:443:133.18.145.214 https://api.d0ne1s.com/up
# 期待: 200
```
