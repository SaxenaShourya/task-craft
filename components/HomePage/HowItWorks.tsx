import { BarChart2, CheckCircle, Clipboard, Users } from "lucide-react";

const HowItWorks = () => (
    <section id="how-it-works" className="py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Our Streamlined Workflow
        </h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <WorkflowStep
                key={index}
                number={index + 1}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
  
  const workflowSteps = [
    {
      title: "Create Tasks",
      description: "Effortlessly organize your workflow with our intuitive task creation interface.",
      icon: <Clipboard className="h-10 w-10 text-primary" />,
    },
    {
      title: "Collaborate",
      description: "Foster teamwork through seamless task assignment and real-time communication.",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      title: "Monitor Progress",
      description: "Gain insights with dynamic dashboards and comprehensive progress tracking.",
      icon: <BarChart2 className="h-10 w-10 text-primary" />,
    },
    {
      title: "Achieve Goals",
      description: "Celebrate milestones as you efficiently complete tasks and reach team objectives.",
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
    },
  ];
  
  const WorkflowStep: React.FC<{
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = ({ number, title, description, icon }) => (
    <div className="flex flex-col items-center text-center relative group">
      <div className="bg-background border border-primary/20 shadow-lg rounded-2xl p-6 mb-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:border-primary/50">
        {icon}
      </div>
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <div className="overflow-hidden">
        <h3 className="text-xl font-bold mb-3 text-primary transition-transform duration-300 group-hover:-translate-y-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs transition-all duration-300 group-hover:text-primary/90 group-hover:translate-y-1">{description}</p>
      </div>
    </div>
  );
export default HowItWorks