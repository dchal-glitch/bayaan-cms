import type { Core } from '@strapi/strapi';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Initialize Azure groups matrix on startup
  strapi.plugin('group-matrix-access').service('azure').initializeGroups();
  
  // Extend existing content types with Azure group relations
  const extendContentTypes = () => {
    Object.keys(strapi.contentTypes).forEach(uid => {
      const contentType = strapi.contentTypes[uid];
      
      // Add Azure groups relation to collection types (except admin and plugin types)
      if (
        contentType.kind === 'collectionType' && 
        !uid.startsWith('admin::') && 
        !uid.startsWith('plugin::') &&
        !contentType.attributes.azureGroups
      ) {
        contentType.attributes.azureGroups = {
          type: 'relation',
          relation: 'manyToMany',
          target: 'plugin::group-matrix-access.azure-group',
          inversedBy: 'contents',
        };
        
        strapi.log.info(`Extended ${uid} with Azure groups relation`);
      }
    });
  };

  // Extend user model with Azure groups
  const extendUserModel = () => {
    const userContentType = strapi.contentTypes['admin::user'];
    if (userContentType && !userContentType.attributes.azureGroups) {
      userContentType.attributes.azureGroups = {
        type: 'relation',
        relation: 'manyToMany',
        target: 'plugin::group-matrix-access.azure-group',
        inversedBy: 'users',
      };
      
      userContentType.attributes.azureObjectId = {
        type: 'string',
        unique: true,
      };
      
      strapi.log.info('Extended admin::user with Azure groups relation');
    }
  };

  // Execute extensions
  extendContentTypes();
  extendUserModel();
  
  strapi.log.info('Azure Group Matrix Access plugin bootstrapped successfully');
};

export default bootstrap;
