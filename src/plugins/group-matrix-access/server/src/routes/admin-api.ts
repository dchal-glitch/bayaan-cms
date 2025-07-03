export default [
  {
    method: 'GET',
    path: '/groups/matrix',
    handler: 'group-controller.getMatrix',
    config: {
      auth: {
        strategy: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/content/assign-groups',
    handler: 'group-controller.assignContentToGroups',
    config: {
      auth: {
        strategy: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/user/groups',
    handler: 'group-controller.getUserGroups',
    config: {
      auth: {
        strategy: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/content/:contentType/access',
    handler: 'group-controller.getContentByAccess',
    config: {
      auth: {
        strategy: 'admin',
      },
    },
  },
  {
    method: 'GET',
    path: '/content/:contentType/:contentId/check-access',
    handler: 'group-controller.checkAccess',
    config: {
      auth: {
        strategy: 'admin',
      },
    },
  },
  {
    method: 'POST',
    path: '/sync/user-groups',
    handler: 'group-controller.syncUserGroups',
    config: {
      auth: {
        strategy: 'admin',
      },
    },
  },
];
