# FiguSwap 🏆

App web estilo Tinder para intercambiar figuritas del Mundial 2026.  
Encontrá coleccionistas cerca tuyo, hacé match y completá tu álbum.

---

## Deploy en Vercel (5 minutos)

### 1. Base de datos — MongoDB Atlas (gratis)

1. Entrá a [cloud.mongodb.com](https://cloud.mongodb.com) y creá una cuenta
2. **Create a free cluster** (M0, cualquier región)
3. En **Database Access** → Add user → usuario + contraseña
4. En **Network Access** → Add IP → `0.0.0.0/0` (permite Vercel)
5. En **Connect** → Drivers → copiá la URL:
   ```
   mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/figuswap?retryWrites=true&w=majority
   ```

### 2. Deploy en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **New Project** → importá este repo
2. En **Environment Variables** agregá:

   | Variable | Valor |
   |----------|-------|
   | `MONGODB_URI` | La URL de MongoDB del paso anterior |
   | `NEXTAUTH_SECRET` | Cualquier string random largo (ej: `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | La URL de tu app en Vercel (ej: `https://figuswap.vercel.app`) |

3. Click en **Deploy** — listo 🚀

### 3. (Opcional) Login con Google

1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Crear **OAuth 2.0 Client ID** → Web application
3. URI autorizado: `https://tu-app.vercel.app/api/auth/callback/google`
4. Agregar en Vercel: `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`

---

## Desarrollo local

```bash
cp .env.local.example .env.local
# Completar las variables en .env.local

npm install
npm run dev
# → http://localhost:3000
```

## Tests

```bash
# Lógica de figuritas (96 tests, sin servidor)
node scripts/test-stickers.mjs

# Rutas API (requiere servidor corriendo)
BASE_URL=http://localhost:3000 bash scripts/test-api.sh
```

---

## Stack

- **Next.js 15** (App Router)
- **MongoDB + Mongoose**
- **NextAuth v5** (Google + email/contraseña)
- **Tailwind CSS + Framer Motion**
- **980 figuritas** (48 equipos × 20 + 20 FWC especiales)
