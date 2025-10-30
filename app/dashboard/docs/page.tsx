"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CheckCircle,
  FileText,
  ImageIcon,
  Lightbulb,
  Settings,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DocumentationPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)

      const sections = [
        "sobre",
        "fluxo",
        "criar-personas",
        "questionario",
        "configuracao",
        "imagens",
        "gerenciar",
        "processo-avaliacao",
        "melhores-praticas",
      ]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const navItems = [
    { id: "sobre", label: "Sobre a Plataforma" },
    { id: "fluxo", label: "Fluxo de Trabalho" },
    { id: "criar-personas", label: "1. Criar Personas", indent: true },
    { id: "questionario", label: "Como criamos o Questionário", indent: true },
    { id: "configuracao", label: "2. Configuração", indent: true },
    { id: "imagens", label: "3. Adicionar Imagens", indent: true },
    { id: "gerenciar", label: "4. Gerenciar e Avaliar", indent: true },
    { id: "processo-avaliacao", label: "Processo de Avaliação", indent: true },
    { id: "melhores-praticas", label: "Melhores Práticas" },
  ]

  return (
    <div className="relative">
      <nav
        className="hidden lg:block fixed left-8 top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto"
        aria-label="Navegação da documentação"
      >
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-sm text-foreground mb-3">Nesta página</h4>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                    item.indent ? "pl-4" : ""
                  } ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  aria-current={activeSection === item.id ? "location" : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="lg:ml-72">
        <section>
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                Documentação
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Guia Completo da Plataforma
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Aprenda a criar personas eficazes e cenários de teste para avaliar a acessibilidade cognitiva em suas
                aplicações.
              </p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <section id="sobre" className="mb-16 scroll-mt-20">
            <h3 className="text-3xl font-bold text-foreground mb-6">Sobre a Plataforma</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Esta plataforma permite criar personas e cenários de teste para avaliar a acessibilidade cognitiva de
              interfaces digitais. Cada persona representa um tipo de usuário com necessidades, contextos e barreiras
              específicas de acessibilidade.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Com essa ferramenta, você pode simular diferentes contextos de uso e identificar barreiras de
              acessibilidade antes que seus usuários as encontrem, promovendo uma experiência mais inclusiva e
              acessível.
            </p>
          </section>

          <section id="fluxo" className="mb-16 scroll-mt-20">
            <h3 className="text-3xl font-bold text-foreground mb-8">Fluxo de Trabalho</h3>

            <div className="grid gap-8">
              <Card id="criar-personas" className="border-2 border-primary/20 scroll-mt-20">
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
                        Defina perfis de usuários com diferentes necessidades e contextos de acessibilidade
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 border border-border">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-B315uAlpMWudM9XZ8g8UF4E0dfw7xe.png"
                      alt="Interface de criação de persona"
                      className="w-full rounded-lg border border-border mb-4"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground text-lg">Como criar personas eficazes:</h4>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Defina um contexto claro</p>
                          <p className="text-muted-foreground text-sm">
                            Descreva quem é a persona, sua idade, profissão ou rotina. Explique brevemente onde e como
                            ela usa tecnologia (ex: ambiente de trabalho, estudo, casa, dispositivos).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Identifique os desafios principais</p>
                          <p className="text-muted-foreground text-sm">
                            Liste as barreiras cognitivas, sensoriais ou comportamentais enfrentadas por essa persona
                            (ex: dificuldade de foco, sensibilidade a estímulos visuais, sobrecarga informacional).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Descreva as necessidades de acessibilidade</p>
                          <p className="text-muted-foreground text-sm">
                            Aponte os recursos e ajustes que ajudam essa persona a usar uma interface com conforto —
                            como legendas, cores neutras, navegação simplificada, feedbacks visuais ou pausas
                            configuráveis.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Inclua forças e habilidades</p>
                          <p className="text-muted-foreground text-sm">
                            Mostre o que essa persona faz bem. Por exemplo, atenção a detalhes, pensamento lógico,
                            memória visual ou criatividade. Isso ajuda a entender como transformar desafios em
                            potencialidades.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Use linguagem natural e empática</p>
                          <p className="text-muted-foreground text-sm">
                            Evite termos clínicos. Prefira narrativas humanas e descritivas (ex: "Sofia se sente
                            sobrecarregada por sons altos" em vez de "usuária com hipersensibilidade auditiva").
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Varie os perfis criados</p>
                          <p className="text-muted-foreground text-sm">
                            Combine diferentes idades, profissões e contextos (ex: estudante com TDAH, profissional
                            autista, idoso com dislexia) para abranger múltiplos tipos de experiência e promover
                            diversidade cognitiva.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
                      <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground mb-1">Dica</p>
                        <p className="text-sm text-muted-foreground">
                          Personas bem descritas tornam o resultado das análises mais próximo da realidade, permitindo
                          que a plataforma gere questionários e recomendações realmente adaptadas às necessidades
                          humanas de acessibilidade.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="questionario" className="border-2 border-accent/30 bg-accent/5 scroll-mt-20">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground shrink-0">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">Como criamos o Questionário</CardTitle>
                      <CardDescription className="text-base">
                        Entenda o processo automatizado que acontece por trás das cenas
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Após você criar uma persona e configurar um cenário de teste, nossa plataforma utiliza inteligência
                    artificial para gerar automaticamente um questionário de avaliação personalizado. Veja como
                    funciona:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Entrada</p>
                        <p className="text-muted-foreground text-sm">
                          Você seleciona uma persona e descreve o contexto/objetivo do teste.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Síntese da persona</p>
                        <p className="text-muted-foreground text-sm">
                          Identificamos necessidades cognitivas, barreiras e pontos fortes (ex.: sensibilidade a
                          estímulos, risco de sobrecarga, necessidade de instruções explícitas).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Geração (LLM)</p>
                        <p className="text-muted-foreground text-sm mb-2">
                          A partir dessa síntese, produzimos <strong>6–10 critérios</strong> voltados exclusivamente
                          para imagens estáticas, cada um contendo:
                        </p>
                        <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                          <li>• Objetivo cognitivo (o porquê do critério)</li>
                          <li>• Como avaliar (na imagem) com passos observáveis e verificáveis</li>
                          <li>• Escala Likert 1–5 com âncoras 1/3/5 específicas do critério</li>
                          <li>• Evidências a coletar (o que observar/registrar)</li>
                          <li>
                            • Referências (até 2 WCAG + 1 COGA do nosso catálogo; se não houver aderência, usar WCAG:
                            N/A; COGA: N/A)
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        4
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Resumo Executivo</p>
                        <p className="text-muted-foreground text-sm">
                          Pontos positivos, principais problemas, pontuação geral (média 1–5) e prioridades de correção
                          em ordem sugerida.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        5
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Controle de escopo</p>
                        <p className="text-muted-foreground text-sm">
                          Ignoramos animações, vídeo e áudio. Se você mencionar algo dinâmico, traduzimos para um
                          equivalente visual verificável (ex.: previsibilidade → hierarquia, ritmo → densidade/clutter,
                          processo → instruções visíveis) ou marcamos N/A.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-5 space-y-4">
                    <h5 className="font-semibold text-foreground">Âncoras da Escala Likert</h5>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground text-sm mb-1">1 (Crítico/Não atende)</p>
                        <p className="text-muted-foreground text-sm">
                          Falhas graves que impedem a compreensão; viola a(s) referência(s) WCAG indicada(s) e contraria
                          o COGA.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-1">3 (Parcialmente atende)</p>
                        <p className="text-muted-foreground text-sm">
                          Há progresso visível, mas persistem obstáculos cognitivos relevantes; atende parcialmente à(s)
                          WCAG; COGA aplicado de forma inconsistente.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-1">5 (Atende bem/Ótimo)</p>
                        <p className="text-muted-foreground text-sm">
                          Critério cumprido com clareza; boas práticas COGA evidentes; WCAG indicada atendida sem
                          ressalvas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-semibold text-foreground">Em que os guidelines se baseiam</h5>

                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground text-sm mb-2">WCAG 2.2 (W3C)</p>
                        <p className="text-muted-foreground text-sm mb-2">
                          Foco nos requisitos testáveis ligados à percepção e compreensão em imagens:
                        </p>
                        <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                          <li>• 1.4.3 Contraste (mínimo)</li>
                          <li>• 1.4.11 Contraste de elementos não textuais (ícones/controles)</li>
                          <li>• 1.4.1 Uso de cor (evitar depender apenas de cor)</li>
                          <li>• 1.3.1 Informação e relações (hierarquia/estrutura visual)</li>
                          <li>• 3.3.2 Rótulos ou instruções (clareza de instruções e rótulos)</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-foreground text-sm mb-2">W3C COGA (Cognitive Accessibility)</p>
                        <p className="text-muted-foreground text-sm mb-2">
                          Heurísticas práticas para reduzir carga cognitiva:
                        </p>
                        <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                          <li>• Linguagem simples e direta</li>
                          <li>• Pistas redundantes além da cor</li>
                          <li>• Ícones familiares e compreensíveis</li>
                          <li>• Quebrar conteúdo em blocos e usar títulos claros</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-foreground">
                        <strong>Por que combinamos WCAG + COGA?</strong>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        A WCAG fornece requisitos objetivos e testáveis, enquanto a COGA traz boas práticas cognitivas
                        que aumentam a compreensibilidade. Nosso questionário cruza os dois, garantindo medição objetiva
                        sem perder o foco na usabilidade cognitiva — sempre limitada ao que é visível e verificável em
                        imagens estáticas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-5">
                    <h5 className="font-semibold text-foreground mb-2">Regras de citação (obrigatórias)</h5>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          Em cada critério, citar no máximo 2 itens de WCAG e 1 de COGA, apenas do nosso catálogo
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Proibido citar referências fora do catálogo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Se nada do catálogo se aplicar, escrever: WCAG: N/A; COGA: N/A</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Create Scenarios - Configuration */}
              <Card id="configuracao" className="border-2 border-primary/20 scroll-mt-20">
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
                      <CardDescription className="text-base">
                        Configure o cenário de teste (Etapa 1 de 2)
                      </CardDescription>
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
              <Card id="imagens" className="border-2 border-primary/20 scroll-mt-20">
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
              <Card id="gerenciar" className="border-2 border-primary/20 scroll-mt-20">
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

              <Card id="processo-avaliacao" className="border-2 border-accent/30 bg-accent/5 scroll-mt-20">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground shrink-0">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">Como funciona o Processo de Avaliação</CardTitle>
                      <CardDescription className="text-base">
                        Entenda como avaliamos múltiplas imagens e consolidamos os resultados
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Quando você adiciona múltiplas imagens a um cenário, cada uma é avaliada individualmente pela
                    inteligência artificial. Depois, consolidamos todos os resultados em um diagnóstico único que
                    identifica padrões e prioriza correções.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-4">Avaliação Individual por Imagem</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            1
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Análise Separada</p>
                            <p className="text-muted-foreground text-sm">
                              Cada imagem do cenário é avaliada separadamente pela IA, usando o mesmo questionário
                              gerado para a persona selecionada.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            2
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Pontuação por Critério</p>
                            <p className="text-muted-foreground text-sm mb-2">
                              Para cada imagem, a IA retorna uma avaliação detalhada com pontuações de 1 a 5 para cada
                              critério:
                            </p>
                            <div className="bg-muted/50 border border-border rounded-lg p-3 font-mono text-sm">
                              <p className="text-foreground">1. Contraste do Texto: 5</p>
                              <p className="text-foreground">2. Uso de Cor com Sinais Redundantes: 3</p>
                              <p className="text-foreground">3. Clareza de Ícones: 4</p>
                              <p className="text-muted-foreground">...</p>
                              <p className="text-foreground mt-2">Resumo Executivo: [análise detalhada]</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            3
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Armazenamento</p>
                            <p className="text-muted-foreground text-sm">
                              Cada resposta é salva como <code className="text-foreground">EvaluationResponse</code>,
                              vinculada à imagem específica. Isso permite visualizar o detalhe de cada tela
                              individualmente.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="font-semibold text-foreground text-lg mb-4">Consolidação dos Resultados</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            1
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Agregação de Dados</p>
                            <p className="text-muted-foreground text-sm">
                              Após avaliar todas as imagens, o sistema coleta todas as respostas daquela mesma avaliação
                              e extrai as notas de cada critério.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            2
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Identificação de Padrões</p>
                            <p className="text-muted-foreground text-sm">
                              A IA (ou código de agregação) identifica problemas e pontos positivos que se repetem em
                              múltiplas imagens. Por exemplo, se várias telas apresentam falta de "sinais redundantes"
                              ou "contraste de ícones baixo".
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            3
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Diagnóstico Único</p>
                            <p className="text-muted-foreground text-sm mb-2">
                              Um diagnóstico consolidado é gerado, contendo:
                            </p>
                            <ul className="space-y-1 text-muted-foreground text-sm ml-4">
                              <li>
                                • <strong className="text-foreground">Média geral</strong> das pontuações de todas as
                                telas
                              </li>
                              <li>
                                • <strong className="text-foreground">Critérios mais problemáticos</strong> que tiveram
                                pontuações baixas
                              </li>
                              <li>
                                • <strong className="text-foreground">Problemas recorrentes</strong> que apareceram em
                                mais de uma imagem
                              </li>
                              <li>
                                • <strong className="text-foreground">Prioridades de correção</strong> ordenadas por
                                impacto e frequência
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                            4
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Armazenamento do Resumo</p>
                            <p className="text-muted-foreground text-sm">
                              O diagnóstico consolidado é salvo diretamente na{" "}
                              <code className="text-foreground">Evaluation</code> (campo{" "}
                              <code className="text-foreground">SummaryContent</code>), não nas imagens individuais.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
                      <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Resultado Final
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        O cenário continua mostrando o <strong>detalhe por imagem</strong> (cada{" "}
                        <code>EvaluationResponse</code>), permitindo que você veja problemas específicos de cada tela.
                        Ao mesmo tempo, a <strong>avaliação consolidada</strong> mostra o{" "}
                        <strong>resumo geral do cenário</strong>, facilitando a identificação de padrões sistêmicos e a
                        priorização de melhorias que terão maior impacto na acessibilidade do projeto como um todo.
                      </p>
                    </div>

                    <div className="bg-muted/50 border border-border rounded-lg p-5">
                      <h5 className="font-semibold text-foreground mb-3">Exemplo de Consolidação</h5>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground mb-1">Cenário: "Fluxo de Checkout"</p>
                          <p className="text-muted-foreground">
                            5 imagens avaliadas (carrinho, endereço, pagamento, confirmação, sucesso)
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Padrões Identificados:</p>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Contraste de ícones baixo em 4 de 5 telas (média: 2.2)</li>
                            <li>• Falta de sinais redundantes além da cor em 3 telas</li>
                            <li>• Instruções claras presentes em todas as telas (média: 4.8)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Prioridade de Correção:</p>
                          <p className="text-muted-foreground">
                            1º Melhorar contraste de ícones (impacto alto, presente em 80% das telas)
                            <br />
                            2º Adicionar indicadores visuais além da cor (impacto médio, presente em 60% das telas)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Best Practices */}
          <section id="melhores-praticas" className="mb-16 scroll-mt-20">
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

          <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 md:p-12 text-center border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Pronto para começar?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Crie sua primeira persona e comece a avaliar a acessibilidade das suas aplicações hoje mesmo.
            </p>
            <Button size="lg" className="gap-2" onClick={() => router.push("/dashboard/profiles/create")}>
              Começar agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </section>
        </main>
      </div>
    </div>
  )
}
