"use client";

import { useQuery } from "@tanstack/react-query";
import { grantRequestService } from "@/services/grant-request.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AccessRequestDialog } from "@/components/access-requests/access-request-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import Link from "next/link";

export default function AccessRequestsPage() {
  const t = useTranslations("AccessRequests");
  const tCommon = useTranslations("Common");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => grantRequestService.listMyRequests(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default" className="bg-green-600">{t(`status.approved`)}</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">{t(`status.rejected`)}</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">{t(`status.pending`)}</Badge>;
      case "EXPIRED":
        return <Badge variant="secondary">{t(`status.expired`)}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <div className="mt-2">
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  {tCommon("dashboard")}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem current>{t("title")}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <AccessRequestDialog 
          trigger={
            <Button variant="contained" color="primary" size="md">
              <Plus className="mr-2 h-4 w-4" />
              {t("newRequest")}
            </Button>
          }
        />
      </div>

      <Card className="!p-0 !gap-0 block overflow-hidden border-none shadow-md bg-card dark:bg-[#212B36]">
        <div className="relative mx-0 rounded-none border-none text-card-foreground shadow-none bg-transparent overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-b border-dashed border-border/50 hover:bg-transparent">
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white first:pl-6">{t("table.resource")}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t("table.level")}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t("table.justification")}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t("table.duration")}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t("table.status")}</TableHead>
                <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">{t("table.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center">
                       <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : requests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground font-medium">{t("empty")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests?.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium px-4 py-4 first:pl-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {req.capability?.code || req.space?.name || "Geral"}
                        </span>
                        {req.capability?.description && (
                            <span className="text-xs text-muted-foreground">
                                {req.capability.description}
                            </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      {req.accessLevel === 'READ_WRITE' ? t("table.levelWrite") : t("table.levelRead")}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate px-4" title={req.justification}>
                      {req.justification}
                    </TableCell>
                    <TableCell className="px-4">
                      {req.requestedDuration} dias
                    </TableCell>
                    <TableCell className="px-4">
                      {getStatusBadge(req.status)}
                    </TableCell>
                    <TableCell className="px-4">
                      {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
