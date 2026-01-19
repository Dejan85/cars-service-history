import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { DirectionsCar, Build } from "@mui/icons-material";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Car Service History
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          Evidencija servisa automobila
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 6,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <DirectionsCar sx={{ fontSize: 60, color: "primary.main" }} />
          <Typography variant="h5">Vozila</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Dodajte i upravljajte vašim vozilima
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/vehicles"
            sx={{ mt: 2 }}
          >
            Pregled vozila
          </Button>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Build sx={{ fontSize: 60, color: "secondary.main" }} />
          <Typography variant="h5">Servisi</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Evidentirajte servise i troškove održavanja
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            href="/services"
            sx={{ mt: 2 }}
          >
            Pregled servisa
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
