// src/components/ui/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AideQuotidienne – Services de confiance à Madagascar</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-primary-600">À propos</a>
          <a href="#" className="hover:text-primary-600">Confidentialité</a>
          <a href="#" className="hover:text-primary-600">Conditions</a>
        </div>
      </div>
    </footer>
  )
}