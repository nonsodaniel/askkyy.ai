"use client";
import Header from "@/components/Header";
import { formSchema } from "@/utils/constants";
import { Code } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";
import ReactMarkDown from "react-markdown";
import { useUpgradeModal } from "@/hooks/useModal";
import toast from "react-hot-toast";
import { fetchPageData } from "@/utils/helpers";

import { useAuth } from "@clerk/nextjs";
import LoadingEmptyState from "@/components/LoadingEmptyState";
import PageForm from "@/components/PageForm";
import { PageType } from "@/utils/types";
const CodePage = () => {
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
      const response = await axios.post("/api/code", {
        messages: latestMessages.flat(),
        prompt: values.prompt,
      });
      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        upgradeModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    if (userId)
      fetchPageData(userId!, "Codes", setMessages, setIsPageDataLoading);
  }, []);

  return (
    <div>
      <Header
        title={"Code Generation Section"}
        description={"Welcome to your AI powered Conversation"}
        icon={Code}
        iconColor="text-emerald-800"
        bgColor="bg-emerald-800/10"
      />
      <div className="px-4 lg:px-8 relative">
        <div className="page-form">
          <PageForm
            form={form}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            pageType={PageType.Code}
          />
        </div>

        <div className="space-y-4 mt-4 mb-12 ">
          <LoadingEmptyState
            isLoading={isLoading}
            isPageDataLoading={isPageDataLoading}
            messages={messages}
          />
          <div className="flex flex-col gap-y-4">
            {messages.map((message, index) => {
              console.log({ message });
              const isMessageArray = Array.isArray(message);
              return (
                <>
                  <div
                    key={index}
                    className={cn(
                      "p-8 w-full flex items-start gap-x-8 rounded-lg",
                      "bg-white border border-black/10"
                    )}
                  >
                    <UserAvatar />
                    <p className="text-sm">
                      {(isMessageArray
                        ? message[0].content
                        : //@ts-ignore
                          //Todo: Improve the isMessageArray checks
                          message.content) || ""}
                    </p>
                  </div>
                  <div
                    key={index}
                    className={cn(
                      "p-8 w-full flex items-start gap-x-8 rounded-lg",
                      "bg-muted"
                    )}
                  >
                    <BotAvatar />

                    <ReactMarkDown
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-black/10 rounded-lg p-1"
                            {...props}
                          />
                        ),
                      }}
                      className="text-sm overflow-hidden leading-7"
                    >
                      {(isMessageArray
                        ? message[1].content
                        : //@ts-ignore
                          //Todo: Improve the isMessageArray checks

                          message.content) || ""}
                    </ReactMarkDown>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
