import type { RouteRecordRaw } from 'vue-router';

export const verificationRoutes: RouteRecordRaw[] = [
  { path: '/verifications', name: 'verifications.list', component: () => import('./views/VerificationListView.vue') },
  { path: '/verifications/new', name: 'verifications.create', component: () => import('./views/VerificationCreateView.vue') },
  { path: '/verifications/:id', name: 'verifications.detail', component: () => import('./views/VerificationDetailView.vue'), props: true },
];
