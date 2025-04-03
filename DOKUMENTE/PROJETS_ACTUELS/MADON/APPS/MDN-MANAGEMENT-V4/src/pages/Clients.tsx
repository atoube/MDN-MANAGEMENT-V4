import React from 'react';

export function Clients() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
      <div className="mt-6">
        {/* Client list will go here */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Client Name</h3>
                  <p className="text-sm text-gray-500">contact@example.com</p>
                </div>
                <div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}