"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createCondition } from "@/services/api/condition";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do perfil é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   router.push("/login");
      //   return;
      // }

     var response = await createCondition({
      name: formData.name,
      description: formData.description,
     });


      toast({
        title: "Sucesso",
        description: "Perfil criado com sucesso!",
      });

     router.push(`/dashboard/profiles/${response.id}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Adicionar uma nova persona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="pb-1">Nome da persona</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nome do perfil"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="pb-1">Descrição da persona</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descreva contexto, desafios, necessidades e forças da personas"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Gerar novo perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
