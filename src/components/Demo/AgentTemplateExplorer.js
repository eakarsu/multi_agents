import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Paper,
  Alert,
  CircularProgress,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  AccountBalance as FinanceIcon,
  ShoppingCart as RetailIcon,
  Work as WorkIcon,
  Create as CreateIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getAllAgentTemplates, getTemplatesByCategory, searchTemplates } from '../../utils/agentTemplates';
import AgentAPI from '../../utils/agentApi';

const AgentTemplateExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tryAgentOpen, setTryAgentOpen] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const agentAPI = new AgentAPI();

  const categories = [
    { id: 'all', label: 'All Agents', icon: SettingsIcon, count: getAllAgentTemplates().length },
    { id: 'craft framework', label: 'CRAFT Core', icon: WorkIcon, count: getTemplatesByCategory('CRAFT Framework').length },
    { id: 'industries', label: 'Industries', icon: BusinessIcon, count: getTemplatesByCategory('Industries').length },
    { id: 'departments', label: 'Departments', icon: WorkIcon, count: getTemplatesByCategory('Departments').length },
    { id: 'creative', label: 'Creative', icon: CreateIcon, count: getTemplatesByCategory('Creative').length },
    { id: 'operations', label: 'Operations', icon: SettingsIcon, count: getTemplatesByCategory('Operations').length }
  ];

  const getFilteredTemplates = () => {
    let templates = getAllAgentTemplates();
    
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }
    
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    }
    
    return templates;
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'healthcare': return HealthIcon;
      case 'finance': return FinanceIcon;
      case 'retail': return RetailIcon;
      case 'education': return SchoolIcon;
      default: return BusinessIcon;
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTryAgentOpen(false);
    setTaskInput('');
    setAgentResponse('');
  };

  const handleTryAgent = async () => {
    if (!taskInput.trim() || !selectedTemplate) return;
    
    setLoading(true);
    setAgentResponse('');
    
    try {
      // Extract agent type and name from template
      const agentType = selectedTemplate.category.toLowerCase().replace(' ', '');
      const agentName = selectedTemplate.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Use template's prompt if available
      const customPrompt = selectedTemplate.prompt || 
                          (selectedTemplate.prompts ? Object.values(selectedTemplate.prompts)[0] : null);
      
      const response = await agentAPI.genericAgent(
        agentType,
        agentName,
        taskInput,
        customPrompt,
        { templateId: selectedTemplate.id }
      );
      
      setAgentResponse(response);
    } catch (error) {
      console.error('Try Agent Error:', error);
      setAgentResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTask = (task) => {
    setTaskInput(task);
    setTryAgentOpen(true);
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
          Agent Template Explorer
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Explore 50+ pre-configured agent templates for different industries and use cases. 
          Each template includes specialized prompts and sample tasks ready for deployment.
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          These templates demonstrate the platform&apos;s flexibility - you can create ANY type of agent for your specific needs using our visual agent builder.
        </Alert>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Left Panel - Categories & Templates */}
        <Grid item xs={12} md={6}>
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search agent templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
            sx={{ mb: 2 }}
          />

          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onChange={(e, newValue) => setSelectedCategory(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.875rem',
                minWidth: 'auto',
                px: 2
              }
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                label={`${category.label} (${category.count})`}
              />
            ))}
          </Tabs>

          {/* Templates List */}
          <Paper 
            elevation={1} 
            sx={{ 
              maxHeight: 400, 
              overflow: 'auto',
              backgroundColor: '#fafafa'
            }}
          >
            <Grid container spacing={1} sx={{ p: 1 }}>
              {filteredTemplates.map((template) => {
                const IconComponent = getCategoryIcon(template.category);
                
                return (
                  <Grid item xs={12} key={template.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: selectedTemplate?.id === template.id ? '2px solid' : '1px solid',
                          borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <IconComponent 
                              sx={{ 
                                color: 'primary.main', 
                                fontSize: 20, 
                                mt: 0.5,
                                flexShrink: 0 
                              }} 
                            />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  lineHeight: 1.2,
                                  mb: 0.5
                                }}
                              >
                                {template.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: 'block',
                                  lineHeight: 1.3,
                                  mb: 1
                                }}
                              >
                                {template.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                <Chip 
                                  label={template.category} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.6rem', height: 18 }}
                                />
                                {template.subcategory && (
                                  <Chip 
                                    label={template.subcategory} 
                                    size="small" 
                                    variant="filled"
                                    sx={{ fontSize: '0.6rem', height: 18 }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
            
            {filteredTemplates.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No templates found. Try adjusting your search or category filter.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Panel - Template Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%', backgroundColor: '#fafafa' }}>
            {selectedTemplate ? (
              <motion.div
                key={selectedTemplate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedTemplate.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedTemplate.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip label={selectedTemplate.category} color="primary" variant="outlined" />
                    {selectedTemplate.subcategory && (
                      <Chip label={selectedTemplate.subcategory} color="secondary" />
                    )}
                  </Box>
                </Box>

                {/* Prompts Section */}
                {selectedTemplate.prompts && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Available Prompts:
                    </Typography>
                    {Object.entries(selectedTemplate.prompts).map(([key, prompt]) => (
                      <Paper key={key} elevation={0} sx={{ p: 2, mb: 1, backgroundColor: 'background.paper' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {prompt}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}

                {/* Single Prompt */}
                {selectedTemplate.prompt && !selectedTemplate.prompts && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Agent Prompt:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {selectedTemplate.prompt}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Sample Tasks */}
                {selectedTemplate.sampleTasks && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Sample Tasks:
                    </Typography>
                    <List dense>
                      {selectedTemplate.sampleTasks.map((task, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                  • {task}
                                </Typography>
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<PlayIcon />}
                                  onClick={() => handleQuickTask(task)}
                                  sx={{ 
                                    minWidth: 'auto',
                                    px: 1,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Try
                                </Button>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Try Agent Interface */}
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayIcon />}
                    onClick={() => setTryAgentOpen(!tryAgentOpen)}
                    sx={{ mb: 2 }}
                  >
                    {tryAgentOpen ? 'Hide Try Agent' : 'Try This Agent'}
                  </Button>
                  
                  <Collapse in={tryAgentOpen}>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        label="Enter your task"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Describe what you want the agent to do..."
                        disabled={loading}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
                        onClick={handleTryAgent}
                        disabled={loading || !taskInput.trim()}
                        sx={{ mt: 1 }}
                      >
                        {loading ? 'Running...' : 'Run Agent'}
                      </Button>
                    </Box>
                    
                    {agentResponse && (
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          backgroundColor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider',
                          maxHeight: 300,
                          overflow: 'auto'
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Agent Response:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'pre-line',
                            lineHeight: 1.5,
                            fontSize: '0.875rem'
                          }}
                        >
                          {agentResponse}
                        </Typography>
                      </Paper>
                    )}
                  </Collapse>
                </Box>
              </motion.div>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}
              >
                <Box>
                  <SettingsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                    Select an Agent Template
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on any template to see its configuration, prompts, and sample tasks
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentTemplateExplorer;