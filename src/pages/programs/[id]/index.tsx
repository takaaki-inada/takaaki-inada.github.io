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
  // public/slidesにあるディレクトリを参照して、pathsをリストでパスを生成する
  const fs = require('fs');
  const path = require('path');
  const slidesDir = path.join(process.cwd(), 'public/slides');
  const slideDirs = fs.readdirSync(slidesDir);
  const paths = slideDirs.map((slideDir: string) => {
    return {
      params: {
        id: slideDir,
      },
    }
  })
  return {
    paths: paths,
    fallback: false,
  };
  // return {
  //   // Add your paths here
  //   paths: [
  //     { params: { id: '20240827' } },
  //     { params: { id: '20240830' } },
  //     { params: { id: '20240903' } },
  //     { params: { id: '20240910' } },
  //     { params: { id: '20240911' } },
  //     { params: { id: '20241002ex' } },
  //     { params: { id: '20241004ex' } },
  //     { params: { id: 'LT_podcast' } },
  //   ],
  //   fallback: false,
  // };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  // Fetch data for the given id
  return {
    props: {
      id: params.id,
    },
  };
}

