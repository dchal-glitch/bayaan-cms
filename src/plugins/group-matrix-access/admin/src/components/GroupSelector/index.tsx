import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Modal, 
  ModalLayout, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Typography,
  Flex,
  Badge,
  Grid
} from '@strapi/design-system';
import { Plus, Check } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import GroupMatrix from '../GroupMatrix';

interface Group {
  id: string;
  name: string;
  domain: string;
  classification: string;
  description: string;
  isActive: boolean;
}

interface GroupSelectorProps {
  selectedGroups: string[];
  onGroupsChange: (groupIds: string[]) => void;
  contentType?: string;
  contentId?: string;
  label?: string;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  selectedGroups,
  onGroupsChange,
  contentType,
  contentId,
  label = "Assigned Groups"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const { get, post } = useFetchClient();

  useEffect(() => {
    fetchUserGroups();
  }, []);

  useEffect(() => {
    fetchSelectedGroupDetails();
  }, [selectedGroups]);

  const fetchUserGroups = async () => {
    try {
      const response = await get('/group-matrix-access/user/groups');
      setUserGroups(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
    }
  };

  const fetchSelectedGroupDetails = async () => {
    if (selectedGroups.length === 0) {
      setSelectedGroupDetails([]);
      return;
    }

    try {
      const response = await get('/group-matrix-access/groups/matrix');
      const allGroups = response.data.data.groups;
      const details = allGroups.filter((group: Group) => 
        selectedGroups.includes(group.id)
      );
      setSelectedGroupDetails(details);
    } catch (error) {
      console.error('Failed to fetch selected group details:', error);
    }
  };

  const handleGroupSelect = (group: Group) => {
    const newSelection = selectedGroups.includes(group.id)
      ? selectedGroups.filter(id => id !== group.id)
      : [...selectedGroups, group.id];
    
    onGroupsChange(newSelection);
  };

  const handleSave = async () => {
    if (!contentType || !contentId) {
      // Just close modal if no content type/id provided
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);
      await post('/group-matrix-access/content/assign-groups', {
        contentType,
        contentId,
        groupIds: selectedGroups,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save group assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const userGroupIds = userGroups.map(g => g.id);

  const getDomainColor = (domain: string) => {
    const colors = {
      'economy': 'primary',
      'population': 'success',
      'agriculture': 'warning',
      'industry': 'danger',
      'social': 'secondary',
      'labour-force': 'alternative'
    } as const;
    return colors[domain as keyof typeof colors] || 'neutral';
  };

  const getClassificationIcon = (classification: string) => {
    const icons = {
      'open': '🔓',
      'confidential': '🔒',
      'sensitive': '🔐',
      'secret': '🔑'
    };
    return icons[classification as keyof typeof icons] || '';
  };

  return (
    <Box>
      <Flex direction="column" gap={3}>
        <Typography variant="pi" fontWeight="bold">
          {label}
        </Typography>
        
        {selectedGroupDetails.length > 0 ? (
          <Grid gap={2}>
            {selectedGroupDetails.map(group => (
              <Box key={group.id} padding={2} background="neutral100" hasRadius>
                <Flex alignItems="center" gap={2}>
                  <Typography variant="omega">
                    {getClassificationIcon(group.classification)}
                  </Typography>
                  <Badge 
                    backgroundColor={getDomainColor(group.domain) + '100'}
                    textColor={getDomainColor(group.domain) + '600'}
                  >
                    {group.domain.replace('-', ' ')}
                  </Badge>
                  <Typography variant="pi" fontWeight="semiBold">
                    {group.name}
                  </Typography>
                </Flex>
              </Box>
            ))}
          </Grid>
        ) : (
          <Box padding={3} background="neutral100" hasRadius>
            <Typography variant="pi" textColor="neutral400" textAlign="center">
              No groups assigned - content will be accessible to all users
            </Typography>
          </Box>
        )}
        
        <Button
          variant="secondary"
          startIcon={<Plus />}
          onClick={() => setIsOpen(true)}
          size="S"
        >
          {selectedGroupDetails.length > 0 ? 'Modify Groups' : 'Assign Groups'}
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalLayout>
          <ModalHeader>
            <Typography variant="omega" fontWeight="bold">
              Assign Content to Groups
            </Typography>
          </ModalHeader>
          
          <ModalBody>
            <Box marginBottom={4}>
              <Typography variant="pi" textColor="neutral600">
                Select groups to assign this content to. You can only assign to groups you have access to.
                Content without group assignments will be accessible to all users.
              </Typography>
            </Box>
            
            <Box marginBottom={4}>
              <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                Currently Selected ({selectedGroups.length}):
              </Typography>
              {selectedGroups.length > 0 ? (
                <Flex wrap="wrap" gap={2}>
                  {selectedGroupDetails.map(group => (
                    <Badge key={group.id} backgroundColor="primary100" textColor="primary600">
                      {group.name}
                    </Badge>
                  ))}
                </Flex>
              ) : (
                <Typography variant="pi" textColor="neutral400">
                  No groups selected
                </Typography>
              )}
            </Box>
            
            <GroupMatrix
              mode="select"
              selectedGroups={selectedGroups}
              userGroups={userGroupIds}
              onGroupSelect={handleGroupSelect}
            />
          </ModalBody>
          
          <ModalFooter
            startActions={
              <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            }
            endActions={
              <Button 
                onClick={handleSave} 
                loading={loading}
                startIcon={<Check />}
              >
                Save Assignments
              </Button>
            }
          />
        </ModalLayout>
      </Modal>
    </Box>
  );
};

export default GroupSelector;
