import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  LinearProgress,
  Collapse,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Forum as ForumIcon,
  Gavel as GavelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Debater presets (mirror of backend)
const DEBATER_PRESETS = {
  optimist: { name: 'The Optimist', avatar: '☀️', color: '#4CAF50' },
  skeptic: { name: 'The Skeptic', avatar: '🔍', color: '#F44336' },
  pragmatist: { name: 'The Pragmatist', avatar: '⚖️', color: '#2196F3' },
  innovator: { name: 'The Innovator', avatar: '🚀', color: '#9C27B0' },
  ethicist: { name: 'The Ethicist', avatar: '🏛️', color: '#FF9800' },
  economist: { name: 'The Economist', avatar: '📊', color: '#009688' }
};

const TOPIC_PRESETS = [
  {
    title: 'Should AI Replace Human Customer Service?',
    description: 'Debate whether AI agents should fully replace human customer service representatives.',
    suggestedDebaters: ['optimist', 'skeptic', 'pragmatist']
  },
  {
    title: 'Remote Work vs Office Work: The Future of Productivity',
    description: 'Which work model leads to better outcomes for companies and employees?',
    suggestedDebaters: ['optimist', 'skeptic', 'economist']
  },
  {
    title: 'AI Regulation: Innovation vs Safety',
    description: 'Should governments strictly regulate AI development, or let innovation lead?',
    suggestedDebaters: ['innovator', 'ethicist', 'pragmatist']
  },
  {
    title: 'Universal Basic Income in the Age of Automation',
    description: 'As AI automates more jobs, is UBI the answer to economic displacement?',
    suggestedDebaters: ['economist', 'ethicist', 'skeptic']
  },
  {
    title: 'Open Source vs Proprietary AI Models',
    description: 'Should AI models be open-sourced for the public good, or kept proprietary?',
    suggestedDebaters: ['innovator', 'skeptic', 'ethicist']
  },
  {
    title: 'The Role of AI in Education',
    description: 'Will AI tutors improve or harm the educational experience for students?',
    suggestedDebaters: ['optimist', 'ethicist', 'pragmatist']
  }
];

// Demo fallback responses
const DEMO_RESPONSES = {
  optimist: {
    'Should AI Replace Human Customer Service?': {
      1: "AI customer service represents one of the most exciting opportunities to dramatically improve the customer experience. Consider that AI agents can provide instant, 24/7 support with zero wait times — something customers consistently rank as their top priority. Companies like CraftAgent Pro have already demonstrated that AI agents can handle 80% of routine inquiries with higher satisfaction scores than human agents.\n\nThe key insight is that AI doesn't just replicate human service — it enhances it. AI agents can simultaneously access a customer's entire history, current account status, and relevant documentation in milliseconds. They never have bad days, never lose patience, and consistently apply best practices. Early adopters report 300% ROI and 40% improvements in customer satisfaction.\n\nThis isn't about eliminating jobs — it's about elevating them. When AI handles routine queries, human agents are freed to tackle complex, high-value interactions where empathy and creativity truly matter.",
      2: "I appreciate the Skeptic's concerns, but the data tells a compelling story. A recent McKinsey study found that companies implementing AI customer service saw a 35% increase in customer retention — not a decrease. The fear of losing the 'human touch' assumes AI can't be warm and helpful, but modern AI agents are remarkably natural and empathetic in their responses.\n\nAs for the Pragmatist's hybrid approach — I fully agree that's the ideal near-term path. But let's not underestimate how quickly AI is advancing. What required human intervention last year can now be fully automated with superior results. The trajectory is clear: AI will continue closing the gap on complex interactions too."
    },
    default: {
      1: "This topic presents a tremendous opportunity for positive change. The evidence consistently shows that embracing innovation — with thoughtful implementation — leads to better outcomes for everyone involved. Early adopters consistently report significant improvements in efficiency, satisfaction, and overall results.\n\nHistory shows us that transformative technologies always face initial resistance, but those who embrace them early gain substantial competitive advantages. The potential benefits far outweigh the risks, especially when we implement proper safeguards and iterate based on real-world feedback.\n\nI'm confident that with the right approach, we can achieve outcomes that benefit all stakeholders while maintaining the values and standards we care about.",
      2: "I hear the valid concerns raised, but I'd point to the overwhelming evidence of success stories. The key is not whether to move forward, but how to do it responsibly. Every major advancement in human history has required us to manage risks while pursuing progress — and this is no different.\n\nThe status quo has its own risks too. Failing to innovate means falling behind, and that creates its own set of problems. Let's focus our energy on making this work well rather than debating whether to do it at all."
    }
  },
  skeptic: {
    'Should AI Replace Human Customer Service?': {
      1: "Before we rush to replace human customer service with AI, let's examine what we'd actually be giving up. Studies show that 75% of customers still prefer speaking to a human for complex issues. There's a reason for this: human agents can read emotional cues, exercise genuine empathy, and think creatively to resolve unique situations. No AI system can truly replicate these capabilities.\n\nThe companies celebrating AI-driven support metrics are often cherry-picking data. Yes, AI handles simple FAQs quickly — but what about the 20% of interactions that are complex, emotionally charged, or involve edge cases? These are precisely the interactions that determine customer loyalty. A single bad AI experience can undo months of relationship building.\n\nWe should also consider the employment impact. Customer service employs millions worldwide. Rapid displacement without adequate transition plans could create significant social and economic disruption.",
      2: "The Optimist makes compelling points about efficiency, but efficiency isn't the only metric that matters. Customer relationships are built on trust and human connection. When a frustrated customer calls about a billing error that caused them real hardship, they don't want to talk to a chatbot — no matter how sophisticated.\n\nI'll concede that the hybrid model the Pragmatist describes has merit. But let's be honest about the trajectory: once companies see the cost savings of AI, the 'hybrid' model quickly becomes 'AI with minimal human oversight.' We need enforceable standards, not just good intentions."
    },
    default: {
      1: "Let's slow down and examine the claims being made here with a critical eye. The proponents of this change often present an idealized version of outcomes while downplaying real risks and unintended consequences. Where is the rigorous, long-term evidence that this approach actually works as advertised?\n\nHistory is full of examples where seemingly great ideas led to unforeseen problems. We need to demand evidence, not just enthusiasm. Who benefits most from this change? Who bears the costs? These are questions that deserve honest answers before we commit to a path that may be difficult to reverse.\n\nI'm not opposed to progress — I'm opposed to reckless optimism masquerading as strategy. Let's see the data, acknowledge the risks, and plan accordingly.",
      2: "While I appreciate the other perspectives shared, I notice a pattern of glossing over legitimate concerns. The Optimist's success stories are selection bias — we rarely hear about the failures. And the practical middle ground sounds reasonable until you realize it often means accepting all the risks while only capturing some of the benefits.\n\nMy position remains: extraordinary claims require extraordinary evidence. Show me the long-term, independently verified results before asking people to bet their livelihoods on this."
    }
  },
  pragmatist: {
    'Should AI Replace Human Customer Service?': {
      1: "The question isn't whether AI should replace human customer service — it's how to find the optimal blend. The practical reality is that a hybrid approach delivers the best outcomes. Here's what actually works based on companies that have implemented this successfully:\n\nTier 1 (AI handles ~70% of volume): Password resets, order tracking, FAQ responses, account updates. These are repetitive, well-defined tasks where AI consistently outperforms humans in speed and accuracy. Implementing this alone typically yields 40-60% cost reduction.\n\nTier 2 (AI-assisted humans handle ~25%): Moderate complexity issues where AI provides real-time suggestions, pulls relevant data, and drafts responses for human agents to review and personalize. This makes human agents 3x more effective.\n\nTier 3 (Humans handle ~5%): High-stakes, emotionally sensitive, or truly novel situations. These require genuine human judgment, empathy, and creative problem-solving.\n\nThe implementation timeline matters too. Don't try to boil the ocean — start with Tier 1 automation, measure results, then expand. Most companies see ROI within 60 days using this phased approach.",
      2: "Both sides make valid points, and that's exactly why the hybrid model works. The Optimist is right that AI excels at speed and consistency. The Skeptic is right that human connection matters for complex situations. These aren't contradictory — they're complementary.\n\nThe real challenge isn't technology — it's change management. Companies that fail with AI customer service usually fail because of poor implementation, not poor technology. Clear escalation paths, proper training, and honest communication with both employees and customers are what separate success from failure."
    },
    default: {
      1: "Let's cut through the ideology on both sides and focus on what actually works in practice. The reality is usually more nuanced than either extreme suggests. Based on real-world implementation data, the optimal approach involves several key principles.\n\nFirst, start small and measure. Don't commit to a massive transformation without evidence from your own context. Run a controlled pilot, gather data, and let results guide your decisions. Second, maintain flexibility. The best solution today might not be the best solution in six months. Design for adaptability, not permanence.\n\nThird, and perhaps most importantly, consider the human element. Any change affects real people. The most successful implementations I've seen invest heavily in training, communication, and gradual transition — not because it's nice, but because it produces better results.",
      2: "The Optimist and Skeptic both make points worth incorporating into a practical plan. The truth is, we can capture most of the upside while managing most of the downside — but only if we're deliberate about it.\n\nMy recommendation: implement in phases, measure ruthlessly, keep humans in the loop for edge cases, and commit to iterating based on real data rather than projections. This isn't as exciting as revolutionary change or as safe as the status quo, but it's what actually works."
    }
  }
};

function getDemoResponse(debaterKey, topic, round) {
  const debaterResponses = DEMO_RESPONSES[debaterKey] || DEMO_RESPONSES.optimist;
  const topicResponses = debaterResponses[topic] || debaterResponses.default;
  return topicResponses[round] || topicResponses[1];
}

const DEMO_MODERATOR_SUMMARY = `## Debate Summary & Analysis

### Key Arguments

**The Optimist** made a strong case for the transformative potential of this change, citing impressive metrics from early adopters including efficiency gains, cost reductions, and improved outcomes. Their strongest point was that the trajectory of technological progress makes adoption inevitable — the question is not "if" but "how."

**The Skeptic** raised critical concerns about overlooked risks, employment impact, and the tendency to over-promise results. Their insistence on evidence-based decision making and consideration of who bears the costs provides an essential counterbalance to unchecked enthusiasm.

**The Pragmatist** effectively bridged both positions with a phased implementation approach. Their tier-based framework for gradual adoption — starting with high-volume, low-complexity tasks — represents the most actionable path forward.

### Areas of Agreement
- All debaters acknowledged that some level of change is necessary and beneficial
- All recognized the importance of maintaining quality for complex, high-stakes situations
- All supported the idea of measuring outcomes rather than relying on projections alone

### Areas of Disagreement
- The pace and scope of implementation
- Whether efficiency metrics adequately capture the full value of human interaction
- The reliability of current success stories as predictors of broad adoption

### Verdict
This was a well-balanced debate that highlighted the genuine tension between innovation and caution. The strongest overall argument came from the Pragmatist's phased approach, which incorporates the Optimist's ambition while respecting the Skeptic's concerns.

**Debate Quality: 8/10** — Each participant brought unique perspectives and engaged meaningfully with others' arguments.`;

const DebateDemo = () => {
  const [topic, setTopic] = useState('');
  const [selectedDebaters, setSelectedDebaters] = useState(['optimist', 'skeptic', 'pragmatist']);
  const [rounds, setRounds] = useState(2);
  const [debateLog, setDebateLog] = useState([]);
  const [moderatorSummary, setModeratorSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('');
  const [progress, setProgress] = useState(0);
  const [debateStarted, setDebateStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [demoMode, setDemoMode] = useState(true);
  const debateEndRef = useRef(null);
  const abortRef = useRef(false);

  useEffect(() => {
    if (debateEndRef.current) {
      debateEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debateLog, moderatorSummary]);

  const handleTopicPreset = (preset) => {
    setTopic(preset.title);
    setSelectedDebaters(preset.suggestedDebaters);
  };

  const toggleDebater = (key) => {
    setSelectedDebaters(prev => {
      if (prev.includes(key)) {
        if (prev.length <= 2) return prev; // minimum 2
        return prev.filter(d => d !== key);
      }
      if (prev.length >= 4) return prev; // maximum 4
      return [...prev, key];
    });
  };

  const startDebate = async () => {
    if (!topic.trim() || selectedDebaters.length < 2) return;

    abortRef.current = false;
    setDebateStarted(true);
    setShowSetup(false);
    setDebateLog([]);
    setModeratorSummary('');
    setLoading(true);
    setProgress(0);

    const totalTurns = selectedDebaters.length * rounds;
    const allArguments = [];
    let turnCount = 0;

    try {
      for (let round = 1; round <= rounds; round++) {
        for (const debaterKey of selectedDebaters) {
          if (abortRef.current) break;

          const preset = DEBATER_PRESETS[debaterKey];
          setCurrentTurn(`${preset.avatar} ${preset.name} is formulating their argument...`);

          let content;

          if (demoMode) {
            // Try API first, fall back to demo responses
            try {
              const response = await fetch(`${BACKEND_URL}/api/debate/turn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  debaterKey,
                  topic,
                  previousArguments: allArguments,
                  roundNumber: round,
                  totalRounds: rounds
                })
              });
              if (!response.ok) throw new Error('API error');
              const data = await response.json();
              content = data.content;
            } catch {
              // Fallback to demo
              await new Promise(resolve => setTimeout(resolve, 1500));
              content = getDemoResponse(debaterKey, topic, round);
            }
          } else {
            const response = await fetch(`${BACKEND_URL}/api/debate/turn`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                debaterKey,
                topic,
                previousArguments: allArguments,
                roundNumber: round,
                totalRounds: rounds
              })
            });
            if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message || 'Failed to get debate response');
            }
            const data = await response.json();
            content = data.content;
          }

          const argument = {
            debaterKey,
            debaterName: preset.name,
            avatar: preset.avatar,
            color: preset.color,
            round,
            content,
            timestamp: new Date().toISOString()
          };

          allArguments.push(argument);
          setDebateLog(prev => [...prev, argument]);

          turnCount++;
          setProgress((turnCount / (totalTurns + 1)) * 100);
        }

        if (abortRef.current) break;
      }

      if (!abortRef.current) {
        // Moderator summary
        setCurrentTurn('🏛️ Moderator is analyzing the debate...');

        let summary;
        if (demoMode) {
          try {
            const response = await fetch(`${BACKEND_URL}/api/debate/summary`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic, arguments: allArguments })
            });
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            summary = data.summary;
          } catch {
            await new Promise(resolve => setTimeout(resolve, 2000));
            summary = DEMO_MODERATOR_SUMMARY;
          }
        } else {
          const response = await fetch(`${BACKEND_URL}/api/debate/summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, arguments: allArguments })
          });
          if (!response.ok) throw new Error('Failed to generate summary');
          const data = await response.json();
          summary = data.summary;
        }

        setModeratorSummary(summary);
        setProgress(100);
      }
    } catch (error) {
      console.error('Debate Error:', error);
      setDebateLog(prev => [
        ...prev,
        {
          debaterKey: 'error',
          debaterName: 'System',
          avatar: '⚠️',
          color: '#f44336',
          round: 0,
          content: `An error occurred: ${error.message}. Please try again or switch to Demo mode.`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
      setCurrentTurn('');
    }
  };

  const stopDebate = () => {
    abortRef.current = true;
  };

  const resetDebate = () => {
    abortRef.current = true;
    setDebateLog([]);
    setModeratorSummary('');
    setDebateStarted(false);
    setShowSetup(true);
    setLoading(false);
    setProgress(0);
    setCurrentTurn('');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ForumIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
            AI Multi-Agent Debate
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={demoMode ? 'Demo Mode (AI Powered)' : 'Live API'}
            color={demoMode ? 'secondary' : 'success'}
            size="small"
            onClick={() => setDemoMode(!demoMode)}
            sx={{ cursor: 'pointer' }}
          />
          {debateStarted && (
            <Button size="small" onClick={resetDebate} startIcon={<RefreshIcon />}>
              New Debate
            </Button>
          )}
        </Box>
      </Box>

      {demoMode && (
        <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Demo Mode: Multiple AI agents debate a topic from different perspectives, moderated by an impartial judge.
        </Alert>
      )}

      {/* Setup Section */}
      <Collapse in={showSetup}>
        <Box sx={{ mb: 3 }}>
          {/* Topic Presets */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
            Choose a debate topic or enter your own:
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {TOPIC_PRESETS.map((preset, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  variant="outlined"
                  sx={{
                    border: topic === preset.title ? '2px solid' : '1px solid',
                    borderColor: topic === preset.title ? 'primary.main' : 'divider',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardActionArea onClick={() => handleTopicPreset(preset)} sx={{ p: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                      {preset.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {preset.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Or type a custom debate topic..."
            size="small"
            sx={{ mb: 2 }}
          />

          {/* Debater Selection */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
            Select debaters (2-4):
          </Typography>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {Object.entries(DEBATER_PRESETS).map(([key, preset]) => (
              <Grid item xs={6} sm={4} md={2} key={key}>
                <Paper
                  elevation={selectedDebaters.includes(key) ? 3 : 0}
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedDebaters.includes(key) ? preset.color : 'transparent',
                    backgroundColor: selectedDebaters.includes(key) ? `${preset.color}10` : 'background.paper',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: preset.color,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => toggleDebater(key)}
                >
                  <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{preset.avatar}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.7rem' }}>
                    {preset.name}
                  </Typography>
                  <Checkbox
                    checked={selectedDebaters.includes(key)}
                    size="small"
                    sx={{ p: 0, mt: 0.5, color: preset.color, '&.Mui-checked': { color: preset.color } }}
                    onChange={() => {}}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Rounds Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rounds</InputLabel>
              <Select value={rounds} onChange={(e) => setRounds(e.target.value)} label="Rounds">
                <MenuItem value={1}>1 Round</MenuItem>
                <MenuItem value={2}>2 Rounds</MenuItem>
                <MenuItem value={3}>3 Rounds</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">
              {selectedDebaters.length} debaters x {rounds} round{rounds > 1 ? 's' : ''} = {selectedDebaters.length * rounds} turns + moderator summary
            </Typography>
          </Box>

          {/* Start Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayIcon />}
            onClick={startDebate}
            disabled={!topic.trim() || selectedDebaters.length < 2}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #7B1FA2 90%)'
              }
            }}
          >
            Start Debate
          </Button>
        </Box>
      </Collapse>

      {/* Debate Toggle (when debate has started) */}
      {debateStarted && (
        <Box sx={{ mb: 1 }}>
          <Button
            size="small"
            onClick={() => setShowSetup(!showSetup)}
            endIcon={showSetup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showSetup ? 'Hide' : 'Show'} Setup
          </Button>
        </Box>
      )}

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">{currentTurn}</Typography>
            <Typography variant="caption" color="text.secondary">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                borderRadius: 3
              }
            }}
          />
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Button size="small" color="error" onClick={stopDebate} startIcon={<StopIcon />}>
              Stop Debate
            </Button>
          </Box>
        </Box>
      )}

      {/* Debate Log */}
      {debateLog.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            flexGrow: 1,
            p: 2,
            mb: 2,
            maxHeight: moderatorSummary ? 500 : 600,
            overflow: 'auto',
            backgroundColor: '#fafafa'
          }}
        >
          {/* Topic Banner */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1a237e 0%, #4a148c 100%)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.8 }}>Debate Topic</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{topic}</Typography>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
              {selectedDebaters.map(key => (
                <Chip
                  key={key}
                  label={`${DEBATER_PRESETS[key].avatar} ${DEBATER_PRESETS[key].name}`}
                  size="small"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    fontSize: '0.7rem'
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>

          <AnimatePresence>
            {debateLog.map((entry, index) => {
              const isNewRound = index === 0 || entry.round !== debateLog[index - 1].round;

              return (
                <React.Fragment key={index}>
                  {isNewRound && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Divider sx={{ my: 2 }}>
                        <Chip
                          label={`Round ${entry.round}`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: 'primary.main',
                            color: 'white'
                          }}
                        />
                      </Divider>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Box sx={{ mb: 2.5 }}>
                      {/* Debater Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            boxShadow: `0 2px 8px ${entry.color}40`
                          }}
                        >
                          {entry.avatar}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: entry.color, lineHeight: 1.2 }}>
                            {entry.debaterName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Round {entry.round}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Argument Content */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          ml: 5.5,
                          borderLeft: `3px solid ${entry.color}`,
                          backgroundColor: 'background.paper',
                          borderRadius: '0 8px 8px 0'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-line',
                            lineHeight: 1.6,
                            color: 'text.primary'
                          }}
                        >
                          {entry.content}
                        </Typography>
                      </Paper>
                    </Box>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2, ml: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {currentTurn}
              </Typography>
            </Box>
          )}

          <div ref={debateEndRef} />
        </Paper>
      )}

      {/* Moderator Summary */}
      {moderatorSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'warning.main',
              background: 'linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <GavelIcon sx={{ color: 'warning.dark' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                Moderator's Summary
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.6,
                color: 'text.primary'
              }}
            >
              {moderatorSummary}
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* Empty State */}
      {!debateStarted && debateLog.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <ForumIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
          <Typography variant="body2">
            Choose a topic, select your debaters, and watch AI agents argue from different perspectives!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DebateDemo;
