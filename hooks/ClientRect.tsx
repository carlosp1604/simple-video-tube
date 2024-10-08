import { Ref, useCallback, useState } from 'react'

export const useClientRect = (): [Ref<HTMLElement>, DOMRect | null] => {
  const [rect, setRect] = useState<DOMRect | null>(null)

  const ref = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])

  return [ref, rect]
}
