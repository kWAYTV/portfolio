export type SocialIcon = "github" | "twitter" | "linkedin" | "fileText";

export const socialLinks: ReadonlyArray<{
  href: string;
  icon: SocialIcon;
  text: string;
}> = [
  { href: "https://github.com/kWAYTV", icon: "github", text: "github" },
  { href: "https://twitter.com/ogeperc", icon: "twitter", text: "twitter" },
  {
    href: "https://linkedin.com/in/mvnieto",
    icon: "linkedin",
    text: "linkedin",
  },
  {
    href: "https://gitroll.io/profile/uezq54oxIk4VFZkLigfxGmGgm57z1",
    icon: "fileText",
    text: "resume",
  },
];
