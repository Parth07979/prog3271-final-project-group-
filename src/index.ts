import express from "express";
import userRoutes from "./presentation/routes/userRoutes";

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Forum Backend Running...");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});