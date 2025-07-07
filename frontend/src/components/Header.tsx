import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🧠 ShelfLife
        </Typography>
        <Box>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => navigate("/add")}
          >
            添加事物
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
