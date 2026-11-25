# Deploy: cPanel

```
cosmo.mn      → Node app «cosmo-web»   /home/wwwcosmo/cosmo-web
api.cosmo.mn  → Node app «cosmo-api»   /home/wwwcosmo/cosmo-api
                MySQL өгөгдлийн сан, зургууд: /home/wwwcosmo/cosmo-uploads
```

Код компьютер дээр build хийгдэж, cPanel руу бэлэн zip болж очно. Сервер дээр build хийхгүй.

cPanel бэлэн болтол ашиглах түр туршилтын орчин: [vercel-railway.md](vercel-railway.md).

## 1. Компьютер дээр багц бэлдэх

Node.js 24, git хэрэгтэй.

```powershell
git clone https://github.com/bilguunn0313/cosmo.mn.git
cd cosmo.mn
npm ci
```

`apps/web/.env.production.local` файл үүсгэнэ:

```
API_URL="https://api.cosmo.mn"
NEXT_PUBLIC_API_URL="https://api.cosmo.mn"
SITE_URL="https://cosmo.mn"
```

```powershell
npm run package:cpanel
```

3 минут орчим болно. Дуусахад `dist-cpanel/` хавтсанд хоёр файл гарна:

- `cosmo-api.zip`: API
- `cosmo-web.zip`: вэбсайт

Эдгээрээс гадна танд дараах хоёр файл ирсэн байх ёстой: өгөгдлийн сан (`cosmo-mysql-*.sql`) ба зургууд (`cosmo-uploads-*.zip`).

## 2. cPanel: анх удаа

### 2.1 Subdomain ба SSL

1. **Domains** → `api.cosmo.mn` үүсгэнэ.
2. **SSL/TLS Status** → **Run AutoSSL**. `cosmo.mn` болон `api.cosmo.mn` хоёулаа ногоон түгжээтэй болох ёстой. HTTPS-гүйгээр админ нэвтрэлт ажиллахгүй.

### 2.2 Өгөгдлийн сан

1. **MySQL Databases** хэсэгт:
   - `wwwcosmo_cosmo` өгөгдлийн сан үүсгэнэ.
   - `wwwcosmo_cosmo` хэрэглэгч үүсгэнэ. Нууц үг нь **зөвхөн үсэг, тооноос** бүрдсэн урт нууц үг байна. `@ # % / :` зэрэг тэмдэгт холбогдох хаягийг эвдэнэ.
   - Хэрэглэгчийг өгөгдлийн санд **ALL PRIVILEGES** эрхтэй нэмнэ.
2. **phpMyAdmin** → зүүн талаас `wwwcosmo_cosmo` → **Import** → `cosmo-mysql-*.sql` → **Go**. 23 хүснэгт гарч ирнэ.

### 2.3 Файлууд

**File Manager**-аар `/home/wwwcosmo` дотор гурван хавтас үүсгэнэ. Zip бүрийг өөрийн хавтсанд **Upload** хийгээд, баруун товч → **Extract** хийнэ. Дараа нь zip файлыг устгана.

| Хавтас | Zip |
|---|---|
| `cosmo-api` | `cosmo-api.zip` |
| `cosmo-web` | `cosmo-web.zip` |
| `cosmo-uploads` | `cosmo-uploads-*.zip` (дотор нь `images/` хавтас гарна) |

### 2.4 API app

**Setup Node.js App** → **CREATE**:

| Талбар | Утга |
|---|---|
| Node.js version | **20.19** (анхдагч 10.24-ийг заавал солино) |
| Application mode | **Production** |
| Application root | `cosmo-api` |
| Application URL | `api.cosmo.mn` |
| Application startup file | `dist/main.js` |
| Passenger log file | `/home/wwwcosmo/logs/cosmo-api.log` |

**Environment variables** → **ADD VARIABLE**:

| Нэр | Утга |
|---|---|
| `DATABASE_URL` | `mysql://wwwcosmo_cosmo:НУУЦҮГ@localhost:3306/wwwcosmo_cosmo` |
| `WEB_URL` | `https://cosmo.mn` |
| `JWT_SECRET` | шинэ, 64 тэмдэгттэй санамсаргүй мөр (үсэг, тоо) |
| `UPLOADS_DIR` | `/home/wwwcosmo/cosmo-uploads` |
| `COOKIE_DOMAIN` | `cosmo.mn` |
| `CLIENT_IP_HEADER` | `x-forwarded-for` |
| `RESEND_API_KEY` | Resend-ийн түлхүүр |
| `MAIL_FROM` | `info@cosmo.mn` |

**CREATE** → **Run NPM Install** (1–3 минут) → **RESTART**.

Шалгах: `https://api.cosmo.mn/health` → `{"status":"ok","database":"up"}`

### 2.5 Вэбсайт app

**Setup Node.js App** → **CREATE**:

| Талбар | Утга |
|---|---|
| Node.js version | **20.19** |
| Application mode | **Production** |
| Application root | `cosmo-web` |
| Application URL | `cosmo.mn` (замын хэсэг хоосон) |
| Application startup file | `app.js` |
| Passenger log file | `/home/wwwcosmo/logs/cosmo-web.log` |

Environment variables хэрэггүй, учир нь тохиргоо нь zip дотор байгаа. **Run NPM Install хийхгүй.** **CREATE** → **RESTART**.

⚠️ Энэ app `cosmo.mn`-д `public_html`-ийн оронд ажиллана. Хуучин сайт байвал түүнийг орлоно.

Шалгах:
- `https://cosmo.mn`: Эхний 5 минутад зарим хэсэг хоосон харагдаж магадгүй. Багцыг API ажиллаж эхлэхээс өмнө build хийсэн учраас ийм байна. 5 минутын дараа refresh хийхэд бүрэн харагдана.
- `https://cosmo.mn/admin/login`: Local-д хэрэглэдэг имэйл, нууц үгээрээ нэвтэрнэ.

## 3. Шинэчлэх

1. Компьютер дээр: `git pull` → `npm ci` → `npm run package:cpanel`.
2. File Manager дээр:
   - `cosmo-api` доторх `dist` хавтсыг устгаад шинэ `cosmo-api.zip`-ийг Extract хийнэ.
   - `cosmo-web` доторх `standalone` хавтсыг устгаад шинэ `cosmo-web.zip`-ийг Extract хийнэ.
   - `node_modules` болон `cosmo-uploads`-д хүрэхгүй.
3. `package.json` өөрчлөгдсөн бол, өөрөөр хэлбэл шинэ сан нэмэгдсэн бол API дээр **Run NPM Install** хийнэ.
4. Repo-гийн `apps/api/prisma/migrations/` хавтсанд шинэ хавтас нэмэгдсэн бол түүний `migration.sql`-ийг phpMyAdmin → **SQL** табд ажиллуулна.
5. Хоёр app-ыг **RESTART** хийнэ.

Админаас оруулсан контент, зургууд шинэчлэлтэд хамаарахгүй, хэвээр үлдэнэ.

## 4. Алдаа гарвал

| Шинж тэмдэг | Хаана харах вэ |
|---|---|
| Хуудас нээгдэхгүй, 503 | `/home/wwwcosmo/logs/cosmo-api.log` эсвэл `cosmo-web.log`. Ихэвчлэн хувьсагчийн нэрийн алдаа эсвэл NPM Install хийгдээгүйгээс болдог. |
| `/health` дээр `database` нь `up` биш | `DATABASE_URL`-ийн нэр, нууц үг, хэрэглэгчийн эрх |
| Зураг харагдахгүй | `UPLOADS_DIR` зөв эсэх, `cosmo-uploads/images/` дотор файлууд байгаа эсэх |
| Админ нэвтэрсний дараа дахин нэвтрэх хуудас руу буцдаг | HTTPS (AutoSSL) болон `COOKIE_DOMAIN=cosmo.mn` |
| Холбоо барих маягт «илгээж чадсангүй» | `RESEND_API_KEY`, Resend дээр cosmo.mn домэйн баталгаажсан эсэх |
