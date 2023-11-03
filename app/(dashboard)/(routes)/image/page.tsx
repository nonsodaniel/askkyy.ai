"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, ImageIcon } from "lucide-react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import Header from "@/components/Header";
import { useUpgradeModal } from "@/hooks/useModal";
import { fetchPageData } from "@/utils/helpers";
import LoadingEmptyState from "@/components/LoadingEmptyState";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import { BotAvatar } from "@/components/ui/BotAvatar";
import { useAuth } from "@clerk/nextjs";
interface IMessage {
  role: "user" | "assistant";
  content: string | Array<{ url: string }>;
}

const ImagePage = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const upgradeModal = useUpgradeModal();
  const [isPageDataLoading, setIsPageDataLoading] = useState<boolean>(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
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
      const response = await axios.post("/api/image", values);
      console.log("response", response);
      setMessages((current) => [
        ...current,
        { content: response.data, role: "assistant" },
      ]);
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
      fetchPageData(userId!, "Images", setMessages, setIsPageDataLoading);
  }, []);
  return (
    <div>
      <Header
        title="Image Generation"
        description="Generate your Image."
        icon={ImageIcon}
        iconColor="text-yellow-00"
        bgColor="bg-yellow-00/10"
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
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Describe your desired image to generate it..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {amountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            {messages.map((message, index) => {
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
                  {Array.isArray(message.content) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                      {message.content.map((src) => (
                        <Card
                          key={src.url}
                          className="rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image fill alt="Generated" src={src.url} />
                          </div>
                          <CardFooter className="p-2">
                            <Button
                              onClick={() => window.open(src.url)}
                              variant="secondary"
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
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

export default ImagePage;
