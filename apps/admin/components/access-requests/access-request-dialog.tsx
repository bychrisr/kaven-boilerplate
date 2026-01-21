"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectOption,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { grantRequestService } from "@/services/grant-request.service";
import { CreateGrantRequestInput } from "@kaven/shared";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface AccessRequestDialogProps {
  spaceId?: string;
  capabilityId?: string;
  capabilityName?: string;
  trigger?: React.ReactNode;
}

export function AccessRequestDialog({ 
  spaceId, 
  capabilityId, 
  capabilityName = "Recurso Protegido",
  trigger 
}: AccessRequestDialogProps) {
  const t = useTranslations("AccessRequests.dialog");
  const tTable = useTranslations("AccessRequests.table");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Define schema inside to use translations
  const formSchema = z.object({
    justification: z.string().min(10, t("validation.justificationMin")),
    requestedDuration: z.number().min(1).max(365),
    accessLevel: z.enum(["READ_ONLY", "READ_WRITE"]),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      justification: "",
      requestedDuration: 7,
      accessLevel: "READ_ONLY",
    },
  });

  const { mutate: createRequest, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload: CreateGrantRequestInput = {
        ...data,
        spaceId: spaceId || undefined,
        capabilityId: capabilityId || undefined,
        scope: "SPACE",
      };
      return await grantRequestService.create(payload);
    },
    onSuccess: () => {
      toast.success(t("success"));
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || t("error"));
    },
  });

  const onSubmit = (data: FormValues) => {
    createRequest(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Lock className="mr-2 h-4 w-4" />
            {t("title")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t.rich("description", {
              resource: capabilityName,
              bold: (chunks) => <strong>{chunks}</strong>,
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.level")}</FormLabel>
                  <FormControl>
                    <Select 
                      onChange={field.onChange} 
                      value={field.value}
                      placeholder={t("placeholders.level")}
                    >
                      <SelectOption value="READ_ONLY">{tTable("levelRead")}</SelectOption>
                      <SelectOption value="READ_WRITE">{tTable("levelWrite")}</SelectOption>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {t("hints.level")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.duration")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={365} 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("hints.duration")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.justification")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("placeholders.justification")} 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("submitting") : t("submit")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
