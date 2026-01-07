"use client"

import { cn } from "@/lib/utils";
import React from "react";
import type { JSX } from "react/jsx-runtime"; // Import JSX to fix the undeclared variable error

interface MarkdownRendererProps {
  content: string
  className?: string
  variant?: "default" | "compact" | "rich"
}

export function MarkdownRenderer({ content, className, variant = "default" }: MarkdownRendererProps) {
  // Simple markdown parser for common elements
  const parseMarkdown = (text: string) => {
    if (!text) return []

    const lines = text.split("\n")
    const elements: JSX.Element[] = []
    let currentList: string[] = []
    let listType: "ul" | "ol" | null = null

    const parseTableRow = (row: string) => {
      const cells = row.trim().split("|")
      if (cells.length > 0 && cells[0].trim() === "") {
        cells.shift()
      }
      if (cells.length > 0 && cells[cells.length - 1].trim() === "") {
        cells.pop()
      }
      return cells.map((cell) => cell.trim())
    }

    const isSeparatorRow = (row: string) => {
      const cells = parseTableRow(row)
      if (cells.length === 0) return false
      return cells.every((cell) => /^:?-{3,}:?$/.test(cell))
    }

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListComponent = listType === "ul" ? "ul" : "ol"
        elements.push(
          <ListComponent
            key={elements.length}
            className={cn(
              "space-y-1 ml-4",
              variant === "compact" ? "text-sm" : "",
              listType === "ul" ? "list-disc" : "list-decimal",
            )}
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ListComponent>,
        )
        currentList = []
        listType = null
      }
    }

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      const trimmed = line.trim()

      if (trimmed.includes("|") && index + 1 < lines.length && isSeparatorRow(lines[index + 1])) {
        flushList()
        const headerCells = parseTableRow(line)
        const separatorCells = parseTableRow(lines[index + 1])
        const alignments = separatorCells.map((cell) => {
          const starts = cell.startsWith(":")
          const ends = cell.endsWith(":")
          if (starts && ends) return "center"
          if (ends) return "right"
          if (starts) return "left"
          return "left"
        })
        const bodyRows: string[][] = []
        index += 2
        while (index < lines.length) {
          const rowLine = lines[index]
          if (!rowLine.trim() || !rowLine.includes("|")) {
            break
          }
          bodyRows.push(parseTableRow(rowLine))
          index += 1
        }
        index -= 1

        elements.push(
          <div key={`table-${index}`} className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {headerCells.map((cell, cellIndex) => (
                    <th
                      key={`th-${cellIndex}`}
                      className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-800"
                      style={{ textAlign: alignments[cellIndex] || "left" }}
                    >
                      {parseInlineMarkdown(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIndex) => (
                  <tr key={`tr-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`td-${rowIndex}-${cellIndex}`}
                        className="border border-gray-200 px-3 py-2 text-gray-700"
                        style={{ textAlign: alignments[cellIndex] || "left" }}
                      >
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
        continue
      }

      // Headers
      if (trimmed.startsWith("# ")) {
        flushList()
        elements.push(
          <h1
            key={index}
            className={cn("text-2xl font-bold mb-4 text-gray-900", variant === "compact" && "text-xl mb-2")}
          >
            {parseInlineMarkdown(trimmed.slice(2))}
          </h1>,
        )
      } else if (trimmed.startsWith("## ")) {
        flushList()
        elements.push(
          <h2
            key={index}
            className={cn("text-xl font-semibold mb-3 text-gray-800", variant === "compact" && "text-lg mb-2")}
          >
            {parseInlineMarkdown(trimmed.slice(3))}
          </h2>,
        )
      } else if (trimmed.startsWith("### ")) {
        flushList()
        elements.push(
          <h3
            key={index}
            className={cn("text-lg font-medium mb-2 text-gray-700", variant === "compact" && "text-base mb-1")}
          >
            {parseInlineMarkdown(trimmed.slice(4))}
          </h3>,
        )
      }
      // Unordered lists
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (listType !== "ul") {
          flushList()
          listType = "ul"
        }
        currentList.push(trimmed.slice(2))
      }
      // Ordered lists
      else if (/^\d+\.\s/.test(trimmed)) {
        if (listType !== "ol") {
          flushList()
          listType = "ol"
        }
        currentList.push(trimmed.replace(/^\d+\.\s/, ""))
      }
      // Blockquotes
      else if (trimmed.startsWith("> ")) {
        flushList()
        elements.push(
          <blockquote
            key={index}
            className={cn(
              "border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 text-gray-700 italic",
              variant === "compact" && "text-sm py-1",
            )}
          >
            {parseInlineMarkdown(trimmed.slice(2))}
          </blockquote>,
        )
      }
      // Code blocks
      else if (trimmed.startsWith("```")) {
        flushList()
        // Simple code block handling - in a real implementation you'd want proper parsing
        elements.push(
          <div
            key={index}
            className={cn(
              "bg-gray-100 rounded-md p-3 font-mono text-sm border",
              variant === "compact" && "p-2 text-xs",
            )}
          >
            <code className="text-gray-800">{trimmed.replace(/```\w*/, "").replace(/```$/, "")}</code>
          </div>,
        )
      }
      // Horizontal rules
      else if (trimmed === "---" || trimmed === "***") {
        flushList()
        elements.push(<hr key={index} className="my-6 border-gray-300" />)
      }
      // Regular paragraphs
      else if (trimmed) {
        flushList()
        elements.push(
          <p key={index} className={cn("mb-4 leading-relaxed text-gray-700", variant === "compact" && "mb-2 text-sm")}>
            {parseInlineMarkdown(trimmed)}
          </p>,
        )
      }
      // Empty lines
      else if (trimmed === "") {
        flushList()
        elements.push(<div key={index} className="h-2" />)
      }
    }

    flushList() // Flush any remaining list
    return elements
  }

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Handle inline formatting
    let result: React.ReactNode = text

    // Bold text **text** or __text__
    result = text.split(/(\*\*.*?\*\*|__.*?__)/g).map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith("__") && part.endsWith("__")) {
        return (
          <strong key={idx} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })

    // Italic text *text* or _text_
    if (typeof result === "string") {
      result = result.split(/(\*.*?\*|_.*?_)/g).map((part, idx) => {
        if (
          (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) ||
          (part.startsWith("_") && part.endsWith("_") && !part.startsWith("__"))
        ) {
          return (
            <em key={idx} className="italic">
              {part.slice(1, -1)}
            </em>
          )
        }
        return part
      })
    }

    // Inline code `code`
    if (Array.isArray(result)) {
      result = result.flatMap((item, idx) => {
        if (typeof item === "string") {
          return item.split(/(`.*?`)/g).map((part, subIdx) => {
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code key={`${idx}-${subIdx}`} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                  {part.slice(1, -1)}
                </code>
              )
            }
            return part
          })
        }
        return item
      })
    }

    return result
  }

  const elements = parseMarkdown(content)

  return (
    <div
      className={cn(
        "prose prose-gray max-w-none",
        variant === "rich" && "prose-lg",
        variant === "compact" && "prose-sm",
        className,
      )}
    >
      {elements}
    </div>
  )
}

// Enhanced markdown editor component
interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showPreview?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite seu conteúdo em markdown...",
  className,
  showPreview = true,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit")

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {showPreview && (
        <div className="flex border-b bg-gray-50">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "edit"
                ? "bg-white border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "preview"
                ? "bg-white border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            Visualizar
          </button>
        </div>
      )}

      <div className="min-h-[200px]">
        {activeTab === "edit" || !showPreview ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[200px] p-4 border-0 resize-none focus:outline-none focus:ring-0"
          />
        ) : (
          <div className="p-4 min-h-[200px]">
            {value ? (
              <MarkdownRenderer content={value} variant="default" />
            ) : (
              <p className="text-gray-500 italic">Nada para visualizar ainda...</p>
            )}
          </div>
        )}
      </div>

      {activeTab === "edit" && (
        <div className="border-t bg-gray-50 px-4 py-2">
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span>
              <strong>**negrito**</strong>
            </span>
            <span>
              <em>*itálico*</em>
            </span>
            <span>
              <code>`código`</code>
            </span>
            <span># Título</span>
            <span>- Lista</span>
            <span>&gt; Citação</span>
          </div>
        </div>
      )}
    </div>
  )
}
