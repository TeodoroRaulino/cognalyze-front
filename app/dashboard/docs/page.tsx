import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, CheckCircle, FileText, ImageIcon, Users } from "lucide-react"

export default function DocumentationPage() {
  return (
    <div>
      <section>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Documentação
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Guia Completo do Cognalyze
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Aprenda a criar perfis de acessibilidade e cenários de teste para avaliar a experiência do usuário em suas
              aplicações.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Overview */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-6">O que é o Cognalyze?</h3>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            O Cognalyze é uma plataforma de avaliação de acessibilidade que permite criar personas e cenários de teste
            para validar a experiência de usuários com diferentes necessidades de acessibilidade.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Com o Cognalyze, você pode simular diferentes contextos de uso e identificar barreiras de acessibilidade
            antes que seus usuários as encontrem.
          </p>
        </section>

        {/* Workflow Steps */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8">Fluxo de Trabalho</h3>

          <div className="grid gap-8">
            {/* Step 1: Create Personas */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-xl shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      Criar Personas
                    </CardTitle>
                    <CardDescription className="text-base">
                      Defina perfis de usuários com diferentes necessidades e contextos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 border border-border">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-B315uAlpMWudM9XZ8g8UF4E0dfw7xe.png"
                    alt="Interface de criação de persona"
                    className="w-full rounded-lg border border-border mb-4"
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Como criar uma persona:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Nome da persona:</strong> Identifique o perfil com um nome descritivo (ex: "Sofia, 24
                        anos, estudante de Design Gráfico")
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Descrição:</strong> Descreva o contexto, desafios, necessidades e forças da persona.
                        Inclua informações sobre limitações visuais, motoras, cognitivas ou outras necessidades de
                        acessibilidade
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Clique em <strong>"Gerar novo perfil"</strong> para salvar a persona
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Create Scenarios - Configuration */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-xl shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Criar Cenário de Teste - Configuração
                    </CardTitle>
                    <CardDescription className="text-base">Configure o cenário de teste (Etapa 1 de 2)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 border border-border">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uceFGqF8hK8cCsMmDYGrthHR2GAy1U.png"
                    alt="Configuração do cenário de teste"
                    className="w-full rounded-lg border border-border mb-4"
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Etapa 1: Configuração</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Nome do Cenário:</strong> Dê um nome descritivo ao teste (ex: "Testando projeto A")
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Descrição:</strong> Descreva o cenário de teste e o que você pretende avaliar
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Persona:</strong> Selecione uma persona previamente criada para este teste
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Clique em <strong>"Próximo"</strong> para avançar para a etapa de imagens
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Create Scenarios - Images */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-xl shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <ImageIcon className="w-6 h-6" />
                      Adicionar Imagens ao Cenário
                    </CardTitle>
                    <CardDescription className="text-base">
                      Faça upload das telas para avaliação (Etapa 2 de 2)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 border border-border">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rzpDHNtnJhEGoXIIIZDCkz1Gz4NoGh.png"
                    alt="Upload de imagens para o cenário"
                    className="w-full rounded-lg border border-border mb-4"
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Etapa 2: Seleção de Imagens</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Formatos suportados:</strong> JPG, PNG, GIF, BMP, WebP, SVG ou arquivos ZIP
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Upload Individual:</strong> Adicione imagens uma por uma
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Upload ZIP:</strong> Envie múltiplas imagens de uma vez em um arquivo compactado
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Arraste e solte os arquivos ou clique para selecionar</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Manage and Evaluate */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-xl shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      Gerenciar e Avaliar
                    </CardTitle>
                    <CardDescription className="text-base">Visualize resultados e reavalie cenários</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 border border-border">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oP1uBvkcrHNYBHCaht3CbyOLxkr6ta.png"
                    alt="Gerenciamento de personas e cenários"
                    className="w-full rounded-lg border border-border mb-4"
                  />
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Gerenciamento:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Personas:</strong> Visualize todas as personas criadas e adicione novas quando
                        necessário
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Cenários:</strong> Acesse seus cenários de teste salvos
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Ver resultado:</strong> Visualize a análise de acessibilidade do cenário
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Reavaliar:</strong> Execute uma nova avaliação do cenário com as mesmas configurações
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-6">Melhores Práticas</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Criação de Personas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>• Seja específico sobre as necessidades de acessibilidade</p>
                <p>• Inclua contexto real de uso (dispositivos, ambiente, objetivos)</p>
                <p>• Considere diferentes tipos de limitações (visual, motora, cognitiva, auditiva)</p>
                <p>• Crie personas diversas para cobrir diferentes cenários</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Cenários de Teste
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>• Use nomes descritivos para facilitar a organização</p>
                <p>• Capture telas de diferentes estados da aplicação</p>
                <p>• Inclua fluxos completos de interação</p>
                <p>• Reavalie periodicamente após mudanças no design</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Qualidade das Imagens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>• Use imagens de alta resolução para melhor análise</p>
                <p>• Capture telas completas, incluindo navegação</p>
                <p>• Documente estados interativos (hover, focus, erro)</p>
                <p>• Organize imagens em sequência lógica de uso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Avaliação Contínua
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>• Revise resultados com equipe de design e desenvolvimento</p>
                <p>• Priorize problemas críticos de acessibilidade</p>
                <p>• Documente melhorias implementadas</p>
                <p>• Mantenha histórico de avaliações para comparação</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 md:p-12 text-center border border-primary/20">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Pronto para começar?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Crie sua primeira persona e comece a avaliar a acessibilidade das suas aplicações hoje mesmo.
          </p>
          <Button size="lg" className="gap-2">
            Começar agora
            <ArrowRight className="w-4 h-4" />
          </Button>
        </section>
      </main>
    </div>
  )
}
