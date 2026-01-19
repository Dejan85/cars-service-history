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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";

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

export default function ServiceList({
  services,
  onEdit,
  onDelete,
  showVehicle = false,
}: ServiceListProps) {
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Datum</TableCell>
            {showVehicle && <TableCell>Vozilo</TableCell>}
            <TableCell>Kilometraža</TableCell>
            <TableCell>Opis</TableCell>
            <TableCell align="center">Stavki</TableCell>
            <TableCell align="right">Trošak (€)</TableCell>
            <TableCell align="right">Akcije</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((service) => (
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
