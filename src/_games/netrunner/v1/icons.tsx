
import { IconBaseProps } from 'react-icons';
import * as io5 from 'react-icons/io5';

export default function iconFor(iconKey: string, extraProps?: IconBaseProps) {
  const props = { style: { display: "unset" }, ...extraProps }
  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "star": return <io5.IoStar {...props} />
    default:
      return <span>X</span>
  }
}