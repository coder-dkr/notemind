'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  HelpCircle, 
  Scale, 
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface OnboardingData {
  mainGoal: string;
  biggestChallenge: string;
  confusionArea: string;
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'long';
  initialThought: string;
}

interface CognitiveOnboardingProps {
  onComplete: () => void;
}

const steps = [
  { id: 'welcome', title: 'Welcome to KeraMind', icon: Brain },
  { id: 'goal', title: 'Your Main Goal', icon: Target },
  { id: 'challenge', title: 'Biggest Challenge', icon: AlertTriangle },
  { id: 'confusion', title: 'Areas of Confusion', icon: HelpCircle },
  { id: 'risk', title: 'Risk Tolerance', icon: Scale },
  { id: 'horizon', title: 'Time Horizon', icon: Clock },
  { id: 'thought', title: 'First Thought', icon: Sparkles },
];

export function CognitiveOnboarding({ onComplete }: CognitiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    mainGoal: '',
    biggestChallenge: '',
    confusionArea: '',
    riskTolerance: 'medium',
    timeHorizon: 'long',
    initialThought: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Save cognitive snapshot
      await supabase.from('cognitive_snapshots').upsert({
        user_id: session.user.id,
        main_goal: data.mainGoal,
        biggest_challenge: data.biggestChallenge,
        confusion_area: data.confusionArea,
        risk_tolerance: data.riskTolerance,
        time_horizon: data.timeHorizon,
        initial_thought: data.initialThought,
        completed_at: new Date().toISOString(),
      });

      // Update profile to mark onboarding as completed
      await supabase.from('profiles').update({
        onboarding_completed: true,
      }).eq('id', session.user.id);

      // Create first thought if provided
      if (data.initialThought) {
        await supabase.from('thoughts').insert({
          user_id: session.user.id,
          content: data.initialThought,
          title: 'My First Thought',
        });
      }

      onComplete();
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome': return true;
      case 'goal': return data.mainGoal.length > 10;
      case 'challenge': return data.biggestChallenge.length > 10;
      case 'confusion': return data.confusionArea.length > 10;
      case 'risk': return true;
      case 'horizon': return true;
      case 'thought': return data.initialThought.length > 20;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 rounded-3xl purple-gradient flex items-center justify-center mx-auto shadow-2xl shadow-primary/30">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white">
                Welcome to <span className="text-primary">KeraMind</span>
              </h2>
              <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
                KeraMind helps you think better, not just answer questions. 
                We'll start by building your initial cognitive snapshot.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
              {[
                { icon: Target, label: 'Map your goals' },
                { icon: AlertTriangle, label: 'Detect biases' },
                { icon: Sparkles, label: 'Find patterns' },
                { icon: Brain, label: 'Grow clarity' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-white/60 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-white">What is your current main goal?</Label>
              <p className="text-white/40 text-sm">
                This could be personal, professional, or something you're working towards.
              </p>
            </div>
            <Textarea
              value={data.mainGoal}
              onChange={(e) => setData({ ...data, mainGoal: e.target.value })}
              placeholder="e.g., I want to transition into a product management role within the next 6 months..."
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/20 text-lg"
            />
          </div>
        );

      case 'challenge':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-white">What is your biggest challenge right now?</Label>
              <p className="text-white/40 text-sm">
                What's standing between you and your goal?
              </p>
            </div>
            <Textarea
              value={data.biggestChallenge}
              onChange={(e) => setData({ ...data, biggestChallenge: e.target.value })}
              placeholder="e.g., I struggle with making decisions quickly because I always second-guess myself..."
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/20 text-lg"
            />
          </div>
        );

      case 'confusion':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-white">What do you feel confused about?</Label>
              <p className="text-white/40 text-sm">
                Areas where you lack clarity or feel uncertain.
              </p>
            </div>
            <Textarea
              value={data.confusionArea}
              onChange={(e) => setData({ ...data, confusionArea: e.target.value })}
              placeholder="e.g., I'm not sure if I should focus on technical skills or soft skills for my career growth..."
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/20 text-lg"
            />
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-white">What is your risk tolerance?</Label>
              <p className="text-white/40 text-sm">
                How comfortable are you with uncertainty and taking risks?
              </p>
            </div>
            <RadioGroup
              value={data.riskTolerance}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setData({ ...data, riskTolerance: value })
              }
              className="space-y-4"
            >
              {[
                { value: 'low', label: 'Low Risk', description: 'I prefer stability and predictable outcomes' },
                { value: 'medium', label: 'Medium Risk', description: 'I can handle some uncertainty for potential gains' },
                { value: 'high', label: 'High Risk', description: 'I embrace uncertainty and big bets' },
              ].map((option) => (
                <Label
                  key={option.value}
                  className={`flex items-start gap-4 p-6 rounded-2xl border cursor-pointer transition-all ${
                    data.riskTolerance === option.value 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <RadioGroupItem value={option.value} className="mt-1" />
                  <div className="space-y-1">
                    <span className="font-bold text-white">{option.label}</span>
                    <p className="text-white/40 text-sm">{option.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'horizon':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-white">What is your time horizon?</Label>
              <p className="text-white/40 text-sm">
                Are you focused on short-term wins or long-term vision?
              </p>
            </div>
            <RadioGroup
              value={data.timeHorizon}
              onValueChange={(value: 'short' | 'long') => 
                setData({ ...data, timeHorizon: value })
              }
              className="space-y-4"
            >
              {[
                { value: 'short', label: 'Short-term Focus', description: 'Prioritizing goals within the next 1-6 months' },
                { value: 'long', label: 'Long-term Focus', description: 'Building towards goals 1-5+ years from now' },
              ].map((option) => (
                <Label
                  key={option.value}
                  className={`flex items-start gap-4 p-6 rounded-2xl border cursor-pointer transition-all ${
                    data.timeHorizon === option.value 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <RadioGroupItem value={option.value} className="mt-1" />
                  <div className="space-y-1">
                    <span className="font-bold text-white">{option.label}</span>
                    <p className="text-white/40 text-sm">{option.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 'thought':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold text-white">What's on your mind right now?</Label>
              <p className="text-white/40 text-sm">
                Write freely about anything you're thinking about. This will be your first cognitive capture.
              </p>
            </div>
            <Textarea
              value={data.initialThought}
              onChange={(e) => setData({ ...data, initialThought: e.target.value })}
              placeholder="Write whatever comes to mind... your thoughts, concerns, ideas, plans..."
              className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/20 text-lg"
            />
            <div className="flex items-center gap-2 text-white/30">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">KeraMind will analyze this to build your first cognitive map</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'w-8 bg-primary' 
                  : i < currentStep 
                    ? 'w-4 bg-primary/50' 
                    : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card rounded-[3rem] p-10 md:p-14 border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="purple-gradient h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Building Your Mind...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="purple-gradient h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
