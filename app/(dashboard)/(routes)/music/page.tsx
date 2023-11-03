"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { formSchema } from "./constants";
import Header from "@/components/Header";
import { useUpgradeModal } from "@/hooks/useModal";
import { fetchPageData } from "@/utils/helpers";
import { useAuth } from "@clerk/nextjs";
import LoadingEmptyState from "@/components/LoadingEmptyState";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";
import PageForm from "@/components/PageForm";
import { IMessage, PageType } from "@/utils/types";

const MusicPage = () => {
  const { userId } = useAuth();
  const [isPageDataLoading, setIsPageDataLoading] = useState<boolean>(true);

  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const upgradeModal = useUpgradeModal();

  const form = useForm<z.infer<typeof formSchema> | FieldValues>({
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
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
      const latestMessages = [...messages, userMessage] as IMessage[];

      setMessages(latestMessages);

      const response = await axios.post("/api/music", values);
      setMessages((current: any) => [
        ...current,
        { content: response.data.audio, role: "assistant" },
      ]);

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
      fetchPageData(userId!, PageType.Music, setMessages, setIsPageDataLoading);
  }, []);

  return (
    <div>
      <Header
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-teal-500"
        bgColor="bg-teal-500/10"
      />
      <div className="px-4 lg:px-8">
        <PageForm
          form={form}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          pageType={PageType.Music}
        />
        <div className="space-y-4 mt-4">
          <LoadingEmptyState
            isLoading={isLoading}
            isPageDataLoading={isPageDataLoading}
            messages={messages}
          />
          <div className="flex flex-col gap-y-4">
            {!!messages.length &&
              messages.map((message, index) => {
                return (
                  <div
                    key={index}
                    className={cn(
                      "p-8 w-full flex items-start gap-x-8 rounded-lg",
                      message.role === "user"
                        ? "bg-white border border-black/10"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}

                    {message.role === "user" ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <audio controls className="w-full mt-8">
                        {Array.isArray(message.content) ? (
                          message.content.map((src, srcIndex) => (
                            <source
                              key={srcIndex}
                              src={src}
                              type="audio/mpeg"
                            />
                          ))
                        ) : (
                          <source src={message.content} type="audio/mpeg" />
                        )}
                      </audio>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
