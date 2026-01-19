import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        services: {
          orderBy: { date: "desc" },
          include: {
            items: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 },
    );
  }
}

// PUT update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { make, model, year, vin, plateNumber } = body;

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        make,
        model,
        year: parseInt(year),
        vin,
        plateNumber,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 },
    );
  }
}

// DELETE vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.vehicle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Vehicle deleted" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 },
    );
  }
}
