import ReactMarkdown from "react-markdown"
import iconFor from "./icons"

export function MarkdownWithIcons({ content }: { content: string }) {
  return (<ReactMarkdown
    components={{
      code(props) {
        //Get the value of what's in the backticks, pass that to iconFor
        const { children } = props
        return iconFor(String(children))
      }
    }}
  >{content}</ReactMarkdown>)
}