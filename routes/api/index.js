const router = require('express').Router();

const departmentRoutes = require('./departmentRoutes');
//const employeeRoutes = require('./employeeRoutes');
//const roleRoutes = require('./roleRoutes');

router.use('/department', departmentRoutes);
//router.use('/employee', employeeRoutes);
//router.use('/role', roleRoutes);

module.exports = router;
