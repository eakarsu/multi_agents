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
import { Analytics as AnalyticsIcon, InsertChart as ChartIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AgentAPI, { demoResponses } from '../../utils/agentApi';

const DataAnalysisDemo = () => {
  const [dataDescription, setDataDescription] = useState('');
  const [analysisType, setAnalysisType] = useState('Performance Analysis');
  const [businessGoals, setBusinessGoals] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  const agentAPI = new AgentAPI();

  const analysisTypes = [
    'Performance Analysis',
    'ROI Assessment',
    'Process Optimization',
    'Trend Analysis',
    'Predictive Modeling',
    'Cost-Benefit Analysis',
    'Automation Opportunity Assessment'
  ];

  const sampleAnalyses = [
    {
      description: 'Customer support ticket data: 2,400 monthly tickets, 18hr average resolution time, 85% agent utilization on repetitive tasks, declining CSAT scores',
      type: 'Performance Analysis',
      goals: 'Reduce response time, improve customer satisfaction, optimize agent productivity'
    },
    {
      description: 'Sales pipeline data: 500 leads/month, 15% conversion rate, 45-day average sales cycle, manual lead scoring consuming 20hrs/week',
      type: 'Process Optimization',
      goals: 'Increase conversion rate, reduce sales cycle time, automate lead qualification'
    },
    {
      description: 'Content marketing metrics: 50 blog posts/month, 25K monthly visitors, 2% conversion rate, content creation taking 8hrs per post',
      type: 'ROI Assessment',
      goals: 'Improve content ROI, scale content production, increase conversion rates'
    }
  ];

  const handleSampleAnalysis = (sample) => {
    setDataDescription(sample.description);
    setAnalysisType(sample.type);
    setBusinessGoals(sample.goals);
    analyzeData(sample.description, sample.type, sample.goals);
  };

  const analyzeData = async (desc = dataDescription, type = analysisType, goals = businessGoals) => {
    if (!desc.trim()) return;

    setLoading(true);
    setAnalysisResult('');

    try {
      let result;
      
      if (demoMode) {
        // Demo mode with realistic responses
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        if (desc.toLowerCase().includes('support') || desc.toLowerCase().includes('ticket')) {
          result = demoResponses.dataAnalysis['performance'];
        } else {
          result = demoResponses.dataAnalysis['default'];
        }
      } else {
        // Real Agent API call
        result = await agentAPI.dataAnalysisAgent(desc, type, goals);
      }

      setAnalysisResult(result);
    } catch (error) {
      console.error('Data Analysis Demo Error:', error);
      setAnalysisResult('Error performing data analysis. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeData();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Data Analysis Agent Demo
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

      {/* Sample Analyses */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Try these sample data analyses:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sampleAnalyses.map((sample, index) => (
            <Chip
              key={index}
              label={`${sample.type}: ${sample.description.substring(0, 30)}...`}
              variant="outlined"
              size="small"
              onClick={() => handleSampleAnalysis(sample)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'primary.light' }
              }}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Analysis Input Form */}
        <Grid item xs={12} md={5}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Data Analysis Request
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Analysis Type</InputLabel>
                    <Select
                      value={analysisType}
                      onChange={(e) => setAnalysisType(e.target.value)}
                      label="Analysis Type"
                    >
                      {analysisTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Data Description"
                    value={dataDescription}
                    onChange={(e) => setDataDescription(e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Describe your data: metrics, volumes, current performance, challenges..."
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Business Goals"
                    value={businessGoals}
                    onChange={(e) => setBusinessGoals(e.target.value)}
                    multiline
                    rows={3}
                    placeholder="What are you trying to achieve? Improve efficiency, reduce costs, increase revenue..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !dataDescription.trim()}
                    startIcon={loading ? <CircularProgress size={16} /> : <AnalyticsIcon />}
                    sx={{ mt: 2 }}
                  >
                    {loading ? 'Analyzing Data...' : 'Analyze Data'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Analysis Results */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: '#fafafa',
              overflow: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ChartIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Analysis Results
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  AI agent is analyzing your data and identifying automation opportunities...
                </Typography>
              </Box>
            ) : analysisResult ? (
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
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  {analysisResult}
                </Typography>
                
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Generated by CraftAgent Pro Data Analysis Agent • {new Date().toLocaleString()}
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AnalyticsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Describe your data and business goals, then click &quot;Analyze Data&quot; to see AI-powered insights and automation recommendations
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataAnalysisDemo;