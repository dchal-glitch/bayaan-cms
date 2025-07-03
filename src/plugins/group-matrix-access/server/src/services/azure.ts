import type { Core } from '@strapi/strapi';

const azureService = ({ strapi }: { strapi: Core.Strapi }) => ({
  // Domain and classification enums
  DOMAINS: ['economy', 'population', 'agriculture', 'industry', 'social', 'labour-force'] as const,
  CLASSIFICATIONS: ['open', 'confidential', 'sensitive', 'secret'] as const,

  async initializeGroups() {
    try {
      strapi.log.info('Initializing Azure groups matrix...');
      
      // Create matrix groups if they don't exist
      for (const domain of this.DOMAINS) {
        for (const classification of this.CLASSIFICATIONS) {
          const groupName = `${domain}-${classification}`;
          
          const existingGroup = await strapi.entityService.findMany(
            'plugin::group-matrix-access.azure-group',
            { 
              filters: { name: groupName },
              limit: 1
            }
          );
          
          if (!existingGroup.length) {
            await strapi.entityService.create('plugin::group-matrix-access.azure-group', {
              data: {
                name: groupName,
                domain,
                classification,
                azureGroupId: await this.generateAzureGroupId(groupName),
                description: `${domain.replace('-', ' ')} domain with ${classification} classification`,
                isActive: true,
              },
            });
            strapi.log.info(`Created Azure group: ${groupName}`);
          }
        }
      }
      
      strapi.log.info('Azure groups matrix initialization completed');
    } catch (error) {
      strapi.log.error('Failed to initialize Azure groups:', error);
      throw error;
    }
  },

  async generateAzureGroupId(groupName: string): Promise<string> {
    // In a real implementation, this would fetch from Microsoft Graph API
    // For now, we'll generate a placeholder ID
    return `azure-${groupName}-${Date.now()}`;
  },

  async syncUserGroups(userId: string, azureGroupIds: string[]) {
    try {
      const user = await strapi.entityService.findOne('admin::user', userId, {
        populate: ['azureGroups'],
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Find matching groups in Strapi
      const strapiGroups = await strapi.entityService.findMany(
        'plugin::group-matrix-access.azure-group',
        { 
          filters: { azureGroupId: { $in: azureGroupIds } },
          fields: ['id', 'name', 'domain', 'classification']
        }
      );
      
      // Update user's group associations
      await strapi.entityService.update('admin::user', userId, {
        data: {
          azureGroups: strapiGroups.map(group => group.id),
        },
      });
      
      strapi.log.info(`Synced ${strapiGroups.length} groups for user ${userId}`);
      return strapiGroups;
    } catch (error) {
      strapi.log.error('Failed to sync user groups:', error);
      throw error;
    }
  },

  async getUserAccessibleGroups(userId: string) {
    try {
      const user = await strapi.entityService.findOne('admin::user', userId, {
        populate: {
          azureGroups: {
            fields: ['id', 'name', 'domain', 'classification', 'azureGroupId'],
          },
        },
      });
      
      return user?.azureGroups || [];
    } catch (error) {
      strapi.log.error('Failed to get user accessible groups:', error);
      return [];
    }
  },

  async getGroupMatrix() {
    try {
      const groups = await strapi.entityService.findMany(
        'plugin::group-matrix-access.azure-group',
        { 
          filters: { isActive: true },
          fields: ['id', 'name', 'domain', 'classification', 'description', 'isActive']
        }
      );
      
      // Organize into matrix structure
      const matrix: Record<string, Record<string, any>> = {};
      
      this.DOMAINS.forEach(domain => {
        matrix[domain] = {};
        this.CLASSIFICATIONS.forEach(classification => {
          const group = groups.find(g => g.domain === domain && g.classification === classification);
          matrix[domain][classification] = group || null;
        });
      });
      
      return { matrix, groups };
    } catch (error) {
      strapi.log.error('Failed to get group matrix:', error);
      throw error;
    }
  },

  async assignContentToGroups(contentType: string, contentId: string, groupIds: string[]) {
    try {
      // Validate content type exists
      if (!strapi.contentTypes[contentType]) {
        throw new Error(`Content type ${contentType} not found`);
      }

      // Update content with group assignments
      await strapi.entityService.update(contentType as any, contentId, {
        data: {
          azureGroups: groupIds,
        } as any,
      });

      strapi.log.info(`Assigned ${groupIds.length} groups to ${contentType}:${contentId}`);
      return true;
    } catch (error) {
      strapi.log.error('Failed to assign content to groups:', error);
      throw error;
    }
  },

  async getContentByUserAccess(contentType: string, userId: string, params: any = {}) {
    try {
      const userGroups = await this.getUserAccessibleGroups(userId);
      const userGroupIds = userGroups.map(g => g.id);

      if (userGroupIds.length === 0) {
        return { data: [], pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } };
      }

      // Filter content by user's accessible groups
      const filters = {
        ...params.filters,
        $or: [
          { azureGroups: { $null: true } }, // Content with no group restrictions
          { azureGroups: { id: { $in: userGroupIds } } }, // Content in user's groups
        ],
      };

      const results = await strapi.entityService.findMany(contentType as any, {
        ...params,
        filters,
        populate: {
          azureGroups: {
            fields: ['id', 'name', 'domain', 'classification'],
          },
        },
      });

      return results;
    } catch (error) {
      strapi.log.error('Failed to get content by user access:', error);
      throw error;
    }
  },

  async checkUserContentAccess(contentType: string, contentId: string, userId: string): Promise<boolean> {
    try {
      const userGroups = await this.getUserAccessibleGroups(userId);
      const userGroupIds = userGroups.map(g => g.id);

      const content = await strapi.entityService.findOne(contentType as any, contentId, {
        populate: {
          azureGroups: {
            fields: ['id'],
          },
        },
      });

      if (!content) {
        return false;
      }

      // If content has no group restrictions, allow access
      if (!content.azureGroups || content.azureGroups.length === 0) {
        return true;
      }

      // Check if user has access to any of the content's groups
      const hasAccess = content.azureGroups.some((group: any) => 
        userGroupIds.includes(group.id)
      );

      return hasAccess;
    } catch (error) {
      strapi.log.error('Failed to check user content access:', error);
      return false;
    }
  },
});

export default azureService;
