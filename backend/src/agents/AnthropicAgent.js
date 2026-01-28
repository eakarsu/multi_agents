const BaseAgent = require('./BaseAgent');

/**
 * Anthropic Claude Agent Implementation
 */
class AnthropicAgent extends BaseAgent {
  constructor(config) {
    super({
      provider: 'anthropic',
      model: config.model || 'claude-3-5-sonnet-20241022',
      apiKey: config.apiKey,
      apiVersion: config.apiVersion || '2023-06-01',
      ...config
    });
    
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  async sendMessage(messages, systemPrompt = '', options = {}) {
    if (!this.isConfigValid()) {
      throw new Error('Anthropic agent configuration is invalid');
    }

    const requestBody = {
      model: this.model,
      max_tokens: options.maxTokens || 1000,
      messages: messages,
      ...(systemPrompt && { system: systemPrompt }),
      ...(options.temperature && { temperature: options.temperature })
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.config.apiVersion
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Anthropic API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.content[0]?.text || '';

    } catch (error) {
      console.error('Anthropic Agent Error:', error);
      throw error;
    }
  }

  /**
   * Get available models for Anthropic
   * @returns {Array} - List of available models
   */
  static getAvailableModels() {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];
  }
}

module.exports = AnthropicAgent;