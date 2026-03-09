const fs = require('fs');
const path = require('path');
const axios = require('axios');
const tus = require('tus-js-client');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Setup player4me API Token in .env.local file: PLAYER4ME_API_TOKEN=your_token_here
const API_TOKEN = process.env.PLAYER4ME_API_TOKEN;
const API_BASE_URL = 'https://player4me.com/api/v1';

if (!API_TOKEN) {
  console.error('Error: PLAYER4ME_API_TOKEN environment variable is not set in .env.local');
  process.exit(1);
}

// Ensure error handler catches unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error("Unhandled Promise Rejection:", error);
});

async function uploadVideo(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileStat = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    console.log(`Starting upload process for: ${fileName} (${(fileStat.size / (1024*1024)).toFixed(2)} MB)`);

    // Step 1: Request Tus Upload Endpoint and Upload Access Token
    console.log('1. Requesting upload ticket from Player4Me API...');
    const ticketResponse = await axios.get(`${API_BASE_URL}/video/upload`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const { tusUrl, accessToken } = ticketResponse.data;
    
    if (!tusUrl || !accessToken) {
      throw new Error('Failed to retrieve tusUrl or accessToken from API');
    }

    console.log(`2. Upload Ticket Received. TUS Server: ${tusUrl}`);

    // Step 2: Upload logic via TUS Protocol
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);
      
      const options = {
        endpoint: tusUrl,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        metadata: {
          filename: fileName,
          filetype: 'video/mp4', // Adjust based on your file types
          accessToken: accessToken
        },
        uploadSize: fileStat.size,
        chunkSize: 52428800, // Player4me requests 50MB chunks
        onError: (error) => {
          console.error('\nError during TUS upload:', error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          process.stdout.write(`\rUploading... ${percentage}% `);
        },
        onSuccess: async () => {
          console.log(`\n3. Upload complete: ${upload.url}`);
          // Note: Tus upload.url might just be the upload endpoint ticket,
          // Normally Player4me will process it asynchronously after 100%.
          // You would use the video list API later to get the final Iframe ID.
          
          console.log('\nFetching latest uploaded videos...');
          try {
             // Retrieve the video list to grab the newly uploaded tracking info
             // This might not be instant if encoding is required on their end
             const videosResponse = await axios.get(`${API_BASE_URL}/video`, {
                headers: { 'Authorization': `Bearer ${API_TOKEN}` },
                params: { limit: 5 } // Get top 5 recent videos
             });
             
             resolve({
                 uploadUrl: upload.url,
                 recentVideos: videosResponse.data.data // contains ID and direct links to iframe
             });
          } catch(err) {
              console.error("\nFailed to fetch recent videos", err.response?.data || err.message);
              resolve({ uploadUrl: upload.url });
          }
        }
      };

      const upload = new tus.Upload(fileStream, options);
      upload.start();
    });

  } catch (error) {
    if (error.response) {
      console.error('\nAPI Error Response:', error.response.status, error.response.data);
    } else {
      console.error('\nUpload error:', error.message);
    }
  }
}

// Example usage when script is run directly
const targetFile = process.argv[2];
if (targetFile) {
   uploadVideo(targetFile).then(res => {
       if(res && res.recentVideos) {
           console.log('\n--- UPCOMING VIDEOS (Most Recent) ---');
           res.recentVideos.forEach(v => {
               // Assuming player4me API returns an 'id' and 'embedUrl' or similar structure
               console.log(`ID: ${v.id} | Status: ${v.status} | Embed: https://player4me.com/embed/${v.id}`);
           });
       }
   });
} else {
   console.log('Usage: node uploadToPlayer4Me.js <path_to_video.mp4>');
}
