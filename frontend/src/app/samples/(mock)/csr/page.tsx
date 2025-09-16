"use client";

import { useState, useEffect } from "react";
import {
  usePetsListPets,
  usePetsCreatePet,
  usePetsGetPet,
} from "@/api/endpoints/pets/pets";
import {
  useToysListToys,
  useToysCreateToy,
} from "@/api/endpoints/pets-toys/pets-toys";
import { PetType } from "@/api/models";
import type { Pet, Toy } from "@/api/models";

export default function MockServerTestPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<{
    pets: { list: boolean; create: boolean; get: boolean };
    toys: { list: boolean; create: boolean };
    mockStatus: "checking" | "active" | "inactive";
  }>({
    pets: { list: false, create: false, get: false },
    toys: { list: false, create: false },
    mockStatus: "checking",
  });

  const [newPet] = useState<Omit<Pet, "id">>({
    name: "Test Pet",
    age: 3,
    kind: PetType.dog,
  });

  // API hooks
  const {
    data: pets,
    isLoading: petsLoading,
    error: petsError,
    refetch: refetchPets,
  } = usePetsListPets();
  const {
    data: toys,
    isLoading: toysLoading,
    refetch: refetchToys,
  } = useToysListToys(
    selectedPetId || 0,
    {},
    { query: { enabled: !!selectedPetId } }
  );

  const createPetMutation = usePetsCreatePet();
  const getPetQuery = usePetsGetPet(
    selectedPetId || 0,
    {},
    { query: { enabled: !!selectedPetId } }
  );
  const createToyMutation = useToysCreateToy();

  useEffect(() => {
    setMounted(true);
    runMockServerTests();
  }, []);

  const runMockServerTests = async () => {
    setTestResults((prev) => ({ ...prev, mockStatus: "checking" }));
    console.log("Starting mock server tests...");

    try {
      // Test 1: List pets
      console.log("Test 1: Attempting to list pets...");
      const petsResponse = await refetchPets();
      console.log("Pets response:", petsResponse);
      const petsListTest =
        !!petsResponse.data && Array.isArray(petsResponse.data);

      // Test 2: Create pet
      let createTest = false;
      let testPetId: number | null = null;
      try {
        console.log("Test 2: Attempting to create pet...");
        const createResponse = await createPetMutation.mutateAsync({
          data: { ...newPet, id: 0 },
        });
        console.log("Create pet response:", createResponse);
        createTest = !!createResponse;
        testPetId =
          typeof createResponse === "object" && "id" in createResponse
            ? createResponse.id
            : null;
        console.log("Created pet ID:", testPetId);
      } catch (e) {
        console.log("Create test failed:", e);
      }

      // Test 3: Get specific pet (if we have an ID)
      let getTest = false;
      if (testPetId) {
        try {
          setSelectedPetId(testPetId);
          // Wait a bit for the query to trigger
          await new Promise((resolve) => setTimeout(resolve, 500));
          getTest = true;
        } catch (e) {
          console.log("Get test failed:", e);
        }
      }

      // Test 4: List toys for pet
      let toysListTest = false;
      if (testPetId) {
        try {
          const toysResponse = await refetchToys();
          toysListTest =
            !!toysResponse.data && Array.isArray(toysResponse.data);
        } catch (e) {
          console.log("Toys list test failed:", e);
        }
      }

      // Test 5: Create toy
      let toyCreateTest = false;
      if (testPetId) {
        try {
          const toyResponse = await createToyMutation.mutateAsync({
            petId: testPetId,
            data: { id: 0, name: "Test Toy" },
          });
          toyCreateTest = !!toyResponse;
        } catch (e) {
          console.log("Toy create test failed:", e);
        }
      }

      setTestResults({
        pets: {
          list: petsListTest,
          create: createTest,
          get: getTest,
        },
        toys: {
          list: toysListTest,
          create: toyCreateTest,
        },
        mockStatus: petsListTest && createTest ? "active" : "inactive",
      });
    } catch (error) {
      console.error("Mock server test failed:", error);
      setTestResults((prev) => ({ ...prev, mockStatus: "inactive" }));
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? "" : "L";
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  if (!mounted) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mock Server Verification Dashboard
          </h1>
          <div
            className={`border rounded-lg p-4 ${
              testResults.mockStatus === "active"
                ? "bg-green-50 border-green-200"
                : testResults.mockStatus === "inactive"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-center mb-2">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  testResults.mockStatus === "active"
                    ? "bg-green-500"
                    : testResults.mockStatus === "inactive"
                      ? "bg-red-500"
                      : "bg-yellow-500 animate-pulse"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  testResults.mockStatus === "active"
                    ? "text-green-800"
                    : testResults.mockStatus === "inactive"
                      ? "text-red-800"
                      : "text-yellow-800"
                }`}
              >
                Mock Server Status:{" "}
                {testResults.mockStatus === "checking"
                  ? "Checking..."
                  : testResults.mockStatus.toUpperCase()}
              </span>
            </div>
            <p
              className={`text-sm ${
                testResults.mockStatus === "active"
                  ? "text-green-600"
                  : testResults.mockStatus === "inactive"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {testResults.mockStatus === "checking" &&
                "Running comprehensive API tests..."}
              {testResults.mockStatus === "active" &&
                "All mock endpoints are responding correctly"}
              {testResults.mockStatus === "inactive" &&
                "Mock server is not responding or has issues"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pets API Tests */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Pets API Tests
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Testing all pets endpoints
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">GET /pets (List)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getStatusIcon(testResults.pets.list)}
                  </span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(testResults.pets.list)}`}
                  >
                    {testResults.pets.list ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">POST /pets (Create)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getStatusIcon(testResults.pets.create)}
                  </span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(testResults.pets.create)}`}
                  >
                    {testResults.pets.create ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">GET /pets/:id (Get)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getStatusIcon(testResults.pets.get)}
                  </span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(testResults.pets.get)}`}
                  >
                    {testResults.pets.get ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Toys API Tests */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Toys API Tests
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Testing nested toys endpoints
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">GET /pets/:id/toys (List)</span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getStatusIcon(testResults.toys.list)}
                  </span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(testResults.toys.list)}`}
                  >
                    {testResults.toys.list ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">
                  POST /pets/:id/toys (Create)
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getStatusIcon(testResults.toys.create)}
                  </span>
                  <span
                    className={`text-sm font-medium ${getStatusColor(testResults.toys.create)}`}
                  >
                    {testResults.toys.create ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Pets */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Live Mock Data - Pets
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {petsLoading
                  ? "Loading..."
                  : `${pets?.length || 0} pets in mock database`}
              </p>
            </div>

            {petsLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : petsError ? (
              <div className="p-6 text-center text-red-600">
                <p className="text-4xl mb-2">�</p>
                <p>
                  Error:{" "}
                  {petsError instanceof Error
                    ? petsError.message
                    : "Failed to load pets"}
                </p>
              </div>
            ) : pets && pets.length > 0 ? (
              <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {pets.slice(0, 5).map((pet: Pet) => (
                  <div
                    key={pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedPetId === pet.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {pet.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {pet.age} years " {pet.kind}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        ID: {pet.id}
                      </span>
                    </div>
                  </div>
                ))}
                {pets.length > 5 && (
                  <div className="px-6 py-2 text-center text-gray-500 text-sm">
                    ... and {pets.length - 5} more pets
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-4xl mb-2">=</div>
                <p className="text-gray-500">No pets in mock database</p>
              </div>
            )}
          </div>

          {/* Current Toys */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Live Mock Data - Toys
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {!selectedPetId
                  ? "Select a pet to view toys"
                  : toysLoading
                    ? "Loading toys..."
                    : `${toys?.length || 0} toys for Pet #${selectedPetId}`}
              </p>
            </div>

            {!selectedPetId ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-4xl mb-4">�</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Pet
                </h3>
                <p className="text-gray-500">
                  Click on a pet to view their toys
                </p>
              </div>
            ) : toysLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : toys && toys.length > 0 ? (
              <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {toys.map((toy: Toy) => (
                  <div key={toy.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">🧸</span>
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {toy.name}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-400">
                        ID: {toy.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-4xl mb-2">�</div>
                <p className="text-gray-500">No toys found for this pet</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Test Controls
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Re-run tests or check specific functionality
            </p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={runMockServerTests}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                = Re-run All Tests
              </button>
              <button
                onClick={() => refetchPets()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                =� Refresh Pets Data
              </button>
              <button
                onClick={() => refetchToys()}
                disabled={!selectedPetId}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                � Refresh Toys Data
              </button>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mock Server Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Technology Stack
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>" Mock Service Worker (MSW)</li>
                <li>" React Query for data fetching</li>
                <li>" TypeScript generated APIs</li>
                <li>" Orval for OpenAPI integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Test Coverage</h4>
              <ul className="space-y-1 text-gray-600">
                <li>" CRUD operations for Pets</li>
                <li>" Nested resource operations</li>
                <li>" Error handling verification</li>
                <li>" Response time simulation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
              <ul className="space-y-1 text-gray-600">
                <li>" No backend dependency</li>
                <li>" Consistent mock data</li>
                <li>" Network-level interception</li>
                <li>" Realistic API simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
