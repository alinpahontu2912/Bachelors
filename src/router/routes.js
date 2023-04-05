
const routes = [

  {
    path: '/',
    component: () => import('src/layouts/StartPageLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/TestPage.vue') },
      { path: 'start', component: () => import('pages/StartPage.vue') },
      { path: 'login', component: () => import('src/pages/LoginForm.vue') },
      { path: 'signup', component: () => import('src/pages/SignUpForm.vue') },
      {path: 'test', component:() => import('src/pages/TestMyPage.vue')},
       {path: 'test2', component:() => import('src/pages/TestPage2.vue')}
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/accountsettings', component: () => import('pages/AccountSettingsPage.vue') },
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
