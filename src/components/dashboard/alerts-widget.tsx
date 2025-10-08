'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { Intervention } from "@/lib/types";
import { Button } from "../ui/button";

interface AlertsWidgetProps {
    interventions: Intervention[];
}

export function AlertsWidget({ interventions }: AlertsWidgetProps) {
    const urgentUnassigned = interventions.filter(
        (i) => i.priority === 'Urgente' && !i.assignedTo
    );

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <div>
                        <CardTitle className="text-destructive">Alertes critiques</CardTitle>
                        <CardDescription>
                            {urgentUnassigned.length > 0 
                                ? `Vous avez ${urgentUnassigned.length} intervention(s) urgente(s) non affectée(s).`
                                : `Aucune alerte critique pour le moment.`
                            }
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            {urgentUnassigned.length > 0 && (
                 <CardContent>
                    <ul className="space-y-2 text-sm">
                        {urgentUnassigned.map(int => (
                            <li key={int.id} className="flex justify-between items-center p-2 rounded-md bg-destructive/10">
                                <div>
                                    <span className="font-semibold">{int.id} - {int.clientName}</span>
                                    <p className="text-muted-foreground">{int.region}</p>
                                </div>
                                <Button size="sm" variant="outline">
                                    Voir
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            )}
        </Card>
    )
}
