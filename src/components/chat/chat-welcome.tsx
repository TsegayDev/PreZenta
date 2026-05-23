
'use client';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { promptCategories } from '@/lib/prompts'; // Import the categorized prompts

interface ChatWelcomeProps {
  onPromptClick: (prompt: string) => void;
}

export default function ChatWelcome({ onPromptClick }: ChatWelcomeProps) {
  
  // Convert the object into an array to easily map over it in JSX
  const categories = Object.values(promptCategories);

  const handleCategoryClick = (prompts: string[]) => {
    // Select a random prompt from the array of prompts for the clicked category
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const randomPrompt = prompts[randomIndex];
    onPromptClick(randomPrompt);
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center text-center pt-8 overflow-hidden">
      {/* Background and decorative elements remain the same */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 z-0"></div>
      <div className="absolute top-10 left-8 w-24 h-24 rounded-full bg-blue-200/20 dark:bg-blue-800/10 blur-2xl"></div>
      <div className="absolute bottom-16 right-8 w-28 h-28 rounded-full bg-purple-200/20 dark:bg-purple-800/10 blur-2xl"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full px-4">
        {/* Logo and Welcome Text remain the same */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4"
        >
            <div className="relative">
                <Logo className="h-16 w-16" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                  className="absolute -top-1 -right-1"
                >
                    <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3"
        >
            Welcome to PreZenta
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-lg"
        >
            Create stunning presentations in seconds with AI
        </motion.p>
        
        {/* Sample prompt categories */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Try one of these categories:
          </p>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-3 rounded-lg border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                  onClick={() => handleCategoryClick(category.prompts)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors flex-shrink-0">
                      <category.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {category.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {category.description}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Call to action remains the same */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 flex flex-col items-center"
        >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Or type your own topic below
            </p>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
                <div className="w-6 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
