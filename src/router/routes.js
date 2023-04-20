
const routes = [

  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/TestPage.vue') , meta: {requiresAuth: false, requiresAdmin: false}},
      { path: 'start', component: () => import('pages/StartPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'login', component: () => import('src/pages/LoginForm.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
      { path: 'signup', component: () => import('src/pages/SignUpForm.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
      { path: 'test', component:() => import('src/pages/TestMyPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'test2', component:() => import('src/pages/TestPage2.vue'), meta: {requiresAuth: false, requiresAdmin: false} },
      { path: 'announcements', component:() => import('src/pages/AnnouncementsPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'solveRequests', component:() => import('src/pages/RequestsPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'admin', component:() => import('src/pages/AdminPanel.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
    ]
  },
  {
    path: '/home/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
      { path: '/accountsettings', component: () => import('pages/AccountSettingsPage.vue'), meta: {requiresAuth: true, requiresAdmin: false}  },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
