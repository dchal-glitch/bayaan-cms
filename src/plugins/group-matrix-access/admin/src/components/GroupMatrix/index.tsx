import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardBody, 
  Typography, 
  Button,
  Flex,
  Badge,
  Status
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';

interface Group {
  id: string;
  name: string;
  domain: string;
  classification: string;
  description: string;
  isActive: boolean;
}

interface GroupMatrixProps {
  onGroupSelect?: (group: Group) => void;
  selectedGroups?: string[];
  mode?: 'view' | 'select';
  userGroups?: string[];
}

const GroupMatrix: React.FC<GroupMatrixProps> = ({ 
  onGroupSelect, 
  selectedGroups = [], 
  mode = 'view',
  userGroups = []
}) => {
  const [matrix, setMatrix] = useState<Record<string, Record<string, Group | null>>>({});
  const [loading, setLoading] = useState(true);
  const { get } = useFetchClient();

  const domains = ['economy', 'population', 'agriculture', 'industry', 'social', 'labour-force'];
  const classifications = ['open', 'confidential', 'sensitive', 'secret'];

  const classificationColors = {
    open: 'success',
    confidential: 'warning', 
    sensitive: 'danger',
    secret: 'secondary'
  } as const;

  const domainLabels = {
    'economy': 'Economy',
    'population': 'Population',
    'agriculture': 'Agriculture',
    'industry': 'Industry',
    'social': 'Social',
    'labour-force': 'Labour Force'
  } as const;

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      const response = await get('/group-matrix-access/groups/matrix');
      setMatrix(response.data.data.matrix);
    } catch (error) {
      console.error('Failed to fetch group matrix:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (group: Group) => {
    if (mode === 'select' && onGroupSelect) {
      // Only allow selection if user has access to this group
      if (userGroups.includes(group.id)) {
        onGroupSelect(group);
      }
    }
  };

  const isGroupSelected = (groupId: string) => selectedGroups.includes(groupId);
  const canUserAccessGroup = (groupId: string) => userGroups.includes(groupId);

  if (loading) {
    return (
      <Box padding={4}>
        <Typography>Loading group matrix...</Typography>
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Typography variant="alpha" marginBottom={4}>
        Azure Groups Matrix (6 Domains × 4 Classifications)
      </Typography>
      
      <Box marginBottom={4}>
        <Typography variant="pi" textColor="neutral600">
          Total Groups: {domains.length * classifications.length} | 
          Active Groups: {Object.values(matrix).flat().filter(g => g?.isActive).length}
        </Typography>
      </Box>

      <Grid gap={4}>
        {/* Header Row */}
        <Grid gridCols={5} gap={2}>
          <Box /> {/* Empty corner */}
          {classifications.map(classification => (
            <Box key={classification} padding={3} background="neutral100" hasRadius>
              <Typography variant="pi" fontWeight="bold" textAlign="center">
                {classification.toUpperCase()}
              </Typography>
            </Box>
          ))}
        </Grid>

        {/* Matrix Rows */}
        {domains.map(domain => (
          <Grid key={domain} gridCols={5} gap={2}>
            {/* Domain Header */}
            <Box padding={3} background="neutral100" hasRadius>
              <Typography variant="pi" fontWeight="bold" textAlign="center">
                {domainLabels[domain as keyof typeof domainLabels]}
              </Typography>
            </Box>
            
            {/* Classification Cells */}
            {classifications.map(classification => {
              const group = matrix[domain]?.[classification];
              const isSelected = group && isGroupSelected(group.id);
              const userHasAccess = group && canUserAccessGroup(group.id);
              
              return (
                <Card
                  key={`${domain}-${classification}`}
                  style={{
                    cursor: mode === 'select' && userHasAccess ? 'pointer' : 'default',
                    border: isSelected ? '2px solid #4945ff' : '1px solid #dcdce4',
                    backgroundColor: isSelected ? '#f0f0ff' : 'white',
                    opacity: mode === 'select' && !userHasAccess ? 0.5 : 1,
                  }}
                  onClick={() => group && handleGroupClick(group)}
                >
                  <CardBody padding={3}>
                    <Flex direction="column" alignItems="center" gap={2}>
                      {group ? (
                        <>
                          <Badge 
                            backgroundColor={classificationColors[classification as keyof typeof classificationColors] + '100'}
                            textColor={classificationColors[classification as keyof typeof classificationColors] + '600'}
                          >
                            {classification.toUpperCase()}
                          </Badge>
                          
                          <Typography variant="pi" textAlign="center" fontWeight="semiBold">
                            {group.name}
                          </Typography>
                          
                          <Flex gap={1} alignItems="center">
                            {group.isActive ? (
                              <Status variant="success" showBullet={false}>
                                <Typography variant="omega">Active</Typography>
                              </Status>
                            ) : (
                              <Status variant="secondary" showBullet={false}>
                                <Typography variant="omega">Inactive</Typography>
                              </Status>
                            )}
                          </Flex>
                          
                          {mode === 'select' && (
                            <Typography variant="omega" textColor={userHasAccess ? "success600" : "neutral400"}>
                              {userHasAccess ? "✓ Access" : "✗ No Access"}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography variant="pi" textColor="neutral400">
                          No Group
                        </Typography>
                      )}
                    </Flex>
                  </CardBody>
                </Card>
              );
            })}
          </Grid>
        ))}
      </Grid>

      {mode === 'select' && (
        <Box marginTop={4} padding={3} background="neutral100" hasRadius>
          <Typography variant="pi" textColor="neutral600">
            💡 You can only select groups you have access to. 
            Groups you don't have access to are shown with reduced opacity.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GroupMatrix;
