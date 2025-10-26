import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Heart, 
  Droplets, 
  Moon, 
  Flame, 
  TrendingUp,
  Award,
  Calendar,
  Settings
} from "lucide-react";

const Profile = () => {
  // Mock user data
  const userData = {
    name: "Sarah",
    avatar: "",
    initials: "SA",
    dailyGoals: {
      calories: { current: 1450, target: 2000 },
      water: { current: 6, target: 8 },
      steps: { current: 7234, target: 10000 },
      sleep: { current: 7, target: 8 },
    },
    wellnessScore: 85,
    streak: 12,
  };

  const goalCards = [
    {
      icon: Flame,
      label: "Calories",
      current: userData.dailyGoals.calories.current,
      target: userData.dailyGoals.calories.target,
      unit: "kcal",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Droplets,
      label: "Water",
      current: userData.dailyGoals.water.current,
      target: userData.dailyGoals.water.target,
      unit: "glasses",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: TrendingUp,
      label: "Steps",
      current: userData.dailyGoals.steps.current,
      target: userData.dailyGoals.steps.target,
      unit: "steps",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Moon,
      label: "Sleep",
      current: userData.dailyGoals.sleep.current,
      target: userData.dailyGoals.sleep.target,
      unit: "hours",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="min-h-screen gradient-warm pb-20">
      <div className="container max-w-2xl mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 shadow-elevated mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Hey, {userData.name}! 👋</h2>
              <p className="text-muted-foreground">Keep up the amazing work!</p>
            </div>
          </div>

          {/* Wellness Score */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Daily Wellness Score
              </span>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {userData.wellnessScore}
              </span>
            </div>
            <Progress value={userData.wellnessScore} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Excellent! You're in great shape today 💪
            </p>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 shadow-elevated mb-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Current Streak</p>
              <p className="text-3xl font-bold flex items-center gap-2">
                <Award className="w-8 h-8" />
                {userData.streak} days
              </p>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
          <p className="text-white/90 text-sm mt-3">
            Amazing dedication! Keep logging your meals daily!
          </p>
        </motion.div>

        {/* Daily Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Today's Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {goalCards.map((goal, index) => {
              const Icon = goal.icon;
              const percentage = (goal.current / goal.target) * 100;
              
              return (
                <motion.div
                  key={goal.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-2xl p-5 shadow-soft border border-border/50 transition-smooth hover:shadow-elevated"
                >
                  <div className={`w-10 h-10 rounded-xl ${goal.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${goal.color}`} />
                  </div>
                  <h4 className="font-semibold mb-2">{goal.label}</h4>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">{goal.current}</span>
                    <span className="text-sm text-muted-foreground">/{goal.target}</span>
                  </div>
                  <Progress value={percentage} className="h-1.5" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Encouraging Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-accent/50 rounded-2xl p-5 border border-border/50 text-center"
        >
          <p className="text-muted-foreground">
            💖 Remember: Progress over perfection. Every small step counts toward your wellness journey!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
