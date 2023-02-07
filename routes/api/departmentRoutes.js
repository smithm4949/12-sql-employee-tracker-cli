const db = require('../../config/connection');

app.get('/api/departments', (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
      if (err) {
      res.status(500).json({ error: err.message });
          return;
      }
      res.json({
      message: 'success',
      data: rows
      });
  });
});