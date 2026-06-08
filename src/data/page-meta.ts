/** Single source of truth for static page metadata used in banners and social cards. */

/** Short tagline shown in the footer and index page banner. */
export const TAGLINE = "Incoming PhD student • Amateur triathlete • 3D printing enthusiast";

export const PAGE_META: Record<string, { title: string; description: string }> = {
  home:      { title: "Josh Olivier",              description: TAGLINE },
  about:     { title: "Josh Olivier - About",      description: "My background, research interests, and what I'm up to." },
  blog:      { title: "Josh Olivier - Blog",       description: "My digital garden, with posts on research, travel, triathlons, 3D printing, and more." },
  bookshelf: { title: "Josh Olivier - Bookshelf",  description: "A collection of recent books I've read." },
  cv:        { title: "Josh Olivier - CV",         description: "My academic and professional history." },
  contact:   { title: "Josh Olivier - Contact",    description: "Get in touch or connect with me on social media." },
};
