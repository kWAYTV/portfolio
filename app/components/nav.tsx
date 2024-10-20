import { Link } from "next-view-transitions";
import React from "react";
import { HomeIcon, GitHubIcon, BlogIcon } from "@/components/icons";

const navItems = {
	"/": {
		name: "home",
		icon: HomeIcon,
	},
	"/blog": {
		name: "blog",
		icon: BlogIcon,
	},
	"https://github.com/kWAYTV": {
		name: "github",
		icon: GitHubIcon,
	},
};

export function Navbar() {
	return (
		<aside className="-ml-[8px] mb-16 tracking-tight">
			<div className="lg:sticky lg:top-20">
				<nav
					className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
					id="nav"
				>
					<div className="flex flex-row space-x-0 pr-10">
						{Object.entries(navItems).map(([path, { name, icon: Icon }]) => {
							return (
								<Link
									key={path}
									href={path}
									className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center relative py-1 px-2 m-1 group"
								>
									<span className="mr-2 w-4 h-4 inline-flex items-center justify-center">
										<Icon />
									</span>
									<span className="group-hover:underline">{name}</span>
								</Link>
							);
						})}
					</div>
				</nav>
			</div>
		</aside>
	);
}
