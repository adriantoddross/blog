import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import path from "path";
import { readdirSync, lstatSync } from "fs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const blogPostsPath = path.resolve(process.cwd(), "./src/posts/");
  const slugs = generatePostSlugs(blogPostsPath);

  return slugs.map((slug: string) => {
    return { slug };
  });
}

export default async function Home({ params }: { params: { slug: string } }) {
  // guide: https://tina.io/blog/simple-markdown-blog-nextjs/

  const { slug } = params;
  const { frontmatter, markdownBody } = await getMarkdownFile(slug);
  const { author, date, tags, title } = frontmatter;

  const blogPostsPath = path.resolve(process.cwd(), "./src/posts/");
  const postSlugs = generatePostSlugs(blogPostsPath);
  console.log(
    postSlugs.map((name: string) => {
      return { slug: name };
    })
  );

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
}

async function getMarkdownFile(blogSlug: string) {
  try {
    const content = await import(`../../../posts/2024/${blogSlug}.md`);
    const data = matter(content.default);

    return {
      frontmatter: data.data,
      markdownBody: data.content,
    };
  } catch (error) {
    notFound();
  }
}

function generatePostSlugs(folderPath: string) {
  function isFile(fileName: string) {
    return lstatSync(fileName).isFile();
  }

  return readdirSync(folderPath, { recursive: true })
    .map((fileName: string | Buffer) => {
      return path.join(folderPath, fileName.toString());
    })
    .filter(isFile)
    .map((filePath: string) => {
      return path.basename(filePath, ".md").replace(/ /g, "-");
    });
}
