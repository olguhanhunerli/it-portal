"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { adminTickets } from "@/services/admin/adminTicket";

export default function AdminTicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await adminTickets.getById(id);
        setTicket(res.data);
      } catch (error) {
        console.error("Ticket detail error:", error);
      }
    };

    if (id) fetchTicket();
  }, [id]);

  if (!ticket) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f6f8fb",
        p: { xs: 2, md: 4 },
      }}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Card sx={{ borderRadius: 4, width: "100%" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {ticket.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.ticketNumber}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={ticket.statusName || "-"} color="primary" />
                <Chip label={ticket.priorityName || "-"} variant="outlined" />
                <Chip label={ticket.typeName || "-"} variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2fr) 380px" },
            gap: 3,
            width: "100%",
            alignItems: "start",
          }}
        >
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Description
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  {ticket.description || "-"}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Comments
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {ticket.comments?.length ? (
                    ticket.comments.map((c, i) => (
                      <Paper
                        key={i}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: "1px solid #e8edf3",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography fontWeight={700}>
                              {c.authorName}
                            </Typography>
                            <Chip
                              size="small"
                              label={c.visibilityName || "Internal"}
                              variant="outlined"
                            />
                          </Stack>
                          <Typography variant="body2">{c.body}</Typography>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Henüz yorum yok.
                    </Typography>
                  )}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Add comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained" size="large">
                      Send Comment
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Activity
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {ticket.events?.length ? (
                    ticket.events.map((event, i) => (
                      <Paper
                        key={i}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: "1px solid #e8edf3",
                        }}
                      >
                        <Typography fontWeight={700}>
                          {event.eventType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.actorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.createdAt}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Aktivite bulunamadı.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Ticket Info
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Info label="Requester" value={ticket.requesterName} />
                  <Info label="Assignee" value={ticket.assigneeName} />
                  <Info label="Team" value={ticket.assignedTeamName} />
                  <Info label="Category" value={ticket.categoryName} />
                  <Info label="Subcategory" value={ticket.subcategoryName} />
                  <Info label="Service" value={ticket.serviceName} />
                  <Info label="Location" value={ticket.locationName} />
                  <Info label="Department" value={ticket.departmentName} />
                  <Info label="Created At" value={ticket.createdAt} />
                  <Info label="Updated At" value={ticket.updatedAt} />
                  <Info label="Due At" value={ticket.dueAt} />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                  Attachments
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {ticket.attachments?.length ? (
                    ticket.attachments.map((file) => (
                      <Paper
                        key={file.id}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: "1px solid #e8edf3",
                        }}
                      >
                        <Typography fontWeight={600}>
                          {file.fileName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {file.contentType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {file.fileSizeBytes} bytes
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Ek bulunamadı.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function Info({ label, value }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
      sx={{
        pb: 1.25,
        borderBottom: "1px solid #eef2f6",
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography textAlign="right" fontWeight={500}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}
