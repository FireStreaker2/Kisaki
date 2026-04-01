export const translations = {
  en: {
    // Brand
    brand: {
      name: "Kisaki",
      tagline: "Desktop Companion",
      settingsTitle: "Settings Dashboard",
      settingsDescription: "Customize your desktop companion"
    },

    // Navigation
    nav: {
      companion: "Companion",
      companionDesc: "Personality & behavior",
      voice: "Voice",
      voiceDesc: "Speech & listening",
      textTools: "Text Tools",
      textToolsDesc: "Explain, summarize & more",
      aiModel: "AI Model",
      aiModelDesc: "Select AI model",
      dashboard: "Dashboard",
      dashboardDesc: "Customize this app"
    },

    // Help section
    help: {
      title: "Need Help?",
      description: 'Press the microphone button or say "Hey Kisaki" anytime!'
    },

    // Header
    header: {
      getHelp: "Get help",
      notifications: "Notifications",
      changeTheme: "Change theme",
      lightMode: "Light Mode",
      darkMode: "Dark Mode"
    },

    // Status panel
    status: {
      voiceRecognition: "Voice Recognition",
      listeningCommands: "Listening for commands",
      voiceDisabled: "Voice disabled",
      systemStatus: "System Status",
      allSystems: "All systems operational"
    },

    // Quick actions
    quickActions: {
      testVoice: "Test Voice",
      pauseListening: "Pause Listening",
      startListening: "Start Listening",
      restartCompanion: "Restart Companion"
    },

    // Companion settings
    companion: {
      title: "Companion Settings",
      description:
        "Customize how your desktop companion behaves and responds to you",
      identity: "Companion Identity",
      identityDesc: "Give your companion a name and personality",
      nameLabel: "Companion Name",
      nameDesc: "This is what your companion will be called",
      namePlaceholder: "Enter a name...",
      personalityType: "Personality Type",
      personalityTypeDesc: "Choose how your companion communicates with you",
      responseSettings: "Response Settings",
      responseSettingsDesc: "Control how detailed and expressive responses are",
      responseLength: "Response Length",
      responseLengthDesc: "How detailed should responses be?",
      brief: "Brief - Short and to the point",
      normal: "Normal - Balanced responses",
      detailed: "Detailed - Thorough explanations",
      includeHumor: "Include Humor",
      humorDesc: "Allow your companion to be playful and include light humor",
      personalities: {
        friendly: {
          name: "Friendly Helper",
          description: "Warm, encouraging, and always ready to help"
        },
        professional: {
          name: "Professional Assistant",
          description: "Clear, concise, and business-focused"
        },
        casual: {
          name: "Casual Buddy",
          description: "Relaxed, conversational, and fun"
        },
        caring: {
          name: "Caring Companion",
          description: "Patient, gentle, and supportive"
        }
      }
    },

    // Voice settings
    voice: {
      title: "Voice Settings",
      description: "Configure how your companion speaks and listens to you",
      features: "Voice Features",
      featuresDesc: "Enable speaking and listening capabilities",
      selection: "Voice Selection",
      selectionDesc: "Choose the voice your companion will use",
      selectVoice: "Select Voice",
      testVoice: "Test This Voice",
      testMessage: "Hello! This is how I will sound when I speak to you.",
      adjustments: "Voice Adjustments",
      adjustmentsDesc: "Fine-tune how the voice sounds",
      speakingSpeed: "Speaking Speed",
      slower: "Slower",
      faster: "Faster",
      voicePitch: "Voice Pitch",
      lower: "Lower",
      higher: "Higher",
      volume: "Volume",
      quieter: "Quieter",
      louder: "Louder",
      listeningSettings: "Listening Settings",
      listeningSettingsDesc:
        "Configure how your companion listens for commands",
      wakeWord: "Wake Word",
      wakeWordDesc: "Say this phrase to get your companion's attention",
      wakeWordPlaceholder: "Hey Kisaki",
      continuousListening: "Continuous Listening",
      continuousListeningDesc:
        "Always listen for the wake word (uses more battery)"
    },

    // Text tools settings
    textTools: {
      title: "Text Assistance Tools",
      description:
        "Configure tools that help you understand and work with highlighted text",
      availableTools: "Available Tools",
      availableToolsDesc:
        "Choose which text tools appear when you highlight text in any application",
      explain: "Explain",
      explainDesc: "Break down complex text into simple terms",
      summarize: "Summarize",
      summarizeDesc: "Get a brief summary of long text",
      translate: "Translate",
      translateDesc: "Translate text to another language",
      factCheck: "Fact Check",
      factCheckDesc: "Verify claims and find sources",
      readingLevel: "Reading Level",
      readingLevelDesc: "Set how explanations and summaries are written",
      simple: "Simple",
      simpleDesc: "Easy to understand, uses basic words",
      standard: "Standard",
      standardDesc: "Balanced, everyday language",
      advanced: "Advanced",
      advancedDesc: "Detailed, technical when needed",
      translationSettings: "Translation Settings",
      translationSettingsDesc:
        "Configure your preferred languages for translation",
      defaultLanguage: "Default Translation Language",
      defaultLanguageDesc:
        "Text will be translated to this language by default",
      autoDetect: "Auto-Detect Source Language",
      autoDetectDesc: "Automatically detect the language of highlighted text",
      howToUse: "How to Use Text Tools",
      step1: "Highlight any text in any application on your computer",
      step2: "A floating menu will appear near the selected text",
      step3:
        "Click on the tool you want (Explain, Summarize, Translate, or Fact Check)",
      step4: "Your companion will show you the result and can read it aloud"
    },

    // AI Model settings
    aiModel: {
      aiModelTitle: "AI Model Selection",
      aiModelDesc: "Choose which AI model powers your companion",
      selectModel: "Select Model",
      modelSpeed: "Speed",
      modelQuality: "Quality",
      modelCost: "Cost",
      free: "Free"
    },

    // Meta settings
    meta: {
      title: "Dashboard Settings",
      description:
        "Customize the appearance and behavior of this settings dashboard",
      appearance: "Appearance",
      appearanceDesc: "Choose your preferred color theme",
      lightMode: "Light Mode",
      lightModeDesc: "Bright and easy to read",
      darkMode: "Dark Mode",
      darkModeDesc: "Easier on the eyes at night",
      system: "System",
      systemDesc: "Match your computer settings",
      textSize: "Text Size",
      textSizeDesc: "Adjust how large text appears throughout the dashboard",
      fontSize: "Font Size",
      smaller: "Smaller",
      larger: "Larger",
      previewText:
        "This is a preview of how text will appear at your selected size. Make sure you can read this comfortably!",
      accessibility: "Accessibility",
      accessibilityDesc: "Options to make the dashboard easier to use",
      highContrast: "High Contrast",
      highContrastDesc: "Increase color contrast for better visibility",
      reducedMotion: "Reduced Motion",
      reducedMotionDesc: "Minimize animations and transitions",
      notificationsSound: "Notifications & Sound",
      notificationsSoundDesc: "Control alerts and audio feedback",
      notifications: "Notifications",
      notificationsDesc: "Show alerts for important events",
      soundEffects: "Sound Effects",
      soundEffectsDesc: "Play sounds for clicks and actions",
      language: "Language",
      languageDesc: "Choose the language for this dashboard",
      saving: "Saving",
      savingDesc: "Control how your settings are saved",
      autoSave: "Auto-Save Changes",
      autoSaveDesc: "Automatically save settings as you change them"
    },

    // Languages
    languages: {
      en: "English",
      es: "Spanish (Español)",
      fr: "French (Français)",
      de: "German (Deutsch)",
      it: "Italian (Italiano)",
      pt: "Portuguese (Português)",
      zh: "Chinese (中文)",
      ja: "Japanese (日本語)",
      ko: "Korean (한국어)",
      ar: "Arabic (العربية)"
    },

    // Common
    common: {
      enabled: "Enabled",
      disabled: "Disabled",
      toggle: "Toggle"
    },

    // Overlay
    overlay: {
      title: "Kisaki Text Tools",
      close: "Close",
      selectedText: "Selected text",
      explain: "Explain",
      summarize: "Summarize",
      translate: "Translate",
      factCheck: "Fact Check",
      processing: "Kisaki is thinking...",
      result: "Result",
      readAloud: "Read aloud",
      copy: "Copy to clipboard",
      confidence: "Confidence",
      sources: "View sources",
      demoTitle: "Text Tools Demo",
      demoInstructions:
        "Highlight any text below to see the Kisaki text tools overlay appear",
      sampleScience: "Sample: Science Text",
      sampleNews: "Sample: News Article",
      sampleForeign: "Sample: Foreign Language",
      placeholder: "Highlight text in any app to use these tools"
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
