import React, { useState } from "react";
import { fetchComponentByName } from "@/integrations/supabase/supabaseClient";
import { CodeDisplay } from "./CodeDisplay";

export default function ComponentFetcher({ name, props = {} }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [component, setComponent] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetchComponentByName(name)
      .then((data) => {
        setComponent(data);
      })
      .catch((err) => {
        setError(err.message || "Error fetching component");
      })
      .finally(() => setLoading(false));
  }, [name]);

  function renderCode(code, props) {
    let rendered = code;
    rendered = rendered.replace(/{{(\w+)}}/g, (_, key) => {
      return props[key] !== undefined ? props[key] : "";
    });
    return rendered;
  }

  if (loading) return <div className="p-4 text-accent">Loading...</div>;
  if (error) return <div className="p-4 text-destructive">{error}</div>;
  if (!component) {
    return (
      <div className="p-4 text-muted-foreground">
        I couldn’t find that. Available components: header, navbar, button,
        footer.
      </div>
    );
  }

  return (
    <CodeDisplay
      code={renderCode(component.code, props)}
      language={
        component.framework === "react" ? "jsx" : component.framework || "html"
      }
      title={component.name}
    />
  );
}
