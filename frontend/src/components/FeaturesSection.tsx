import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, Target, BookOpen, Zap } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Smart Budget Planning",
    description: "Create personalized budgets that adapt to your lifestyle and financial goals.",
    color: "text-finance-teal",
    bgColor: "bg-finance-teal/10",
  },
  {
    icon: TrendingUp,
    title: "Expense Tracking",
    description: "Track every dollar with intuitive categorization and real-time insights.",
    color: "text-finance-purple",
    bgColor: "bg-finance-purple/10",
  },
  {
    icon: Target,
    title: "Savings Goals",
    description: "Set and achieve savings targets with smart progress tracking and reminders.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: BookOpen,
    title: "YouthWallet Tips for Students",
    description: "Learn money management with curated content designed for young adults.",
    color: "text-finance-blue",
    bgColor: "bg-finance-blue/10",
  },
  {
    icon: Zap,
    title: "Beginner-Friendly Tools",
    description: "Simple, intuitive interface that makes YouthWallet accessible to everyone.",
    color: "text-finance-teal",
    bgColor: "bg-finance-teal/10",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="gradient-text">Succeed Financially</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help you take control of your money with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="glass p-8 hover:shadow-hover transition-all duration-300 hover:-translate-y-2 group border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
