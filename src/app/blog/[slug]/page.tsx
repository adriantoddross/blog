import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { frontmatter, markdownBody } = await getMarkdownFile(slug);
  const { author, date, tags, title } = frontmatter;

  return (
    <main>
      <h1>{title}</h1>
      <p>{date}</p>
      <p>{tags}</p>
      <p>{author}</p>
      <p>Slug: {slug}</p>
      <ReactMarkdown>{markdownBody}</ReactMarkdown>
    </main>
  );

  async function getMarkdownFile(blogSlug: string) {
    const content = await import(`../../../posts/2024/${blogSlug}.md`);
    const data = matter(content.default);

    return {
      frontmatter: data.data,
      markdownBody: data.content,
    };
  }
}

// https://tina.io/blog/simple-markdown-blog-nextjs/
