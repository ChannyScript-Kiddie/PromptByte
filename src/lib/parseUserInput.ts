const COMPONENT_SYNONYMS = {
  header: ["header", "title", "heading", "top bar"],
  button: ["button", "btn", "click", "submit"],
  footer: ["footer", "bottom bar", "foot"],
  card: ["card", "panel", "box"],
  navbar: ["navbar", "navigation", "menu", "nav"],
  popup: ["popup", "screen popup"],
  alert: ["alert", "warning", "notification"],
  hero: ["hero section", "hero"],
  sidebar: ["sidebar", "sidebar navigation", "sidebar menu"],
  login: ["login form", "login", "signup form", "signup"],
};

export function parseUserInput(prompt: string): {
  component: string;
  props: Record<string, any>;
} {
  const lower = prompt.toLowerCase();
  let component = null;
  let props: Record<string, any> = {};

  // First try exact match with database component names
  const exactMatch = Object.keys(COMPONENT_SYNONYMS).find((name) =>
    lower.includes(name)
  );

  if (exactMatch) {
    component = exactMatch;
  } else {
    // Fallback to synonym matching if no exact match
    for (const [type, synonyms] of Object.entries(COMPONENT_SYNONYMS)) {
      if (synonyms.some((syn) => lower.includes(syn))) {
        component = type;
        break;
      }
    }
  }

  // Handle styles as boolean flags
  const STYLES = ["rounded", "centered", "shadow", "bold", "italic"];
  STYLES.forEach((style) => {
    if (
      lower.includes(style) ||
      lower.includes(`make it ${style}`) ||
      lower.includes(`as ${style}`)
    ) {
      props[style] = true;
    }
  });

  return { component, props };
}
