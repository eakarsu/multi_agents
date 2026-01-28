import React from 'react';
import {
  Typography,
  Grid,
  CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import AnimatedCard from '../common/AnimatedCard';
import { useScrollAnimation, useCounter } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);

const stats = [
  { number: 171, label: 'Average ROI', suffix: '%' },
  { number: 25, label: 'Productivity Increase', suffix: '%' },
  { number: 30, label: 'Cost Reduction', suffix: '%' },
  { number: 96, label: 'Plan to Expand Usage', suffix: '%' }
];

const ROI = () => {
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
          Proven Results: $1.9 Trillion Value Potential by 2030
        </MotionTypography>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <StatCard 
                stat={stat} 
                index={index} 
                inView={inView}
              />
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Section>
  );
};

const StatCard = ({ stat, index, inView }) => {
  const count = useCounter(stat.number, 2000, 0, inView);

  return (
    <AnimatedCard
      delay={index * 0.1}
      sx={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, #EADDFF 0%, #E8DEF8 100%)',
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 12px 24px rgba(103, 80, 164, 0.2)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h3"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {count}{stat.suffix}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          {stat.label}
        </Typography>
      </CardContent>
    </AnimatedCard>
  );
};

export default ROI;