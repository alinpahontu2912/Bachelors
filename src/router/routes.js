
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/StartPageLayout.vue'),
    children: [
      { name: 'login', path: '', component: () => import('src/pages/LoginForm.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
      { path: 'signup', component: () => import('src/pages/SignUpForm.vue'), meta: {requiresAuth: false, requiresAdmin: false}  },
    ]
  },
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { name: 'start',  path: 'start', component: () => import('pages/StartPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { name: 'contact', path: 'messages', component:() => import('src/pages/ContactPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'announcements', path: 'announcements', component:() => import('src/pages/AnnouncementsPage.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { name: 'requests', path: 'solveRequests', component:() => import('src/pages/RequestsPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'admin', path: 'admin', component:() => import('src/pages/AdminPanel.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'account_settings',  path: '/accountsettings', component: () => import('pages/AccountSettingsPage.vue'), meta: {requiresAuth: true, requiresAdmin: false}  },
      { name: 'europe_barChart', path: 'europe/barChart', component: () => import('src/pages/BarChart.vue') , meta: {requiresAuth: false, requiresAdmin: false}},
      { name: 'europe_lineGraph', path: 'europe/lineGraph', component:() => import('src/pages/EuropeLineGraph.vue'), meta: {requiresAuth: false, requiresAdmin: false} },
      { name: 'europe_map', path: 'europe/map', component:() => import('src/pages/EuropeMap.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { name: 'europe_table', path: 'europe/table', component:() => import('src/pages/EuropeTable.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { name: 'romania_map', path: 'romania/map', component:() => import('src/pages/RomaniaMap.vue'), meta: {requiresAuth: true, requiresAdmin: false} },
      { name: 'romania_countyBarChart', path: 'romania/countyBarChart', component:() => import('src/pages/RomaniaCountyPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'romania_lineGraph' ,path: 'romania/lineGraph', component:() => import('src/pages/RomaniaLineGraphPage.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'romania_reportGenerator', path: 'romania/reportGenerator', component:() => import('src/pages/RomaniaReportGenerator.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'romania_tableCounty', path: 'romania/table/county', component:() => import('src/pages/RomaniaCountyTable.vue'), meta: {requiresAuth: true, requiresAdmin: true} },
      { name: 'romania_tableResidency', path: 'romania/table/residencyArea', component:() => import('src/pages/RomaniaResidencyTable.vue'), meta: {requiresAuth: true, requiresAdmin: true} },


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
