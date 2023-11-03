"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FileAudio } from "lucide-react";
import { useRouter } from "next/navigation";

import { formSchema } from "./constants";
import Header from "@/components/Header";
import { useUpgradeModal } from "@/hooks/useModal";
import { useAuth } from "@clerk/nextjs";
import { fetchPageData } from "@/utils/helpers";
import LoadingEmptyState from "@/components/LoadingEmptyState";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";
import { IMessage, PageType } from "@/utils/types";
import PageForm from "@/components/PageForm";

const VideoPage = () => {
  const { userId } = useAuth();
  const [isPageDataLoading, setIsPageDataLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const router = useRouter();

  const upgradeModal = useUpgradeModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema> | FieldValues) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };
      const latestMessages = [...messages, userMessage] as IMessage[];

      setMessages(latestMessages);
      const response = await axios.post("/api/video", values);
      setMessages((current: any) => [
        ...current,
        { content: response.data[0], role: "assistant" },
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
      fetchPageData(userId!, "Videos", setMessages, setIsPageDataLoading);
  }, []);

  return (
    <div>
      <Header
        title={`${PageType.Video} Generation`}
        description={`Generate your desired ${PageType.Video}.`}
        icon={FileAudio}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />
      <div className="px-4 lg:px-8">
        <PageForm
          form={form}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          pageType={PageType.Video}
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
                      <video
                        controls
                        className="w-full aspect-video mt-8 rounded-lg border bg-black"
                      >
                        {Array.isArray(message.content) ? (
                          message.content.map((src, srcIndex) => (
                            <source
                              key={srcIndex}
                              src={src}
                              type="video/mp4" // You may need to specify the correct MIME type
                            />
                          ))
                        ) : (
                          <source src={message.content} type="video/mp4" />
                        )}
                      </video>
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

export default VideoPage;
