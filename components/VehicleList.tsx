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
import { Edit, Delete, Visibility } from "@mui/icons-material";
import Link from "next/link";

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

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export default function VehicleList({
  vehicles,
  onEdit,
  onDelete,
}: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Nema dodanih vozila. Dodajte prvo vozilo.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Proizvodjač</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Godina</TableCell>
            <TableCell>Registracija</TableCell>
            <TableCell>VIN</TableCell>
            <TableCell align="center">Servisi</TableCell>
            <TableCell align="center">Zadnja kilometraža</TableCell>
            <TableCell align="right">Akcije</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} hover>
              <TableCell>{vehicle.make}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>
                {vehicle.plateNumber || (
                  <Typography variant="caption" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {vehicle.vin ? (
                  <Typography variant="caption">{vehicle.vin}</Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={vehicle._count?.services || 0}
                  size="small"
                  color={vehicle._count?.services ? "primary" : "default"}
                />
              </TableCell>
              <TableCell align="center">
                {vehicle.services?.[0]?.mileage ? (
                  `${vehicle.services[0].mileage.toLocaleString()} km`
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    -
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  component={Link}
                  href={`/vehicles/${vehicle.id}`}
                  size="small"
                  color="info"
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  onClick={() => onEdit(vehicle)}
                  size="small"
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(vehicle.id)}
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
