import type { Core } from '@strapi/strapi';

const groupController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getMatrix(ctx: any) {
    try {
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const result = await azureService.getGroupMatrix();
      
      ctx.send({
        data: result,
        meta: {
          domains: azureService.DOMAINS,
          classifications: azureService.CLASSIFICATIONS,
        },
      });
    } catch (error) {
      strapi.log.error('Failed to get group matrix:', error);
      ctx.throw(500, 'Failed to get group matrix');
    }
  },

  async assignContentToGroups(ctx: any) {
    try {
      const { contentType, contentId, groupIds } = ctx.request.body;
      
      if (!contentType || !contentId || !Array.isArray(groupIds)) {
        return ctx.throw(400, 'Missing required parameters: contentType, contentId, groupIds');
      }
      
      // Validate user has permission to assign to these groups
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const userGroups = await azureService.getUserAccessibleGroups(ctx.state.user.id);
      
      const userGroupIds = userGroups.map((g: any) => g.id);
      const hasPermission = groupIds.every((id: string) => userGroupIds.includes(id));
      
      if (!hasPermission) {
        return ctx.throw(403, 'Insufficient permissions to assign to these groups');
      }
      
      await azureService.assignContentToGroups(contentType, contentId, groupIds);
      
      ctx.send({ 
        data: { success: true },
        message: 'Content assigned to groups successfully'
      });
    } catch (error) {
      strapi.log.error('Failed to assign content to groups:', error);
      ctx.throw(500, 'Failed to assign content to groups');
    }
  },

  async getUserGroups(ctx: any) {
    try {
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const groups = await azureService.getUserAccessibleGroups(ctx.state.user.id);
      
      ctx.send({
        data: groups,
        meta: {
          count: groups.length,
        },
      });
    } catch (error) {
      strapi.log.error('Failed to get user groups:', error);
      ctx.throw(500, 'Failed to get user groups');
    }
  },

  async getContentByAccess(ctx: any) {
    try {
      const { contentType } = ctx.params;
      const { page = 1, pageSize = 25, sort, filters } = ctx.query;
      
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const results = await azureService.getContentByUserAccess(
        contentType,
        ctx.state.user.id,
        {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          sort,
          filters: filters || {},
        }
      );
      
      ctx.send({
        data: results,
      });
    } catch (error) {
      strapi.log.error('Failed to get content by access:', error);
      ctx.throw(500, 'Failed to get content by access');
    }
  },

  async checkAccess(ctx: any) {
    try {
      const { contentType, contentId } = ctx.params;
      
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const hasAccess = await azureService.checkUserContentAccess(
        contentType,
        contentId,
        ctx.state.user.id
      );
      
      ctx.send({
        data: { hasAccess },
      });
    } catch (error) {
      strapi.log.error('Failed to check access:', error);
      ctx.throw(500, 'Failed to check access');
    }
  },

  async syncUserGroups(ctx: any) {
    try {
      const { userId, azureGroupIds } = ctx.request.body;
      
      if (!userId || !Array.isArray(azureGroupIds)) {
        return ctx.throw(400, 'Missing required parameters: userId, azureGroupIds');
      }
      
      const azureService = strapi.plugin('group-matrix-access').service('azure');
      const syncedGroups = await azureService.syncUserGroups(userId, azureGroupIds);
      
      ctx.send({
        data: syncedGroups,
        message: 'User groups synchronized successfully',
      });
    } catch (error) {
      strapi.log.error('Failed to sync user groups:', error);
      ctx.throw(500, 'Failed to sync user groups');
    }
  },
});

export default groupController;
