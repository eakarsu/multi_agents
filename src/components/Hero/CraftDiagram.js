import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Chat as ChatIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const MotionBox = motion(Box);

const agentData = [
  { icon: ChatIcon, label: 'Communication', color: '#6750A4', delay: 0 },
  { icon: SearchIcon, label: 'Research', color: '#625B71', delay: 0.2 },
  { icon: AnalyticsIcon, label: 'Analytics', color: '#7D5260', delay: 0.4 },
  { icon: SettingsIcon, label: 'Functional', color: '#6750A4', delay: 0.6 },
  { icon: CodeIcon, label: 'Technical', color: '#625B71', delay: 0.8 }
];

const CraftDiagram = () => {
  const nodeVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.1,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
        gap: { xs: 2, md: 3 },
        maxWidth: { xs: 300, sm: 400, md: 500 },
        width: '100%',
        position: 'relative'
      }}
    >
      {agentData.map((agent, _index) => {
        const IconComponent = agent.icon;
        
        return (
          <MotionBox
            key={agent.label}
            variants={nodeVariants}
            whileHover="hover"
            animate={["visible", "float"]}
            style={{ 
              animationDelay: `${agent.delay + 1}s`
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              p: { xs: 2, md: 3 },
              backgroundColor: 'background.paper',
              borderRadius: 3,
              border: '2px solid',
              borderColor: agent.color,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${agent.color}15 0%, transparent 50%)`,
                zIndex: 0
              }
            }}
          >
            <IconComponent
              sx={{
                fontSize: { xs: 32, md: 40 },
                color: agent.color,
                zIndex: 1
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                textAlign: 'center',
                color: 'text.primary',
                zIndex: 1
              }}
            >
              {agent.label}
            </Typography>
          </MotionBox>
        );
      })}

      {/* Center connecting animation */}
      <MotionBox
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.3, 0],
          scale: [0, 2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 2,
          ease: 'easeInOut'
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'primary.main',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />
    </MotionBox>
  );
};

export default CraftDiagram;