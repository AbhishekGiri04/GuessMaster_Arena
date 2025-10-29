class AIOpponent {
  constructor() {
    this.min = 1;
    this.max = 100;
    this.guesses = [];
    this.difficulty = 'medium'; // easy, medium, hard
    this.personality = 'strategic'; // strategic, aggressive, cautious
    this.thinkingTime = 0;
    this.confidence = 0.8;
  }

  makeGuess() {
    // Simulate thinking time for realism
    this.thinkingTime = Math.random() * 1000 + 500; // 0.5-1.5 seconds
    
    let guess;
    
    if (this.guesses.length === 0) {
      // First guess strategy based on personality
      switch (this.personality) {
        case 'aggressive':
          guess = Math.random() > 0.5 ? 25 : 75; // Go for extremes
          break;
        case 'cautious':
          guess = 50; // Safe middle ground
          break;
        default: // strategic
          guess = Math.floor((this.min + this.max) / 2);
      }
    } else {
      const range = this.max - this.min + 1;
      
      if (range <= 1) {
        guess = this.min;
      } else if (range === 2) {
        guess = this.min === this.guesses[this.guesses.length - 1] ? this.max : this.min;
      } else {
        // Enhanced AI strategy with personality
        const center = Math.floor((this.min + this.max) / 2);
        
        // Personality-based variance
        let variance = 0;
        let personalityFactor = 1;
        
        switch (this.personality) {
          case 'aggressive':
            personalityFactor = 1.3;
            variance = Math.floor(range * 0.15);
            break;
          case 'cautious':
            personalityFactor = 0.7;
            variance = Math.floor(range * 0.05);
            break;
          default: // strategic
            personalityFactor = 1;
            variance = Math.floor(range * 0.08);
        }
        
        // Difficulty-based adjustments
        if (this.difficulty === 'easy') {
          variance = Math.floor(range * 0.25);
          this.confidence = 0.6;
        } else if (this.difficulty === 'medium') {
          variance = Math.floor(range * 0.12);
          this.confidence = 0.8;
        } else { // hard
          variance = Math.floor(range * 0.03);
          this.confidence = 0.95;
        }
        
        // Apply confidence and personality
        const randomOffset = (Math.random() - 0.5) * variance * personalityFactor;
        guess = Math.round(center + randomOffset);
        
        // Ensure guess is within valid range
        guess = Math.max(this.min, Math.min(this.max, guess));
        
        // Advanced duplicate avoidance with learning
        if (this.guesses.includes(guess) && range > 2) {
          const attempts = 3;
          for (let i = 0; i < attempts; i++) {
            const offset = Math.floor(Math.random() * 5) + 1;
            const direction = Math.random() > 0.5 ? 1 : -1;
            const newGuess = guess + (offset * direction);
            
            if (newGuess >= this.min && newGuess <= this.max && !this.guesses.includes(newGuess)) {
              guess = newGuess;
              break;
            }
          }
        }
      }
    }
    
    this.guesses.push(guess);
    return guess;
  }

  processHint(guess, hint) {
    if (hint === 'higher') {
      this.min = Math.max(this.min, guess + 1);
    } else if (hint === 'lower') {
      this.max = Math.min(this.max, guess - 1);
    }
    
    // Ensure min doesn't exceed max
    if (this.min > this.max) {
      this.min = this.max;
    }
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  reset() {
    this.min = 1;
    this.max = 100;
    this.guesses = [];
    this.thinkingTime = 0;
    // Randomly change personality for variety
    const personalities = ['strategic', 'aggressive', 'cautious'];
    this.personality = personalities[Math.floor(Math.random() * personalities.length)];
    this.confidence = 0.8;
  }

  getStats() {
    return {
      totalGuesses: this.guesses.length,
      guesses: [...this.guesses],
      currentRange: { min: this.min, max: this.max },
      personality: this.personality,
      confidence: this.confidence,
      thinkingTime: this.thinkingTime
    };
  }
  
  setPersonality(personality) {
    this.personality = personality;
  }
  
  getPersonalityMessage() {
    const messages = {
      strategic: [
        "Calculating optimal path...",
        "Analyzing probability matrices...",
        "Processing strategic algorithms...",
        "Evaluating decision trees..."
      ],
      aggressive: [
        "Initiating aggressive protocol...",
        "Deploying rapid-fire analysis...",
        "Executing bold strategy...",
        "Charging neural networks..."
      ],
      cautious: [
        "Performing careful analysis...",
        "Double-checking calculations...",
        "Ensuring optimal precision...",
        "Validating strategic approach..."
      ]
    };
    
    const personalityMessages = messages[this.personality] || messages.strategic;
    return personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
  }
}

module.exports = AIOpponent;