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
  Divider,
  Drawer,
  Grid,
  IconButton,
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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { employee } from "@/services/employee/employee";
import CreateTicket from "../ticketcreate/ticketcreate";
import { useRouter } from "next/navigation";

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
  } catch {
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

function StatCard({ title, value, icon, bgColor, textColor }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              bgcolor: bgColor,
              color: textColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={800}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TicketInfoItem({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || "-"}
      </Typography>
    </Box>
  );
}
export default function DashboardPage() {
  const [tickets, setTickets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const router = useRouter();
  const [openCreatePanel, setOpenCreatePanel] = React.useState(false);

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

  const handleCloseDrawer = () => {
    setOpenCreatePanel(false);
  };

  const handleCreateSuccess = async () => {
    setOpenCreatePanel(false);
    await fetchTickets();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.background.paper} 55%)`,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: 1.2 }}
                  >
                    IT PORTAL
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ mb: 0.5, lineHeight: 1.15 }}
                  >
                    Ticket Dashboard
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Taleplerini görüntüle, yeni ticket oluştur ve mevcut
                    kayıtları yönet.
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshOutlinedIcon />}
                    onClick={fetchTickets}
                    disabled={loading}
                    sx={{
                      borderRadius: 999,
                      px: 2,
                      minWidth: 120,
                    }}
                  >
                    Yenile
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push("/employee/CreateTicket")}
                    sx={{
                      borderRadius: 999,
                      px: 2.5,
                    }}
                  >
                    Yeni Ticket
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Toplam Ticket"
                value={stats.total}
                icon={<ConfirmationNumberOutlinedIcon />}
                bgColor="primary.main"
                textColor="primary.contrastText"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StatCard
                title="Açık / Bekleyen"
                value={stats.open + stats.pending}
                icon={<PendingActionsOutlinedIcon />}
                bgColor="warning.main"
                textColor="warning.contrastText"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <StatCard
                title="Tamamlanan"
                value={stats.closed}
                icon={<CheckCircleOutlineOutlinedIcon />}
                bgColor="success.main"
                textColor="success.contrastText"
              />
            </Grid>
          </Grid>

          <Card
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
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
                  <Typography variant="h6" fontWeight={800}>
                    Ticket Listesi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Son oluşturulan destek kayıtları burada listelenir.
                  </Typography>
                </Box>

                <Chip
                  label={`Toplam ${totalCount} kayıt`}
                  variant="outlined"
                  sx={{ borderRadius: 999, fontWeight: 600 }}
                />
              </Stack>

              <Divider sx={{ mb: 2.5 }} />

              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : null}

              {loading ? (
                <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : tickets.length === 0 ? (
                <Box
                  sx={{
                    py: 8,
                    px: 3,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 4,
                    bgcolor: "background.default",
                  }}
                >
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Henüz ticket bulunmuyor
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2.5, maxWidth: 420, mx: "auto" }}
                  >
                    İlk kaydı oluşturmak için aşağıdaki butonu kullanabilirsin.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreatePanel(true)}
                    sx={{ borderRadius: 999, px: 2.5 }}
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
                          borderRadius: 4,
                          border: "1px solid",
                          borderColor: "divider",
                          boxShadow: "0 1px 2px rgba(16,24,40,0.03)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "primary.main",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(16,24,40,0.08)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack spacing={2}>
                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              spacing={1.5}
                              justifyContent="space-between"
                              alignItems={{
                                xs: "flex-start",
                                md: "flex-start",
                              }}
                            >
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  {ticket.ticketNumber || "-"}
                                </Typography>

                                <Typography
                                  variant="h6"
                                  fontWeight={800}
                                  sx={{
                                    lineHeight: 1.2,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {ticket.title || "Başlıksız Ticket"}
                                </Typography>
                              </Box>

                              <Chip
                                label={statusMeta.label}
                                color={statusMeta.color}
                                variant="filled"
                                sx={{
                                  fontWeight: 700,
                                  borderRadius: 999,
                                }}
                              />
                            </Stack>

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={3}>
                                <TicketInfoItem
                                  label="Öncelik"
                                  value={ticket.priorityName || "-"}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TicketInfoItem
                                  label="Atanan Kişi"
                                  value={ticket.assigneeName || "Atanmadı"}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TicketInfoItem
                                  label="Oluşturulma"
                                  value={formatDate(ticket.createdAt)}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={3}>
                                <TicketInfoItem
                                  label="Termin"
                                  value={formatDate(ticket.dueAt)}
                                />
                              </Grid>
                            </Grid>

                            <Stack direction="row" justifyContent="flex-end">
                              <Button
                                variant="text"
                                endIcon={
                                  <ArrowForwardIosRoundedIcon
                                    sx={{ fontSize: 14 }}
                                  />
                                }
                                sx={{ borderRadius: 999 }}
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
                    shape="rounded"
                    onChange={(_, value) => setPage(value)}
                  />
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
