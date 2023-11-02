"use client";
import Header from "@/components/Header";
import { formSchema } from "@/utils/constants";
import { MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";
import { toast } from "react-hot-toast";
import { useUpgradeModal } from "@/hooks/useModal";
import { fetchPageData } from "@/utils/helpers";
import { useAuth } from "@clerk/nextjs";
import PageForm from "@/components/PageForm";
import LoadingEmptyState from "@/components/LoadingEmptyState";

const ConversationPage = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[][]>(
    []
  );
  const [isPageDataLoading, setIsPageDataLoading] = useState<boolean>(true);

  const router = useRouter();
  const upgradeModal = useUpgradeModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (
    values: z.infer<typeof formSchema> | FieldValues
  ) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const latestMessages = [...messages, userMessage];
      const response = await axios.post("/api/conversation", {
        messages: latestMessages.flat(),
        prompt: values.prompt,
      });

      setMessages((current) => [...current, [userMessage, response.data]]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        upgradeModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh(); // use to re-hrydrate all server components fetching the newest update from the server (database)
    }
  };
  useEffect(() => {
    if (userId)
      fetchPageData(
        userId!,
        "Conversations",
        setMessages,
        setIsPageDataLoading
      );
  }, []);

  return (
    <div>
      <Header
        title={"Conversation Section"}
        description={"Welcome to your AI powered Conversation"}
        icon={MessageSquare}
        iconColor="text-lime-500"
        bgColor="bg-lime-500/10"
      />
      <div className="px-4 lg:px-8">
        <div className="page-form">
          <PageForm
            form={form}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-4 mt-4">
          <LoadingEmptyState
            isLoading={isLoading}
            isPageDataLoading={isPageDataLoading}
            messages={messages}
          />
          <div className="flex flex-col gap-y-4">
            {messages.reverse().map((message, index) => (
              <>
                <div
                  key={index}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    "bg-white border border-black/10"
                  )}
                >
                  <UserAvatar />
                  <p className="text-sm">{message[0].content}</p>
                </div>
                <div
                  key={index}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    "bg-muted"
                  )}
                >
                  <BotAvatar />
                  <p className="text-sm">{message[1].content}</p>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
