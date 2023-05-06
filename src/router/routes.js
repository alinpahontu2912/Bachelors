
const routes = [

  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/StartPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'login', component: () => import('src/pages/LoginForm.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
      { path: 'signup', component: () => import('src/pages/SignUpForm.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
      { path: 'announcements', component:() => import('src/pages/AnnouncementsPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'solveRequests', component:() => import('src/pages/RequestsPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'admin', component:() => import('src/pages/AdminPanel.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'europe/barChart', component: () => import('src/pages/BarChart.vue') , meta: {requiresAuth: false, requiresAdmin: false}},
      { path: 'europe/lineGraph', component:() => import('src/pages/EuropeLineGraph.vue'), meta: {requiresAuth: false, requiresAdmin: false} },
      { path: 'europe/map', component:() => import('src/pages/EuropeMap.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'europe/table', component:() => import('src/pages/EuropeTable.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'romania/map', component:() => import('src/pages/RomaniaMap.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { path: 'romania/countyBarChart', component:() => import('src/pages/RomaniaCountyPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'romania/lineGraph', component:() => import('src/pages/RomaniaLineGraphPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'romania/reportGenerator', component:() => import('src/pages/RomaniaReportGenerator.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'romania/table/county', component:() => import('src/pages/RomaniaCountyTable.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { path: 'romania/table/residencyArea', component:() => import('src/pages/RomaniaResidencyTable.vue'), meta: {requiresAuth: true, requiresAdmin: true} },


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
