"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { employee } from "@/services/employee/employee";

const getStatusMeta = (statusName) => {
  const normalized = (statusName || "").toLowerCase();

  if (
    normalized.includes("tamam") ||
    normalized.includes("kapa") ||
    normalized.includes("çözü") ||
    normalized.includes("cozul")
  ) {
    return { label: statusName || "Tamamlandı", color: "success" };
  }

  if (
    normalized.includes("bek") ||
    normalized.includes("işlem") ||
    normalized.includes("yeniden")
  ) {
    return { label: statusName || "Beklemede", color: "warning" };
  }

  if (
    normalized.includes("yeni") ||
    normalized.includes("aç") ||
    normalized.includes("ac")
  ) {
    return { label: statusName || "Yeni", color: "info" };
  }

  return { label: statusName || "Bilinmiyor", color: "default" };
};

const formatDate = (value) => {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const getStats = (tickets, totalCount) => {
  return tickets.reduce(
    (acc, ticket) => {
      const status = (ticket.statusName || "").toLowerCase();

      acc.total = totalCount || 0;

      if (
        status.includes("tamam") ||
        status.includes("kapa") ||
        status.includes("çözü") ||
        status.includes("cozul")
      ) {
        acc.closed += 1;
      } else if (
        status.includes("bek") ||
        status.includes("işlem") ||
        status.includes("yeniden")
      ) {
        acc.pending += 1;
      } else {
        acc.open += 1;
      }

      return acc;
    },
    { total: totalCount || 0, open: 0, pending: 0, closed: 0 },
  );
};

export default function DashboardPage() {
  const [tickets, setTickets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);

  const fetchTickets = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await employee.getEmployeeTickets(page, pageSize);
      const payload = response || {};
      const items = payload?.data?.items || [];

      setTickets(items);
      setTotalCount(payload?.data?.totalCount || 0);
      setTotalPages(payload?.data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Ticket listesi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);
  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const stats = React.useMemo(
    () => getStats(tickets, totalCount),
    [tickets, totalCount],
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.background.paper} 55%)`,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    IT Portal
                  </Typography>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Ticket Portal
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshOutlinedIcon />}
                    onClick={fetchTickets}
                    disabled={loading}
                    sx={{ borderRadius: 999 }}
                  >
                    Yenile
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateModal(true)}
                    sx={{ borderRadius: 999, px: 2.5 }}
                  >
                    Yeni Ticket
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      }}
                    >
                      <ConfirmationNumberOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Toplam Ticket
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {stats.total}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "warning.main",
                        color: "warning.contrastText",
                      }}
                    >
                      <PendingActionsOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Açık / Bekleyen
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {stats.open + stats.pending}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "success.main",
                        color: "success.contrastText",
                      }}
                    >
                      <CheckCircleOutlineOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tamamlanan
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        {stats.closed}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Ticket Listesi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Son oluşturulan kayıtlar burada listelenir.
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Toplam {totalCount} kayıt
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : null}

              {loading ? (
                <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : tickets.length === 0 ? (
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 4,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Henüz ticket bulunmuyor
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    İlk kaydı oluşturmak için Yeni Ticket butonunu kullan.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateModal(true)}
                  >
                    Yeni Ticket
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {tickets.map((ticket) => {
                    const statusMeta = getStatusMeta(ticket.statusName);

                    return (
                      <Card
                        key={ticket.id}
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Stack spacing={2}>
                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              spacing={1.5}
                              justifyContent="space-between"
                              alignItems={{ xs: "flex-start", md: "center" }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  {ticket.ticketNumber}
                                </Typography>
                                <Typography variant="h6" fontWeight={700}>
                                  {ticket.title || "Başlıksız Ticket"}
                                </Typography>
                              </Box>

                              <Chip
                                label={statusMeta.label}
                                color={statusMeta.color}
                                variant="filled"
                                sx={{ fontWeight: 600 }}
                              />
                            </Stack>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Öncelik
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {ticket.priorityName || "-"}
                                </Typography>
                              </Grid>

                              <Grid item xs={12} md={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Atanan Kişi
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {ticket.assigneeName || "Atanmadı"}
                                </Typography>
                              </Grid>

                              <Grid item xs={12} md={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Oluşturulma
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {formatDate(ticket.createdAt)}
                                </Typography>
                              </Grid>

                              <Grid item xs={12} md={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Termin
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {formatDate(ticket.dueAt)}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Stack direction="row" justifyContent="flex-end">
                              <Button
                                endIcon={
                                  <ArrowForwardIosRoundedIcon
                                    sx={{ fontSize: 14 }}
                                  />
                                }
                              >
                                Detaya Git
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              )}

              {!loading && totalPages > 1 ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    page={page}
                    count={totalPages}
                    color="primary"
                    onChange={(_, value) => setPage(value)}
                  />
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Yeni Ticket</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Şimdilik sadece dashboard istendiği için bu alan placeholder
            bırakıldı. Sonraki adımda buraya form veya create sayfasına
            yönlendirme ekleyebiliriz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Kapat</Button>
          <Button variant="contained" onClick={() => setOpenCreateModal(false)}>
            Tamam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
