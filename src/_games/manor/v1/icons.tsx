
import { IconBaseProps } from 'react-icons';
import * as io5 from 'react-icons/io5';
import * as gi from 'react-icons/gi';

export default function iconFor(iconKey: string, extraProps?: IconBaseProps) {
  const props = { style: { display: "unset" }, ...extraProps }
  switch (iconKey.toLowerCase().replaceAll("`", "")) {
    case "star": return <io5.IoStar {...props} />
    case "ecto": return <gi.GiAbstract013 {...props} />
    case "fear": return <gi.GiGhost {...props} />
    case "lurk": return <gi.GiSunkenEye {...props} />
    case "lurk2": return <gi.GiEvilEyes {...props} />
    default:
      return <span>⚠️</span>
  }
}