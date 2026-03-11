"use client";

import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Container, Chip, Box, Button } from "@mui/material";
import { adminTickets } from "@/services/admin/adminTicket";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await adminTickets.getAllTickets(1, 10);
        setTickets(response.data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Yeni") return "warning";
    if (status === "Tamamlandı") return "success";
    if (status === "Yeniden Açıldı") return "error";
    return "default";
  };

  if (loading) {
    return (
      <Container sx={{ my: 3 }}>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ my: 3 }}>
      {tickets.map((ticket) => (
        <Accordion key={ticket.id} sx={{ my: 2, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                pr: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {ticket.ticketNumber}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                  {ticket.title}
                </Typography>
              </Box>

              <Chip
                label={ticket.statusName}
                color={getStatusColor(ticket.statusName)}
                size="small"
              />
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Typography sx={{ mb: 1 }}>
              <b>Talep Eden:</b> {ticket.requesterName}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <b>Atanan:</b> {ticket.assigneeName || "Atanmadı"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <b>Öncelik:</b> {ticket.priorityName || "Belirtilmemiş"}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <b>Oluşturulma:</b>{" "}
              {new Date(ticket.createdAt).toLocaleString("tr-TR")}
            </Typography>
            <Typography>
              <b>Bitiş:</b>{" "}
              {ticket.dueAt
                ? new Date(ticket.dueAt).toLocaleString("tr-TR")
                : "Yok"}
            </Typography>
            <Button variant="contained" size="small" sx={{ mt: 2 }}>
              Detayları Gör
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
