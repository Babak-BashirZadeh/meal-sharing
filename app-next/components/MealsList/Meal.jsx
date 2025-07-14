import { Card, CardMedia, Box, CardContent, Typography } from "@mui/material";

const MealCard = ({ meal }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderRadius: 0,
        height: "100%",
        maxWidth: 300,
        margin: "0 auto",
      }}
    >
      <CardMedia
        component="img"
        height="194"
        image="/meals/sezar.jpg"
        alt={meal.title}
      />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6">{meal.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {meal.description}
        </Typography>
        <Typography variant="body2">
          Date:{" "}
          <Box component="span" color="text.secondary">
            {new Date(meal.when).toLocaleDateString("en-EN")}
          </Box>
        </Typography>
        <Typography variant="body2">
          Location:{" "}
          <Box component="span" color="text.secondary">
            {meal.location}
          </Box>
        </Typography>
        <Typography variant="body2">
          Max reservation:{" "}
          <Box component="span" color="text.secondary">
            {meal.max_reservation}
          </Box>
        </Typography>
        <Typography variant="subtitle1" color="#27ae60">
          <strong> Price:</strong> ${meal.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MealCard;