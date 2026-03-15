const AgentFactory = require('../agents/AgentFactory');

/**
 * Debate Service - Orchestrates multi-agent debates
 * Multiple AI agents with different perspectives debate a topic,
 * moderated by a dedicated moderator agent.
 */
class DebateService {
  constructor() {
    this.defaultProvider = process.env.DEFAULT_AGENT_PROVIDER || 'anthropic';
    this.agents = new Map();
  }

  getAgent(provider = this.defaultProvider) {
    if (!this.agents.has(provider)) {
      const agent = AgentFactory.createFromEnv(provider);
      this.agents.set(provider, agent);
    }
    return this.agents.get(provider);
  }

  /**
   * Pre-defined debater personas
   */
  static get DEBATER_PRESETS() {
    return {
      optimist: {
        name: 'The Optimist',
        avatar: '☀️',
        color: '#4CAF50',
        systemPrompt: `You are "The Optimist" in a structured debate. You see the positive potential, opportunities, and benefits in the topic. You argue with enthusiasm and hope, backed by evidence and examples of success stories. You acknowledge risks but focus on how they can be mitigated. Keep responses concise (2-3 paragraphs max).`
      },
      skeptic: {
        name: 'The Skeptic',
        avatar: '🔍',
        color: '#F44336',
        systemPrompt: `You are "The Skeptic" in a structured debate. You critically examine claims, demand evidence, and highlight risks, downsides, and unintended consequences. You are not negative for the sake of it — you raise legitimate concerns that need addressing. Keep responses concise (2-3 paragraphs max).`
      },
      pragmatist: {
        name: 'The Pragmatist',
        avatar: '⚖️',
        color: '#2196F3',
        systemPrompt: `You are "The Pragmatist" in a structured debate. You focus on practical implementation, real-world constraints, cost-benefit analysis, and what actually works. You bridge idealism and criticism with actionable middle-ground solutions. Keep responses concise (2-3 paragraphs max).`
      },
      innovator: {
        name: 'The Innovator',
        avatar: '🚀',
        color: '#9C27B0',
        systemPrompt: `You are "The Innovator" in a structured debate. You think outside the box, propose creative solutions, and challenge conventional assumptions. You draw on cross-industry insights and emerging technologies. Keep responses concise (2-3 paragraphs max).`
      },
      ethicist: {
        name: 'The Ethicist',
        avatar: '🏛️',
        color: '#FF9800',
        systemPrompt: `You are "The Ethicist" in a structured debate. You examine the moral, social, and fairness implications. You consider who benefits, who is harmed, and what the long-term societal impact might be. You reference ethical frameworks and principles. Keep responses concise (2-3 paragraphs max).`
      },
      economist: {
        name: 'The Economist',
        avatar: '📊',
        color: '#009688',
        systemPrompt: `You are "The Economist" in a structured debate. You analyze everything through the lens of costs, incentives, market dynamics, and resource allocation. You use data, economic theory, and financial reasoning. Keep responses concise (2-3 paragraphs max).`
      }
    };
  }

  /**
   * Pre-defined debate topics for quick start
   */
  static get TOPIC_PRESETS() {
    return [
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
  }

  /**
   * Run a single debate turn for one debater
   */
  async runDebaterTurn(debaterKey, topic, previousArguments, roundNumber, totalRounds, provider) {
    const agent = this.getAgent(provider || this.defaultProvider);
    const preset = DebateService.DEBATER_PRESETS[debaterKey];

    if (!preset) {
      throw new Error(`Unknown debater: ${debaterKey}`);
    }

    const systemPrompt = `${preset.systemPrompt}

DEBATE RULES:
- This is Round ${roundNumber} of ${totalRounds}.
- Directly engage with and respond to other debaters' arguments when applicable.
- Be persuasive but respectful — no personal attacks.
- Use specific examples, data, or analogies to support your position.
- If this is not Round 1, you MUST reference and counter at least one previous argument.`;

    let userMessage = `DEBATE TOPIC: "${topic}"\n\n`;

    if (previousArguments.length > 0) {
      userMessage += `PREVIOUS ARGUMENTS IN THIS DEBATE:\n`;
      previousArguments.forEach((arg, i) => {
        userMessage += `\n--- ${arg.debaterName} (Round ${arg.round}) ---\n${arg.content}\n`;
      });
      userMessage += `\nNow present your argument for Round ${roundNumber}. Engage with the points made above.`;
    } else {
      userMessage += `You are opening the debate. Present your initial argument on this topic.`;
    }

    const messages = [{ role: 'user', content: userMessage }];
    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 800 });
  }

  /**
   * Generate moderator summary
   */
  async generateModeratorSummary(topic, allArguments, provider) {
    const agent = this.getAgent(provider || this.defaultProvider);

    const systemPrompt = `You are an impartial debate moderator. Your job is to:
1. Summarize the key arguments from each side
2. Identify the strongest points made
3. Note areas of agreement and disagreement
4. Provide a balanced verdict — not picking a winner, but highlighting what the audience should take away
5. Rate the overall debate quality (1-10)

Be concise, fair, and insightful. Format with clear sections.`;

    let userMessage = `DEBATE TOPIC: "${topic}"\n\nFULL DEBATE TRANSCRIPT:\n`;
    allArguments.forEach((arg) => {
      userMessage += `\n--- ${arg.debaterName} (Round ${arg.round}) ---\n${arg.content}\n`;
    });
    userMessage += `\nPlease provide your moderator summary and analysis.`;

    const messages = [{ role: 'user', content: userMessage }];
    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 1200 });
  }

  /**
   * Run a complete debate (all rounds)
   */
  async runFullDebate(topic, debaterKeys, rounds = 2, provider) {
    const allArguments = [];
    const debateLog = [];

    for (let round = 1; round <= rounds; round++) {
      for (const debaterKey of debaterKeys) {
        const preset = DebateService.DEBATER_PRESETS[debaterKey];
        const content = await this.runDebaterTurn(
          debaterKey, topic, allArguments, round, rounds, provider
        );

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
        debateLog.push(argument);
      }
    }

    // Generate moderator summary
    const summary = await this.generateModeratorSummary(topic, allArguments, provider);

    return {
      topic,
      debaters: debaterKeys.map(k => ({
        key: k,
        ...DebateService.DEBATER_PRESETS[k]
      })),
      rounds,
      arguments: debateLog,
      moderatorSummary: summary,
      completedAt: new Date().toISOString()
    };
  }
}

module.exports = DebateService;
