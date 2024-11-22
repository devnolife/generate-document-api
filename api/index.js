const axios = require('axios');
const FormData = require('form-data');

const uploadFileToApi = async (fileBuffer, fileName) => {
  try {
    const formdata = new FormData();
    formdata.append("fileName", fileName);
    formdata.append("file", fileBuffer, {
      filename: fileName.concat('.docx'),
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const response = await axios.post('https://storage.superapps.if.unismuh.ac.id', formdata, {
      headers: {
        ...formdata.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading file to API:', error.response?.data || error.message);
    throw error;
  }
};

const sendWhatsAppMessage = async (number, message) => {
  try {
    const response = await axios.post("https://whatsapp.devnolife.site/send-message", {
      number: number,
      message: message,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
};

const lastNumber = async (params) => {
  try {
    const response = await axios.get(`https://devnolife.site/api/no-surat/${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data?.noSurat;
  } catch (error) {
    console.error('Error fetching last number:', error.response?.data || error.message);
    throw error;
  }
};

const updateNumber = async (params) => {
  try {
    const response = await axios.put(`https://devnolife.site/api/no-surat/${params}`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data?.noSurat;
  } catch (error) {
    console.error('Error updating number:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  uploadFileToApi,
  sendWhatsAppMessage,
  lastNumber,
  updateNumber,
};
