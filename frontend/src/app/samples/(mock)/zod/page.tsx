"use client";

import { useState } from "react";
import { petsListPetsResponseItem } from "@/api/zod/pets/pets.zod";
import { toysListToysResponseItem } from "@/api/zod/pets-toys/pets-toys.zod";
import { z } from "zod";

type PetType = z.infer<typeof petsListPetsResponseItem>;
type ToyType = z.infer<typeof toysListToysResponseItem>;

export default function ZodSamplePage() {
  const [petData, setPetData] = useState<PetType>({
    id: 0,
    name: "",
    age: 0,
    kind: "dog",
  });
  const [toyData, setToyData] = useState({
    id: 0,
    name: "",
  });
  const [validationResults, setValidationResults] = useState<{
    pet?: string;
    toy?: string;
  }>({});

  const validatePet = () => {
    try {
      const result = petsListPetsResponseItem.parse(petData);
      setValidationResults((prev) => ({ ...prev, pet: " Valid pet data!" }));
      console.log("Validated pet:", result);
    } catch (error: any) {
      setValidationResults((prev) => ({
        ...prev,
        pet: `L ${error.issues?.[0]?.message || error.message}`,
      }));
    }
  };

  const validateToy = () => {
    try {
      const result = toysListToysResponseItem.parse(toyData);
      console.log(result);
      setValidationResults((prev) => ({ ...prev, toy: " Valid toy data!" }));
      console.log("Validated toy:", result);
    } catch (error: any) {
      setValidationResults((prev) => ({
        ...prev,
        toy: `L ${error.issues?.[0]?.message || error.message}`,
      }));
    }
  };

  const samplePet: PetType = {
    id: 1,
    name: "Buddy",
    age: 3,
    kind: "dog",
  };

  const sampleToy: ToyType = {
    id: 1,
    name: "Tennis Ball",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-black">
      <div>
        <h1 className="text-3xl font-bold mb-2">Zod Validation Sample</h1>
        <p className="text-gray-600">
          This page demonstrates Zod schema validation using the Pet Store API
          schemas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pet Validation */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Pet Validation</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pet ID</label>
              <input
                type="number"
                value={petData.id}
                onChange={(e) =>
                  setPetData((prev) => ({
                    ...prev,
                    id: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Name (required, min 1 char)
              </label>
              <input
                type="text"
                value={petData.name}
                onChange={(e) =>
                  setPetData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
                placeholder="Enter pet name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Age (0-100)
              </label>
              <input
                type="number"
                value={petData.age}
                onChange={(e) =>
                  setPetData((prev) => ({
                    ...prev,
                    age: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border rounded-md"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Kind</label>
              <select
                value={petData.kind}
                onChange={(e) =>
                  setPetData((prev) => ({
                    ...prev,
                    kind: e.target.value as any,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="fish">Fish</option>
                <option value="bird">Bird</option>
                <option value="reptile">Reptile</option>
              </select>
            </div>

            <button
              onClick={validatePet}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Validate Pet
            </button>

            {validationResults.pet && (
              <div className="p-3 rounded-md bg-gray-50 text-sm">
                {validationResults.pet}
              </div>
            )}
          </div>
        </div>

        {/* Toy Validation */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Toy Validation</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Toy ID</label>
              <input
                type="number"
                value={toyData.id}
                onChange={(e) =>
                  setToyData((prev) => ({
                    ...prev,
                    id: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Name (required)
              </label>
              <input
                type="text"
                value={toyData.name}
                onChange={(e) =>
                  setToyData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
                placeholder="Enter toy name"
              />
            </div>

            <button
              onClick={validateToy}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Validate Toy
            </button>

            {validationResults.toy && (
              <div className="p-3 rounded-md bg-gray-50 text-sm">
                {validationResults.toy}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample Data Display */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Valid Sample Data</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Sample Pet:</h3>
            <pre className="bg-white p-3 rounded text-sm overflow-auto">
              {JSON.stringify(samplePet, null, 2)}
            </pre>
            <button
              onClick={() => setPetData(samplePet)}
              className="mt-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              Load Sample Pet
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Sample Toy:</h3>
            <pre className="bg-white p-3 rounded text-sm overflow-auto">
              {JSON.stringify(sampleToy, null, 2)}
            </pre>
            <button
              onClick={() => setToyData(sampleToy)}
              className="mt-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors"
            >
              Load Sample Toy
            </button>
          </div>
        </div>
      </div>

      {/* Schema Information */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold mb-4">Schema Rules</h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium">Pet Schema Rules:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>ID: Number (required)</li>
              <li>Name: String with minimum 1 character (required)</li>
              <li>Age: Number between 0 and 100 (required)</li>
              <li>
                Kind: Must be one of: dog, cat, fish, bird, reptile (required)
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">Toy Schema Rules:</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>ID: Number (required)</li>
              <li>Name: String (required)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
