import { notFound } from 'next/navigation';

import { baseUrl } from '@/app/sitemap';
import { CustomMDX } from '@/components/core/blog/mdx';
import { getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map(post => ({
    slug: post.slug
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = getBlogPosts().find(post => post.slug === params.slug);

  if (!post) {
    return {
      title: 'Blog',
      description: 'Blog'
    };
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image
  } = post.metadata;
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

export default async function Blog(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = getBlogPosts().find(post => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio'
            }
          })
        }}
      />
      <h1 className='title text-2xl font-semibold tracking-tighter'>
        {post.metadata.title}
      </h1>
      <div className='mt-2 mb-8 flex items-center justify-between text-sm'>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className='prose'>
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
