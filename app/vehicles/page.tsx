"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState, useEffect } from "react";
import VehicleList from "@/components/VehicleList";
import VehicleForm, { VehicleFormData } from "@/components/VehicleForm";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string | null;
  plateNumber?: string | null;
  _count?: {
    services: number;
  };
  services?: Array<{
    date: Date;
    mileage: number;
  }>;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("/api/vehicles", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API endpoint nije pronađen");
        }
        throw new Error(`Greška: ${response.status}`);
      }

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setError("Zahtev je prekoračio vremensko ograničenje");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Greška pri učitavanju vozila",
        );
      }
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (data: VehicleFormData) => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setFormOpen(false);
        fetchVehicles();
      }
    } catch (error) {
      console.error("Failed to add vehicle:", error);
    }
  };

  const handleEditVehicle = async (data: VehicleFormData) => {
    if (!editingVehicle) return;

    try {
      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEditingVehicle(null);
        setFormOpen(false);
        fetchVehicles();
      }
    } catch (error) {
      console.error("Failed to update vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovo vozilo?")) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchVehicles();
      }
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  const openEditForm = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingVehicle(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Vozila
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Dodaj vozilo
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <VehicleList
            vehicles={vehicles}
            onEdit={openEditForm}
            onDelete={handleDeleteVehicle}
          />
        )}
      </Box>

      <VehicleForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
        initialData={
          editingVehicle
            ? {
                make: editingVehicle.make,
                model: editingVehicle.model,
                year: editingVehicle.year.toString(),
                vin: editingVehicle.vin || "",
                plateNumber: editingVehicle.plateNumber || "",
              }
            : undefined
        }
      />
    </Container>
  );
}
