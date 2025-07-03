export default {
  kind: 'collectionType',
  collectionName: 'azure_groups',
  info: {
    singularName: 'azure-group',
    pluralName: 'azure-groups',
    displayName: 'Azure Groups',
    description: 'Azure AD groups for content access control with matrix structure',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    azureGroupId: {
      type: 'string',
      required: true,
      unique: true,
    },
    domain: {
      type: 'enumeration',
      enum: ['economy', 'population', 'agriculture', 'industry', 'social', 'labour-force'],
      required: true,
    },
    classification: {
      type: 'enumeration',
      enum: ['open', 'confidential', 'sensitive', 'secret'],
      required: true,
    },
    description: {
      type: 'text',
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    users: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'admin::user',
      mappedBy: 'azureGroups',
    },
    // This will be populated with all content types at runtime
    contents: {
      type: 'json',
      default: [],
    },
  },
};
