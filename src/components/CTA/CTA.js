import React from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import GradientButton from '../common/GradientButton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const CTA = () => {
  const [ref, inView] = useScrollAnimation();

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
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #6750A4 0%, #625B71 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          zIndex: 0
        }}
      />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <MotionTypography
          variant="h2"
          component="h2"
          gutterBottom
          variants={itemVariants}
          sx={{
            mb: 3,
            fontWeight: 700,
            color: 'white'
          }}
        >
          Join the AI Super Agent Economy
        </MotionTypography>

        <MotionTypography
          variant="h6"
          component="p"
          variants={itemVariants}
          sx={{
            mb: 4,
            opacity: 0.9,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Start building your CRAFT agent empire today with our 30-day free trial
        </MotionTypography>

        <MotionBox variants={itemVariants} sx={{ mb: 3 }}>
          <GradientButton
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.25rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            Start Your 30-Day Free Trial
          </GradientButton>
        </MotionBox>

        <MotionTypography
          variant="body2"
          variants={itemVariants}
          sx={{
            opacity: 0.8,
            fontSize: '0.875rem'
          }}
        >
          No credit card required • Cancel anytime • Full support
        </MotionTypography>
      </motion.div>
    </Section>
  );
};

export default CTA;