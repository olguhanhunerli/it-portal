"use client";
import account from "@/services/account/account";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await account.login(formData);
      console.log("login result:", result);

      if (!result?.success) {
        setError(result?.message || "Giriş başarısız");
        return;
      }

      const meResult = await account.getMe();
      console.log("me result:", meResult);

      if (!meResult?.success) {
        setError(meResult?.message || "Kullanıcı bilgisi alınamadı");
        return;
      }

      const user = meResult?.data;
      const roles = user?.roles || [];

      if (roles.includes("Employee")) {
        console.log("employee dashboarda gidiyor");
        router.push("/employee/dashboard");
      } else {
        console.log("admin dashboarda gidiyor");
        router.push("/admin/dashboard/tickets");
      }
    } catch (err) {
      console.log("Login error:", err);
      setError(err?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" gutterBottom>
            Giriş Yap
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Giriş Yap"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
