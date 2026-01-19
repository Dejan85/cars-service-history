"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

interface VehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => void;
  initialData?: VehicleFormData;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  vin?: string;
  plateNumber?: string;
}

export default function VehicleForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(
    initialData || {
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      vin: "",
      plateNumber: "",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange =
    (field: keyof VehicleFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Izmeni vozilo" : "Dodaj novo vozilo"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Proizvodjač"
              value={formData.make}
              onChange={handleChange("make")}
              required
              fullWidth
            />
            <TextField
              label="Model"
              value={formData.model}
              onChange={handleChange("model")}
              required
              fullWidth
            />
            <TextField
              label="Godina"
              type="number"
              value={formData.year}
              onChange={handleChange("year")}
              required
              fullWidth
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
            />
            <TextField
              label="VIN"
              value={formData.vin}
              onChange={handleChange("vin")}
              fullWidth
            />
            <TextField
              label="Registarska tablica"
              value={formData.plateNumber}
              onChange={handleChange("plateNumber")}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Otkaži</Button>
          <Button type="submit" variant="contained">
            {initialData ? "Sačuvaj" : "Dodaj"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
