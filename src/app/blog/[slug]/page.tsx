import matter from "gray-matter";

export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = params;

  console.log(await getMarkdownFile(slug));

  return (
    <main>
      <h1>Hello, world!</h1>
      <p>Slug: {slug}</p>
    </main>
  );

  async function getMarkdownFile(blogSlug: string) {
    // "use server";

    // get slug from context

    const content = await import(`../../../posts/2024/${blogSlug}.md`);
    const data = matter(content.default);

    return data.data;

    // import gray matter config
    // return props: title, frontmatter and markdown
  }
}

// https://tina.io/blog/simple-markdown-blog-nextjs/
