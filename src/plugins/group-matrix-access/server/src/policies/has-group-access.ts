import type { Core } from '@strapi/strapi';

const hasGroupAccess = ({ strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    try {
      const { user } = ctx.state;
      
      if (!user) {
        return ctx.throw(401, 'Authentication required');
      }
      
      // Get user's accessible groups
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const userGroups = await azureService.getUserAccessibleGroups(user.id);
      
      // For specific content access
      const { contentType, contentId } = ctx.params;
      
      if (contentType && contentId) {
        const hasAccess = await azureService.checkUserContentAccess(
          contentType,
          contentId,
          user.id
        );
        
        if (!hasAccess) {
          return ctx.throw(403, 'Insufficient permissions to access this content');
        }
      }
      
      // Add user groups to context for further filtering
      ctx.state.userGroups = userGroups;
      ctx.state.userGroupIds = userGroups.map((g: any) => g.id);
      
      await next();
    } catch (error) {
      strapi.log.error('Group access policy error:', error);
      ctx.throw(500, 'Access control error');
    }
  };
};

export default hasGroupAccess;
