import React from 'react';

export function Projects() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
      <div className="mt-6">
        {/* Project list will go here */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Projet Alpha</h3>
                  <p className="text-sm text-gray-500">Client: MDN Page web design</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>



        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">  
                  <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Projet  Promote 2026</h3>
                  <p className="text-sm text-gray-500">Client: projet interne</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        
      </div>
    </div>
  );
}