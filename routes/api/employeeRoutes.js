const router = require('express').Router();

// GET an employee
router.get('/:id', async (req, res) => {
  try {
    const employeeData = await Employee.findByPk(req.params.id);
    if (!employeeData) {
      res.status(404).json({ message: 'No employee with this id!' });
      return;
    }
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE an employee
router.put('/:id', async (req, res) => {
  try {
    const employeeData = await Employee.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!employeeData[0]) {
      res.status(404).json({ message: 'No employee with this id!' });
      return;
    }
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE an employee
router.delete('/:id', async (req, res) => {
  try {
    const employeeData = await Employee.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!employeeData) {
      res.status(404).json({ message: 'No employee with this id!' });
      return;
    }
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
