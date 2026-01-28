import React from 'react';
import { Box } from '@mui/material';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Problem from './components/Problem/Problem';
import CraftAgents from './components/CraftAgents/CraftAgents';
import Hybrid from './components/Hybrid/Hybrid';
import ROI from './components/ROI/ROI';
import Pricing from './components/Pricing/Pricing';
import Integration from './components/Integration/Integration';
import Demo from './components/Demo/Demo';
import Trust from './components/Trust/Trust';
import CTA from './components/CTA/CTA';

function App() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <main>
        <Hero />
        <Problem />
        <CraftAgents />
        <Hybrid />
        <ROI />
        <Pricing />
        <Integration />
        <Demo />
        <Trust />
        <CTA />
      </main>
    </Box>
  );
}

export default App;