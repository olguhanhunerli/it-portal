"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
} from "@mui/material";
import {
  DepartmentCard,
  DepartmentUpdate,
  DepartmentCreate,
} from "@/services/admin/department";
import { useRouter } from "next/navigation";

export default function DepartmentForm({ id }) {
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigation = useRouter();

  const [dialog, setDialog] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await DepartmentCard.getById(id);
        const data = response.data;

        setFormData({
          name: data?.name ?? "",
          createdAt: data?.createdAt ? data.createdAt.slice(0, 16) : "",
        });
      } catch (err) {
        setError("Veri alınamadı.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      fetchDepartment();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setDialog({
        open: true,
        message: "Departman adı boş bırakılamaz.",
        severity: "error",
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
      };

      if (isEdit) {
        await DepartmentUpdate.put(id, payload);
        setDialog({
          open: true,
          message: "Departman başarıyla güncellendi.",
          severity: "success",
        });
      } else {
        await DepartmentCreate.post(payload);
        setDialog({
          open: true,
          message: "Departman başarıyla oluşturuldu.",
          severity: "success",
        });
      }
    } catch (err) {
      setDialog({
        open: true,
        message: isEdit
          ? "Departman güncellenirken bir hata oluştu."
          : "Departman oluşturulurken bir hata oluştu.",
        severity: "error",
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    const wasSuccess = dialog.severity === "success";

    setDialog((prev) => ({ ...prev, open: false }));

    if (wasSuccess) {
      navigation.replace("/admin/dashboard/department");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Paper sx={{ maxWidth: 500, mx: "auto", mt: 6, p: 4 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? "Departman Güncelle" : "Departman Oluştur"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            {isEdit && (
              <TextField
                label="Created At"
                name="createdAt"
                type="datetime-local"
                value={formData.createdAt}
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
              />
            )}

            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Oluştur"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={dialog.open} onClose={handleCloseDialog}>
        <Box p={3} minWidth={300}>
          <Alert severity={dialog.severity} variant="filled">
            {dialog.message}
          </Alert>
        </Box>
      </Dialog>
    </>
  );
}
