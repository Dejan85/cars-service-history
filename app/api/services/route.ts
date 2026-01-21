import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all services
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vehicleId = searchParams.get("vehicleId");

    const where = vehicleId ? { vehicleId } : {};

    const services = await prisma.service.findMany({
      where,
      include: {
        vehicle: true,
        items: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

// POST new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      date,
      mileage,
      description,
      cost,
      notes,
      isPreviousOwner,
      isOffroad,
      isSmallService,
      items,
    } = body;

    if (!vehicleId || !date || !mileage || !description) {
      return NextResponse.json(
        { error: "VehicleId, date, mileage, and description are required" },
        { status: 400 },
      );
    }

    const service = await prisma.service.create({
      data: {
        vehicleId,
        date: new Date(date),
        mileage: parseInt(mileage),
        description,
        cost: parseFloat(cost) || 0,
        notes,
        isPreviousOwner: isPreviousOwner || false,
        isOffroad: isOffroad || false,
        isSmallService: isSmallService || false,
        items: {
          create:
            items?.map((item: any) => ({
              description: item.description,
              cost: parseFloat(item.cost) || 0,
            })) || [],
        },
      },
      include: {
        items: true,
        vehicle: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
