"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  initialData?: ServiceFormData;
  vehicleId?: string;
}

export interface ServiceFormData {
  vehicleId?: string;
  date: Dayjs | null;
  mileage: string;
  description: string;
  cost: string;
  notes?: string;
  isPreviousOwner?: boolean;
  isOffroad?: boolean;
  items: ServiceItem[];
}

interface ServiceItem {
  description: string;
  cost: string;
}

export default function ServiceForm({
  open,
  onClose,
  onSubmit,
  initialData,
  vehicleId,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>(
    initialData || {
      vehicleId: vehicleId || "",
      date: dayjs(),
      mileage: "",
      description: "",
      cost: "0",
      notes: "",
      isPreviousOwner: false,
      isOffroad: false,
      items: [],
    },
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        vehicleId: vehicleId || "",
        date: dayjs(),
        mileage: "",
        description: "",
        cost: "0",
        notes: "",
        isPreviousOwner: false,
        isOffroad: false,
        items: [],
      });
    }
  }, [initialData, vehicleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange =
    (field: keyof ServiceFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData({ ...formData, date });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", cost: "0" }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (
    index: number,
    field: keyof ServiceItem,
    value: string,
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotalCost = () => {
    const itemsTotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.cost) || 0);
    }, 0);
    const mainCost = parseFloat(formData.cost) || 0;
    return itemsTotal + mainCost;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {initialData ? "Izmeni servis" : "Dodaj novi servis"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <DatePicker
                label="Datum servisa"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
              <TextField
                label="Kilometraža"
                type="number"
                value={formData.mileage}
                onChange={handleChange("mileage")}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Opis servisa"
                value={formData.description}
                onChange={handleChange("description")}
                required
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Osnovni trošak (€)"
                type="number"
                value={formData.cost}
                onChange={handleChange("cost")}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                label="Napomene"
                value={formData.notes}
                onChange={handleChange("notes")}
                fullWidth
                multiline
                rows={2}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isPreviousOwner || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isPreviousOwner: e.target.checked,
                      })
                    }
                  />
                }
                label="Servis prethodnog vlasnika"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isOffroad || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isOffroad: e.target.checked,
                      })
                    }
                  />
                }
                label="Offroad modifikacija"
              />

              <Divider sx={{ my: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Stavke servisa</Typography>
                <Button startIcon={<Add />} onClick={addItem}>
                  Dodaj stavku
                </Button>
              </Box>

              {formData.items.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 1, alignItems: "start" }}
                >
                  <TextField
                    label="Opis stavke"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Cena (€)"
                    type="number"
                    value={item.cost}
                    onChange={(e) => updateItem(index, "cost", e.target.value)}
                    sx={{ width: 150 }}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <IconButton
                    onClick={() => removeItem(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" align="right">
                  Ukupno: €{calculateTotalCost().toFixed(2)}
                </Typography>
              </Box>
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
    </LocalizationProvider>
  );
}
