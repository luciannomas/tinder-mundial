# El Torneo de las Leyendas ⚽🏆

Home "Coming soon" del torneo (A, B, Los Papus, Tercero, Auxi, Matadores).

- **Next.js 15 + TypeScript** (App Router)
- **Vercel** para el deploy
- Próxima etapa: **MongoDB Atlas** (datos) + **Vercel Blob** (videos/fotos)

## Desarrollo

```bash
npm install
npm run dev   # http://localhost:3000
```

## Video del Home

El video está en `public/video/torneo-leyendas.mp4` (con su portada `torneo-leyendas-poster.jpg`).
Para usar otro video sin tocar código, poné su URL en `NEXT_PUBLIC_HOME_VIDEO_URL`
(en `.env.local` o en Vercel → Environment Variables).

## Deploy en Vercel

New Project → importar el repo → Deploy (no hace falta configurar nada más).
