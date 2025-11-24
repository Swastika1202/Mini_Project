import { Shield, Users, Lightbulb } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Phantom Finance is built to empower young adults to take control of their financial lives 
              with confidence and clarity. Simple tools, practical lessons, and smart strategies—all in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Secure & Private</h3>
              <p className="text-muted-foreground">Your financial data is protected with bank-level encryption.</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Built for Youth</h3>
              <p className="text-muted-foreground">Designed with students and young adults in mind.</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Smart Insights</h3>
              <p className="text-muted-foreground">AI-powered tips to help you make better financial decisions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
