"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FileAudio } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { formSchema } from "./constants";
import Header from "@/components/Header";
import { useUpgradeModal } from "@/hooks/useModal";
import { useAuth } from "@clerk/nextjs";
import { fetchPageData } from "@/utils/helpers";
import LoadingEmptyState from "@/components/LoadingEmptyState";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";

interface IMessage {
  role: "user" | "assistant";
  content: string | string[];
}

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        title="Video Generation"
        description="Generate your desired Video."
        icon={FileAudio}
        iconColor="text-blue-300"
        bgColor="bg-blue-300/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Enter a description of your chosen video..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
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
                              type="audio/mpeg" // You may need to specify the correct MIME type
                            />
                          ))
                        ) : (
                          <source src={message.content} type="audio/mpeg" />
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
