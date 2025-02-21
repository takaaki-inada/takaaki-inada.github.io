import { Meta } from '@/components/meta';
import slideStore from '@/features/stores/slide';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DynamicPage({ id }: { id: string }) {
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      console.log('id:', id);
      slideStore.setState({ selectedSlideDocs: id });
      fetch(`/slides/${id}/slides.md`)
        .then(res => res.text())
        .then(md => {
          const frontmatterMatch = md.match(/^---([\s\S]*?)---/);
          let newTitle = null;
          let newDescription = null;
          if (frontmatterMatch) {
            const lines = frontmatterMatch[1].split('\n');
            let recordingDesc = false;
            for (const line of lines) {
              if (line.startsWith('title:')) {
                newTitle = line.replace(/^title:\s*/, '').replace(/^['"]|['"]$/g, '');
                recordingDesc = false;
              } else if (line.startsWith('description:')) {
                newDescription = line.replace(/^description:\s*/, '');
                recordingDesc = true;
              } else if (recordingDesc && /^[a-zA-Z0-9_-]+:\s/.test(line)) {
                recordingDesc = false;
              } else if (recordingDesc) {
                newDescription += '\n' + line;
              }
            }
          }
          setTitle(newTitle);
          setDescription(newDescription);
        });
    }
  }, [id]);

  useEffect(() => {
    router.push('/programs/');
  }, [router]);

  return (
    <div>
      <Meta title={title} description={description} />
    </div>
  );
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

