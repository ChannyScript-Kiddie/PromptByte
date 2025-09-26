const COMPONENT_SYNONYMS = {
  header: ["header", "title", "heading", "top bar"],
  button: ["button", "btn", "click", "submit"],
  footer: ["footer", "bottom bar", "foot"],
  card: ["card", "panel", "box"],
  navbar: ["navbar", "navigation", "menu", "nav"],
};

// Common property patterns that could appear in any component
const PROPERTY_PATTERNS = {
  text: [
    // Matches: "with text Hello", "text: Hello", "saying Hello"
    {
      pattern: /(?:with\s+)?text\s*[:=]?\s*["']?([^"',]+)["']?/i,
      prop: "text",
    },
    { pattern: /saying\s+["']?([^"',]+)["']?/i, prop: "text" },
    { pattern: /labeled\s+["']?([^"',]+)["']?/i, prop: "text" },
  ],
  title: [
    // Matches: "with title Hello", "titled Hello", "called Hello"
    {
      pattern: /(?:with\s+)?title\s*[:=]?\s*["']?([^"',]+)["']?/i,
      prop: "title",
    },
    { pattern: /titled\s+["']?([^"',]+)["']?/i, prop: "title" },
    { pattern: /called\s+["']?([^"',]+)["']?/i, prop: "title" },
  ],
  color: [
    // Matches: "in red", "red button", "color: blue"
    {
      pattern:
        /(?:in|with|color:?\s+)(red|blue|green|yellow|purple|orange|gray|black|white)/i,
      prop: "color",
    },
  ],
  size: [
    // Matches: "large button", "small card", "size: medium"
    {
      pattern: /(?:size:?\s+)?(small|medium|large|xs|sm|md|lg|xl)/i,
      prop: "size",
    },
  ],
  items: [
    // Matches: "with items Home, About", "containing X, Y, Z"
    {
      pattern: /(?:with items|containing|menu:?)\s+([^.]+)/i,
      prop: "items",
      transform: (match) =>
        match
          .split(/,|\sand\s/)
          .map((item) => item.trim())
          .filter(Boolean),
    },
  ],
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

  // Dynamic property detection
  Object.entries(PROPERTY_PATTERNS).forEach(([key, patterns]) => {
    patterns.forEach(({ pattern, prop, transform }) => {
      const match = prompt.match(pattern);
      if (match) {
        const value = transform ? transform(match[1]) : match[1];
        props[prop] = value;
      }
    });
  });

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
