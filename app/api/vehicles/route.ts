import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        services: {
          where: {
            isPreviousOwner: false,
          },
          orderBy: { date: "desc" },
          take: 1,
        },
        _count: {
          select: { services: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

// POST new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { make, model, year, vin, plateNumber } = body;

    if (!make || !model || !year) {
      return NextResponse.json(
        { error: "Make, model, and year are required" },
        { status: 400 },
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        year: parseInt(year),
        vin,
        plateNumber,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}
