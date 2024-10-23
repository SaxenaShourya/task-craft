import { Button } from "../ui/button";
import Link from "next/link";

const CTASection = () => (
    <section id="cta" className="bg-primary text-primary-foreground py-16 px-8 rounded-lg mb-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Supercharge Your Productivity?
        </h2>
        <p className="text-xl mb-8">
          Join thousands of teams already using Task Craft to streamline their
          workflow.
        </p>
        <Link href="/login">
          <Button size="lg" variant="secondary">
            Start Your Free Trial
          </Button>
        </Link>
      </div>
    </section>
  );

export default CTASection;