export default {
    kind: 'collectionType',
    collectionName: 'groups',
    info: {
        singularName: 'group',
        pluralName: 'groups',
        displayName: 'Group',
        description: 'Manage groups for Azure Matrix Access',
    },
    options: {
        draftAndPublish: false,
    },
    pluginOptions: {
        'content-manager': {
            visible: false,
        },
        'content-type-builder': {
            visible: false,
        }
    },
    attributes: {
        name: {
            type: 'string',
            min: 1,
            max: 100,
            configurable: false,
        },
        id: {
            type: 'string',
            min: 36,
            max: 36,
            configurable: false,
        },
    }
};