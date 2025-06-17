import express from 'express';
import cors from 'cors';
import evalAndCaptureOutput from "./evalExecutor.js";

const app = express();
const port = 3721;

app.use(express.json());
app.use(cors({ origin: '*' }));

// We seprated the code runner logics into a different individual codebase, because of security consideration
// We can add more security setups for this codebase only which will try to reduce the impact the agent codebase.
app.post('/', async (req, res) => { // this route is only for running the js code
  try {
    const { code } = req.body;
    
    console.log("Should run these code ..");
    console.log("code: ", code);
    
    const result = await evalAndCaptureOutput(code);

    res.json(result);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
