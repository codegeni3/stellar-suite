"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, Server, RefreshCw } from "lucide-react";
import { useResourceTelemetry } from "@/lib/resourceTelemetry";
import { Button } from "@/components/ui/button";

export function ResourceUsageDashboard() {
  const {
    buildMinutesUsed,
    buildMinutesLimit,
    storageUsed,
    storageLimit,
    lastUpdated,
    isUpdating,
    fetchUsage,
  } = useResourceTelemetry();

  const buildPercentage = (buildMinutesUsed / buildMinutesLimit) * 100;
  const storagePercentage = (storageUsed / storageLimit) * 100;

  const isNearingLimit = buildPercentage >= 90 || storagePercentage >= 90;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Resource Usage</h3>
          <p className="text-sm text-muted-foreground">
            Current month resource consumption and quotas.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchUsage}
          disabled={isUpdating}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isNearingLimit && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 transition-all animate-in zoom-in-95">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Resource Limit Warning</AlertTitle>
          <AlertDescription>
            You are approaching 90% or more of your monthly resource quota. Please consider upgrading or optimizing your builds to avoid interruptions.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Build Minutes
            </CardTitle>
            <CardDescription>Estimated compute time spent this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{buildMinutesUsed} / {buildMinutesLimit} min</span>
                <span className={buildPercentage >= 90 ? "text-destructive" : "text-primary"}>
                  {buildPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={buildPercentage} 
                className={`h-2.5 ${buildPercentage >= 90 ? "bg-destructive/20" : "bg-primary/20"}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-4 w-4 text-primary" />
              Storage Usage
            </CardTitle>
            <CardDescription>Persistent storage for artifacts and datasets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>{storageUsed} / {storageLimit} MB</span>
                <span className={storagePercentage >= 90 ? "text-destructive" : "text-primary"}>
                  {storagePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={storagePercentage} 
                className={`h-2.5 ${storagePercentage >= 90 ? "bg-destructive/20" : "bg-primary/20"}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono bg-muted/30 p-2 rounded-lg border border-border/50">
        <span>Last synced with telemetry service: {new Date(lastUpdated).toLocaleString()}</span>
        <span className="text-primary font-bold">● Live Updates Enabled</span>
      </div>
    </div>
  );
}
