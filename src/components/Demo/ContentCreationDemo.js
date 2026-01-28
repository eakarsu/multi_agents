import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Create as CreateIcon, AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AgentAPI, { demoResponses } from '../../utils/agentApi';

const ContentCreationDemo = () => {
  const [contentType, setContentType] = useState('blog post');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('business executives');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  const agentAPI = new AgentAPI();

  const contentTypes = [
    'blog post',
    'social media post',
    'email campaign',
    'whitepaper',
    'case study',
    'landing page copy'
  ];

  const audiences = [
    'business executives',
    'IT decision makers',
    'small business owners',
    'enterprise teams',
    'startup founders',
    'operations managers'
  ];

  const tones = [
    'professional',
    'conversational',
    'technical',
    'persuasive',
    'educational',
    'inspiring'
  ];

  const quickPrompts = [
    {
      type: 'blog post',
      topic: 'AI automation ROI for customer service',
      audience: 'business executives',
      tone: 'professional'
    },
    {
      type: 'social media post',
      topic: 'CRAFT agent framework benefits',
      audience: 'startup founders',
      tone: 'conversational'
    },
    {
      type: 'email campaign',
      topic: 'Free trial invitation',
      audience: 'small business owners',
      tone: 'persuasive'
    }
  ];

  const handleQuickPrompt = (prompt) => {
    setContentType(prompt.type);
    setTopic(prompt.topic);
    setAudience(prompt.audience);
    setTone(prompt.tone);
    generateContent(prompt.type, prompt.topic, prompt.audience, prompt.tone);
  };

  const generateContent = async (type = contentType, topicText = topic, aud = audience, toneStyle = tone) => {
    if (!topicText.trim()) return;

    setLoading(true);
    setGeneratedContent('');

    try {
      let content;
      
      if (demoMode) {
        // Demo mode with realistic responses
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        
        if (type.includes('blog')) {
          content = demoResponses.contentCreation['blog post'];
        } else if (type.includes('social')) {
          content = demoResponses.contentCreation['social media'];
        } else {
          content = demoResponses.contentCreation['default'];
        }
      } else {
        // Real Agent API call
        content = await agentAPI.contentCreationAgent(type, topicText, aud, toneStyle);
      }

      setGeneratedContent(content);
    } catch (error) {
      console.error('Content Creation Demo Error:', error);
      setGeneratedContent('Error generating content. Please try again or check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateContent();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Content Creation Agent Demo
        </Typography>
        <Chip 
          label={demoMode ? 'Demo Mode' : 'Live API'} 
          color={demoMode ? 'default' : 'success'}
          size="small"
          onClick={() => setDemoMode(!demoMode)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {/* API Key Notice */}
      {!demoMode && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          To use live API, set REACT_APP_ANTHROPIC_API_KEY in your .env file
        </Alert>
      )}

      {/* Quick Prompts */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Try these content ideas:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickPrompts.map((prompt, index) => (
            <Chip
              key={index}
              label={`${prompt.type}: ${prompt.topic}`}
              variant="outlined"
              size="small"
              onClick={() => handleQuickPrompt(prompt)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'primary.light' }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Content Form */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  label="Content Type"
                >
                  {contentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  label="Target Audience"
                >
                  {audiences.map((aud) => (
                    <MenuItem key={aud} value={aud}>
                      {aud.charAt(0).toUpperCase() + aud.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your content topic..."
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tone</InputLabel>
                <Select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  label="Tone"
                >
                  {tones.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !topic.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : <CreateIcon />}
                sx={{ mt: 1 }}
              >
                {loading ? 'Generating Content...' : 'Generate Content'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Generated Content */}
      {(generatedContent || loading) && (
        <Paper 
          elevation={1} 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            backgroundColor: '#fafafa',
            overflow: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesomeIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Generated Content
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                AI agent is creating your content...
              </Typography>
            </Box>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                  fontFamily: contentType === 'social media post' ? 'inherit' : 'monospace',
                  fontSize: contentType === 'social media post' ? 'inherit' : '0.875rem'
                }}
              >
                {generatedContent}
              </Typography>
              
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  Generated by CraftAgent Pro Content Creation Agent • {new Date().toLocaleString()}
                </Typography>
              </Box>
            </motion.div>
          )}
        </Paper>
      )}
      
      {!generatedContent && !loading && (
        <Paper 
          elevation={1} 
          sx={{ 
            flexGrow: 1, 
            p: 4,
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Box>
            <CreateIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Configure your content parameters and click &quot;Generate Content&quot; to see the AI in action
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ContentCreationDemo;