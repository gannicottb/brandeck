import ReactMarkdown from "react-markdown"
import iconFor from "./icons"

export function MarkdownWithIcons(
  { content, iconFn }: { content: string, iconFn?: (s: string) => JSX.Element },
) {
  // Make it possible to pass a different iconFn so we can pass different props to an icon
  const iconFnSafe = iconFn ? iconFn : iconFor
  return (<ReactMarkdown
    components={{
      code(props) {
        //Get the value of what's in the backticks, pass that to iconFor
        const { children } = props
        return iconFnSafe(String(children))
      }
    }}
  >{content}</ReactMarkdown>)
}