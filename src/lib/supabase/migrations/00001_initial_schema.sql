-- ============================================================
-- AideQuotidienne - Migration initiale
-- Base de données PostgreSQL (Supabase)
-- Tables, index, triggers, Row Level Security
-- ============================================================

-- Activer l'extension uuid-ossp si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------
-- Types énumérés
-- -----------------------------------------------------------
CREATE TYPE user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE message_type AS ENUM ('text', 'image');

-- -----------------------------------------------------------
-- Table profiles (étend auth.users)
-- -----------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client',
  location TEXT,          -- Ex: Antananarivo, Toamasina
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- Table categories (catégories de services)
-- -----------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT,              -- Nom d'icône ou URL
  slug TEXT UNIQUE NOT NULL
);

-- Insérer les catégories de base
INSERT INTO categories (name, icon, slug) VALUES
  ('Plomberie', '🔧', 'plomberie'),
  ('Nettoyage', '🧹', 'nettoyage'),
  ('Réparation électrique', '💡', 'reparation-electrique'),
  ('Jardinage', '🌿', 'jardinage'),
  ('Peinture', '🎨', 'peinture'),
  ('Déménagement', '🚚', 'demenagement');

-- -----------------------------------------------------------
-- Table services (offres des prestataires)
-- -----------------------------------------------------------
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_unit TEXT DEFAULT 'FCFA',  -- Monnaie locale (Ariary peut être géré)
  duration_minutes INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- Table bookings (réservations)
-- -----------------------------------------------------------
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  status booking_status DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  address TEXT,
  notes TEXT,
  client_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- Table messages (chat temps réel)
-- -----------------------------------------------------------
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------
-- Table reviews (avis)
-- -----------------------------------------------------------
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Index pour les performances
-- ============================================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);

-- ============================================================
-- Trigger pour updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------
-- PROFILES
-- Tout le monde peut voir les profils
-- Seul le propriétaire peut modifier son profil
-- Admin peut tout modifier
-- -----------------------------------------------------------
CREATE POLICY "Voir tous les profils" ON profiles FOR SELECT USING (true);

CREATE POLICY "Modifier son propre profil" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admin mise à jour profils" ON profiles FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------
-- SERVICES
-- Lecture publique
-- Écriture par le prestataire ou admin
-- -----------------------------------------------------------
CREATE POLICY "Lecture services" ON services FOR SELECT USING (true);

CREATE POLICY "Insertion par prestataire" ON services FOR INSERT
  WITH CHECK (
    auth.uid() = provider_id
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'provider'
  );

CREATE POLICY "Mise à jour par prestataire" ON services FOR UPDATE
  USING (auth.uid() = provider_id);

CREATE POLICY "Suppression par prestataire" ON services FOR DELETE
  USING (auth.uid() = provider_id);

CREATE POLICY "Admin tous droits services" ON services
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------
-- BOOKINGS
-- Client et prestataire voient leurs réservations
-- Client peut créer une réservation
-- Prestataire peut accepter/refuser (mise à jour du statut)
-- Admin tous droits
-- -----------------------------------------------------------
CREATE POLICY "Client voit ses réservations" ON bookings FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Prestataire voit ses réservations" ON bookings FOR SELECT
  USING (auth.uid() = provider_id);

CREATE POLICY "Client crée une réservation" ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = client_id
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'client'
  );

CREATE POLICY "Prestataire accepte/refuse" ON bookings FOR UPDATE
  USING (auth.uid() = provider_id)
  WITH CHECK (status IN ('confirmed', 'cancelled'));

CREATE POLICY "Admin voit/modifie toutes les réservations" ON bookings
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- -----------------------------------------------------------
-- MESSAGES
-- Visibles par le client et le prestataire du booking
-- Envoi autorisé pour les participants du booking
-- -----------------------------------------------------------
CREATE POLICY "Voir messages du booking" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
    )
  );

CREATE POLICY "Envoyer message" ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
    )
  );

-- -----------------------------------------------------------
-- REVIEWS
-- Lecture publique
-- Seul le client du booking terminé peut créer un avis
-- Admin tous droits
-- -----------------------------------------------------------
CREATE POLICY "Lecture reviews" ON reviews FOR SELECT USING (true);

CREATE POLICY "Client note après complétion" ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = reviews.booking_id
      AND bookings.client_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

CREATE POLICY "Admin tous droits reviews" ON reviews
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
