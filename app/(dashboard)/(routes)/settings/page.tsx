import { Settings } from "lucide-react";

import { checkSubscription } from "@/lib/subscription";
import Header from "@/components/Header";
import { SubscriptionButton } from "@/components/SubscriptionButton";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Header
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-pink-500"
        bgColor="bg-pink-800"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
