import fs from "node:fs";
import path from "node:path";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

const FRONTMATTER_REGEX = /---\s*([\s\S]*?)\s*---/;
const QUOTE_STRIP_REGEX = /^['"](.*)['"]$/;

function parseFrontmatter(fileContent: string) {
  const match = FRONTMATTER_REGEX.exec(fileContent);
  const frontMatterBlock = match?.[1];
  if (!frontMatterBlock) {
    throw new Error("Invalid frontmatter");
  }
  const content = fileContent.replace(FRONTMATTER_REGEX, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  for (const line of frontMatterLines) {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(QUOTE_STRIP_REGEX, "$1");
    metadata[key.trim() as keyof Metadata] = value;
  }

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "src", "content", "posts"));
}
