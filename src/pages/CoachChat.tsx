import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Sparkles, Volume2, VolumeX, Bell, BellOff } from "lucide-react";
import coachAvatar from "@/assets/coach-avatar.png";
import { getTextToSpeech } from "@/utils/textToSpeech";
import { requestNotificationPermission, showNotification, playNotificationSound } from "@/utils/notificationUtils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "coach";
  timestamp: Date;
}

const CoachChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! 👋 I'm Coach Emma, your personal nutrition companion. I'm here to support you on your wellness journey! How are you feeling today?",
      sender: "coach",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ttsRef = useRef(getTextToSpeech());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize notifications on mount
  useEffect(() => {
    requestNotificationPermission().then((granted) => {
      setNotificationsEnabled(granted);
    });

    // Speak the initial message after a short delay
    const timer = setTimeout(() => {
      if (voiceEnabled && messages.length === 1) {
        ttsRef.current.speak(messages[0].text);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      ttsRef.current.stop();
    };
  }, []);

  const toggleVoice = () => {
    const newState = ttsRef.current.toggle();
    setVoiceEnabled(newState);
    toast({
      title: newState ? "Voice enabled 🔊" : "Voice muted 🔇",
      description: newState 
        ? "Coach Emma will speak her messages" 
        : "Voice responses are now muted",
    });
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        toast({
          title: "Notifications enabled 🔔",
          description: "You'll receive notifications for new messages",
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive",
        });
      }
    } else {
      setNotificationsEnabled(false);
      toast({
        title: "Notifications disabled 🔕",
        description: "You won't receive notifications anymore",
      });
    }
  };

  const generateCoachResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("help") || lowerMessage.includes("advice")) {
      return "I'd love to help! 💖 What specific area would you like guidance on? Meal planning, portion control, or maybe understanding your nutritional needs better?";
    }
    
    if (lowerMessage.includes("tired") || lowerMessage.includes("energy")) {
      return "I hear you! 🌟 Low energy can often be related to nutrition. Are you getting enough protein and complex carbs? Also, staying hydrated is key! How's your water intake today?";
    }
    
    if (lowerMessage.includes("hungry") || lowerMessage.includes("snack")) {
      return "Great question! 🍎 Try reaching for nutrient-dense snacks like nuts, Greek yogurt, or fresh fruit. These will keep you satisfied longer and provide steady energy. What sounds good to you?";
    }
    
    if (lowerMessage.includes("goal") || lowerMessage.includes("target")) {
      return "I love that you're thinking about your goals! 🎯 Remember, the best goals are specific, measurable, and realistic. What would you like to achieve with your nutrition?";
    }
    
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're so welcome! 💕 I'm always here to support you. Remember, every healthy choice matters, and you're doing amazing!";
    }
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! 😊 It's wonderful to chat with you! How can I support your wellness journey today?";
    }
    
    // Default responses
    const defaultResponses = [
      "That's really interesting! Tell me more about how that's been working for you. 🌿",
      "I appreciate you sharing that with me! How do you feel about making some small, positive changes? 💪",
      "You're doing great by thinking about your nutrition! What aspect would you like to focus on today? ✨",
      "I'm here to help you succeed! Let's break this down together. What's your main concern right now? 💖",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate coach typing and response
    setTimeout(() => {
      const responseText = generateCoachResponse(inputValue);
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "coach",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachResponse]);
      setIsTyping(false);

      // Play notification sound
      playNotificationSound();

      // Show browser notification if enabled and window not focused
      if (notificationsEnabled && document.hidden) {
        showNotification(
          "Coach Emma",
          responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""),
          coachAvatar
        );
      }

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        // Wait a bit for the typing animation to finish
        setTimeout(() => {
          ttsRef.current.speak(responseText);
        }, 300);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen gradient-warm pb-20">
      <div className="container max-w-3xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-elevated mb-3 sm:mb-4 flex items-center gap-2 sm:gap-4"
        >
          <div className="relative flex-shrink-0">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 sm:border-4 border-primary/30">
              <AvatarImage src={coachAvatar} alt="Coach Emma" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
                CE
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-xl font-bold flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="truncate">Coach Emma</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Your nutrition companion
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 touch-manipulation"
            onClick={toggleVoice}
            title={voiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 touch-manipulation"
            onClick={toggleNotifications}
            title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
          >
            {notificationsEnabled ? (
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            ) : (
              <BellOff className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            )}
          </Button>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-3 sm:space-y-4 px-1 sm:px-2">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-2 sm:gap-3 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {message.sender === "coach" && (
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-primary/20">
                    <AvatarImage src={coachAvatar} alt="Coach Emma" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs sm:text-sm font-bold">
                      CE
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-soft"
                      : "bg-card shadow-soft border border-border/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {message.sender === "user" && (
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-secondary/20">
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xs sm:text-sm">
                      You
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 sm:gap-3"
            >
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 border-2 border-primary/20">
                <AvatarImage src={coachAvatar} alt="Coach Emma" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs sm:text-sm font-bold">
                  CE
                </AvatarFallback>
              </Avatar>
              <div className="bg-card shadow-soft border border-border/50 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: 0.4,
                    }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Replies */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4 flex gap-1.5 sm:gap-2 flex-wrap px-1"
          >
            {[
              "I need help with meal planning 🍽️",
              "I'm feeling tired today 😴",
              "What's a healthy snack? 🍎",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="soft"
                size="sm"
                onClick={() => {
                  setInputValue(suggestion);
                }}
                className="text-xs touch-manipulation h-9"
              >
                {suggestion}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-elevated"
        >
          <div className="flex gap-2 sm:gap-3 items-end">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... 💬"
              className="rounded-2xl min-h-[50px] sm:min-h-[60px] max-h-[100px] sm:max-h-[120px] resize-none text-base"
            />
            <Button
              variant="hero"
              size="icon"
              className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 touch-manipulation"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center hidden sm:block">
            Press Enter to send • Shift+Enter for new line
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CoachChat;
