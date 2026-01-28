import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import GradientButton from '../common/GradientButton';
import CraftDiagram from './CraftDiagram';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const Hero = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
    <Section
      background="primary"
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #EADDFF 0%, #E8DEF8 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ width: '100%', zIndex: 2 }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox variants={itemVariants}>
              <MotionTypography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  color: 'text.primary',
                  mb: 3,
                  fontWeight: 700
                }}
              >
                Build Any AI Agent You Can Imagine with CRAFT Technology
              </MotionTypography>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                Create unlimited custom AI agents beyond our CRAFT framework 
                (Communication, Research, Analytics, Functional, Technical). 
                From customer service to data analysis, financial modeling to 
                creative content - build any agent type for any use case. 
                <strong> 171% average ROI guaranteed.</strong>
              </Typography>
            </MotionBox>

            <MotionBox 
              variants={itemVariants}
              sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' }
              }}
            >
              <GradientButton
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Start Free Trial
              </GradientButton>
              <GradientButton
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Watch Demo
              </GradientButton>
            </MotionBox>

            <MotionBox 
              variants={itemVariants}
              sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Chip
                label="Powered by Anthropic"
                sx={{
                  backgroundColor: 'background.paper',
                  color: 'primary.main',
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Chip
                label="OpenAI Integration"
                sx={{
                  backgroundColor: 'background.paper',
                  color: 'primary.main',
                  fontWeight: 500,
                  border: '1px solid',
                  borderColor: 'primary.main'
                }}
              />
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionBox
              variants={itemVariants}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                mt: { xs: 4, md: 0 }
              }}
            >
              <CraftDiagram />
            </MotionBox>
          </Grid>
        </Grid>
      </MotionBox>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(103, 80, 164, 0.1) 0%, transparent 70%)',
          zIndex: 1
        }}
      />
    </Section>
  );
};

export default Hero;