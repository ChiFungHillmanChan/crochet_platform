export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-soft-pink border-t-transparent" />
        <p className="text-sm text-warm-gray">Loading...</p>
      </div>
    </div>
  );
}
