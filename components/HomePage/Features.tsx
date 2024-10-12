import { BarChart2, Clipboard, Clock, Shield, Users, Zap } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const Features = () => (
  <section id="features" className="min-h-screen flex flex-col justify-center items-center py-20 bg-gradient-to-b from-background to-background/50">
    <div className="container mx-auto px-4">
      <h2 className="text-5xl font-extrabold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
        Features To Boost Productivity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Clipboard className="h-10 w-10 text-primary" />}
          title="Task Management"
          description="Organize and prioritize your tasks with ease. Create, assign, and track tasks effortlessly."
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-primary" />}
          title="Team Collaboration"
          description="Work seamlessly with your team in real-time. Share tasks, communicate, and stay aligned."
        />
        <FeatureCard
          icon={<BarChart2 className="h-10 w-10 text-primary" />}
          title="Progress Tracking"
          description="Visualize your productivity with insightful analytics and customizable dashboards."
        />
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-primary" />}
          title="Automation"
          description="Streamline repetitive tasks with powerful automation tools and integrations."
        />
        <FeatureCard
          icon={<Shield className="h-10 w-10 text-primary" />}
          title="Security"
          description="Keep your data safe with enterprise-grade security features and encryption."
        />
        <FeatureCard
          icon={<Clock className="h-10 w-10 text-primary" />}
          title="Time Tracking"
          description="Monitor time spent on tasks and projects to optimize your workflow."
        />
      </div>
    </div>
  </section>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <CardHeader>
      <CardTitle className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg transition-all duration-300 group-hover:bg-primary/20">
          {icon}
        </div>
        <span className="text-xl font-semibold">{title}</span>
      </CardTitle>
      <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
);

export default Features;
