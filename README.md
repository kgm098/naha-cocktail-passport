# NAHA COCKTAIL PASSPORT Vol.1

2026年7月1日〜8月31日開催、那覇市内6バーを巡るQRスタンプラリーWebアプリ。

---

## セットアップ手順（初回のみ）

### Step 1 — Node.js をインストール

```bash
# Homebrewがある場合（推奨）
brew install node

# Homebrewがない場合は https://nodejs.org から LTS版をダウンロードしてインストール
```

インストール確認:
```bash
node -v   # v20.x.x 以上が表示されればOK
npm -v    # 10.x.x 以上が表示されればOK
```

---

### Step 2 — Supabase プロジェクトを作成

1. https://supabase.com にアクセスしてアカウント作成（無料プランでOK）
2. 「New Project」でプロジェクトを作成
   - Project name: `naha-cocktail-passport`
   - Region: `Northeast Asia (Tokyo)` を推奨
   - Password: 任意（メモしておく）
3. プロジェクト作成後、左メニューの **「SQL Editor」** を開く
4. `supabase/schema.sql` の内容を全選択してSQLエディタに貼り付け → **Run** を実行

---

### Step 3 — 環境変数を設定

Supabase の **Project Settings → API** を開き、以下をコピーする:

| 項目 | コピーするもの |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role |

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて各行に値を貼り付け:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=任意の管理者パスワード（英数字推奨）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ `.env.local` は Git にコミットしないこと（`.gitignore` に既に含まれています）

---

### Step 4 — 依存パッケージをインストール

```bash
cd ~/Desktop/BARスタンプラリー
npm install
```

---

### Step 5 — ローカルで起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて確認。

---

## Vercel へのデプロイ

### 初回デプロイ

```bash
npm install -g vercel
vercel login        # ブラウザでログイン
vercel --prod       # デプロイ実行
```

### 環境変数をVercelに設定

Vercel ダッシュボード → プロジェクト → **Settings → Environment Variables** で
`.env.local` と同じ4つの変数を追加する。

`NEXT_PUBLIC_SITE_URL` はデプロイ後に発行されたURL（例: `https://naha-cocktail-passport.vercel.app`）に変更する。

---

## QRコードの作成

各店舗のスタンプ取得URLは以下の形式:

| 店舗 | URL |
|---|---|
| Bar Sou | `https://your-domain.com/passport/stamp/sou` |
| Bar Daisy | `https://your-domain.com/passport/stamp/daisy` |
| Bar Stir Laboratory | `https://your-domain.com/passport/stamp/stir` |
| Bar Hammock | `https://your-domain.com/passport/stamp/hammock` |
| BAR FORTUNA | `https://your-domain.com/passport/stamp/fortuna` |
| Bar Whisky&JAPAN | `https://your-domain.com/passport/stamp/whisky-japan` |

QRコード生成は https://qr.quel.jp/ （無料）でPNG/SVG出力できます。

**推奨設定:**
- サイズ: 500×500px 以上
- エラー訂正: H（最高）
- 出力: PNG（印刷用）または SVG（拡大縮小対応）

---

## 管理画面へのログイン

URL: `https://your-domain.com/admin`

- パスワードは `.env.local` の `ADMIN_PASSWORD` に設定した値

---

## 店舗情報の編集

[`src/lib/bars.ts`](src/lib/bars.ts) を直接編集してください。
各バーの説明文・カクテル情報・営業時間・地図URLなどをここで一元管理しています。

---

## 店舗写真の追加

1. `public/images/bars/` に `sou.jpg`, `daisy.jpg` などの画像を配置
2. [`src/components/BarCard.tsx`](src/components/BarCard.tsx) と
   [`src/app/bars/[slug]/page.tsx`](src/app/bars/%5Bslug%5D/page.tsx) の
   プレースホルダー部分を `<Image src={...} />` に差し替える

---

## ページ構成

| URL | 説明 |
|---|---|
| `/` | トップ（スタンプ一覧・進捗） |
| `/bars` | 参加店舗一覧 |
| `/bars/[slug]` | 店舗詳細ページ |
| `/passport/stamp/[barSlug]` | QRスタンプ取得（QR経由） |
| `/complete` | コンプリート画面・達成コード表示 |
| `/admin` | 管理画面（パスワード必須） |

---

## よくある質問

**Q: スタンプを重複取得できてしまう？**
→ 同一参加者IDから同一バーへの2回目のリクエストはAPIレベルで弾きます（DB UNIQUE制約も有り）。

**Q: 参加者IDはどこに保存される？**
→ ブラウザの `localStorage` と Supabase の `participants` テーブルの両方に保存されます。ブラウザのキャッシュをクリアするとIDが失われますが、スタンプ履歴はSupabase側に残ります。

**Q: 管理画面のデータはリアルタイムで更新される？**
→ ページを開いた時点のデータを取得します。最新データを見るにはページをリロードしてください。
