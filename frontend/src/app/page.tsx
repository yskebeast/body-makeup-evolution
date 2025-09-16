import Link from "next/link";

const getSamplePages = () => {
  const samplePages = [
    {
      path: "/samples/csr",
      name: "CSR Sample",
      description: "Client Side Rendering example",
    },
    {
      path: "/samples/ssr",
      name: "SSR Sample",
      description: "Server Side Rendering example",
    },
    {
      path: "/samples/zod",
      name: "Zod Validation Sample",
      description: "Zod schema validation example using Pet Store API",
    },
  ];

  return samplePages;
};

export default function Home() {
  const samplePages = getSamplePages();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Body Makeup Evolution</h1>
        <p className="text-gray-600 text-lg">Frontend Application Samples</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {samplePages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="block p-6 bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow hover:border-blue-300"
          >
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {page.name}
              </h2>
              <p className="text-gray-600 text-sm">{page.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                View Sample
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
