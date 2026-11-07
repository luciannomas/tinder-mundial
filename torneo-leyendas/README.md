# El Torneo de las Leyendas ⚽🏆

Home "Coming soon" del torneo (A, B, Los Papus, Tercero, Auxi, Matadores).

- **Next.js 15 + TypeScript** (App Router)
- **Vercel** para el deploy
- Próxima etapa: **MongoDB Atlas** (datos) + **Vercel Blob** (videos/fotos)

## Desarrollo

```bash
cd torneo-leyendas
npm install
npm run dev   # http://localhost:3000
```

## Video del Home

Cuando tengas el video, poné su URL en `NEXT_PUBLIC_HOME_VIDEO_URL`
(en `.env.local` o en Vercel → Environment Variables). Si está vacío se muestra el placeholder.

## Deploy en Vercel

New Project → importar el repo → **Root Directory: `torneo-leyendas`** → Deploy.
