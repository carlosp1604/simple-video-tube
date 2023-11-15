import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { ParsedUrlQuery } from 'querystring'

export interface QueryItem {
  key: string
  value: string
}

export function useUpdateQuery () {
  const { push, query, pathname } = useRouter()

  return useCallback(
    async (items: QueryItem[]): Promise<void> => {
      const newQuery: ParsedUrlQuery = {}

      items.forEach((item) => {
        const param = query[item.key]

        if (param && param === item.value) {
          return
        }

        newQuery[item.key] = item.value
      })

      await push({
        pathname,
        query: newQuery,
      }, undefined, { shallow: true, scroll: false })
    },
    [query, pathname]
  )
}
