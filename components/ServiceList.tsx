"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  TableSortLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { useState, useMemo } from "react";

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

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  showVehicle?: boolean;
}

type SortField = "date" | "mileage" | "items" | "cost";
type SortOrder = "asc" | "desc";

export default function ServiceList({
  services,
  onEdit,
  onDelete,
  showVehicle = false,
}: ServiceListProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  if (services.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Nema evidentiranih servisa.
        </Typography>
      </Box>
    );
  }

  const calculateTotalCost = (service: Service) => {
    const itemsCost =
      service.items?.reduce((sum, item) => sum + item.cost, 0) || 0;
    return service.cost + itemsCost;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "mileage":
          comparison = a.mileage - b.mileage;
          break;
        case "items":
          comparison = (a.items?.length || 0) - (b.items?.length || 0);
          break;
        case "cost":
          comparison = calculateTotalCost(a) - calculateTotalCost(b);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [services, sortField, sortOrder]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === "date"}
                direction={sortField === "date" ? sortOrder : "asc"}
                onClick={() => handleSort("date")}
              >
                Datum
              </TableSortLabel>
            </TableCell>
            {showVehicle && <TableCell>Vozilo</TableCell>}
            <TableCell>
              <TableSortLabel
                active={sortField === "mileage"}
                direction={sortField === "mileage" ? sortOrder : "asc"}
                onClick={() => handleSort("mileage")}
              >
                Kilometraža
              </TableSortLabel>
            </TableCell>
            <TableCell>Opis</TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "items"}
                direction={sortField === "items" ? sortOrder : "asc"}
                onClick={() => handleSort("items")}
              >
                Stavki
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === "cost"}
                direction={sortField === "cost" ? sortOrder : "asc"}
                onClick={() => handleSort("cost")}
              >
                Trošak (€)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Akcije</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedServices.map((service) => (
            <TableRow key={service.id} hover>
              <TableCell>{dayjs(service.date).format("DD.MM.YYYY")}</TableCell>
              {showVehicle && (
                <TableCell>
                  {service.vehicle?.make} {service.vehicle?.model}
                </TableCell>
              )}
              <TableCell>{service.mileage.toLocaleString()} km</TableCell>
              <TableCell>
                <Typography variant="body2">{service.description}</Typography>
                {service.notes && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {service.notes}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={service.items?.length || 0}
                  size="small"
                  color={service.items?.length ? "primary" : "default"}
                />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold">
                  €{calculateTotalCost(service).toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onEdit(service)}
                  size="small"
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(service.id)}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
