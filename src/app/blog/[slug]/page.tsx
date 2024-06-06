import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import path from "path";
import { readdirSync, lstatSync } from "fs";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = generateBlogPostUrls(blogPostsPath);

  return slugs.map((slug: string) => {
    return { slug };
  });
}

export default async function Home({ params }: { params: { slug: string } }) {
  // guide: https://tina.io/blog/simple-markdown-blog-nextjs/

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
}

async function getMarkdownFile(slug: string) {
  const blogPostPaths = generateBlogsMap(blogPostsPath);
  console.log("generateBlogsMap", blogPostPaths.get(slug));

  try {
    const markdownFile = await import(`../../../posts/2024/${slug}.md`);
    // TODO: Dynamic import path?
    // Import fails when using ternary statements

    const markdownContent = matter(markdownFile.default);
    const { data, content } = markdownContent;

    if (data && content) {
      return {
        frontmatter: data,
        markdownBody: content,
      };
    }

    return null;
  } catch (error) {
    return notFound();
  }
}

const blogPostsPath = path.resolve(process.cwd(), "./src/posts/");

function isFile(fileName: string) {
  return lstatSync(fileName).isFile();
}

function formatPathAsUrl(filePath: string, fileType: string) {
  return path.basename(filePath, fileType).replace(/ /g, "-");
}

function getBlogPosts(folderPath: string) {
  return readdirSync(folderPath, { recursive: true })
    .map((fileName: string | Buffer) => {
      return path.join(folderPath, fileName.toString());
    })
    .filter(isFile);
}

function generateBlogPostUrls(folderPath: string) {
  return getBlogPosts(folderPath).map((filePath: string) => {
    return formatPathAsUrl(filePath, ".md").replace(/ /g, "-");
  });
}

function generateBlogsMap(folderPath: string) {
  const blogsMap: Map<string, string> = new Map();
  const blogPostPaths = getBlogPosts(folderPath);

  blogPostPaths.forEach((filePath) => {
    blogsMap.set(
      formatPathAsUrl(filePath, ".md"),
      path.relative(folderPath, filePath.toString())
    );
  });

  return blogsMap;
}
