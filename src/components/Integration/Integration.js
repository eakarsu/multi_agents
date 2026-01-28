import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const integrationCategories = [
  {
    title: 'CRM & Sales',
    tools: ['Salesforce', 'HubSpot', 'Pipedrive']
  },
  {
    title: 'Communication',
    tools: ['Slack', 'Microsoft Teams', 'Discord']
  },
  {
    title: 'Analytics',
    tools: ['Google Analytics', 'Tableau', 'PowerBI']
  },
  {
    title: 'Development',
    tools: ['GitHub', 'Jira', 'Jenkins']
  }
];

const Integration = () => {
  const [ref, inView] = useScrollAnimation();

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

  return (
    <Section sx={{ py: { xs: 8, md: 12 } }}>
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
            mb: 6,
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          Connects with Your Existing Tools
        </MotionTypography>

        <Grid container spacing={4}>
          {integrationCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={category.title}>
              <MotionBox
                variants={itemVariants}
                sx={{
                  height: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2
                  }}
                >
                  {category.title}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {category.tools.map((tool, toolIndex) => (
                    <motion.div
                      key={tool}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.1 + toolIndex * 0.1
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            borderColor: 'primary.main',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(103, 80, 164, 0.2)'
                          }
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary'
                          }}
                        >
                          {tool}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Section>
  );
};

export default Integration;