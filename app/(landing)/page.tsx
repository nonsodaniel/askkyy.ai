import { LandingPageHero } from "@/components/LandingPageHero";
import { LandingPageContent } from "@/components/LandingPageContent";
import { LandingPageNavbar } from "@/components/LandingPageNavbar";

const LandingPage = () => {
  return (
    <div className="h-full ">
      <LandingPageNavbar />
      <LandingPageHero />
      <LandingPageContent />
    </div>
  );
};

export default LandingPage;
