// Test file untuk memastikan sistem deteksi field dari database berjalan dengan baik

const { generateFields, getAvailableFields, getAllDocumentTypes } = require('../utils/generate-fields');

async function testSystemBaru() {
  try {
    console.log('🧪 Testing sistem deteksi field dari database...\n');

    // Test 1: Get all document types
    console.log('1️⃣ Testing getAllDocumentTypes()');
    const allTypes = await getAllDocumentTypes();
    console.log('Available document types:', JSON.stringify(allTypes, null, 2));
    console.log('✅ getAllDocumentTypes() berhasil\n');

    // Test 2: Get available fields untuk specific type
    console.log('2️⃣ Testing getAvailableFields() untuk KKP Informatika');
    const fields = await getAvailableFields('kkp', 'informatika');
    console.log('Fields for kkp-informatika:', JSON.stringify(fields, null, 2));
    console.log('✅ getAvailableFields() berhasil\n');

    // Test 3: Generate fields dengan data sample
    console.log('3️⃣ Testing generateFields() dengan data sample');
    const sampleData = {
      kepada: 'PT. Tech Indonesia',
      tempat_tujuan: 'Jakarta',
      tanggal_hijriyah: '1445/06/15',
      tanggal_masehi: '2024-01-15',
      tableData: [
        { nama: 'Ahmad Rahman', nim: '2019001', semester: '6' },
        { nama: 'Budi Santoso', nim: '2019002', semester: '6' }
      ]
    };

    const generatedFields = await generateFields('kkp', 'informatika', sampleData);
    console.log('Generated fields:', JSON.stringify(generatedFields, null, 2));
    console.log('✅ generateFields() berhasil\n');

    // Test 4: Test dengan prodi yang berbeda
    console.log('4️⃣ Testing generateFields() untuk prodi elektro');
    const elektroData = {
      ...sampleData,
      bidang_keahlian: 'Power Systems'
    };

    const elektroFields = await generateFields('kkp', 'elektro', elektroData);
    console.log('Generated fields for elektro:', JSON.stringify(elektroFields, null, 2));
    console.log('✅ generateFields() untuk elektro berhasil\n');

    console.log('🎉 Semua test berhasil! Sistem deteksi field dari database berfungsi dengan baik.');

  } catch (error) {
    console.error('❌ Test gagal:', error.message);
  }
}

// Jalankan test jika file ini dijalankan langsung
if (require.main === module) {
  testSystemBaru();
}

module.exports = { testSystemBaru };
