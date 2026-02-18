import FloatingToolbar from '../ui/FloatingToolbar'
import { useTextStyle } from '../../hooks/useTextStyle'

/**
 * StyledTextarea
 * --------------
 * A drop-in replacement for a plain <textarea> that gains a FloatingToolbar
 * on focus. The toolbar lets the user choose a font and ink color — changes
 * apply ONLY to this specific textarea instance.
 *
 * Props
 * -----
 * All standard <textarea> props are forwarded, plus:
 *   initialFont   – optional starting fontFamily value
 *   initialColor  – optional starting textColor value
 *   className     – class string applied to the <textarea>
 *
 * Usage
 * -----
 *   <StyledTextarea
 *     value={text}
 *     onChange={(e) => setText(e.target.value)}
 *     placeholder="Write your notes..."
 *     rows={4}
 *     className="w-full bg-background/30 rounded-xl p-3 ..."
 *   />
 */
export default function StyledTextarea({
  className = '',
  initialFont,
  initialColor,
  onFocus,
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
      <textarea
        ref={inputRef}
        className={`outline-none resize-none transition-colors duration-200 ${className}`}
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
