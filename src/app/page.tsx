import Link from 'next/link'
import { Calendar, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">ShiftMate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Nouveau : Demandes de congés automatisées
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Planifiez vos équipes<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            en 5 minutes
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Fini les tableaux Excel illisibles. ShiftMate simplifie la gestion des plannings 
          pour les restaurants, commerces et salons.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
          >
            Essai gratuit 14 jours
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            href="#features" 
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Voir les fonctionnalités
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Pas de carte bancaire requise • Annulation à tout moment
        </p>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Tout ce dont vous avez besoin
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="h-7 w-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Planning visuel</h3>
            <p className="text-gray-400">
              Vue semaine/mois intuitive. Glissez-déposez pour créer et modifier les shifts en un clic.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
            <div className="bg-pink-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Gestion d&apos;équipe</h3>
            <p className="text-gray-400">
              Profils employés, disponibilités, demandes de congés. Tout centralisé et accessible.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
            <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Clock className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Gain de temps</h3>
            <p className="text-gray-400">
              Automatisez les tâches répétitives. Économisez 5h par semaine sur la gestion des plannings.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 rounded-3xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Entreprises utilisatrices</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-gray-400">Shifts créés par mois</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-gray-400">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Prêt à simplifier vos plannings ?
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Rejoignez des centaines d&apos;entreprises qui ont dit adieu aux prises de tête des plannings.
        </p>
        <Link 
          href="/register" 
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
        >
          Commencer gratuitement
          <ArrowRight className="h-5 w-5" />
        </Link>
        
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            14 jours gratuits
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Sans engagement
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Support inclus
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span className="font-semibold text-white">ShiftMate</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 ShiftMate. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
