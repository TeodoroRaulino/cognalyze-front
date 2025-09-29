"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getConditions } from "@/services/api/condition";
import { getScenarios } from "@/services/api/scenario";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Condition {
  id: string;
  name: string;
  description: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchConditions = useCallback(async () => {
    try {
      const data = await getConditions();
      setConditions(data);
    } catch (error) {
      console.error("Error fetching conditions:", error);
    }
  }, []);

  const fetchScenarios = useCallback(async () => {
    try {
      const data = await getScenarios();
      setScenarios(data);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchConditions(), fetchScenarios()]);
      setLoading(false);
    };

    if (session) {
      fetchData();
    }
  }, [session, fetchConditions, fetchScenarios]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          Perfis de acessibilidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {conditions.map((condition) => (
            <Card
              key={condition.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                router.push(`/dashboard/profiles/${condition.id}`)
              }
            >
              <CardContent className="p-6 text-center">
                <h3 className="font-medium text-gray-900">{condition.name}</h3>
                {condition.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {condition.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
            onClick={() => router.push("/dashboard/profiles/create")}
          >
            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-gray-600">
                Adicionar Perfil de Acessibilidade
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Cenários</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Descrição</p>
                <p className="text-xs text-gray-600 mb-3">
                  {scenario.description?.substring(0, 20)}...
                </p>
                <div className="space-y-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/results/${scenario.id}`);
                    }}
                  >
                    Ver resultado →
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/evaluation/${scenario.id}`);
                    }}
                  >
                    Reavaliar →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
            onClick={() => router.push("/dashboard/scenarios/create")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <Plus className="h-6 w-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-600">Novo cenário</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
