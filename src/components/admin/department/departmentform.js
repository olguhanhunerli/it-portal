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
import { DepartmentCard, DepartmentUpdate } from "@/services/admin/department";
import { useRouter } from "next/navigation";

export default function DepartmentForm({ id }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
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
          id: data?.id ?? "",
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

    if (id) {
      fetchDepartment();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await DepartmentUpdate.put(id, {
        name: formData.name,
      });
      setDialog({
        open: true,
        message: "Departman başarıyla güncellendi.",
        severity: "success",
      });
    } catch (err) {
      setDialog({
        open: true,
        message: "Departman güncellenirken bir hata oluştu.",
        severity: "error",
      });
      console.error(err);
    }
  };

  const handleCloseDialog = () => {
    setDialog((prev) => ({ ...prev, open: false }));

    if (dialog.severity === "success") {
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
          Department Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Created At"
              name="createdAt"
              type="datetime-local"
              value={formData.createdAt}
              // onChange={handleChange}
              fullWidth
              disabled
            />

            <Button type="submit" variant="contained">
              Kaydet
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
      ;
    </>
  );
}
