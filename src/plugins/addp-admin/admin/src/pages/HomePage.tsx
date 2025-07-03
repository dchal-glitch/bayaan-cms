import {
  Main,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Typography,
  Button,
  Flex,
  IconButton,
  NumberInput,
  TextInput,
  Switch,
  Divider
} from '@strapi/design-system';

import {
TooltipProvider,
} from '@strapi/design-system';

import { Grid } from '@strapi/design-system';

import { Tabs } from '@strapi/design-system';

import {
  SingleSelect as Select,
  SingleSelectOption as Option,
  MultiSelect as MultiSelect,
  MultiSelectOption as MultiSelectOption,
  MultiSelectNested as MultiSelectNested,
} from '@strapi/design-system';

import { DesignSystemProvider  } from '@strapi/design-system';


import { useIntl } from 'react-intl';
import { useState } from 'react';
import {
  Cog,
  Stack,
  ChartPie,
  User,
  PinMap,
  Plus,
  Pencil,
  Trash,
  Eye,
  Download,
  Upload,
  Earth as Location,
  Earth,
  Earth as Refresh,
  Earth as MapIcon
} from '@strapi/icons';
import TooltipIconButton from '../components/CustomIcon2';


const HomePage = () => {
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [populationSize, setPopulationSize] = useState(1000);
  const [accessibilityRadius, setAccessibilityRadius] = useState(5);

  const pillars = [
    { id: 'education', name: 'Education', color: '#007bff', weight: 25 },
    { id: 'healthcare', name: 'Healthcare', color: '#28a745', weight: 25 },
    { id: 'industry', name: 'Industry', color: '#ffc107', weight: 20 },
    { id: 'transportation', name: 'Transportation', color: '#dc3545', weight: 15 },
    { id: 'environment', name: 'Environment', color: '#17a2b8', weight: 15 }
  ];

  const districts = [
    { id: 'abu-dhabi', name: 'Abu Dhabi', score: 85, population: 150000 },
    { id: 'al-ain', name: 'Al Ain', score: 78, population: 120000 },
    { id: 'western-region', name: 'Western Region', score: 72, population: 80000 }
  ];

  const pointsOfInterest = [
    { id: 'schools', name: 'Schools', pillar: 'education', count: 245 },
    { id: 'hospitals', name: 'Hospitals', pillar: 'healthcare', count: 89 },
    { id: 'factories', name: 'Factories', pillar: 'industry', count: 156 },
    { id: 'bus-stops', name: 'Bus Stops', pillar: 'transportation', count: 892 }
  ];

  const DashboardTab = () => (
    <Box padding={6}>
      <Grid.Root gap={6}>
        {/* Key Metrics */}
        <Grid.Root gap={4} gridCols={4}>
          <Card>
            <CardBody>
              <Flex direction="column" alignItems="center">
                <Typography variant="omega" fontWeight="bold">Total Districts</Typography>
                <Typography variant="alpha">{districts.length}</Typography>
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Flex direction="column" alignItems="center">
                <Typography variant="omega" fontWeight="bold">Active Pillars</Typography>
                <Typography variant="alpha">{pillars.length}</Typography>
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Flex direction="column" alignItems="center">
                <Typography variant="omega" fontWeight="bold">Points of Interest</Typography>
                <Typography variant="alpha">{pointsOfInterest.reduce((sum, poi) => sum + poi.count, 0)}</Typography>
              </Flex>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Flex direction="column" alignItems="center">
                <Typography variant="omega" fontWeight="bold">Avg. Score</Typography>
                <Typography variant="alpha">{Math.round(districts.reduce((sum, d) => sum + d.score, 0) / districts.length)}</Typography>
              </Flex>
            </CardBody>
          </Card>
        </Grid.Root >

        {/* Quick Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Configuration</CardTitle>
          </CardHeader>
          <CardBody>
            <Grid.Root gap={4} gridCols={3}>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Population Block Size
                </Typography>
                <NumberInput
                  value={populationSize}
                  onValueChange={setPopulationSize}
                  placeholder="Enter population size"
                />
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Accessibility Radius (km)
                </Typography>
                <NumberInput
                  value={accessibilityRadius}
                  onValueChange={setAccessibilityRadius}
                  placeholder="Enter radius in km"
                />
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Actions
                </Typography>
                <Flex gap={2}>
                  <Button variant="default" startIcon={<Refresh />}>
                    Recalculate
                  </Button>
                  <Button variant="secondary" startIcon={<Download />}>
                    Export
                  </Button>
                </Flex>
              </Box>
            </Grid.Root >
          </CardBody>
        </Card>

        {/* District Overview */}
        <Card>
          <CardHeader>
            <CardTitle>District Overview</CardTitle>
          </CardHeader>
          <CardBody>
            <Grid.Root gap={4}>
              {districts.map((district) => (
                <Box key={district.id} padding={4} background="neutral100" hasRadius>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="beta" fontWeight="bold">{district.name}</Typography>
                      <Typography variant="pi" textColor="neutral600">
                        Population: {district.population.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="alpha" fontWeight="bold" textColor={district.score >= 80 ? "success600" : district.score >= 60 ? "warning600" : "danger600"}>
                        {district.score}
                      </Typography>
                    </Box>
                    <Flex gap={2}>
                      <TooltipIconButton label="View Details" icon={<Eye />} />
                      <TooltipIconButton label="Edit" icon={<Pencil />} />
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </Grid.Root >
          </CardBody>
        </Card>
      </Grid.Root >
    </Box>
  );

  const DistrictsTab = () => (
    <Box padding={6}>
      <Flex justifyContent="space-between" marginBottom={6}>
        <Typography variant="alpha">Districts Management</Typography>
        <Button startIcon={<Plus />} variant="default">
          Add District
        </Button>
      </Flex>
      
      <Card>
        <CardHeader>
          <CardTitle>Districts List</CardTitle>
        </CardHeader>
        <CardBody>
          <Grid.Root gap={4}>
            {districts.map((district) => (
              <Box key={district.id} padding={4} background="neutral0" hasRadius shadow="tableShadow">
                <Grid.Root gap={4} gridCols={4}>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Name</Typography>
                    <Typography variant="beta">{district.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Population</Typography>
                    <Typography variant="beta">{district.population.toLocaleString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Score</Typography>
                    <Typography variant="beta" textColor={district.score >= 80 ? "success600" : district.score >= 60 ? "warning600" : "danger600"}>
                      {district.score}
                    </Typography>
                  </Box>
                  <Flex gap={2} justifyContent="flex-end">
                    <TooltipIconButton label="View on Map" icon={<Earth />} />
                    <TooltipIconButton label="Edit" icon={<Pencil />} />
                    <TooltipIconButton label="Delete" icon={<Trash />} />
                  </Flex>
                </Grid.Root >
              </Box>
            ))}
          </Grid.Root >
        </CardBody>
      </Card>
    </Box>
  );

  const PillarsTab = () => (
    <Box padding={6}>
      <Flex justifyContent="space-between" marginBottom={6}>
        <Typography variant="alpha">Pillars Management</Typography>
        <Button startIcon={<Plus />} variant="default">
          Add Pillar
        </Button>
      </Flex>
      
      <Card>
        <CardHeader>
          <CardTitle>Scoring Pillars</CardTitle>
        </CardHeader>
        <CardBody>
          <Grid.Root gap={4}>
            {pillars.map((pillar) => (
              <Box key={pillar.id} padding={4} background="neutral0" hasRadius shadow="tableShadow">
                <Grid.Root gap={4} gridCols={5}>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Name</Typography>
                    <Typography variant="beta">{pillar.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Weight (%)</Typography>
                    <Typography variant="beta">{pillar.weight}%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Color</Typography>
                    <Box 
                      width="24px" 
                      height="24px" 
                      background={pillar.color} 
                      hasRadius 
                      style={{ backgroundColor: pillar.color }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Status</Typography>
                    <Switch size="S" selected={true} />
                  </Box>
                  <Flex gap={2} justifyContent="flex-end">
                    <TooltipIconButton label="Configure" icon={<Cog />} />
                    <TooltipIconButton label="Edit" icon={<Pencil />} />
                    <TooltipIconButton label="Delete" icon={<Trash />} />
                  </Flex>
                </Grid.Root >
              </Box>
            ))}
          </Grid.Root >
        </CardBody>
      </Card>
    </Box>
  );

  const PointsOfInterestTab = () => (
    <Box padding={6}>
      <Flex justifyContent="space-between" marginBottom={6}>
        <Typography variant="alpha">Points of Interest</Typography>
        <Flex gap={2}>
          <Button startIcon={<Upload />} variant="secondary">
            Import POI
          </Button>
          <Button startIcon={<Plus />} variant="default">
            Add POI Type
          </Button>
        </Flex>
      </Flex>
      
      <Card>
        <CardHeader>
          <CardTitle>POI Categories</CardTitle>
        </CardHeader>
        <CardBody>
          <Grid.Root gap={4}>
            {pointsOfInterest.map((poi) => (
              <Box key={poi.id} padding={4} background="neutral0" hasRadius shadow="tableShadow">
                <Grid.Root gap={4} gridCols={4}>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Category</Typography>
                    <Typography variant="beta">{poi.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Pillar</Typography>
                    <Typography variant="beta">{pillars.find(p => p.id === poi.pillar)?.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="pi" fontWeight="bold" textColor="neutral600">Count</Typography>
                    <Typography variant="beta">{poi.count}</Typography>
                  </Box>
                  <Flex gap={2} justifyContent="flex-end">
                    <TooltipIconButton label="View on Map" icon={<Location />} />
                    <TooltipIconButton label="Edit" icon={<Pencil />} />
                    <TooltipIconButton label="Delete" icon={<Trash />} />
                  </Flex>
                </Grid.Root >
              </Box>
            ))}
          </Grid.Root >
        </CardBody>
      </Card>
    </Box>
  );

  const ConfigurationTab = () => (
    <Box padding={6}>
      <Typography variant="alpha" marginBottom={6}>System Configuration</Typography>
      
      <Grid.Root gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Scoring Parameters</CardTitle>
          </CardHeader>
          <CardBody>
            <Grid.Root gap={4} gridCols={2}>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Default Population Block Size
                </Typography>
                <NumberInput
                  value={populationSize}
                  onValueChange={setPopulationSize}
                  placeholder="Enter population size"
                />
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Default Accessibility Radius (km)
                </Typography>
                <NumberInput
                  value={accessibilityRadius}
                  onValueChange={setAccessibilityRadius}
                  placeholder="Enter radius in km"
                />
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Scoring Algorithm
                </Typography>
                <Select placeholder="Select algorithm">
                  <Option value="weighted-average">Weighted Average</Option>
                  <Option value="geometric-mean">Geometric Mean</Option>
                  <Option value="harmonic-mean">Harmonic Mean</Option>
                </Select>
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Update Frequency
                </Typography>
                <Select placeholder="Select frequency">
                  <Option value="real-time">Real-time</Option>
                  <Option value="hourly">Hourly</Option>
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                </Select>
              </Box>
            </Grid.Root >
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map Configuration</CardTitle>
          </CardHeader>
          <CardBody>
            <Grid.Root gap={4} gridCols={2}>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Map Provider
                </Typography>
                <Select placeholder="Select map provider">
                  <Option value="arcgis">ArcGIS</Option>
                  <Option value="mapbox">Mapbox</Option>
                  <Option value="google">Google Maps</Option>
                </Select>
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Default Zoom Level
                </Typography>
                <NumberInput
                  value={10}
                  placeholder="Enter zoom level"
                />
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Center Coordinates
                </Typography>
                <TextInput
                  value="24.4539, 54.3773"
                  placeholder="Latitude, Longitude"
                />
              </Box>
              <Box>
                <Typography variant="pi" fontWeight="bold" marginBottom={2}>
                  Map Style
                </Typography>
                <Select placeholder="Select map style">
                  <Option value="satellite">Satellite</Option>
                  <Option value="streets">Streets</Option>
                  <Option value="terrain">Terrain</Option>
                  <Option value="hybrid">Hybrid</Option>
                </Select>
              </Box>
            </Grid.Root >
          </CardBody>
        </Card>
      </Grid.Root >
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return DashboardTab();
      case 'districts':
        return DistrictsTab();
      case 'pillars':
        return PillarsTab();
      case 'poi':
        return PointsOfInterestTab();
      case 'configuration':
        return ConfigurationTab();
      default:
        return DashboardTab();
    }
  };

  return (
     <Main>
      <Box padding={6}>
        <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
          <Box>
            <Typography variant="alpha">Abu Dhabi District Pulse Admin</Typography>
            <Typography variant="epsilon" textColor="neutral600">Manage districts, pillars, and visualization parameters</Typography>
          </Box>
          <Button startIcon={<MapIcon />} variant="default">View Map</Button>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="dashboard">
              <Flex alignItems="center" gap={2}><ChartPie /> Dashboard</Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="districts">
              <Flex alignItems="center" gap={2}><MapIcon /> Districts</Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="pillars">
              <Flex alignItems="center" gap={2}><Stack /> Pillars</Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="poi">
              <Flex alignItems="center" gap={2}><PinMap /> Points of Interest</Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="configuration">
              <Flex alignItems="center" gap={2}><Cog /> Configuration</Flex>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value={activeTab}>{renderTabContent()}</Tabs.Content>
        </Tabs.Root>
      </Box>
    </Main>
  );
};

export { HomePage };