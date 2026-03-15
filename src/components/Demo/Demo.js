import React, { useState } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import CustomerSupportDemo from './CustomerSupportDemo';
import ContentCreationDemo from './ContentCreationDemo';
import LeadQualificationDemo from './LeadQualificationDemo';
import DataAnalysisDemo from './DataAnalysisDemo';
import AgentTemplateExplorer from './AgentTemplateExplorer';
import DebateDemo from './DebateDemo';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const tabLabels = [
  'Customer Support',
  'Content Creation',
  'Lead Qualification',
  'Data Analysis',
  'AI Debate',
  'Agent Templates'
];

const Demo = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [ref, inView] = useScrollAnimation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const renderDemoContent = () => {
    switch (activeTab) {
      case 0:
        return <CustomerSupportDemo />;
      case 1:
        return <ContentCreationDemo />;
      case 2:
        return <LeadQualificationDemo />;
      case 3:
        return <DataAnalysisDemo />;
      case 4:
        return <AgentTemplateExplorer />;
      default:
        return <CustomerSupportDemo />;
    }
  };

  return (
    <Section id="demo" background="variant" sx={{ py: { xs: 8, md: 12 } }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <MotionTypography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          variants={itemVariants}
          sx={{
            mb: 3,
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          See CRAFT Agents in Action
        </MotionTypography>

        <MotionTypography
          variant="subtitle1"
          align="center"
          variants={itemVariants}
          sx={{
            mb: 6,
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          Interactive demos powered by Anthropic Claude API. Test real AI agents for customer support, content creation, lead qualification, and data analysis.
        </MotionTypography>

        <MotionBox variants={itemVariants}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 4,
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                minWidth: 'auto',
                px: 3
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: 3,
                borderRadius: 1.5
              }
            }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={index}
                label={label}
                sx={{
                  color: activeTab === index ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              />
            ))}
          </Tabs>
        </MotionBox>

        <MotionBox variants={itemVariants}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              minHeight: 600,
              backgroundColor: 'background.paper'
            }}
          >
            {renderDemoContent()}
          </Paper>
        </MotionBox>
      </motion.div>
    </Section>
  );
};

export default Demo;