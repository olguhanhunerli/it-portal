"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";
import RefreshIcon from "@mui/icons-material/Refresh";
import { location } from "@/services/admin/locations";

function StatCard({ title, value, icon }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Location() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });

  const [newLocationName, setNewLocationName] = useState("");

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await location.getAllLocations(page + 1, rowsPerPage);
      setData(res?.data || res);
    } catch (err) {
      console.error(err);
      setError("Lokasyonlar alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [page, rowsPerPage]);

  const items = useMemo(() => {
    return data?.items || [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalCount || 0;
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreate = async () => {
    if (!newLocationName.trim()) {
      setError("Lokasyon adı boş bırakılamaz.");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      await location.createLocation({
        name: newLocationName.trim(),
      });

      setCreateDialog(false);
      setNewLocationName("");
      fetchLocations();
    } catch (err) {
      console.error(err);
      setError("Lokasyon oluşturulamadı.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editDialog.name.trim()) {
      setError("Lokasyon adı boş bırakılamaz.");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      await location.updateLocation(editDialog.id, {
        name: editDialog.name.trim(),
      });

      setEditDialog({
        open: false,
        id: null,
        name: "",
      });

      fetchLocations();
    } catch (err) {
      console.error(err);
      setError("Lokasyon güncellenemedi.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitLoading(true);
      setError("");

      await location.deleteLocation(deleteDialog.id);

      setDeleteDialog({
        open: false,
        id: null,
        name: "",
      });

      fetchLocations();
    } catch (err) {
      console.error(err);
      setError("Lokasyon silinemedi.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Lokasyonlar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lokasyon listesi ve yönetimi
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              {/* <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchLocations}
                disabled={loading}
              >
                Yenile
              </Button> */}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialog(true)}
              >
                Yeni Lokasyon
              </Button>
            </Stack>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Toplam Lokasyon"
                value={items.length}
                icon={<PlaceIcon />}
              />
            </Grid>
          </Grid>

          <Paper sx={{ borderRadius: 3 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 8,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width={100}>#</TableCell>
                        <TableCell>Lokasyon Adı</TableCell>
                        <TableCell align="center" width={220}>
                          İşlemler
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {items.length > 0 ? (
                        items.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="center">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    setEditDialog({
                                      open: true,
                                      id: item.id,
                                      name: item.name,
                                    })
                                  }
                                >
                                  <EditIcon />
                                </IconButton>

                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    setDeleteDialog({
                                      open: true,
                                      id: item.id,
                                      name: item.name,
                                    })
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Typography py={4} color="text.secondary">
                              Kayıt bulunamadı.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </>
            )}
          </Paper>
        </Stack>
      </Container>

      <Dialog
        open={createDialog}
        onClose={() => {
          if (!submitLoading) {
            setCreateDialog(false);
            setNewLocationName("");
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Yeni Lokasyon Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            label="Lokasyon Adı"
            fullWidth
            margin="normal"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialog(false);
              setNewLocationName("");
            }}
            disabled={submitLoading}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={submitLoading}
          >
            {submitLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialog.open}
        onClose={() => {
          if (!submitLoading) {
            setEditDialog({
              open: false,
              id: null,
              name: "",
            });
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Lokasyon Güncelle</DialogTitle>
        <DialogContent>
          <TextField
            label="Lokasyon Adı"
            fullWidth
            margin="normal"
            value={editDialog.name}
            onChange={(e) =>
              setEditDialog((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setEditDialog({
                open: false,
                id: null,
                name: "",
              })
            }
            disabled={submitLoading}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleEdit}
            disabled={submitLoading}
          >
            {submitLoading ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => {
          if (!submitLoading) {
            setDeleteDialog({
              open: false,
              id: null,
              name: "",
            });
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Lokasyonu Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{deleteDialog.name}</strong> lokasyonunu silmek istediğinize
            emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog({
                open: false,
                id: null,
                name: "",
              })
            }
            disabled={submitLoading}
          >
            İptal
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={submitLoading}
          >
            {submitLoading ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
