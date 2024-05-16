import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import path from "path";
import { readdirSync } from "fs";

export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { frontmatter, markdownBody } = await getMarkdownFile(slug);
  const { author, date, tags, title } = frontmatter;

  const blogPostsPath = path.resolve(process.cwd(), "./src/posts/2024");
  const files = readdirSync(blogPostsPath, { recursive: true });

  console.log(files);

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

  function getFileNames() {}
}

// https://tina.io/blog/simple-markdown-blog-nextjs/
