export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AideQuotidienne – Madagascar</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-primary-600 transition">À propos</a>
          <a href="#" className="hover:text-primary-600 transition">Confidentialité</a>
          <a href="#" className="hover:text-primary-600 transition">Conditions</a>
        </div>
      </div>
    </footer>
  )
}