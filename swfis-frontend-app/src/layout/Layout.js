import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

// Import your components
import RainProbab from '../components/RainProbab';
import TemperaturePredict from '../components/TemperaturePrediction';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Layout() {
  return (
    <Box sx={{
        width: "70%",
        height: "70%",
        backgroundColor: 'primary.dark',
      }}>
      <Stack
  spacing={{ xs: 1, sm: 2, md: 4 }}>
        <Item>
          <RainProbab />
        </Item>
        <Item>
          <TemperaturePredict />
        </Item>
        <Item>
          <TemperaturePredict />
        </Item>
        {/* Add more items/components as needed */}
      </Stack>
    </Box>
  );
}
