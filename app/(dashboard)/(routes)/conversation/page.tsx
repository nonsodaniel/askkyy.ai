"use client";
import Header from "@/components/Header";
import { formSchema } from "@/utils/constants";
import { MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import Loading from "@/components/ui/Loading";
import { Empty } from "@/components/ui/Empty";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { BotAvatar } from "@/components/ui/BotAvatar";
import { toast } from "react-hot-toast";
import { useUpgradeModal } from "@/hooks/useModal";
import { fetchResponseFromFirebase } from "@/utils/helpers";
import { useAuth } from "@clerk/nextjs";

const formatFirebaseData = (firebaseData: any) => {
  return firebaseData.map((item: any) => {
    const userMessage = {
      role: "user",
      content: item.question,
    };

    const assistantMessage = {
      role: "assistant",
      content: item.answer,
    };

    return [userMessage, assistantMessage];
  });
};

const ConversationPage = () => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[][]>(
    []
  );
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
    const fetchConversations = async () => {
      if (userId) {
        fetchResponseFromFirebase(userId, "Conversations").then((res) => {
          const formattedMessages = formatFirebaseData(res);

          setMessages(formattedMessages);
        });
      }
    };
    fetchConversations();
  }, []);
  console.log({ messages });
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
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg  border w-full  p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Ask or tell me anything! What's on your mind?"
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
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center">
              <Loading />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col gap-y-4">
            {messages.map((message, index) => (
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
