"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { formSchema } from "./constants";
import Header from "@/components/Header";
import { useUpgradeModal } from "@/hooks/useModal";
import { fetchPageData } from "@/utils/helpers";
import { useAuth } from "@clerk/nextjs";
import LoadingEmptyState from "@/components/LoadingEmptyState";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";

interface IMessage {
  role: "user" | "assistant";
  content: string | string[];
}

const MusicPage = () => {
  const { userId } = useAuth();
  const [isPageDataLoading, setIsPageDataLoading] = useState<boolean>(true);

  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
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
      fetchPageData(userId!, "Music", setMessages, setIsPageDataLoading);
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
                      placeholder="Describe your music"
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
