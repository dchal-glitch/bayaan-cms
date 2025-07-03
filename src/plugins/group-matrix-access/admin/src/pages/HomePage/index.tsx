import React, { useState, useEffect } from 'react';
import { 
  Main, 
  HeaderLayout, 
  ContentLayout, 
  Box, 
  Typography,
  Tabs,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@strapi/design-system';
import { Shield, User, Stack, Cog } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import GroupMatrix from '../../components/GroupMatrix';
import GroupSelector from '../../components/GroupSelector';

interface Group {
  id: string;
  name: string;
  domain: string;
  classification: string;
  description: string;
  isActive: boolean;
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  azureGroups: Group[];
}

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [groupStats, setGroupStats] = useState({
    totalGroups: 0,
    activeGroups: 0,
    totalUsers: 0,
    usersWithGroups: 0
  });
  const [loading, setLoading] = useState(true);
  const { get } = useFetchClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user groups
      const userGroupsResponse = await get('/group-matrix-access/user/groups');
      setUserGroups(userGroupsResponse.data.data || []);
      
      // Fetch matrix data for stats
      const matrixResponse = await get('/group-matrix-access/groups/matrix');
      const groups = matrixResponse.data.data.groups || [];
      
      // Calculate stats
      setGroupStats({
        totalGroups: groups.length,
        activeGroups: groups.filter((g: Group) => g.isActive).length,
        totalUsers: 0, // Would need additional API endpoint
        usersWithGroups: 0 // Would need additional API endpoint
      });
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardTab = () => (
    <Box>
      <Typography variant="alpha" marginBottom={6}>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid gap={4} gridCols={4} marginBottom={6}>
        <Card>
          <CardBody>
            <Flex direction="column" alignItems="center" gap={2}>
              <Typography variant="omega" fontWeight="bold" textColor="neutral600">
                Total Groups
              </Typography>
              <Typography variant="alpha" fontWeight="bold">
                {groupStats.totalGroups}
              </Typography>
              <Badge backgroundColor="primary100" textColor="primary600">
                6×4 Matrix
              </Badge>
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" alignItems="center" gap={2}>
              <Typography variant="omega" fontWeight="bold" textColor="neutral600">
                Active Groups
              </Typography>
              <Typography variant="alpha" fontWeight="bold" textColor="success600">
                {groupStats.activeGroups}
              </Typography>
              <Badge backgroundColor="success100" textColor="success600">
                Operational
              </Badge>
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" alignItems="center" gap={2}>
              <Typography variant="omega" fontWeight="bold" textColor="neutral600">
                Your Groups
              </Typography>
              <Typography variant="alpha" fontWeight="bold" textColor="warning600">
                {userGroups.length}
              </Typography>
              <Badge backgroundColor="warning100" textColor="warning600">
                Accessible
              </Badge>
            </Flex>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Flex direction="column" alignItems="center" gap={2}>
              <Typography variant="omega" fontWeight="bold" textColor="neutral600">
                Domains
              </Typography>
              <Typography variant="alpha" fontWeight="bold">
                6
              </Typography>
              <Badge backgroundColor="secondary100" textColor="secondary600">
                Categories
              </Badge>
            </Flex>
          </CardBody>
        </Card>
      </Grid>

      {/* User Groups Summary */}
      <Card>
        <CardHeader>
          <Typography variant="delta" fontWeight="bold">
            Your Access Groups
          </Typography>
        </CardHeader>
        <CardBody>
          {userGroups.length > 0 ? (
            <Grid gap={3}>
              {userGroups.map(group => (
                <Box key={group.id} padding={3} background="neutral100" hasRadius>
                  <Flex alignItems="center" gap={3}>
                    <Badge 
                      backgroundColor={group.classification === 'open' ? 'success100' : 
                                    group.classification === 'confidential' ? 'warning100' :
                                    group.classification === 'sensitive' ? 'danger100' : 'secondary100'}
                      textColor={group.classification === 'open' ? 'success600' : 
                               group.classification === 'confidential' ? 'warning600' :
                               group.classification === 'sensitive' ? 'danger600' : 'secondary600'}
                    >
                      {group.classification.toUpperCase()}
                    </Badge>
                    <Typography variant="beta" fontWeight="semiBold">
                      {group.name}
                    </Typography>
                    <Typography variant="pi" textColor="neutral600">
                      {group.domain.replace('-', ' ')}
                    </Typography>
                  </Flex>
                </Box>
              ))}
            </Grid>
          ) : (
            <Box padding={4} textAlign="center">
              <Typography variant="pi" textColor="neutral400">
                You don't have access to any groups yet. Contact your administrator to assign groups.
              </Typography>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );

  const MatrixTab = () => (
    <Box>
      <Typography variant="alpha" marginBottom={4}>
        Azure Groups Matrix
      </Typography>
      <Typography variant="pi" textColor="neutral600" marginBottom={6}>
        Overview of all 24 groups organized by domain and classification level.
        Groups highlighted in blue are accessible to you.
      </Typography>
      
      <GroupMatrix 
        mode="view"
        userGroups={userGroups.map(g => g.id)}
      />
    </Box>
  );

  const GroupSelectorTab = () => {
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    
    return (
      <Box>
        <Typography variant="alpha" marginBottom={4}>
          Group Assignment Demo
        </Typography>
        <Typography variant="pi" textColor="neutral600" marginBottom={6}>
          This demonstrates how content can be assigned to groups. 
          In the actual implementation, this would be integrated into content type edit forms.
        </Typography>
        
        <Card>
          <CardHeader>
            <Typography variant="delta" fontWeight="bold">
              Content Group Assignment
            </Typography>
          </CardHeader>
          <CardBody>
            <GroupSelector
              selectedGroups={selectedGroups}
              onGroupsChange={setSelectedGroups}
              label="Demo Content Groups"
            />
          </CardBody>
        </Card>
      </Box>
    );
  };

  const tabs = [
    { label: 'Dashboard', icon: <Shield />, content: <DashboardTab /> },
    { label: 'Matrix View', icon: <Stack />, content: <MatrixTab /> },
    { label: 'Group Assignment', icon: <Cog />, content: <GroupSelectorTab /> },
  ];

  return (
    <Main>
      <HeaderLayout
        title="Azure Group Matrix Access Control"
        subtitle="Manage content access based on Azure AD groups with 6×4 matrix structure"
        primaryAction={
          <Button variant="default" startIcon={<User />}>
            Sync Groups
          </Button>
        }
      />
      
      <ContentLayout>
        <TabGroup 
          label="Group management sections"
          id="group-tabs"
          onTabChange={setActiveTab}
          variant="simple"
        >
          <TabList>
            {tabs.map((tab, index) => (
              <Tab key={index}>
                <Flex alignItems="center" gap={2}>
                  {tab.icon}
                  {tab.label}
                </Flex>
              </Tab>
            ))}
          </TabList>
          
          <TabPanels>
            {tabs.map((tab, index) => (
              <TabPanel key={index}>
                <Box paddingTop={6}>
                  {tab.content}
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </ContentLayout>
    </Main>
  );
};

export default HomePage;
export { HomePage };
