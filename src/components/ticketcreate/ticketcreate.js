"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Lookup } from "@/services/lookup/lookup";

const sectionCardSx = {
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "none",
  bgcolor: "#fff",
};

const fieldSx = {
  width: "100%",
  "& .MuiInputBase-root": {
    minHeight: 54,
    backgroundColor: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
  },
};

const sectionHeaderIconSx = {
  width: 42,
  height: 42,
  borderRadius: 2.5,
  display: "grid",
  placeItems: "center",
  bgcolor: "primary.main",
  color: "primary.contrastText",
  flexShrink: 0,
};

export default function CreateTicket({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    typeId: "",
    title: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    priorityId: "",
    serviceId: "",
    configurationItemId: "",
    requestedForId: "",
    dueAt: null,
  });

  const [lookups, setLookups] = useState({
    types: [],
    categories: [],
    subcategories: [],
    priorities: [],
    services: [],
    configurationItems: [],
    employees: [],
  });

  const [loadingLookups, setLoadingLookups] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
    }));
  };

  const handleDateChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      dueAt: value,
    }));
  };

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        setLoadingLookups(true);
        setError("");

        const lookupTypes = await Lookup.getLookupTypes({ take: 20 });

        if (lookupTypes?.success) {
          setLookups((prev) => ({
            ...prev,
            types: lookupTypes.data || [],
          }));
        }
      } catch (err) {
        console.error("Error fetching lookup types:", err);
        setError("Lookup verileri alınırken hata oluştu.");
      } finally {
        setLoadingLookups(false);
      }
    };

    fetchLookups();
  }, []);

  const isFormValid = useMemo(() => {
    return Boolean(
      formData.typeId && formData.title.trim() && formData.description.trim(),
    );
  }, [formData]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,
        typeId: formData.typeId ? Number(formData.typeId) : 0,
        categoryId: formData.categoryId ? Number(formData.categoryId) : 0,
        subcategoryId: formData.subcategoryId
          ? Number(formData.subcategoryId)
          : 0,
        priorityId: formData.priorityId ? Number(formData.priorityId) : 0,
        serviceId: formData.serviceId ? Number(formData.serviceId) : 0,
        configurationItemId: formData.configurationItemId
          ? Number(formData.configurationItemId)
          : 0,
        requestedForId: formData.requestedForId
          ? Number(formData.requestedForId)
          : 0,
        dueAt: formData.dueAt ? dayjs(formData.dueAt).toISOString() : null,
      };

      console.log("submit payload:", payload);

      setSuccess("Ticket başarıyla oluşturuldu.");

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err) {
      console.error(err);
      setError("Ticket oluşturulurken hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <Box>
          <Chip
            label="Yeni Ticket"
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 999, fontWeight: 600, mb: 1.5 }}
          />

          <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
            Yeni destek kaydı oluştur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerekli alanları doldur, ticket hızlıca sisteme düşsün.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {success ? <Alert severity="success">{success}</Alert> : null}

        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box sx={sectionHeaderIconSx}>
                <AssignmentOutlinedIcon />
              </Box>
              <Box>
                <Typography fontWeight={800} variant="h6">
                  Temel Bilgiler
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ticket başlığı ve açıklamasını gir.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Ticket Type"
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Ticket type seçin
                  </MenuItem>
                  {lookups.types.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nameTr}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Örn. Laptop erişim sorunu"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  minRows={5}
                  placeholder="Sorunu detaylı şekilde açıklayın..."
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box sx={sectionHeaderIconSx}>
                <CategoryOutlinedIcon />
              </Box>
              <Box>
                <Typography fontWeight={800} variant="h6">
                  Sınıflandırma
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Öncelik, kategori ve servis bilgilerini seç.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Category seçin
                  </MenuItem>
                  {lookups.categories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Subcategory"
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  disabled={!formData.categoryId || loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Subcategory seçin
                  </MenuItem>
                  {lookups.subcategories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  name="priorityId"
                  value={formData.priorityId}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Priority seçin
                  </MenuItem>
                  {lookups.priorities.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Service"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Service seçin
                  </MenuItem>
                  {lookups.services.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Configuration Item"
                  name="configurationItemId"
                  value={formData.configurationItemId}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Configuration item seçin
                  </MenuItem>
                  {lookups.configurationItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={sectionCardSx}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box sx={sectionHeaderIconSx}>
                <InfoOutlinedIcon />
              </Box>
              <Box>
                <Typography fontWeight={800} variant="h6">
                  Ek Bilgiler
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Talep sahibi ve termin tarihi gibi ek alanlar.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Requested For"
                  name="requestedForId"
                  value={formData.requestedForId}
                  onChange={handleChange}
                  disabled={loadingLookups}
                  sx={fieldSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Talep sahibi seçin
                  </MenuItem>
                  {lookups.employees.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Due Date"
                  value={formData.dueAt}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: fieldSx,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 5,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
            px: 2,
            py: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography variant="body2" color="text.secondary">
              Zorunlu alanlar: Tip, Başlık, Açıklama
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{ minWidth: 110 }}
              >
                Vazgeç
              </Button>

              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSubmit}
                disabled={submitting || !isFormValid}
                sx={{ minWidth: 170 }}
              >
                {submitting ? "Oluşturuluyor..." : "Ticket Oluştur"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}
