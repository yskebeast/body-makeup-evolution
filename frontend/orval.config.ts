import { defineConfig } from "orval";

export default defineConfig({
  bodyMakeupEvolution: {
    input: "../schemas/openapi.2.0.yaml",
    output: {
      httpClient: "fetch",
      target: "./src/api/tags/",
      schemas: "./src/api/models/",
      client: "react-query",
      mode: "tags-split",
      clean: true, // Clean the output directory before generating new files
      override: {
        fetch: {
          // Set to true if you want to access headers, status, etc.
          // If false, only the response body will be returned.
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
