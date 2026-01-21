import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        vehicle: true,
        items: true,
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 },
    );
  }
}

// PUT update service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const {
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
    body;

    // Delete existing items
    await prisma.serviceItem.deleteMany({
      where: { serviceId: params.id },
    });

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}

// DELETE service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
