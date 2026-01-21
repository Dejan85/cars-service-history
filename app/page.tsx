import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { DirectionsCar, Analytics } from "@mui/icons-material";
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
          <Analytics sx={{ fontSize: 60, color: "success.main" }} />
          <Typography variant="h5">Analitika</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Pratite pouzdanost i troškove održavanja
          </Typography>
          <Button
            variant="contained"
            color="success"
            component={Link}
            href="/analytics"
            sx={{ mt: 2 }}
          >
            Pregled analitike
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
