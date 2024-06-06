import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import {
  GetMarkdownFileProps,
  MarkdownFileProps,
  blogPostsPath,
  generateBlogPostUrls,
} from "./helpers";

export async function generateStaticParams() {
  const slugs = generateBlogPostUrls(blogPostsPath);
  return slugs.map((slug: string) => {
    return { slug };
  });
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const markdownFile = await getMarkdownFile(slug);

  return (
    <main>
      {markdownFile?.frontmatter ? (
        <>
          <h1>{markdownFile.frontmatter.title}</h1>
          <p>{markdownFile.frontmatter.date}</p>
          <p>{markdownFile.frontmatter.tags}</p>
          <p>{markdownFile.frontmatter.author}</p>
          <p>Slug: {slug}</p>
        </>
      ) : null}

      {markdownFile?.markdownBody ? (
        <ReactMarkdown>{markdownFile.markdownBody}</ReactMarkdown>
      ) : null}
    </main>
  );
}

async function getMarkdownFile(
  slug: string
): Promise<GetMarkdownFileProps | null> {
  try {
    // TODO: Rename posts folder, remove 2024
    // Add date to MarkdownFileProps type

    return await import(`../../../posts/2024/${slug}.md`).then(
      (importedFile: MarkdownFileProps) => {
        const { data, content } = matter(importedFile?.default);

        if (data && content) {
          return {
            frontmatter: data,
            markdownBody: content,
          };
        }
        return null;
      }
    );
  } catch (error) {
    return notFound();
  }
}
