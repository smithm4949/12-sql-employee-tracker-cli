const router = require('express').Router();

const departmentRoutes = require('./departmentRoutes');
const employeeRoutes = require('./employeeRoutes');
const roleRoutes = require('./roleRoutes');

router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/roles', roleRoutes);

module.exports = router;
