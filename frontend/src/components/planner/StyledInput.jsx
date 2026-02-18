import FloatingToolbar from '../ui/FloatingToolbar'
import { useTextStyle } from '../../hooks/useTextStyle'

/**
 * StyledInput
 * -----------
 * Same concept as StyledTextarea but for single-line <input> elements.
 * Each instance manages its own font + ink color independently.
 *
 * Props
 * -----
 * All standard <input> props forwarded, plus:
 *   initialFont   – optional starting fontFamily
 *   initialColor  – optional starting textColor
 *   className     – applied to the <input>
 */
export default function StyledInput({
  className = '',
  initialFont,
  initialColor,
  onFocus,
  type = 'text',
  ...rest
}) {
  const {
    textStyle,
    toolbarVisible,
    inputRef,
    handleFocus,
    handleStyleChange,
    closeToolbar,
  } = useTextStyle({
    ...(initialFont  ? { fontFamily: initialFont  } : {}),
    ...(initialColor ? { textColor:  initialColor } : {}),
  })

  return (
    <>
      <input
        ref={inputRef}
        type={type}
        className={`outline-none transition-colors duration-200 ${className}`}
        style={{
          fontFamily: textStyle.fontFamily,
          color:      textStyle.textColor,
        }}
        onFocus={(e) => {
          handleFocus()
          onFocus?.(e)
        }}
        {...rest}
      />

      <FloatingToolbar
        anchorEl={inputRef.current}
        visible={toolbarVisible}
        textStyle={textStyle}
        onStyleChange={handleStyleChange}
        onClose={closeToolbar}
      />
    </>
  )
}
