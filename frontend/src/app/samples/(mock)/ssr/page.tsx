import { Suspense } from "react";
import { petsListPets } from "@/api/endpoints/pets/pets";
import { toysListToys } from "@/api/endpoints/pets-toys/pets-toys";
import type { Pet, Toy } from "@/api/models";

// Server-side test status component
async function MockServerStatus() {
  // Intentional delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let testResults = {
    pets: { list: false },
    toys: { list: false },
    serverStatus: "inactive" as "active" | "inactive",
  };

  try {
    // Test 1: List pets
    const pets = await petsListPets();
    const petsListTest = Array.isArray(pets) && pets.length >= 0;

    // Test 2: Get toys for first pet (if exists)
    let toysListTest = false;
    if (pets && pets.length > 0) {
      try {
        const toys = await toysListToys(pets[0].id);
        toysListTest = Array.isArray(toys) && toys.length >= 0;
      } catch (e) {
        console.log("Toys test failed:", e);
      }
    }

    testResults = {
      pets: { list: petsListTest },
      toys: { list: toysListTest },
      serverStatus: petsListTest ? "active" : "inactive",
    };
  } catch (error) {
    console.error("SSR Mock server test failed:", error);
  }

  return (
    <div
      className={`border rounded-lg p-4 ${
        testResults.serverStatus === "active"
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center mb-2">
        <div
          className={`w-3 h-3 rounded-full mr-3 ${
            testResults.serverStatus === "active"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        ></div>
        <span
          className={`font-medium ${
            testResults.serverStatus === "active"
              ? "text-green-800"
              : "text-red-800"
          }`}
        >
          SSR Mock Server Status: {testResults.serverStatus.toUpperCase()}
        </span>
      </div>
      <p
        className={`text-sm ${
          testResults.serverStatus === "active"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {testResults.serverStatus === "active"
          ? "Server-side mock endpoints are working correctly"
          : "Server-side mock endpoints failed to respond"}
      </p>

      {/* Test Results Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white bg-opacity-70 rounded p-3">
          <h4 className="font-medium text-gray-900 mb-2">Pets API Tests</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>GET /pets</span>
              <span
                className={
                  testResults.pets.list ? "text-green-600" : "text-red-600"
                }
              >
                {testResults.pets.list ? "PASS" : "FAIL"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-70 rounded p-3">
          <h4 className="font-medium text-gray-900 mb-2">Toys API Tests</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>GET /pets/:id/toys</span>
              <span
                className={
                  testResults.toys.list ? "text-green-600" : "text-red-600"
                }
              >
                {testResults.toys.list ? "PASS" : "FAIL"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Server Component for fetching and displaying pets
async function PetsServerData() {
  // Intentional delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const pets: Pet[] = await petsListPets();

    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Server-Rendered Pets Data
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {pets.length} pets fetched on server at build/request time
          </p>
        </div>

        {pets.length > 0 ? (
          <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {pets.map((pet: Pet) => (
              <div key={pet.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-lg">
                        {pet.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {pet.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {pet.age} years old - {pet.kind}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Server-rendered
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">ID: {pet.id}</span>
                    <p className="text-xs text-gray-400 mt-1">
                      Generated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🐕</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pets found
            </h3>
            <p className="text-gray-500">
              The mock server returned an empty dataset
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-900">
            Server-Rendered Pets Data (Error)
          </h2>
        </div>
        <div className="p-6 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Server Fetch Error
          </h3>
          <p className="text-red-600 text-sm">
            {error instanceof Error
              ? error.message
              : "Failed to fetch pets data on server"}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This indicates the mock server is not responding during SSR
          </p>
        </div>
      </div>
    );
  }
}

// Server Component for fetching sample toys data
async function ToysServerData() {
  // Intentional delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Try to get toys for a sample pet (ID: 1)
    const toys: Toy[] = await toysListToys(1);

    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Server-Rendered Toys Data
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sample toys for Pet #1 - {toys.length} items fetched on server
          </p>
        </div>

        {toys.length > 0 ? (
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {toys.map((toy: Toy) => (
              <div key={toy.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg">🧸</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {toy.name}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Server-rendered
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">ID: {toy.id}</span>
                    <p className="text-xs text-gray-400 mt-1">
                      Generated: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🧸</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No toys found
            </h3>
            <p className="text-gray-500">
              Pet #1 has no toys in the mock database
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-900">
            Server-Rendered Toys Data (Error)
          </h2>
        </div>
        <div className="p-6 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Server Fetch Error
          </h3>
          <p className="text-red-600 text-sm">
            {error instanceof Error
              ? error.message
              : "Failed to fetch toys data on server"}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This indicates the nested API endpoint is not responding during SSR
          </p>
        </div>
      </div>
    );
  }
}

// Loading components
function StatusLoading() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
        <span className="text-yellow-800 font-medium">
          SSR Mock Server Status: CHECKING...
        </span>
      </div>
      <p className="text-yellow-600 text-sm mb-4">
        Running comprehensive server-side API tests...
      </p>
      <div className="animate-pulse">
        <div className="h-4 bg-yellow-200 rounded w-3/4 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-70 rounded p-3">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-between mt-2">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="bg-white bg-opacity-70 rounded p-3">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex justify-between mt-2">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-yellow-700 mb-1">
          <span>Testing endpoints...</span>
          <span>2s delay</span>
        </div>
        <div className="w-full bg-yellow-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function DataLoading({
  title = "Loading Data",
  delay = "1.5s",
}: {
  title?: string;
  delay?: string;
}) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 text-blue-600 mb-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">{title}...</span>
          </div>
          <p className="text-xs text-gray-500">
            Server-side fetch delay: {delay}
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="text-right">
                <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full animate-pulse"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SSRMockServerPage() {
  const currentTime = new Date().toISOString();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            SSR Mock Server Verification
          </h1>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-purple-800 font-medium">
                Server-Side Rendering
              </span>
            </div>
            <p className="text-purple-600 text-sm">
              This page tests mock server functionality during server-side
              rendering. All data is fetched on the server before the page is
              sent to the browser.
            </p>
            <p className="text-purple-500 text-xs mt-2">
              Page generated at: {currentTime}
            </p>
          </div>

          {/* Server Status Check */}
          <Suspense fallback={<StatusLoading />}>
            <MockServerStatus />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Server-rendered Pets */}
          <Suspense fallback={<DataLoading />}>
            <PetsServerData />
          </Suspense>

          {/* Server-rendered Toys */}
          <Suspense fallback={<DataLoading />}>
            <ToysServerData />
          </Suspense>
        </div>

        {/* Comparison with CSR */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            SSR vs CSR Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                Server-Side Rendering (This Page)
              </h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>- Data fetched during server render</li>
                <li>- Fast initial page load with data</li>
                <li>- SEO-friendly with pre-rendered content</li>
                <li>- No loading states for initial data</li>
                <li>- Mock server runs in Node.js environment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Client-Side Rendering
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>- Data fetched after page load</li>
                <li>- Interactive loading states</li>
                <li>- Real-time updates and mutations</li>
                <li>- Better for dynamic user interactions</li>
                <li>- Mock server runs in browser</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technical Implementation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Server Components
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>- React Server Components</li>
                <li>- Async/await data fetching</li>
                <li>- Direct API function calls</li>
                <li>- Server-side error boundaries</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Mock Integration
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>- MSW Node.js setup</li>
                <li>- Server-side request interception</li>
                <li>- Consistent mock responses</li>
                <li>- Network delay simulation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Performance Benefits
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>- Pre-populated HTML</li>
                <li>- Reduced client-side JavaScript</li>
                <li>- Faster perceived load times</li>
                <li>- Better Core Web Vitals</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded border">
            <h4 className="font-medium text-gray-900 mb-2">
              Debug Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
              <div>
                <strong>Render Time:</strong>
                <br />
                {new Date().toLocaleTimeString()}
              </div>
              <div>
                <strong>Environment:</strong>
                <br />
                {typeof window === "undefined" ? "Server" : "Client"}
              </div>
              <div>
                <strong>Node Version:</strong>
                <br />
                {process.version || "N/A"}
              </div>
              <div>
                <strong>Render Type:</strong>
                <br />
                Static Generation
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Helper */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Compare with client-side rendering behavior
          </p>
          <a
            href="/samples/(mock)/csr"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View CSR Mock Server Test →
          </a>
        </div>
      </div>
    </div>
  );
}
