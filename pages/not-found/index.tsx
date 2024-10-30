import { GetServerSideProps } from 'next'
import { NotFound } from '~/components/pages/NotFound/NotFound'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}

export default NotFound
