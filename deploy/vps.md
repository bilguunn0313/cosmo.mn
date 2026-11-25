# VPS дээр байршуулах (нөөц хувилбар)

Сервер дээрх бүтэц:

```
/srv/cosmo.mn            git repo (энэ төсөл)
/srv/cosmo-data/uploads  админаас оруулсан зураг, видео (UPLOADS_DIR)
/srv/cosmo-data/backups  өгөгдлийн сан болон uploads-ийн нөөц
```

pm2 хоёр процесс ажиллуулна: `cosmo-api` (NestJS, 4000 порт) ба `cosmo-web` (Next.js, 3000 порт). Nginx гаднаас ирсэн хүсэлтийг хуваарилна: `/api/*` → Nest, `/uploads/*` → дискнээс шууд, бусад нь → Next.

## Өдөр тутмын deploy

```powershell
git push
ssh cosmo "bash /srv/cosmo.mn/scripts/deploy.sh"
```

Скрипт дарааллаар: нөөц авна → `origin/main`-ийг татна → `npm ci` → migration → API build ба restart → web build ба restart. Алхам бүтэлгүйтвэл тэр дороо зогсоно.

### Буцаах

Deploy-ийн төгсгөлд өмнөх commit хэвлэгдэнэ. Буцаахдаа:

```powershell
ssh cosmo "bash /srv/cosmo.mn/scripts/deploy.sh <commit>"
```

Код буцдаг ч migration буцдаггүй. Migration өгөгдлийг эвдсэн бол deploy-ийн өмнө авсан нөөцөөс сэргээнэ:

```bash
pg_restore --clean --if-exists -d "<DATABASE_URL>" /srv/cosmo-data/backups/db/cosmo-<огноо>.dump
```

## Серверийг анх тохируулах (нэг удаа)

Ubuntu 24.04 LTS, root эрхээр эхэлнэ.

### 1. Хэрэглэгч, SSH, firewall

```bash
apt update && apt upgrade -y
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Шинэ терминалаас `ssh deploy@<IP>` орж чадаж байгааг шалгасны **дараа** л `/etc/ssh/sshd_config`-д:

```
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart ssh
sudo apt install -y fail2ban
sudo ufw allow OpenSSH
sudo ufw enable
```

Өөрийн компьютерийн `~/.ssh/config`-д:

```
Host cosmo
    HostName <IP>
    User deploy
```

### 2. Программ суулгах

```bash
sudo apt install -y git nginx postgresql rsync certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
sudo ufw allow "Nginx Full"
```

`node -v` нь 24.9 буюу түүнээс дээш байх ёстой.

### 3. Өгөгдлийн сан

```bash
sudo -u postgres createuser --pwprompt cosmo
sudo -u postgres createdb --owner=cosmo cosmo
```

### 4. Хавтас ба repo

```bash
sudo mkdir -p /srv/cosmo.mn /srv/cosmo-data/uploads /srv/cosmo-data/backups
sudo chown -R deploy:deploy /srv/cosmo.mn /srv/cosmo-data
git clone https://github.com/bilguunn0313/cosmo.mn.git /srv/cosmo.mn
```

Repo private бол серверт тусдаа түлхүүр үүсгээд (`ssh-keygen -t ed25519`), `~/.ssh/id_ed25519.pub`-ийг GitHub → Settings → Deploy keys-д (read-only) нэмж, `git@github.com:bilguunn0313/cosmo.mn.git` хаягаар clone хийнэ.

### 5. `.env` файлууд

Dev-ийн утгыг дахин бүү ашигла. Шинэ нууц үгсийг password manager-т хадгална.

`apps/api/.env`:

| Хувьсагч | Утга |
|---|---|
| `DATABASE_URL` | `postgresql://cosmo:<3-р алхмын нууц үг>@localhost:5432/cosmo` |
| `WEB_URL` | `https://cosmo.mn` |
| `PORT` | `4000` |
| `JWT_SECRET` | `openssl rand -hex 32` командын гаралт |
| `UPLOADS_DIR` | `/srv/cosmo-data/uploads` (Nginx-ийн тохиргоотой ижил байх ёстой) |
| `RESEND_API_KEY`, `MAIL_FROM` | Resend дээр cosmo.mn-ийг баталгаажуулсны дараа |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | анхны админ, хүчтэй нууц үгтэй |

`apps/web/.env.local`:

| Хувьсагч | Утга |
|---|---|
| `API_URL` | `http://127.0.0.1:4000` |
| `SITE_URL` | `https://cosmo.mn` |

### 6. Анхны deploy

```bash
cd /srv/cosmo.mn
bash scripts/deploy.sh
npm run db:seed -w apps/api
pm2 startup
pm2 install pm2-logrotate
```

`pm2 startup` хэвлэсэн `sudo ...` командыг хуулж ажиллуулна. Ингэснээр сервер дахин асахад сайт өөрөө асна.

### 7. Nginx ба SSL

Домэйны `A` бичлэгүүд (`cosmo.mn`, `www`) серверийн IP руу заасны дараа:

```bash
sudo cp deploy/nginx/cosmo.mn.conf /etc/nginx/sites-available/cosmo.mn
sudo ln -s /etc/nginx/sites-available/cosmo.mn /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d cosmo.mn -d www.cosmo.mn --redirect
```

Админы нэвтрэлт HTTPS дээр л ажиллана (cookie нь `secure`).

### 8. Өдөр бүрийн нөөц

`crontab -e`:

```
0 3 * * * bash /srv/cosmo.mn/scripts/backup.sh >> /srv/cosmo-data/backups/backup.log 2>&1
```

Өгөгдлийн сангийн нөөц 14 хоног хадгалагдана. Uploads-ийн нөөцөөс файл устдаггүй. Нөөц нэг сервер дээр байгаа тул үе үе өөрийн компьютер руу татаж авна:

```powershell
scp -r cosmo:/srv/cosmo-data/backups ./cosmo-backups
```
