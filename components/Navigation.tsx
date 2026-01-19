"use client";

import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { DirectionsCar, Build, Home } from "@mui/icons-material";
import Link from "next/link";

export default function Navigation() {
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
          >
            Početna
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/vehicles"
            startIcon={<DirectionsCar />}
          >
            Vozila
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/services"
            startIcon={<Build />}
          >
            Servisi
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
