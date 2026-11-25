# Deploy: Vercel + Railway

```
cosmo.mn      → Vercel   web (Next.js)
api.cosmo.mn  → Railway  API (NestJS) + Postgres + зургийн volume
```

Хөтөч админы хүсэлт, upload, маягтыг `api.cosmo.mn` руу шууд илгээнэ. Нэвтрэлтийн cookie нь `cosmo.mn`-ийн бүх subdomain дээр хүчинтэй. `main` руу push хийхэд хоёр платформ автоматаар deploy хийнэ.

VPS дээр байршуулах заавар: [vps.md](vps.md).

## 0. Бэлтгэл

- [ ] Vercel ба Railway бүртгэл, компанийн имэйлээр. Туршилтын үед Vercel Hobby хангалттай. Сайтыг олон нийтэд нээхээс өмнө **Pro** руу шилжинэ, учир нь Hobby нь арилжааны хэрэглээг зөвшөөрдөггүй.
- [ ] Домэйны DNS панелд нэвтрэх эрх
- [ ] Docker Desktop асаалттай (local DB-г экспортлоход хэрэгтэй)
- [ ] Railway CLI: `npm install -g @railway/cli`
- [ ] Кодоо commit хийгээд `main` руу push хийсэн

## 1. Railway: Postgres

1. railway.com → **New Project** → **Deploy PostgreSQL**.
2. Postgres service → **Settings** → Region: **Southeast Asia (Singapore)**.
3. Postgres → **Variables**-аас `DATABASE_PUBLIC_URL`-ийг хуулж авна. Үүнийг 2-р алхамд хэрэглэнэ.

## 2. Local өгөгдлийг Railway руу хуулах

⚠️ Энэ алхмаас хойш local админаас юу ч бүү засаарай. Хуулсны дараах өөрчлөлт production-д орохгүй.

Repo-гийн root хавтаснаас, PowerShell дээр:

```powershell
docker compose exec db pg_dump -U cosmo -Fc -f /tmp/cosmo.dump cosmo
docker compose cp db:/tmp/cosmo.dump ./cosmo.dump
docker run --rm -v "${PWD}:/backup" postgres:16 pg_restore --no-owner --no-acl -d "<DATABASE_PUBLIC_URL>" /backup/cosmo.dump
```

`cosmo.dump` файлд админы нууц үгийн hash байгаа тул сэргээж дууссаны дараа устгана. Git-д орохгүй (`.gitignore`-д нэмсэн).

Migration-ий түүх хамт хуулагдана. Тиймээс API анх deploy хийгдэхэд шинэ migration ажиллахгүй.

## 3. Railway: API

1. Төсөл дотроо **New** → **GitHub Repo** → `cosmo.mn` repo.
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
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `RAILPACK_NODE_VERSION` | `24` |
   | `PORT` | `4000` |
   | `WEB_URL` | `https://cosmo.mn` |
   | `COOKIE_DOMAIN` | `cosmo.mn` |
   | `CLIENT_IP_HEADER` | `x-real-ip` |
   | `UPLOADS_DIR` | `/data/uploads` |
   | `JWT_SECRET` | шинэ урт санамсаргүй тэмдэгт мөр |
   | `RESEND_API_KEY`, `MAIL_FROM` | 6-р алхмын дараа |

   `NODE_ENV`-г бүү нэмээрэй. Railway апп ажиллах үед үүнийг өөрөө `production` болгодог. Build хийх үед тохируулбал build эвдэрнэ.

5. Deploy хийгдээд **Deployments** хэсэгт ногоон болсны дараа: **Settings** → **Networking** → **Custom Domain** → `api.cosmo.mn`, порт `4000`. Railway CNAME бичлэг өгнө. Үүнийг DNS панелд нэмнэ.
6. `https://api.cosmo.mn/health` хөтөч дээр нээгдэх хүртэл хүлээнэ (DNS шинэчлэгдэхэд хэдэн минутаас хэдэн цаг шаардагдана).

## 4. Зургуудыг volume руу хуулах

Repo-гийн root хавтаснаас:

```powershell
railway login
railway link
railway volume files upload apps/api/uploads /uploads
```

`railway link` дээр төсөл болон API service-ийг сонгоно. API ажиллаж байх үед л upload хийгдэнэ.

Шалгах: local `apps/api/uploads/images/` доторх аль нэг файлын нэрийг аваад `https://api.cosmo.mn/uploads/images/<файл>.webp` хаягийг нээнэ. Нээгдэхгүй бол `railway volume files browse /` командаар файлууд хаана очсоныг харна. Тэд `/data/uploads` доор байх ёстой.

## 5. Vercel: web

1. vercel.com → **Add New** → **Project** → `cosmo.mn` repo.
2. Тохиргоо:

   | Талбар | Утга |
   |---|---|
   | Root Directory | `apps/web` |
   | Install Command | `cd ../.. && npm ci` |
   | Build Command | `cd ../.. && npm run build:web` |
   | Node.js Version | 24.x |

3. **Environment Variables**:

   | Хувьсагч | Утга |
   |---|---|
   | `API_URL` | `https://api.cosmo.mn` |
   | `NEXT_PUBLIC_API_URL` | `https://api.cosmo.mn` |
   | `SITE_URL` | `https://cosmo.mn` |

4. **Deploy**. Build хийх үед хуудсууд API-аас өгөгдөл татдаг тул 3-р алхмын `api.cosmo.mn` ажиллаж байх ёстой.
5. **Settings** → **Functions** → Function Region: **Singapore (sin1)**. Дараа нь дахин deploy хийнэ.
6. **Settings** → **Domains** → `cosmo.mn` болон `www.cosmo.mn` нэмж, `www`-ийг `cosmo.mn` руу redirect хийнэ. Vercel-ийн заасан бичлэгүүдийг DNS панелд нэмнэ.

`cosmo.mn` дээр одоо хуучин сайт ажиллаж байгаа бөгөөд шинэ сайтыг шалгаж дуустал түүнийг хэвээр үлдээх бол: эхлээд `new.cosmo.mn`-ийг нэмж, Railway-ийн `WEB_URL`-ийг `https://new.cosmo.mn` болгоно. Шалгаж дууссаны дараа `cosmo.mn` руу шилжүүлж, `WEB_URL`-ийг буцааж өөрчилнө.

`*.vercel.app` хаяг дээр нийтийн хуудсууд ажиллана. Харин cookie нь `cosmo.mn`-д хамаарах тул админ нэвтрэлт ажиллахгүй.

## 6. Имэйл (Resend)

1. resend.com → **Domains** → `cosmo.mn` нэмнэ. Resend-ийн өгсөн DNS бичлэгүүдийг нэмээд **Verify** дарна.
2. API key үүсгээд Railway-д `RESEND_API_KEY`, `MAIL_FROM` (`cosmo.mn <noreply@cosmo.mn>`) гэж нэмнэ.

Энэ алхмыг хийхээс өмнө contact маягт болон анкет «илгээж чадсангүй» гэсэн алдаа өгнө.

⚠️ DNS панелд байгаа хуучин MX, TXT бичлэгүүдэд хүрэхгүй. Тэд компанийн одоогийн имэйлийн бичлэгүүд.

## 7. Шалгах

- [ ] Нүүр, Бидний тухай, Брэндүүд, Медиа, Холбоо барих хуудсууд MN / EN / ZH хэлээр контент, зурагтайгаа харагдаж байна
- [ ] `https://cosmo.mn/admin/login`-оор нэвтэрч чадаж байна
- [ ] **Админы нууц үгийг шууд сольсон.** Local DB-ээс хуулагдсан тул хуучин нууц үг хэвээр байгаа.
- [ ] Утсаар авсан том (5MB+) зураг upload хийгдэж байна
- [ ] Админаас өөрчилсөн зүйл сайт дээр гарч байна
- [ ] Contact маягт имэйл хүргэж байна

## Өдөр тутам

- `git push` хийхэд Vercel web-ийг, Railway API-г дахин deploy хийнэ. Шинэ migration байвал Railway апп асахаас өмнө ажиллуулна.
- **Нөөц:** Сард нэг удаа ч гэсэн DB-ээ өөрийн компьютер руу татаж авна. Docker image-ийн хувилбар Railway-ийн Postgres-ийн хувилбартай ижил буюу түүнээс шинэ байх ёстой (Postgres service-ийн логоос хувилбарыг нь харна):

  ```powershell
  docker run --rm -v "${PWD}:/backup" postgres:17 pg_dump -Fc -f /backup/cosmo-backup.dump "<DATABASE_PUBLIC_URL>"
  ```
