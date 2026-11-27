# Туршилтын deploy: Vercel + Railway

cPanel бэлэн болтол сайтыг онлайнаар үзүүлэх **түр** орчин. Үндсэн заавар: [README.md](README.md) (cPanel).

```
new.cosmo.mn      → Vercel   вэбсайт
new-api.cosmo.mn  → Railway  API + MySQL + зургийн volume
```

`cosmo.mn`, `api.cosmo.mn`-д хүрэхгүй, тэдгээрийг cPanel-д үлдээнэ.

## 0. Бэлтгэл

- [ ] Код GitHub-ийн `main` дээр push хийгдсэн
- [ ] Railway бүртгэл. Эхний 30 хоногийн $5 туршилтын кредит хангалттай. Үнэгүй ($1/сар) багц хүрэлцэхгүй.
- [ ] Vercel бүртгэл (Hobby)
- [ ] Railway CLI: `npm.cmd install -g @railway/cli`
- [ ] Docker Desktop асаалттай
- [ ] `cosmo-mysql-2026-11-27.sql` ба `cosmo-uploads-2026-11-27.zip` файлууд
- [ ] cPanel → **Zone Editor** (cosmo.mn-ийн DNS) руу нэвтрэх эрх

PowerShell скрипт ажиллуулахыг хориглосон компьютер дээр `npm`, `railway`-ийн оронд `npm.cmd`, `railway.cmd` гэж бичнэ.

## 1. Railway: MySQL

1. railway.com → **New Project** → **Deploy MySQL**.
2. MySQL service → **Settings** → Region: **Southeast Asia (Singapore)**.

## 2. Өгөгдөл оруулах

Оффисын сүлжээ MySQL-ийн порт (3306, Railway-ийн proxy порт)-ыг хаадаг тул **Public Access ашиглахгүй**, SSH tunnel-ээр (22-р порт) оруулна.

```powershell
railway.cmd login
cd C:\Users\User\Desktop\cosmo.mn
railway.cmd link
railway.cmd ssh keys add
railway.cmd connect MySQL --tunnel-only --port 3310
```

`link` дээр төсөл, `production` environment-ийг сонгоно. `ssh keys add` нь `~/.ssh`-ийн түлхүүрийг Railway-д бүртгэнэ. Сүүлийн команд нууц үгийг хэвлээд tunnel-ийг нээлттэй барина: цонхыг бүү хаа.

**Өөр** PowerShell цонхонд, SQL файл байгаа хавтаснаас (`НУУЦҮГ` нь tunnel-ийн хэвлэсэн `Password`):

```powershell
docker run --rm -v "${PWD}:/backup" mysql:8.4 sh -c "mysql --default-character-set=utf8mb4 -h host.docker.internal -P 3310 -u root -pНУУЦҮГ railway < /backup/cosmo-mysql-2026-11-27.sql"
```

Дуусмагц tunnel-ийн цонхонд **Ctrl+C**. SQL-ийг `Get-Content ... |`-ээр бүү дамжуулаарай. PowerShell 5.1 кирилл үсгийг эвдэнэ.

## 3. Railway: API

1. Төсөл дотор **New** → **GitHub Repo** → `cosmo.mn`.
2. **Settings**:

   | Талбар | Утга |
   |---|---|
   | Region | Southeast Asia (Singapore) |
   | Custom Build Command | `npm run build:api` |
   | Custom Start Command | `npm run start:prod -w apps/api` |
   | Pre-deploy Command | `npm run prisma:migrate -w apps/api` |
   | Healthcheck Path | `/health` |
   | Watch Paths | `apps/api/**`, `packages/shared/**` |

3. API service дээр **Volume** нэмнэ. Mount path нь `/data`.
4. **Variables**:

   | Хувьсагч | Утга |
   |---|---|
   | `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` |
   | `RAILPACK_NODE_VERSION` | `22` |
   | `PORT` | `4000` |
   | `WEB_URL` | `https://new.cosmo.mn` |
   | `COOKIE_DOMAIN` | `cosmo.mn` |
   | `CLIENT_IP_HEADER` | `x-real-ip` |
   | `UPLOADS_DIR` | `/data/uploads` |
   | `JWT_SECRET` | шинэ, 64 тэмдэгттэй санамсаргүй мөр |
   | `RESEND_API_KEY`, `MAIL_FROM` | local `.env`-ийнхтэй ижил |

   `NODE_ENV`-г бүү нэмээрэй. Railway апп ажиллах үед үүнийг өөрөө `production` болгодог. Build хийх үед тохируулбал build эвдэрнэ.

5. Deploy ногоон болмогц **Settings** → **Networking** → **Custom Domain** → `new-api.cosmo.mn`, порт `4000`. Railway өгсөн CNAME-ийг cPanel → **Zone Editor**-т нэмнэ.
6. `https://new-api.cosmo.mn/health` → `{"status":"ok","database":"up"}`

## 4. Зургууд

`cosmo-uploads-2026-11-27.zip`-ийг `cosmo-uploads` хавтсанд задлаад, тэр хавтсыг агуулсан хавтаснаас:

```powershell
railway.cmd service
railway.cmd volume files upload .\cosmo-uploads /uploads
```

`railway.cmd service` дээр API service-ийг сонгоно (2-р алхмын `link` MySQL дээр байж болно). API ажиллаж байх үед л upload хийгдэнэ.

Шалгах: `https://new-api.cosmo.mn/uploads/images/<аль нэг файл>.webp`. Нээгдэхгүй бол `railway.cmd volume files browse /` командаар файлууд `/uploads/images/` дотор байгаа эсэхийг харна.

## 5. Vercel: вэбсайт

API ажиллаж эхэлсний **дараа** хийнэ. Build хийх үед хуудсууд API-аас өгөгдөл татдаг.

1. vercel.com → **Add New** → **Project** → `cosmo.mn` repo.
2. Тохиргоо:

   | Талбар | Утга |
   |---|---|
   | Root Directory | `apps/web` |
   | Install Command | `cd ../.. && npm ci` |
   | Build Command | `cd ../.. && npm run build:web` |
   | Node.js Version | 22.x |

3. **Environment Variables**:

   | Хувьсагч | Утга |
   |---|---|
   | `API_URL` | `https://new-api.cosmo.mn` |
   | `NEXT_PUBLIC_API_URL` | `https://new-api.cosmo.mn` |
   | `SITE_URL` | `https://new.cosmo.mn` |

4. **Deploy**.
5. **Settings** → **Functions** → Function Region: **Singapore (sin1)** → дахин deploy хийнэ.
6. **Settings** → **Domains** → `new.cosmo.mn`. Vercel-ийн өгсөн бичлэгийг cPanel → **Zone Editor**-т нэмнэ.

## 6. Шалгах

- [ ] `https://new.cosmo.mn` гурван хэлээр контент, зурагтайгаа харагдаж байна
- [ ] `https://new.cosmo.mn/admin/login`: local-ын имэйл, нууц үгээрээ нэвтэрч байна
- [ ] Админаас зураг upload хийгдэж, өөрчлөлт сайт дээр гарч байна
- [ ] Холбоо барих маягт имэйл илгээж байна

## 7. Дууссаны дараа

cPanel ажиллаж эхэлмэгц:
1. Railway төслийг **Delete Project**-оор устгана, эс бөгөөс төлбөр үргэлжилнэ.
2. Vercel төслийг устгана.
3. Zone Editor-оос `new` ба `new-api` бичлэгүүдийг хасна.

Туршилтын орчинд админаас оруулсан контент cPanel руу **автоматаар шилжихгүй**. Контентоо cPanel-д нэг л газар засаарай.
