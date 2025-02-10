import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckLargeIcon } from "@/utils/icons/icons";
import { useCreateCheckoutSession } from '@/query/payment.queries';
import Spinner from '@/components/Spinner';
import { useContext, useState } from 'react';
import { 
  PricingCardProps, 
  PricingPlan, 
  EnterpriseFeaturesSection,
} from '@/types/subscription';
import { UserContext } from "@/context";
import { Link } from "react-router-dom";

const PricingCard = ({ tier, price, period, minutes, features, highlight, planId, onSubscribe, isLoading, isCurrentPlan, subtitle,processingPlanId }: PricingCardProps) => (
  <Card className={`w-full max-w-96 transition-all duration-300 hover:transform hover:-translate-y-1 backdrop-blur-sm bg-black/50 
    ${highlight ? 'border-purple-500 border-2 bg-gradient-to-b from-purple-900/50 to-black/50' : 'border-zinc-800'}`}>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <div>
          <span className="text-white">{tier}</span>
          <p className="text-sm text-white/60 mt-1">{subtitle}</p>
        </div>
        {highlight && <Badge className="bg-purple-600 hover:bg-purple-700 xl:whitespace-nowrap">Most Popular</Badge>}
      </CardTitle>
      <div className="mt-4">
        <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          {price === '0' ? 'Free' : `$${price}`}
        </span>
        {period && <span className="text-white/60">/{period}</span>}
      </div>
      <div className="text-sm text-white/60">{minutes}</div>
    </CardHeader>
    <CardContent className="space-y-6">
      <ul className="space-y-3 mb-8">
        {features.map((feature : string, i : number) => (
          <li key={i} className="flex items-center gap-3">
            <CheckLargeIcon className="text-purple-400 shrink-0" />
            <span className="text-sm text-white">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant="primary" 
        onClick={() => onSubscribe(planId)}
        disabled={isLoading || isCurrentPlan || planId === 'free'}
        className={`w-full shadow-[0_0_10px_rgba(147,51,234,0.3)] py-3 text-base font-medium
          ${planId === 'free' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading && processingPlanId === planId ? (
          <>Processing<Spinner/></>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : planId === 'free' ? (
          'Free Plan'
        ) : (
          'Get Started'
        )}
      </Button>
    </CardContent>
  </Card>
);

const PricingPage = () => {
  const { toast } = useToast();
  const { user } = useContext(UserContext);
  const { mutateAsync: createCheckout, isPending } = useCreateCheckoutSession();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const monthlyPlans: PricingPlan[] = [
    {
      tier: 'Starter',
      price: '39',
      period: 'month',
      planId: 'starter',
      subtitle: 'Best for small teams and startups',
      minutes: '150 minutes/month ($0.26/min overage)',
      features: [
        '2 concurrent calls',
        'Community + Email support',
        'All core features included'
      ]
    },
    {
      tier: 'Pro',
      price: '250',
      period: 'month',
      planId: 'professional',
      subtitle: 'Best for growing teams and advanced features',
      minutes: '1,000 minutes/month ($0.25/min overage)',
      features: [
        '5 concurrent calls',
        'Email + Priority support',
        'Prompt engineering support',
        'Basic setup assistance'
      ],
      highlight: true
    },
    {
      tier: 'Growth',
      price: '625',
      period: 'month',
      planId: 'growth',
      subtitle: 'Best for large teams and customization needs',
      minutes: '2,500 minutes/month ($0.25/min overage)',
      features: [
        '7 concurrent calls',
        'Priority + Slack channel support',
        'Advanced prompt engineering',
        'Done-for-you setup',
        'Custom integration support'
      ]
    },
    {
      tier: 'Elite',
      price: '1,250',
      period: 'month',
      planId: 'elite',
      subtitle: 'Best for agencies and high-volume clients',
      minutes: '5,000 minutes/month ($0.25/min overage)',
      features: [
        '10 concurrent calls',
        'Dedicated support manager',
        'Custom prompt library',
        'Priority setup assistance',
        'Agency training program'
      ]
    }
  ];

  const annualPlans: PricingPlan[] = [
    {
      tier: 'Starter',
      price: '35',
      period: 'month, billed annually',
      planId: 'starter',
      subtitle: 'Best for small teams and startups',
      minutes: '150 minutes/month ($0.26/min overage)',
      features: [
        '2 concurrent calls',
        'Community + Email support',
        'All core features included'
      ]
    },
    {
      tier: 'Pro',
      price: '223',
      period: 'month, billed annually',
      planId: 'professional',
      subtitle: 'Best for growing teams and advanced features',
      minutes: '1,000 minutes/month ($0.25/min overage)',
      features: [
        '5 concurrent calls',
        'Email + Priority support',
        'Prompt engineering support',
        'Basic setup assistance'
      ],
      highlight: true
    }
  ];

  const commonFeatures: string[] = [
    'Call transfers to human when needed',
    'Automated booking and scheduling on calls',
    'Automated SMS sending on calls',
    'Unlimited AI assistants',
    'Dialoft Academy access',
    'Batch calling capabilities',
    'Call recording and transcription',
    'Call summaries',
    'Customer sentiment analysis',
    'Success evaluation',
    'Advanced analytics dashboard',
    '11Labs Integration',
    'GPT-4 Integration',
    'Voicemail Detection',
    'Twilio & Vonage phone number import support'
  ];

  const enterpriseFeatures: EnterpriseFeaturesSection[] = [
    {
      category: 'Scale & Performance',
      features: [
        'Custom minute packages',
        'Unlimited concurrent calls',
        'Custom deployment',
        'Unlimited workspaces'
      ]
    },
    {
      category: 'Support & Service',
      features: [
        '24/7 dedicated support',
        'Dedicated account manager',
        'Custom contract terms',
        'Volume discounts'
      ]
    },
    {
      category: 'Custom Solutions',
      features: [
        'Custom analytics integration',
        'Custom API access',
        'Custom security requirements',
        'Custom deployment options'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    try {
      setProcessingPlanId(planId);
      // Verify user doesn't have active subscription
      if (user?.subscription?.planId !== 'trial') {
        toast({
          title: "Error",
          description: "You already have an active subscription",
          variant: "destructive"
        });
        return;
      }

      const response = await createCheckout({planName : planId, billingPeriod});
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  // Check if plan is current
  const isCurrentPlan = (planId: string) => {
    if (!user?.subscription) return false;
    return user.subscription.planId?.toLowerCase() === planId?.toLowerCase();
  };

  // Add user plan info section
  const getUserPlanInfo = () => {
    if (!user?.subscription) {
      return {
        tier: 'Free Forever',
        minutes: '10 minutes on signup (Never expires)',
        features: [
          '1 concurrent call',
          'Community support',
          'All core features included'
        ]
      };
    }

    const concurrentCallLimit = user.subscription.concurrentCallLimit;

    return {
      tier: user.subscription.planId,
      minutes: `${user.subscription.secondsRemaining / 60} minutes remaining`,
      features: [
        `${concurrentCallLimit} concurrent calls`,
        user.subscription.planId === 'starter' ? 'Community + Email support' : 'Priority support',
        'All core features included',
        user.subscription.cancelAtPeriodEnd ? 'Cancels at period end' : 'Auto-renews'
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white p-8">
      <div className="max-w-8xl mx-auto">
        {/* User's Current Plan Banner */}
        <div className="mb-16">
          <Card className="bg-black border border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mr-2">
                      Current Plan: <span className="text-purple-400">{getUserPlanInfo().tier}</span>
                    </h2>
                    <p className="text-lg text-purple-200/80">
                      {getUserPlanInfo().minutes}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {getUserPlanInfo().features.map((feature, i) => (
                      <Badge 
                        key={i}
                        variant="outline"
                        className="bg-purple-500/10 border-purple-500/30 text-purple-200"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  {!user?.subscription && (
                    <Badge className="bg-purple-600 text-white">
                      Free Plan
                    </Badge>
                  )}
                  {user?.subscription?.status === 'active' && (
                    <Badge className="bg-green-600/20 text-green-200 border-green-500/30">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Upgrade your plan
          </h1>
          <p className="text-white/60 text-lg">Choose the plan that's right for your business</p>
          
          {/* Billing toggle */}
          <div className="flex justify-center mt-8 space-x-2 bg-zinc-900/50 p-1.5 rounded-lg backdrop-blur-sm border border-zinc-800/50">
            <Button
              variant={billingPeriod === 'monthly' ? 'primary' : 'ghost'}
              onClick={() => setBillingPeriod('monthly')}
              className="text-sm"
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === 'annual' ? 'primary' : 'ghost'}
              onClick={() => setBillingPeriod('annual')}
              className="text-sm"
            >
              Annual (Save 11%)
            </Button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 ${billingPeriod === 'annual' ? 'lg:flex lg:justify-center' : ''}`}>
          {(billingPeriod === 'monthly' ? monthlyPlans : annualPlans).map((plan) => (
            <PricingCard 
              processingPlanId={processingPlanId}
              key={plan.planId}
              {...plan}
              onSubscribe={handleSubscribe}
              isLoading={isPending}
              isCurrentPlan={isCurrentPlan(plan?.planId ?? '')}
            />
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-purple-950 via-purple-950 to-black border-purple-400/20 backdrop-blur-lg relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent" />
          </div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-white">Enterprise</CardTitle>
                <p className="text-purple-100 mt-2 text-lg">Custom solutions for large organizations</p>
              </div>
              <Badge className="bg-indigo-500/30 text-indigo-100 border border-indigo-400/40 px-4 py-1.5 text-sm font-medium">
                Custom Pricing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {enterpriseFeatures.map((section) => (
                <div key={section.category} className="space-y-4 backdrop-blur-sm bg-white/5 rounded-lg p-6 border border-indigo-200/10">
                  <h3 className="text-lg font-semibold text-indigo-200">{section.category}</h3>
                  <div className="space-y-3">
                    {section.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckLargeIcon className="text-indigo-400" />
                        <span className="text-sm text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 items-center justify-center w-full mt-8">
              <Button variant="secondary" className="bg-purple-100 text-purple-950 hover:bg-purple-200 px-8 py-6 text-base font-medium min-w-[200px] cursor-pointer">
              <a href="https://cal.com/dialoftai/demo" target="_blank" rel="noopener noreferrer">
                Schedule Demo
              </a>
              </Button>
              <Button variant="primary" className="shadow-[0_0_10px_rgba(147,51,234,0.3)] px-8 py-6 text-base font-medium border border-purple-500 min-w-[200px]">
               <Link to={`/${user?.workShops[0]?._id}/support`}>Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-16 bg-black/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">All Plans Include</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commonFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckLargeIcon className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-white">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;