import { Meta } from '@/components/meta';
import slideStore from '@/features/stores/slide';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function DynamicPage({
  id,
  title,
  description,
}: {
  id: string;
  title?: string;
  description?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (id) {
      console.log('id:', id);
      slideStore.setState({ selectedSlideDocs: id });
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
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), `public/slides/${params.id}/slides.md`);
  let title: string | null = null;
  let description: string | null = null;
  let md = '';
  try {
    md = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading file:', filePath);
  }
  const frontmatterMatch = md.match(/^---([\s\S]*?)---/);
  if (frontmatterMatch) {
    const lines = frontmatterMatch[1].split('\n');
    let recordingDesc = false;
    for (const line of lines) {
      if (line.startsWith('title:')) {
        title = line.replace(/^title:\s*/, '').replace(/^['"]|['"]$/g, '');
        recordingDesc = false;
      } else if (line.startsWith('description:')) {
        description = line.replace(/^description:\s*/, '');
        recordingDesc = true;
      } else if (recordingDesc && /^[a-zA-Z0-9_-]+:\s/.test(line)) {
        recordingDesc = false;
      } else if (recordingDesc) {
        description += '\n' + line;
      }
    }
  } else {
    console.error('frontmatter not found:', filePath);
  }
  console.log('id:', params.id);
  console.log('title:', title);
  console.log('description:', description);
  return {
    props: {
      id: params.id,
      title,
      description,
    },
  };
}
