import { Routes, Route } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Header from "./components/Header";
import ThingList from "./components/ThingList";
import ThingForm from "./components/ThingForm";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<ThingList />} />
          <Route path="/add" element={<ThingForm />} />
          <Route path="/edit/:id" element={<ThingForm />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
