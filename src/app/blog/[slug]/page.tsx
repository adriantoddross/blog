import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import path from "path";
import { readdirSync, lstatSync } from "fs";

export default async function Home({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { frontmatter, markdownBody } = await getMarkdownFile(slug);
  const { author, date, tags, title } = frontmatter;

  const blogPostsPath = path.resolve(process.cwd(), "./src/posts/");
  console.log(getFileNames(blogPostsPath));

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

    // TODO: throw 404 page for bad slug

    return {
      frontmatter: data.data,
      markdownBody: data.content,
    };
  }

  function getFileNames(folderPath: string) {
    function isFile(fileName: string) {
      return lstatSync(fileName).isFile();
    }

    return readdirSync(folderPath, { recursive: true })
      .map((fileName: string | Buffer) => {
        return path.join(folderPath, fileName.toString());
      })
      .filter(isFile)
      .map((filePath: string) => {
        return path.basename(filePath);
        // TODO: format the filenames into URL
      });

    // return array of strings
  }
}

// https://tina.io/blog/simple-markdown-blog-nextjs/
