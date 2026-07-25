import { Outlet, useLocation, useNavigate } from "react-router";
import { Container, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProductsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isListPage = location.pathname === "/products";

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", marginBottom: 2 }}>
        {!isListPage && (
          <IconButton
            aria-label="Back to products list"
            onClick={() => navigate("/products")}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography id="products-heading" variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
      </Stack>
      <Outlet />
    </Container>
  );
}
