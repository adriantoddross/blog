export default function Home({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <main>
      <h1>Hello, world!</h1>
      <p>Slug: {slug}</p>
    </main>
  );

  async function getBlogPost() {
    "use server";
    // get slug from context
    // import gray matter config
    // return props: title, frontmatter and markdown
  }
}
