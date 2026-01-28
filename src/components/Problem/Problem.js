import React from 'react';
import {
  Typography,
  Grid,
  Box,
  CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import AnimatedCard from '../common/AnimatedCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const problemPoints = [
  {
    title: 'Complex Setup',
    description: 'Multi-agent systems require deep technical expertise and months of development',
    icon: '⚙️'
  },
  {
    title: 'High Costs',
    description: 'Development costs average $500K+ with uncertain ROI and long implementation times',
    icon: '💰'
  },
  {
    title: 'No Business Solutions',
    description: 'Most AI tools are technical demos, not business-ready production systems',
    icon: '🏢'
  },
  {
    title: 'Poor Visibility',
    description: 'No clear ROI tracking or performance metrics for AI implementations',
    icon: '📊'
  }
];

const Problem = () => {
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
    <Section background="variant" sx={{ py: { xs: 8, md: 12 } }}>
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
          Why 81% of Companies Struggle with AI Implementation
        </MotionTypography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {problemPoints.map((point, index) => (
            <Grid item xs={12} sm={6} md={3} key={point.title}>
              <AnimatedCard
                delay={index * 0.1}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Box
                    sx={{
                      fontSize: '3rem',
                      mb: 2,
                      display: 'block'
                    }}
                  >
                    {point.icon}
                  </Box>
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
                    {point.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6
                    }}
                  >
                    {point.description}
                  </Typography>
                </CardContent>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>

        <MotionBox
          variants={itemVariants}
          sx={{
            textAlign: 'center',
            p: 4,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'primary.main',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, transparent 50%)',
              zIndex: 0
            }}
          />
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              position: 'relative',
              zIndex: 1
            }}
          >
            $236 Billion
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              position: 'relative',
              zIndex: 1
            }}
          >
            Industry opportunity with massive implementation gap
          </Typography>
        </MotionBox>
      </motion.div>
    </Section>
  );
};

export default Problem;