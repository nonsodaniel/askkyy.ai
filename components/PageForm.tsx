import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";
import { PageType } from "@/utils/types";

interface IPageFormProps {
  form: any;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  pageType: string;
}

const PageForm = ({
  form,
  handleSubmit,
  pageType,
  isLoading,
}: IPageFormProps) => {
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="rounded-lg  border w-full  p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        >
          <FormField
            control={form.control}
            name={`${pageType}-prompt`}
            render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                    disabled={isLoading}
                    placeholder={
                      pageType === PageType.Conversation
                        ? "Ask me anything..."
                        : `Describe the ${pageType}...`
                    }
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
  );
};

export default PageForm;
