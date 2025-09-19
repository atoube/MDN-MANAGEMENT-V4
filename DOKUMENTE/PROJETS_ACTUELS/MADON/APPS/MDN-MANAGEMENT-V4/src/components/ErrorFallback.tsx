export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800">Une erreur est survenue</h2>
      <p className="mt-2 text-sm text-red-600">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>
  );
}; 