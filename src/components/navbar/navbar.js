"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

const pages = [
  { label: "Tickets", path: "/admin/dashboard/tickets" },
  { label: "Departman", path: "/admin/dashboard/department" },
  { label: "Lokasyon", path: "/lokasyon" },
  { label: "Kullanıcılar", path: "/kullanicilar" },
  { label: "Roller", path: "/roller" },
];

const settings = [
  { label: "Profile", path: "/profile" },
  { label: "Account", path: "/account" },
  { label: "Dashboard", path: "/" },
  { label: "Logout", path: "/login" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User parse error:", error);
      }
    }
  }, []);

  const isEmployee = user?.roles?.includes("Employee");

  const hiddenForEmployee = [
    "/admin/dashboard/tickets",
    "/admin/dashboard/department",
    "/lokasyon",
    "/kullanicilar",
    "/roller",
  ];

  const filteredPages = isEmployee
    ? pages.filter((page) => !hiddenForEmployee.includes(page.path))
    : pages;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (path) => {
    if (pathname === path) {
      handleCloseNavMenu();
      handleCloseUserMenu();
      return;
    }

    router.push(path);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.push("/login");
    handleCloseUserMenu();
  };

  const initials =
    user?.fullName?.charAt(0)?.toUpperCase() ||
    user?.userName?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1.2,
              mr: 4,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #60a5fa, #2563eb)",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
              }}
            >
              <DashboardRoundedIcon sx={{ color: "#fff", fontSize: 22 }} />
            </Box>

            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: ".08rem",
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              IT Portal
            </Typography>
          </Box>
          {isEmployee ? (
            <div></div>
          ) : (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 3,
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                  },
                }}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {filteredPages.map((page) => (
                  <MenuItem
                    key={page.path}
                    onClick={() => handleNavigate(page.path)}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: pathname === page.path ? 700 : 500,
                        color: pathname === page.path ? "#60a5fa" : "#fff",
                      }}
                    >
                      {page.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #60a5fa, #2563eb)",
              }}
            >
              <DashboardRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>

            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: ".05rem",
                color: "#fff",
              }}
            >
              IT Portal
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 1,
            }}
          >
            {filteredPages.map((page) => {
              const active = pathname === page.path;

              return (
                <Button
                  key={page.path}
                  onClick={() => handleNavigate(page.path)}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "12px",
                    color: active ? "#ffffff" : "rgba(255,255,255,0.82)",
                    backgroundColor: active
                      ? "rgba(96, 165, 250, 0.18)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(96, 165, 250, 0.28)"
                      : "1px solid transparent",
                    fontWeight: active ? 700 : 500,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    },
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              sx={{
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>

            <Tooltip title="Kullanıcı menüsü">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="User"
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#2563eb",
                    fontWeight: 700,
                    border: "2px solid rgba(255,255,255,0.18)",
                  }}
                >
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "50px" }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  minWidth: 220,
                  borderRadius: 3,
                  p: 1,
                  backgroundColor: "#0f172a",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
                },
              }}
            >
              <Box sx={{ px: 1.5, py: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                  {user?.fullName || "Kullanıcı"}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}
                >
                  {user?.userName || "-"}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />

              {settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={() =>
                    setting.label === "Logout"
                      ? handleLogout()
                      : handleNavigate(setting.path)
                  }
                  sx={{
                    borderRadius: 2,
                    mx: 0.5,
                    my: 0.3,
                    "&:hover": {
                      backgroundColor:
                        setting.label === "Logout"
                          ? "rgba(239, 68, 68, 0.12)"
                          : "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color:
                        setting.label === "Logout"
                          ? "#f87171"
                          : "rgba(255,255,255,0.92)",
                    }}
                  >
                    {setting.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
