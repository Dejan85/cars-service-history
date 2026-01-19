"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState, useEffect } from "react";
import ServiceList from "@/components/ServiceList";
import ServiceForm, { ServiceFormData } from "@/components/ServiceForm";
import dayjs from "dayjs";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
}

interface Service {
  id: string;
  date: Date | string;
  mileage: number;
  description: string;
  cost: number;
  notes?: string | null;
  vehicle?: {
    make: string;
    model: string;
  };
  items?: Array<{
    description: string;
    cost: number;
  }>;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) {
        throw new Error(`Greška: ${response.status}`);
      }
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setError(
        error instanceof Error ? error.message : "Greška pri učitavanju vozila",
      );
    }
  };

  const fetchServices = async (vehicleId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = vehicleId
        ? `/api/services?vehicleId=${vehicleId}`
        : "/api/services";

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("API endpoint nije pronađen");
        }
        throw new Error(`Greška: ${response.status}`);
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Greška pri učitavanju servisa",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchServices(selectedVehicleId || undefined);
  }, [selectedVehicleId]);

  const handleAddService = async (data: ServiceFormData) => {
    if (!data.vehicleId) {
      alert("Morate odabrati vozilo");
      return;
    }

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: data.date?.toISOString(),
        }),
      });

      if (response.ok) {
        setFormOpen(false);
        fetchServices(selectedVehicleId || undefined);
      }
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  const handleEditService = async (data: ServiceFormData) => {
    if (!editingService) return;

    try {
      const response = await fetch(`/api/services/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: data.date?.toISOString(),
        }),
      });

      if (response.ok) {
        setEditingService(null);
        setFormOpen(false);
        fetchServices(selectedVehicleId || undefined);
      }
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj servis?")) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices(selectedVehicleId || undefined);
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingService(null);
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
            Servisi
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            disabled={vehicles.length === 0}
          >
            Dodaj servis
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            select
            label="Filter po vozilu"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="">Sva vozila</MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {vehicles.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Najpre dodajte vozilo da biste mogli evidentirati servise.
            </Typography>
          </Box>
        ) : loading ? (
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
          <ServiceList
            services={services}
            onEdit={openEditForm}
            onDelete={handleDeleteService}
            showVehicle={!selectedVehicleId}
          />
        )}
      </Box>

      {vehicles.length > 0 && (
        <ServiceForm
          open={formOpen}
          onClose={closeForm}
          onSubmit={editingService ? handleEditService : handleAddService}
          vehicleId={selectedVehicleId || vehicles[0]?.id}
          initialData={
            editingService
              ? {
                  date: dayjs(editingService.date),
                  mileage: editingService.mileage.toString(),
                  description: editingService.description,
                  cost: editingService.cost.toString(),
                  notes: editingService.notes || "",
                  items:
                    editingService.items?.map((item) => ({
                      description: item.description,
                      cost: item.cost.toString(),
                    })) || [],
                }
              : undefined
          }
        />
      )}
    </Container>
  );
}
