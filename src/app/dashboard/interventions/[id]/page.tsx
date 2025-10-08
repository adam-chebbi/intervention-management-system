
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Status, Intervention } from "@/lib/types";
import { Clock, LoaderCircle, CheckCircle, User, Calendar, MapPin, Tag, Shield, FileText, Pencil, Trash2 } from 'lucide-react';
import { useDashboard } from "@/app/dashboard/layout.client";
import { Button } from "@/components/ui/button";

const statusConfig: Record<Status, { icon: React.ElementType, className: string }> = {
    'En attente': { icon: Clock, className: 'bg-red-500/10 text-red-600 border-red-500/20' },
    'En cours': { icon: LoaderCircle, className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    'Clôturée': { icon: CheckCircle, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
};

export default function InterventionDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { interventions, users, setEditingIntervention, setDeletingIntervention, isPending } = useDashboard();

    const intervention = useMemo(() => {
        return interventions.find(i => i.id === id);
    }, [id, interventions]);
    
    if (isPending && !intervention) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Chargement de l'intervention...</p>
            </div>
        );
    }
    
    if (!intervention) {
        notFound();
        return null;
    }

    const assignedUser = users.find(u => u.id === intervention.assignedTo);
    const StatusIcon = statusConfig[intervention.status].icon;
    
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' });
    }
    
    const handleDelete = () => {
        setDeletingIntervention(intervention);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Détails de l'intervention : {intervention.id}</h2>
                    <p className="text-muted-foreground">
                        Informations complètes sur l'intervention pour {intervention.clientName}.
                    </p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingIntervention(intervention)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <CardTitle>{intervention.clientName}</CardTitle>
                            <CardDescription>{intervention.address}</CardDescription>
                        </div>
                         <Badge variant="outline" className={cn("text-base gap-1.5 self-start sm:self-center", statusConfig[intervention.status].className)}>
                            <StatusIcon className={cn("h-4 w-4", intervention.status === 'En cours' && 'animate-spin')}/>
                            <span>{intervention.status}</span>
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Technicien</h4>
                                <p>{assignedUser?.name || <span className="italic">Non assigné</span>}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Date de création</h4>
                                <p>{formatDate(intervention.date)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Dernière mise à jour</h4>
                                <p>{formatDate(intervention.lastUpdated)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Région</h4>
                                <p>{intervention.region}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Tag className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Catégorie</h4>
                                <p>{intervention.category}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold">Priorité</h4>
                                <p className={cn(intervention.priority === 'Urgente' && "font-bold text-destructive")}>
                                  {intervention.priority}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t pt-6">
                        <div className="flex items-start gap-3">
                             <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                             <div>
                                <h4 className="font-semibold mb-2">Notes d'intervention</h4>
                                <p className="text-muted-foreground whitespace-pre-wrap">{intervention.notes}</p>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
