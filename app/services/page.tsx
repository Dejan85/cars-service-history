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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
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
  isPreviousOwner?: boolean;
  isOffroad?: boolean;
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
  const [showPreviousOwner, setShowPreviousOwner] = useState(false);
  const [showMyServices, setShowMyServices] = useState(true);
  const [showOffroad, setShowOffroad] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

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

  const handleDeleteService = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/services/${serviceToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchServices(selectedVehicleId || undefined);
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
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

  const filteredServices = services.filter((service) => {
    // If service is previous owner's and checkbox is unchecked, filter out
    if (service.isPreviousOwner && !showPreviousOwner) return false;
    // If service is user's regular service and checkbox is unchecked, filter out
    if (!service.isPreviousOwner && !service.isOffroad && !showMyServices)
      return false;
    // If service is offroad and checkbox is unchecked, filter out
    if (service.isOffroad && !showOffroad) return false;
    return true;
  });

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

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
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

          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPreviousOwner}
                  onChange={(e) => setShowPreviousOwner(e.target.checked)}
                  color="warning"
                />
              }
              label="Prethodni vlasnik"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showMyServices}
                  onChange={(e) => setShowMyServices(e.target.checked)}
                  color="success"
                />
              }
              label="Moji redovni servisi"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOffroad}
                  onChange={(e) => setShowOffroad(e.target.checked)}
                  color="info"
                />
              }
              label="Offroad modifikacije"
            />
          </Box>
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
            services={filteredServices}
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
                  isPreviousOwner: editingService.isPreviousOwner || false,
                  isOffroad: editingService.isOffroad || false,
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Potvrda brisanja</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Da li ste sigurni da želite da obrišete ovaj servis?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
