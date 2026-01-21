"use client";

import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber?: string;
  vin?: string;
  services: Service[];
}

interface Service {
  id: string;
  description: string;
  date: string;
  mileage: number;
  cost: number;
  isPreviousOwner: boolean;
  isOffroad: boolean;
  isSmallService: boolean;
  items?: ServiceItem[];
}

interface ServiceItem {
  id: string;
  name: string;
  cost: number;
}

interface MonthlyStats {
  month: string;
  serviceCount: number;
  totalCost: number;
  averageDaysBetween: number;
}

export default function AnalyticsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicleId) {
      fetchVehicleDetails(selectedVehicleId);
    } else {
      setSelectedVehicle(null);
    }
  }, [selectedVehicleId]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (response.ok) {
        const data = await response.json();
        // Fetch full vehicle data with all services for selected vehicle
        if (data.length > 0) {
          setSelectedVehicleId(data[0].id);
          await fetchVehicleDetails(data[0].id);
        }
        setVehicles(data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedVehicle(data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicle details:", error);
    }
  };

  const getUserServices = () => {
    if (!selectedVehicle) return [];
    return selectedVehicle.services
      .filter((s) => !s.isPreviousOwner && !s.isOffroad)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const calculateMonthlyStats = (): MonthlyStats[] => {
    const services = getUserServices();
    if (services.length === 0) return [];

    const monthMap = new Map<string, Service[]>();

    services.forEach((service) => {
      const monthKey = dayjs(service.date).format("YYYY-MM");
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(service);
    });

    const stats: MonthlyStats[] = [];
    const sortedMonths = Array.from(monthMap.keys()).sort().reverse();

    sortedMonths.forEach((monthKey) => {
      const monthServices = monthMap.get(monthKey)!;
      const totalCost = monthServices.reduce((sum, s) => {
        const itemsCost = s.items?.reduce((s, i) => s + i.cost, 0) || 0;
        return sum + s.cost + itemsCost;
      }, 0);

      stats.push({
        month: dayjs(monthKey).format("MMMM YYYY"),
        serviceCount: monthServices.length,
        totalCost,
        averageDaysBetween: 0,
      });
    });

    return stats;
  };

  const calculateAverageDaysBetweenServices = () => {
    const services = getUserServices();
    if (services.length < 2) return 0;

    let totalDays = 0;
    for (let i = 0; i < services.length - 1; i++) {
      const date1 = dayjs(services[i].date);
      const date2 = dayjs(services[i + 1].date);
      totalDays += Math.abs(date1.diff(date2, "day"));
    }

    return Math.round(totalDays / (services.length - 1));
  };

  const calculateMonthlyAverage = () => {
    const services = getUserServices();
    if (services.length === 0) return 0;

    const totalCost = services.reduce((sum, s) => {
      const itemsCost = s.items?.reduce((s, i) => s + i.cost, 0) || 0;
      return sum + s.cost + itemsCost;
    }, 0);

    const firstService = dayjs(services[services.length - 1].date);
    const lastService = dayjs(services[0].date);
    const monthsDiff = lastService.diff(firstService, "month", true);

    return monthsDiff > 0 ? totalCost / monthsDiff : totalCost;
  };

  const calculateTotalMileage = () => {
    const services = getUserServices();
    if (services.length === 0) return 0;

    const firstMileage = services[services.length - 1].mileage;
    const lastMileage = services[0].mileage;

    return lastMileage - firstMileage;
  };

  const calculateYearlyMileage = () => {
    const services = getUserServices();
    const smallServices = services.filter((s) => s.isSmallService);

    if (smallServices.length < 2) {
      // Ako nema dovoljno malih servisa, koristi sve servise
      if (services.length < 2) return 0;

      const firstService = services[services.length - 1];
      const lastService = services[0];
      const kmDiff = lastService.mileage - firstService.mileage;
      const daysDiff = dayjs(lastService.date).diff(
        dayjs(firstService.date),
        "day",
      );

      if (daysDiff === 0) return 0;
      return Math.round((kmDiff / daysDiff) * 365);
    }

    // Računaj prosečnu km između malih servisa
    let totalKm = 0;
    let totalDays = 0;

    for (let i = 0; i < smallServices.length - 1; i++) {
      const kmDiff = smallServices[i].mileage - smallServices[i + 1].mileage;
      const daysDiff = dayjs(smallServices[i].date).diff(
        dayjs(smallServices[i + 1].date),
        "day",
      );
      totalKm += Math.abs(kmDiff);
      totalDays += Math.abs(daysDiff);
    }

    if (totalDays === 0) return 0;
    return Math.round((totalKm / totalDays) * 365);
  };

  const monthlyStats = calculateMonthlyStats();
  const avgDaysBetween = calculateAverageDaysBetweenServices();
  const monthlyAverage = calculateMonthlyAverage();
  const totalServices = getUserServices().length;
  const totalMileage = calculateTotalMileage();
  const yearlyMileage = calculateYearlyMileage();

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analitika
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            select
            fullWidth
            label="Izaberite vozilo"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            sx={{ maxWidth: 400 }}
          >
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {!selectedVehicle ? (
          <Alert severity="info">Izaberite vozilo za prikaz analitike</Alert>
        ) : totalServices === 0 ? (
          <Alert severity="warning">
            Nemate evidentiranih servisa za ovo vozilo
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "primary.light" }}
                >
                  <Typography variant="caption" color="primary.contrastText">
                    Ukupno servisa
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary.contrastText"
                  >
                    {totalServices}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "success.light" }}
                >
                  <Typography variant="caption" color="success.contrastText">
                    Prosečno dana između servisa
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="success.contrastText"
                  >
                    {avgDaysBetween}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "warning.light" }}
                >
                  <Typography variant="caption" color="warning.contrastText">
                    Prosečno mesečno
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="warning.contrastText"
                  >
                    €{monthlyAverage.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "info.light" }}
                >
                  <Typography variant="caption" color="info.contrastText">
                    Pouzdanost
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="info.contrastText"
                  >
                    {avgDaysBetween > 60
                      ? "Visoka"
                      : avgDaysBetween > 30
                        ? "Srednja"
                        : "Niska"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "secondary.light" }}
                >
                  <Typography variant="caption" color="secondary.contrastText">
                    Pređena kilometraža
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="secondary.contrastText"
                  >
                    {totalMileage.toLocaleString()} km
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{ p: 3, textAlign: "center", bgcolor: "error.light" }}
                >
                  <Typography variant="caption" color="error.contrastText">
                    Godišnja kilometraža
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="error.contrastText"
                  >
                    {yearlyMileage.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Mesečna statistika
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {monthlyStats.map((stat, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6" color="primary">
                        {stat.month}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Broj servisa
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {stat.serviceCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary">
                        Ukupni troškovi
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="error"
                      >
                        €{stat.totalCost.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="caption" color="text.secondary">
                        Prosek
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        €{(stat.totalCost / stat.serviceCount).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < monthlyStats.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}
