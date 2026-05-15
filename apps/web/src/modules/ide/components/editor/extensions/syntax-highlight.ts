import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--syntax-keyword)" },
  { tag: tags.controlKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.moduleKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.operatorKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.definitionKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.string, color: "var(--syntax-string)" },
  { tag: tags.special(tags.string), color: "var(--syntax-string)" },
  { tag: tags.comment, color: "var(--syntax-comment)" },
  { tag: tags.lineComment, color: "var(--syntax-comment)" },
  { tag: tags.blockComment, color: "var(--syntax-comment)" },
  { tag: tags.number, color: "var(--syntax-number)" },
  { tag: tags.integer, color: "var(--syntax-number)" },
  { tag: tags.float, color: "var(--syntax-number)" },
  { tag: tags.bool, color: "var(--syntax-number)" },
  { tag: tags.typeName, color: "var(--syntax-type)" },
  { tag: tags.className, color: "var(--syntax-type)" },
  { tag: tags.definition(tags.typeName), color: "var(--syntax-type)" },
  {
    tag: tags.function(tags.variableName),
    color: "var(--syntax-function)",
  },
  {
    tag: tags.definition(tags.function(tags.variableName)),
    color: "var(--syntax-function)",
  },
  { tag: tags.tagName, color: "var(--syntax-tag)" },
  { tag: tags.angleBracket, color: "var(--syntax-tag)" },
  { tag: tags.attributeName, color: "var(--syntax-attribute)" },
  { tag: tags.propertyName, color: "var(--syntax-attribute)" },
  {
    tag: tags.definition(tags.propertyName),
    color: "var(--syntax-attribute)",
  },
  { tag: tags.punctuation, color: "var(--syntax-punctuation)" },
  { tag: tags.operator, color: "var(--syntax-punctuation)" },
  { tag: tags.variableName, color: "var(--foreground)" },
  { tag: tags.heading, color: "var(--syntax-keyword)", fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.link, color: "var(--syntax-function)" },
  { tag: tags.url, color: "var(--syntax-string)" },
]);

export const syntaxHighlight = syntaxHighlighting(highlight);
