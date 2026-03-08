export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Memories. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Capture your precious moments in beautiful albums.
          </p>
        </div>
      </div>
    </footer>
  );
}
