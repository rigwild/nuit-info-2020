export default [
  // {
  //   path: '/user/uploadedDocumentsNew/:documentId?',
  //   name: 'UserUploadedDocumentsNew',
  //   component: () => import('@/views/user/UploadedDocumentsNew'),
  //   props: true
  // },
  {
    path: '/user/accountantsList',
    name: 'UserAccountantsList',
    component: () => import('@/views/user/AccountantsList'),
    meta: {
      menuBarName: 'Comptables'
    }
  },
  {
    path: '/user/accountantsListNew',
    name: 'UserAccountantsListNew',
    component: () => import('@/views/user/AccountantsListNew')
  }
].map(x => ({
  ...x,
  meta: {
    ...x.meta,
    needLoggedIn: true,
    neededAccountType: 'user'
  }
}))
