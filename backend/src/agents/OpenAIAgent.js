const BaseAgent = require('./BaseAgent');

/**
 * OpenAI GPT Agent Implementation
 */
class OpenAIAgent extends BaseAgent {
  constructor(config) {
    super({
      provider: 'openai',
      model: config.model || 'gpt-4o',
      apiKey: config.apiKey,
      organizationId: config.organizationId,
      ...config
    });
    
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  async sendMessage(messages, systemPrompt = '', options = {}) {
    if (!this.isConfigValid()) {
      throw new Error('OpenAI agent configuration is invalid');
    }

    // Convert messages format for OpenAI
    const openAIMessages = [];
    
    if (systemPrompt) {
      openAIMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // Add user messages
    openAIMessages.push(...messages);

    const requestBody = {
      model: this.model,
      messages: openAIMessages,
      max_tokens: options.maxTokens || 1000,
      ...(options.temperature && { temperature: options.temperature }),
      ...(options.topP && { top_p: options.topP }),
      ...(options.frequencyPenalty && { frequency_penalty: options.frequencyPenalty }),
      ...(options.presencePenalty && { presence_penalty: options.presencePenalty })
    };

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      if (this.config.organizationId) {
        headers['OpenAI-Organization'] = this.config.organizationId;
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';

    } catch (error) {
      console.error('OpenAI Agent Error:', error);
      throw error;
    }
  }

  /**
   * Get available models for OpenAI
   * @returns {Array} - List of available models
   */
  static getAvailableModels() {
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ];
  }
}

module.exports = OpenAIAgent;