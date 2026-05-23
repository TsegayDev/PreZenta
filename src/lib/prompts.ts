
import { Lightbulb, Zap, FileText, BrainCircuit } from 'lucide-react';

export const promptCategories = {
  business: {
    icon: Lightbulb,
    title: "Business & Startups",
    description: "Pitch decks, marketing plans, and analysis.",
    prompts: [
      "Create a 10-slide pitch deck for a new AI-powered language learning app called 'LingoLeap'. Include a title slide, problem, solution, market size, product features, and a concluding call to action.",
      "Develop a 5-slide marketing strategy presentation for a sustainable fashion brand targeting Gen Z consumers. Include social media campaigns, influencer collaborations, and key metrics.",
      "Generate a 7-slide presentation analyzing the competitive landscape for the meal-kit delivery service industry. Identify key players, their strengths, weaknesses, and potential market gaps.",
      "Outline a 12-slide presentation for a quarterly business review (QBR), covering financial performance, sales highlights, key challenges, and goals for the next quarter."
    ]
  },
  technology: {
    icon: Zap,
    title: "Technology Explained",
    description: "Explain complex tech topics in simple terms.",
    prompts: [
      "Generate a 12-slide presentation explaining Quantum Computing for a non-technical audience. Use simple analogies and focus on the potential impact of the technology.",
      "Create an 8-slide presentation on the basics of blockchain technology, explaining concepts like decentralization, blocks, and smart contracts.",
      "Develop a 10-slide presentation explaining the difference between Artificial Intelligence, Machine Learning, and Deep Learning, with real-world examples for each.",
      "Craft a presentation explaining the importance of cybersecurity for small businesses, covering common threats and preventative measures."
    ]
  },
  education: {
    icon: FileText,
    title: "Educational Topics",
    description: "Teach a subject for a specific audience.",
    prompts: [
      "Create a 7-slide summary of the book 'Sapiens: A Brief History of Humankind' by Yuval Noah Harari. Cover the Cognitive, Agricultural, and Scientific Revolutions.",
      "Generate a 15-slide presentation on the causes and effects of climate change, suitable for a high school audience, including visuals and key statistics.",
      "Develop a 10-slide presentation about the solar system for middle school students, with a slide dedicated to each planet.",
      "Create an educational presentation about the life and work of Marie Curie, highlighting her major scientific contributions and challenges."
    ]
  },
  creative: {
    icon: BrainCircuit,
    title: "Creative & Fun",
    description: "Ideas for storytelling, hobbies, and more.",
    prompts: [
        "Create a 10-slide presentation outlining a story for a new sci-fi movie about first contact with an alien civilization.",
        "Generate a presentation for a travel guide to Tokyo, Japan, highlighting top 5 must-see spots, cultural etiquette, and food recommendations.",
        "Develop a 7-slide presentation on 'The Art of Making the Perfect Pizza at Home', from dough to toppings.",
        "Craft a fun presentation proposing three different themes for a company's annual team-building event."
    ]
  }
};
