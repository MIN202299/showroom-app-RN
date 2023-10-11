// util.js
import { Text } from 'react-native'

export function setCustomText() {
  const TextRender = Text.render

  const customStyle = {
    fontFamily: 'HarmonyOS-Sans',
    color: '#fff',
  }

  Text.render = function render(props, ...rest) {
    const mergedProps = { ...props, style: [customStyle, props.style] }
    return TextRender.apply(this, [mergedProps, ...rest])
  }
}
