/** Placeholder source code for IDE code view. UI only, no portfolio logic. */

export const welcomeCode = `export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <p>Welcome</p>
    </main>
  );
}`;

export const aboutCode = `# About

> A bit about me

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

## Experience

### Example Co — *2020 - Present*
Software Engineer

### Acme Inc — *2018 - 2020*
Junior Developer`;

export const projectsCode = `interface Project {
  name: string;
  description: string | null;
  url: string;
}

const projects: Project[] = [
  {
    name: "Example",
    description: "A sample project",
    url: "https://example.com",
  },
];

export function getProjects(): Project[] {
  return projects;
}`;
