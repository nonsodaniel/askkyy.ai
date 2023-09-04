import Header from "@/components/Header";
import { MessageSquare } from "lucide-react";
import React from "react";

const ConversationPage = () => {
  return (
    <div>
      <Header
        title={"Conversation Section"}
        description={"Welcome to your AI powered Conversation"}
        icon={MessageSquare}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
      />
    </div>
  );
};

export default ConversationPage;
