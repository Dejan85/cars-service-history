import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Očisti postojeće podatke
  console.log("Čišćenje baze...");
  await prisma.serviceItem.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.vehicle.deleteMany({});

  // Kreiraj vozilo
  const vehicle = await prisma.vehicle.create({
    data: {
      make: "Jeep",
      model: "Grand Cherokee Overland 3.0",
      year: 2007,
      vin: "1J8HCE8M47Y544374",
      plateNumber: "BG2386EK",
    },
  });

  console.log("Created vehicle:", vehicle);

  // Kreiraj servise iz Excel tabele
  const services = [
    // Row 4-5: April 15, 2021
    {
      date: new Date("2021-04-15"),
      mileage: 216000,
      description: "Uradjeno kod Koceljevca u Valjevu prethodni vlasnik",
      cost: 0,
      notes: "ulje diferencijali 2 spone na 216.000km receno 1500 eur",
    },
    // Row 5: June 05, 2022
    {
      date: new Date("2022-06-05"),
      mileage: 216000,
      description: "Distanci",
      cost: 150.0,
    },
    // Row 6: June 10, 2022
    {
      date: new Date("2022-06-10"),
      mileage: 216000,
      description:
        "Felne 4 komada za JEEP iz Cacka sa gumama 17ice, gume zamenjene 2024",
      cost: 700.0,
    },
    // Row 7: Servis kod Nese i Bobija (bez specificnog datuma, stavljam jun 2022)
    {
      date: new Date("2022-06-12"),
      mileage: 216000,
      description: "Servis kod Nese i Bobija za klimu",
      cost: 365.0,
      notes: "Total radovi do sada: 365 eur",
      items: {
        create: [
          { description: "Crevo", cost: 55 },
          { description: "Ruke za crevo", cost: 80 },
          { description: "Dijagnostika", cost: 30 },
          { description: "Dijagnostika expanzionog ventila", cost: 15 },
          { description: "Punjenje klime", cost: 40 },
          { description: "Pojas", cost: 70 },
          { description: "Ruke za pojas", cost: 60 },
          { description: "Levi stabilizator ruke", cost: 15 },
        ],
      },
    },
    // Row 8: June 16, 2022
    {
      date: new Date("2022-06-16"),
      mileage: 216000,
      description: "Nova brava kljuca 15.400 din",
      cost: 500.0,
    },
    // Row 8: July 01, 2022
    {
      date: new Date("2022-07-01"),
      mileage: 216000,
      description: "Kupljen hladnjak klime izvedena struja do krova",
      cost: 350.0,
    },
    // Row 9: June 18, 2022
    {
      date: new Date("2022-06-18"),
      mileage: 216000,
      description: "Kupljen iz USA novi expanzioni ventil",
      cost: 50.0,
    },
    // Row 10: June 18, 2022
    {
      date: new Date("2022-06-18"),
      mileage: 216000,
      description: "Kupljeno iz USA novi Crown bump stoper - 2 kom za zadnje",
      cost: 75.0,
    },
    // Row 11: June 20, 2022
    {
      date: new Date("2022-06-20"),
      mileage: 216000,
      description: "Raptor boja",
      cost: 500.0,
    },
    // Row 12: June 20, 2022
    {
      date: new Date("2022-06-20"),
      mileage: 216000,
      description: "Farbanje ruke",
      cost: 900.0,
      notes: "zastitia odozdo sredio trule sajtne isekao stavio nove",
    },
    // Row 13: July 28, 2022
    {
      date: new Date("2022-07-28"),
      mileage: 216000,
      description: "I ojacao za overlanding",
      cost: 900.0,
    },
    // Row 14: August 15, 2022
    {
      date: new Date("2022-08-15"),
      mileage: 222000,
      description: "Servis menjaca 222000km",
      cost: 160.0,
    },
    // Row 15: October 10, 2022
    {
      date: new Date("2022-10-10"),
      mileage: 223325,
      description:
        "Mali servis (Ulje 10l Mobile one puna sintetika 5w30, filter ulja, goriva, vazduha) 223.325 km",
      cost: 170.21,
    },
    // Row 16: December 05, 2022
    {
      date: new Date("2022-12-05"),
      mileage: 223325,
      description: "Crevo desno interkulera",
      cost: 150.0,
    },
    // Row 17: December 05, 2022
    {
      date: new Date("2022-12-05"),
      mileage: 223325,
      description: "Zadnja lajna za senzore",
      cost: 100.0,
      items: {
        create: [
          { description: "Lezaj alternatora veci", cost: 0 },
          { description: "Lezaj alternatora manji", cost: 0 },
          { description: "Pregled alternatora", cost: 0 },
          { description: "Kolektor", cost: 0 },
          {
            description: "Sredivanje park senzora na zadnjem braniku",
            cost: 0,
          },
        ],
      },
    },
    // Row 18: December 16, 2022
    {
      date: new Date("2022-12-16"),
      mileage: 226130,
      description: "Zamenjena hidraulicna sipka za drzanje haube na 226.130km",
      cost: 400.0,
      items: {
        create: [
          {
            description: "Pranje prednje strane motora, motor cleaner",
            cost: 0,
          },
          {
            description: "Brakclean, zamena linijskog kaisa i dva rolera",
            cost: 0,
          },
        ],
      },
    },
    // Row 19: August 18, 2023
    {
      date: new Date("2023-08-18"),
      mileage: 226130,
      description: "Rezonator turbine dihtovan dolivano ulje",
      cost: 350.0,
    },
    // Row 20: September 12, 2023
    {
      date: new Date("2023-09-12"),
      mileage: 234272,
      description: "Mali servis grand uradjen na 234.272km",
      cost: 150.0,
      items: {
        create: [
          { description: "Filter ulja", cost: 0 },
          { description: "Filter vazduha", cost: 0 },
          {
            description:
              "Motorno ulje Mobil super 3000 puna sintetika 5W30 10l",
            cost: 0,
          },
        ],
      },
    },
    // Row 21: May 20, 2024 - stavke su za naredni period
    {
      date: new Date("2024-05-20"),
      mileage: 241150,
      description: "Prednji desni deo branika stavljanje armature",
      cost: 360.0,
      items: {
        create: [
          { description: "Remont prednjih klesta 2x 140eur", cost: 280 },
          { description: "Prednje plocice 70 eur", cost: 70 },
          { description: "Ruke 3hx30eur", cost: 90 },
          { description: "Pranje motora 25 eur", cost: 25 },
          { description: "Otpornik na leptiru turbine 15eur", cost: 15 },
        ],
      },
    },
    // Row 22: July 20, 2024
    {
      date: new Date("2024-07-20"),
      mileage: 241150,
      description: "AT gume road cruza",
      cost: 500.0,
    },
    // Row 23: August 02, 2024
    {
      date: new Date("2024-08-02"),
      mileage: 244552,
      description: "Reparacija letve volana",
      cost: 750.0,
      items: {
        create: [
          { description: "Dve gornje kugle letve volana", cost: 0 },
          { description: "Servo ulje", cost: 0 },
        ],
      },
    },
    // Row 24: August 08, 2024
    {
      date: new Date("2024-08-08"),
      mileage: 245175,
      description: "Mali servis grand uradjen na 245.175km",
      cost: 140.0,
      items: {
        create: [
          { description: "Filter ulja", cost: 0 },
          { description: "Filter vazduha", cost: 0 },
          {
            description:
              "Motorno ulje Mobil super 3000 puna sintetika 5W30 10l",
            cost: 0,
          },
        ],
      },
    },
    // May 01, 2025
    {
      date: new Date("2025-05-01"),
      mileage: 250030,
      description: "Veci servis na 250.030km",
      cost: 1100.0,
      items: {
        create: [
          { description: "Anlaser 38.000", cost: 0 },
          { description: "Servo pumpa 52.400", cost: 0 },
          { description: "Plocice zadnje 85 eur", cost: 85 },
          { description: "Servo ulje 1400 rsd", cost: 12 },
          { description: "Ruke 210 rsd 30eur/h", cost: 0 },
        ],
      },
    },
    // Oktobar 04, 2025
    {
      date: new Date("2025-10-04"),
      mileage: 254882,
      description: "Mali servis na 254.882km",
      cost: 230.0,
      items: {
        create: [
          { description: "Svi filteri", cost: 0 },
          { description: "Ulje", cost: 0 },
          { description: "Antifriz", cost: 0 },
        ],
      },
    },
    // Oktobar 08, 2025
    {
      date: new Date("2025-10-08"),
      mileage: 254882,
      description:
        "Zadnji stabilizatori, stavljena guma na crevo usisa turbine",
      cost: 90.0,
    },
  ];

  for (const serviceData of services) {
    const service = await prisma.service.create({
      data: {
        vehicleId: vehicle.id,
        isPreviousOwner: true, // Svi seed servisi su od prethodnog vlasnika
        ...serviceData,
      },
      include: {
        items: true,
      },
    });
    console.log(
      "Created service:",
      service.date.toLocaleDateString("sr-RS"),
      "-",
      service.description.substring(0, 50),
      "- €" + service.cost,
    );
  }

  // Izračunaj ukupno
  const total = services.reduce((sum, s) => sum + s.cost, 0);
  console.log("\n✅ Seed completed!");
  console.log(`📊 Ukupno servisa: ${services.length}`);
  console.log(`💰 Ukupni troškovi: €${total.toFixed(2)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
