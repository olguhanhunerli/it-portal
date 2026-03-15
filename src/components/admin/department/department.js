"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import {
  DepartmentDelete,
  DepartmentService,
} from "@/services/admin/department";
import { useRouter } from "next/navigation";

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

export default function DepartmentsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const router = useRouter();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await DepartmentService.getAllDepartment(
        page + 1,
        rowsPerPage,
      );
      setData(res);
    } catch (err) {
      setError("Departments alınamadı");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, [page, rowsPerPage]);

  const items = data?.data?.items || [];

  const totalUsers = useMemo(() => {
    return items.reduce((sum, d) => sum + d.userCount, 0);
  }, [items]);

  const totalTeams = useMemo(() => {
    return items.reduce((sum, d) => sum + d.teamCount, 0);
  }, [items]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDelete = async () => {
    try {
      await DepartmentDelete.delete(deleteDialog.id);
      fetchDepartments();
    } catch (err) {
      setError("Departman silinemedi");
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };
  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                sx={{ mb: 1 }}
                display="flex"
                flexDirection="column"
                gap={0.5}
              >
                <Typography variant="h4" fontWeight={800}>
                  Departmanlar
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Departman listesi
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  component={Link}
                  variant="contained"
                  href="/admin/dashboard/department/create"
                >
                  Yeni Departman
                </Button>

                {/* <Tooltip title="Yenile">
                <IconButton onClick={fetchDepartments}>
                  {loading ? <CircularProgress size={22} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip> */}
              </Stack>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Toplam Departman Sayısı"
                  value={data?.data?.totalCount || 0}
                  icon={<BusinessIcon />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  title="Toplam Kullanıcı Sayısı"
                  value={totalUsers}
                  icon={<GroupsIcon />}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  title="Toplam Takım Sayısı"
                  value={totalTeams}
                  icon={<Diversity3Icon />}
                />
              </Grid>
            </Grid>

            <Paper sx={{ borderRadius: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Ad</TableCell>
                      <TableCell align="center">Kullanıcı Sayısı</TableCell>
                      <TableCell align="center">Takım Sayısı</TableCell>
                      <TableCell>Durum</TableCell>
                      <TableCell align="center">İşlemler</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {items.map((dep) => (
                      <TableRow key={dep.id} hover>
                        <TableCell>{dep.id}</TableCell>
                        <TableCell>{dep.name}</TableCell>
                        <TableCell align="center">{dep.userCount}</TableCell>
                        <TableCell align="center">{dep.teamCount}</TableCell>
                        <TableCell>
                          {dep.userCount > 0 ? (
                            <Chip label="Aktif" color="success" size="small" />
                          ) : (
                            <Chip label="Boş" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip title="Görüntüle / Düzenle">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  router.push(
                                    `/admin/dashboard/department/${dep.id}`,
                                  )
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Sil">
                              <IconButton
                                color="error"
                                onClick={() =>
                                  setDeleteDialog({ open: true, id: dep.id })
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={data?.data?.totalCount || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Paper>
          </Stack>
        </Container>
      </Box>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <Box p={3}>
          <Typography variant="h6" mb={2}>
            Departmanı silmek istediğinize emin misiniz?
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
              İptal
            </Button>

            <Button color="error" variant="contained" onClick={handleDelete}>
              Sil
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
