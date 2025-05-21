import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="bg-gray-300 p-2 rounded disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-gray-300 p-2 rounded disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
