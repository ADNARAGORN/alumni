const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');

// 1. İş İlanları Listesi + Yeni İlan Ekleme Formu
router.get('/jobs', JobController.renderJobsPage);

// 2. Yeni İş İlanı Gönderme (Form Submit)
router.post('/jobs', JobController.createJob);

// 3. İlana Hızlı Başvuru Yapma (Form Submit)
router.post('/jobs/:id/apply', JobController.applyJob);

// 4. Belirli bir ilana gelen başvuruları görüntüleme
router.get('/jobs/:id/applications', JobController.renderJobApplications);

// 5. Tüm başvuruları genel listede görüntüleme
router.get('/applications', JobController.renderAllApplications);

// 6. Başvuruyu silme / iptal etme
router.post('/applications/:id/delete', JobController.deleteApplication);

module.exports = router;
