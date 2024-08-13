import { lstatSync, readdirSync } from "fs";
import path from "path";

export interface MarkdownFileProps {
  default: {
    data: { [key: string]: string };
    content: string;
  };
}

export interface GetMarkdownFileProps {
  frontmatter: { [key: string]: string };
  markdownBody: string;
}

export const blogPostsPath = path.resolve(process.cwd(), "./src/posts/");

export function isFile(fileName: string) {
  return lstatSync(fileName).isFile();
}

export function formatPathAsUrl(filePath: string, fileType: string) {
  return path.basename(filePath, fileType).replace(/ /g, "-");
}

export function getBlogPosts(folderPath: string) {
  return readdirSync(folderPath, { recursive: true })
    .map((fileName: string | Buffer) => {
      return path.join(folderPath, fileName.toString());
    })
    .filter(isFile);
}

export function generateBlogPostUrls(folderPath: string) {
  return getBlogPosts(folderPath).map((filePath: string) => {
    return formatPathAsUrl(filePath, ".md").replace(/ /g, "-");
  });
}
