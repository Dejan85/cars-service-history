"use client";

import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { DirectionsCar, Home, Analytics } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <DirectionsCar sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Car Service
          </Typography>

          <Button
            color="inherit"
            component={Link}
            href="/"
            startIcon={<Home />}
            sx={{
              bgcolor:
                pathname === "/" ? "rgba(255, 255, 255, 0.2)" : "transparent",
              "&:hover": {
                bgcolor:
                  pathname === "/"
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Početna
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/vehicles"
            startIcon={<DirectionsCar />}
            sx={{
              bgcolor: pathname?.startsWith("/vehicles")
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
              "&:hover": {
                bgcolor: pathname?.startsWith("/vehicles")
                  ? "rgba(255, 255, 255, 0.25)"
                  : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Vozila
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/analytics"
            startIcon={<Analytics />}
            sx={{
              bgcolor:
                pathname === "/analytics"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              "&:hover": {
                bgcolor:
                  pathname === "/analytics"
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Analitika
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
