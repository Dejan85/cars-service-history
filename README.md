# Car Service History

Next.js aplikacija za evidenciju servisa automobila.

## Tech Stack

- **Next.js 14+** - React framework sa App Router
- **TypeScript** - Type safety
- **Material-UI** - UI komponente
- **PostgreSQL** - Relaciona baza podataka
- **Prisma** - ORM za rad sa bazom

## Funkcionalnosti

### Vozila
- ✅ Dodavanje vozila (proizvodjač, model, godina, VIN, registracija)
- ✅ Pregled svih vozila u tabeli
- ✅ Izmena podataka o vozilu
- ✅ Brisanje vozila
- ✅ Detaljna stranica za svako vozilo

### Servisi
- ✅ Dodavanje servisa sa datumom i kilometražom
- ✅ Definisanje osnovnog servisa i dodatnih stavki
- ✅ Evidencija troškova po stavkama
- ✅ Napomene za svaki servis
- ✅ Pregled svih servisa
- ✅ Filtriranje servisa po vozilu
- ✅ Izmena i brisanje servisa

### Dashboard i statistika
- ✅ Pregled poslednje kilometraže
- ✅ Ukupni troškovi po vozilu
- ✅ Datum poslednjeg servisa
- ✅ Broj evidentiranih servisa

## Setup

### Preduslov

- Node.js 18+
- PostgreSQL baza

### Instalacija

1. Kloniraj repo:
```bash
git clone <repo-url>
cd car-service-history
```

2. Instaliraj zavisnosti:
```bash
npm install
```

3. Podesi bazu podataka:

Kreiraj `.env` fajl u root direktorijumu:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/car_service_db?schema=public"
```

4. Kreiraj bazu i tabele:
```bash
npm run prisma:push
```

5. Pokreni development server:
```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

## Prisma komande

```bash
# Generiši Prisma Client
npm run prisma:generate

# Push schema promene u bazu
npm run prisma:push

# Otvori Prisma Studio (GUI za pregled baze)
npm run prisma:studio
```

## Development

```bash
npm run dev      # Pokreni dev server
npm run build    # Build za production
npm run start    # Pokreni production build
npm run lint     # Lint code
```
