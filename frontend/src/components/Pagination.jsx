export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex justify-between items-center">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="bg-blue-300 px-4 py-2 rounded disabled:bg-gray-400"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="bg-blue-300 px-4 py-2 rounded disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
}
