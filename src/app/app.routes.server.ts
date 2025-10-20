import { RenderMode, ServerRoute } from '@angular/ssr';

// Usar SSR para todas as rotas evita a necessidade de fornecer
// getPrerenderParams para rotas com parâmetros (ex.: update/:id)
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
