"use client";

import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ArrowBack, Add, Edit } from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ServiceList from "@/components/ServiceList";
import ServiceForm, { ServiceFormData } from "@/components/ServiceForm";
import VehicleForm, { VehicleFormData } from "@/components/VehicleForm";
import dayjs from "dayjs";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string | null;
  plateNumber?: string | null;
  services: Service[];
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
  items?: Array<{
    description: string;
    cost: number;
  }>;
}

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showPreviousOwner, setShowPreviousOwner] = useState(false);
  const [showMyServices, setShowMyServices] = useState(true);
  const [showOffroad, setShowOffroad] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/vehicles/${vehicleId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Vozilo nije pronađeno");
        }
        throw new Error(`Greška: ${response.status}`);
      }

      const data = await response.json();
      setVehicle(data);
    } catch (error) {
      console.error("Failed to fetch vehicle:", error);
      setError(
        error instanceof Error ? error.message : "Greška pri učitavanju vozila",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const handleAddService = async (data: ServiceFormData) => {
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          vehicleId,
          date: data.date?.toISOString(),
        }),
      });

      if (response.ok) {
        setFormOpen(false);
        fetchVehicle();
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
        fetchVehicle();
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
        await fetchVehicle();
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

  const handleUpdateVehicle = async (data: VehicleFormData) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setVehicleFormOpen(false);
        fetchVehicle();
      }
    } catch (error) {
      console.error("Failed to update vehicle:", error);
    }
  };

  const calculateTotalCost = () => {
    if (!vehicle) return 0;
    return vehicle.services.reduce((sum, service) => {
      const itemsCost = service.items?.reduce((s, i) => s + i.cost, 0) || 0;
      return sum + service.cost + itemsCost;
    }, 0);
  };

  const calculateMyServicesCost = () => {
    if (!vehicle) return 0;
    return vehicle.services
      .filter((s) => !s.isPreviousOwner)
      .reduce((sum, service) => {
        const itemsCost = service.items?.reduce((s, i) => s + i.cost, 0) || 0;
        return sum + service.cost + itemsCost;
      }, 0);
  };

  const calculatePreviousOwnerCost = () => {
    if (!vehicle) return 0;
    return vehicle.services
      .filter((s) => s.isPreviousOwner)
      .reduce((sum, service) => {
        const itemsCost = service.items?.reduce((s, i) => s + i.cost, 0) || 0;
        return sum + service.cost + itemsCost;
      }, 0);
  };

  const calculateOffroadCost = () => {
    if (!vehicle) return 0;
    return vehicle.services
      .filter((s) => s.isOffroad)
      .reduce((sum, service) => {
        const itemsCost = service.items?.reduce((s, i) => s + i.cost, 0) || 0;
        return sum + service.cost + itemsCost;
      }, 0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !vehicle) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            href="/vehicles"
            startIcon={<ArrowBack />}
            sx={{ mb: 2 }}
          >
            Nazad na listu
          </Button>
          <Alert severity="error">{error || "Vozilo nije pronađeno"}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          component={Link}
          href="/vehicles"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Nazad na listu
        </Button>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              {vehicle.make} {vehicle.model}
            </Typography>
            <Button
              onClick={() => setVehicleFormOpen(true)}
              startIcon={<Edit />}
              variant="outlined"
            >
              Izmeni
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Godina
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {vehicle.year}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Registracija
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {vehicle.plateNumber || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                VIN
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ fontSize: "0.9rem" }}
              >
                {vehicle.vin || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Broj servisa
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {vehicle.services.length}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Poslednja kilometraža
              </Typography>
              <Typography variant="h6" color="primary">
                {vehicle.services[0]?.mileage
                  ? `${vehicle.services[0].mileage.toLocaleString()} km`
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Ukupni troškovi
              </Typography>
              <Typography variant="h6" color="error">
                €{calculateTotalCost().toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Poslednji servis
              </Typography>
              <Typography variant="h6">
                {vehicle.services[0]
                  ? dayjs(vehicle.services[0].date).format("DD.MM.YYYY")
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Broj mojih servisa
              </Typography>
              <Typography variant="h6">
                {
                  vehicle.services.filter(
                    (s) => !s.isPreviousOwner && !s.isOffroad,
                  ).length
                }
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Troškovi preth. vlasnika
              </Typography>
              <Typography variant="h6" color="warning.main">
                €{calculatePreviousOwnerCost().toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Broj servisa preth. vlasnika
              </Typography>
              <Typography variant="h6" color="warning.main">
                {
                  vehicle.services.filter(
                    (s) => s.isPreviousOwner && !s.isOffroad,
                  ).length
                }
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Moji troškovi
              </Typography>
              <Typography variant="h6" color="success.main">
                €{calculateMyServicesCost().toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Broj mojih servisa
              </Typography>
              <Typography variant="h6" color="success.main">
                {
                  vehicle.services.filter(
                    (s) => !s.isPreviousOwner && !s.isOffroad,
                  ).length
                }
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Offroad modifikacije
              </Typography>
              <Typography variant="h6" color="info.main">
                €{calculateOffroadCost().toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Broj offroad modifikacija
              </Typography>
              <Typography variant="h6" color="info.main">
                {vehicle.services.filter((s) => s.isOffroad).length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            Istorija servisa
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            Dodaj servis
          </Button>
        </Box>

        <Box sx={{ mb: 2, display: "flex", gap: 3 }}>
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

        <ServiceList
          services={vehicle.services.filter((s) => {
            if (s.isPreviousOwner && s.isOffroad)
              return showPreviousOwner && showOffroad;
            if (s.isPreviousOwner) return showPreviousOwner;
            if (s.isOffroad) return showOffroad;
            return showMyServices;
          })}
          onEdit={openEditForm}
          onDelete={handleDeleteService}
          showVehicle={false}
        />
      </Box>

      <ServiceForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={editingService ? handleEditService : handleAddService}
        vehicleId={vehicleId}
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

      <VehicleForm
        open={vehicleFormOpen}
        onClose={() => setVehicleFormOpen(false)}
        onSubmit={handleUpdateVehicle}
        initialData={{
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year.toString(),
          vin: vehicle.vin || "",
          plateNumber: vehicle.plateNumber || "",
        }}
      />

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
