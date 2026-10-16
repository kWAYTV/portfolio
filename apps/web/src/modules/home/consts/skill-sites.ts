import type { skills } from "@/modules/home/consts/skills";

type SkillTitle = (typeof skills)[number]["title"];

/** Official homepages. C's is the one WG14 links as the language homepage. */
export const skillSites = {
  Babel: "https://babeljs.io/",
  C: "https://www.c-language.org/",
  "C++": "https://isocpp.org/",
  Expo: "https://expo.dev/",
  Express: "https://expressjs.com/",
  Git: "https://git-scm.com/",
  Go: "https://go.dev/",
  "Godot Engine": "https://godotengine.org/",
  GreenSock: "https://gsap.com/",
  JavaScript: "https://tc39.es/",
  Lua: "https://www.lua.org/",
  "Next.js": "https://nextjs.org/",
  "Node.js": "https://nodejs.org/",
  Python: "https://www.python.org/",
  pino: "https://getpino.io/",
  React: "https://react.dev/",
  Redis: "https://redis.io/",
  Rust: "https://www.rust-lang.org/",
  "Socket.io": "https://socket.io/",
  Swift: "https://www.swift.org/",
  "Tailwind CSS": "https://tailwindcss.com/",
  "Three.js": "https://threejs.org/",
  TypeScript: "https://www.typescriptlang.org/",
} as const satisfies Record<SkillTitle, string>;
