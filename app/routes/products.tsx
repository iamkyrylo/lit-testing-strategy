import { Outlet } from "react-router";
import { Container, Typography } from "@mui/material";

export default function ProductsLayout() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Outlet />
    </Container>
  );
}
