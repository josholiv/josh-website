import {
  k
} from "./chunk-EJ5P4D46.js";

// node_modules/@astrojs/preact/dist/static-html.js
var StaticHtml = ({ value, name, hydrate = true }) => {
  if (!value) return null;
  const tagName = hydrate ? "astro-slot" : "astro-static-slot";
  return k(tagName, { name, dangerouslySetInnerHTML: { __html: value } });
};
StaticHtml.shouldComponentUpdate = () => false;
var static_html_default = StaticHtml;

export {
  static_html_default
};
//# sourceMappingURL=chunk-V4UUEOLZ.js.map
