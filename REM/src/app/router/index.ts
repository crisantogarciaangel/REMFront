import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { verificationRoutes } from '@/modules/verifications/routes';

// Rutas base (puedes agregar más aquí)
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  // Si quieres una ruta "fallback" (opcional):
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/HomeView.vue'),
  },
];

const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...verificationRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
