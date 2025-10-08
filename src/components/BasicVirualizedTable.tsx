import React, { useState, useRef, useEffect } from 'react';

// Generate mock data
const generateData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive',
    amount: Math.floor(Math.random() * 10000),
  }));
};

const VirtualizedTable = () => {
  const [data] = useState(() => generateData(100000));
  const [scrollTop, setScrollTop] = useState(0);
  
  const containerRef = useRef(null);
  
  // Configuration
  const ROW_HEIGHT = 40;
  const VIEWPORT_HEIGHT = 600;
  const OVERSCAN = 5;
  const TOTAL_HEIGHT = data.length * ROW_HEIGHT;
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + OVERSCAN
  );
  
  const visibleData = data.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;
  
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Custom Virtualized Table</h1>
        <p className="text-gray-600">
          Rendering {visibleData.length} of {data.length.toLocaleString()} rows
          <span className="ml-4 text-sm">
            (Visible: {startIndex}-{endIndex})
          </span>
        </p>
      </div>
      
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="border border-gray-300 rounded overflow-auto"
        style={{ height: VIEWPORT_HEIGHT }}
      >
        {/* Spacer to create scrollable area */}
        <div style={{ height: TOTAL_HEIGHT, position: 'relative' }}>
          {/* Visible rows container */}
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {/* Header */}
            <div 
              className="flex bg-gray-100 border-b border-gray-300 font-semibold sticky top-0 z-10"
              style={{ height: ROW_HEIGHT }}
            >
              <div className="flex-shrink-0 w-20 px-4 py-2 border-r">ID</div>
              <div className="flex-1 px-4 py-2 border-r">Name</div>
              <div className="flex-1 px-4 py-2 border-r">Email</div>
              <div className="w-32 px-4 py-2 border-r">Status</div>
              <div className="w-32 px-4 py-2">Amount</div>
            </div>
            
            {/* Rows */}
            {visibleData.map((row) => (
              <div
                key={row.id}
                className="flex border-b border-gray-200 hover:bg-blue-50"
                style={{ height: ROW_HEIGHT }}
              >
                <div className="flex-shrink-0 w-20 px-4 py-2 border-r text-gray-600">
                  {row.id}
                </div>
                <div className="flex-1 px-4 py-2 border-r font-medium">
                  {row.name}
                </div>
                <div className="flex-1 px-4 py-2 border-r text-gray-600">
                  {row.email}
                </div>
                <div className="w-32 px-4 py-2 border-r">
                  <span className={`px-2 py-1 rounded text-xs ${
                    row.status === 'Active' ? 'bg-green-100 text-green-800' :
                    row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {row.status}
                  </span>
                </div>
                <div className="w-32 px-4 py-2 text-right font-mono">
                  ${row.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Performance Stats:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Total Rows: {data.length.toLocaleString()}</li>
          <li>✅ Rendered Rows: {visibleData.length}</li>
          <li>✅ DOM Nodes Saved: {(data.length - visibleData.length).toLocaleString()}</li>
          <li>✅ Memory Efficiency: {((visibleData.length / data.length) * 100).toFixed(2)}% rendered</li>
        </ul>
      </div>
    </div>
  );
};

export default VirtualizedTable;