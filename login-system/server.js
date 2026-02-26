const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./users.db");

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// admin user
const defaultAdmin = { username: "admin", password: "admin123" };

db.get(
  "SELECT * FROM users WHERE username = ?",
  [defaultAdmin.username],
  async (err, user) => {
    if (err) return console.error(err.message);
    if (!user) {
      const hash = await bcrypt.hash(defaultAdmin.password, 10);
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [defaultAdmin.username, hash],
        (err) => {
          if (err) console.error("Failed to create default admin:", err.message);
          else console.log("Default admin created: admin / admin123");
        }
      );
    }
  }
);


/*

 _____ _____ _____  _   _ _   _______ 
/  ___|_   _|  __ \| \ | | | | | ___ \
\ `--.  | | | |  \/|  \| | | | | |_/ /
 `--. \ | | | | __ | . ` | | | |  __/ 
/\__/ /_| |_| |_\ \| |\  | |_| | |    
\____/ \___/ \____/\_| \_/\___/\_|    
                                      
                                      

*/
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ success: false, error: "Missing username or password" });

  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      function (err) {
        if (err)
          return res.json({ success: false, error: "User already exists" });
        res.json({ success: true });
      },
    );
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

/*

 _     _____ _____ _____ _   _ 
| |   |  _  |  __ \_   _| \ | |
| |   | | | | |  \/ | | |  \| |
| |   | | | | | __  | | | . ` |
| |___\ \_/ / |_\ \_| |_| |\  |
\_____/\___/ \____/\___/\_| \_/
                               
                               

*/

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.json({ success: false, error: "Missing username or password" });

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.json({ success: false, error: "Server error" });
      }

      if (!user)
        return res.json({ success: false, error: "Invalid credentials" });

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({ success: true, username: user.username });
      } else {
        res.json({ success: false, error: "Invalid credentials" });
      }
    },
  );
});

/*

                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
 _____  _____ _____   _   _ _____ ___________  ______ ___________  ______  ___   _____ _   _ ______  _____  ___  ____________ 
|  __ \|  ___|_   _| | | | /  ___|  ___| ___ \ |  ___|  _  | ___ \ |  _  \/ _ \ /  ___| | | || ___ \|  _  |/ _ \ | ___ \  _  \
| |  \/| |__   | |   | | | \ `--.| |__ | |_/ / | |_  | | | | |_/ / | | | / /_\ \\ `--.| |_| || |_/ /| | | / /_\ \| |_/ / | | |
| | __ |  __|  | |   | | | |`--. \  __||    /  |  _| | | | |    /  | | | |  _  | `--. \  _  || ___ \| | | |  _  ||    /| | | |
| |_\ \| |___  | |   | |_| /\__/ / |___| |\ \  | |   \ \_/ / |\ \  | |/ /| | | |/\__/ / | | || |_/ /\ \_/ / | | || |\ \| |/ / 
 \____/\____/  \_/    \___/\____/\____/\_| \_| \_|    \___/\_| \_| |___/ \_| |_/\____/\_| |_/\____/  \___/\_| |_/\_| \_|___/  
                                                                                                                              
                                                                                                                              

*/
app.get("/user/:username", (req, res) => {
  const username = req.params.username;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.json({ success: false });
    res.json({ success: true, username: user.username });
  });
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
