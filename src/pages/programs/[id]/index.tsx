import slideStore from '@/features/stores/slide';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DynamicPage({ id }: { id: string }) {
  const router = useRouter();
  if (id) {
    console.log('id', id);
    slideStore.setState({ selectedSlideDocs: id });
  }

  useEffect(() => {
    router.push('/programs/');
  }, []);

  return null;
}

export async function getStaticPaths() {
  return {
     // Add your paths here
    paths: [
      { params: { id: '20240827' } },
      { params: { id: '20240830' } },
      { params: { id: '20240903' } },
      { params: { id: '20240910' } },
      { params: { id: '20240911' } },
      { params: { id: '20241002ex' } },
      { params: { id: 'LT_podcast' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  // Fetch data for the given id
  return {
    props: {
      id: params.id,
    },
  };
}

